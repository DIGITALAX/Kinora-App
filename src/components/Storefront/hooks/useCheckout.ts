import { Collection } from "@/components/Envoke/types/envoke.types";
import { useEffect, useState } from "react";
import { CartItem, Details, OracleData } from "../types/storefront.types";
import { Profile } from "../../../../graphql/generated";
import { PublicClient, createWalletClient, custom } from "viem";
import { polygon } from "viem/chains";
import { ACCEPTED_TOKENS, COINOP_OPEN_ACTION } from "../../../../lib/constants";
import findBalance from "../../../../lib/helpers/findBalance";
import { setSuccess } from "../../../../redux/reducers/successSlice";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { encryptItems } from "../../../../lib/helpers/encryptItems";
import actPost from "../../../../lib/helpers/actPost";
import encodeActData from "../../../../lib/helpers/encodeActData";
import { getAllStore } from "../../../../graphql/subgraph/getShop";
import handleCollectionProfilesAndPublications from "../../../../lib/helpers/handleCollectionProfilesAndPublications";
import { Dispatch } from "redux";

const useCheckout = (
  lensConnected: Profile | undefined,
  publicClient: PublicClient,
  oracleData: OracleData[],
  address: `0x${string}` | undefined,
  dispatch: Dispatch,
  t: (key: string) => string
) => {
  const [storeItems, setStoreItems] = useState<
    (Collection & {
      chosenSize: string;
      chosenAmount: string;
    })[]
  >([]);
  const [storeLoading, setStoreLoading] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [checkoutCurrency, setCheckoutCurrency] = useState<string>("USDT");
  const [chosenCartItem, setChosenCartItem] = useState<CartItem | undefined>();
  const [approved, setApproved] = useState<boolean>(false);
  const [fulfillmentDetails, setFulfillmentDetails] = useState<Details>({
    name: "",
    address: "",
    zip: "",
    city: "",
    state: "",
    country: "",
  });
  const client = new LitJsSdk.LitNodeClient({
    litNetwork: "cayenne",
    debug: false,
  });

  const getStore = async () => {
    setStoreLoading(true);
    try {
      const data = await getAllStore();

      if (
        !data?.data?.collectionCreateds ||
        data?.data?.collectionCreateds?.length < 1
      ) {
        setStoreLoading(false);
        return;
      }
      const allShopValues = await handleCollectionProfilesAndPublications(
        data?.data?.collectionCreateds,
        lensConnected
      );

      setStoreItems(
        allShopValues as (Collection & {
          chosenSize: string;
          chosenAmount: string;
        })[]
      );
    } catch (err: any) {
      console.error(err.message);
    }
    setStoreLoading(false);
  };

  const encryptFulfillment = async () => {
    if (
      !address ||
      fulfillmentDetails?.address?.trim() === "" ||
      fulfillmentDetails?.city?.trim() === "" ||
      fulfillmentDetails?.name?.trim() === "" ||
      fulfillmentDetails?.state?.trim() === "" ||
      fulfillmentDetails?.zip?.trim() === "" ||
      fulfillmentDetails?.country?.trim() === ""
    )
      return;
    try {
      let nonce = client.getLatestBlockhash();

      const authSig = await LitJsSdk.checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });

      await client.connect();

      const encryptedItems = await encryptItems(
        client as any,
        {
          ...fulfillmentDetails,
          contact: lensConnected?.handle?.suggestedFormatted?.localName!,
          checkoutCurrency: ACCEPTED_TOKENS?.find(
            (item) => item?.[1] == checkoutCurrency
          )?.[2]?.toLowerCase() as string,
          chosenAmount: chosenCartItem?.chosenAmount!,
        },
        address as `0x${string}`,
        authSig,
        chosenCartItem!
      );

      return encryptedItems;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkoutItem = async () => {
    if (!lensConnected?.id) return;
    const encryptedFulfillment = await encryptFulfillment();

    setCheckoutLoading(true);
    try {
      const balance = await findBalance(
        publicClient,
        ACCEPTED_TOKENS?.find(
          (item) => item?.[1] == checkoutCurrency
        )?.[2]?.toLowerCase() as string,
        address as `0x${string}`
      );

      if (
        Number(balance) <
        (Number(
          Number(chosenCartItem?.item?.prices?.[0]) *
            Number(chosenCartItem?.chosenAmount) *
            10 ** 18
        ) /
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                ACCEPTED_TOKENS?.find(
                  (item) => item?.[1] == checkoutCurrency
                )?.[2]?.toLowerCase()
            )?.rate
          )) *
          Number(
            oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                ACCEPTED_TOKENS?.find(
                  (item) => item?.[1] == checkoutCurrency
                )?.[2]?.toLowerCase()
            )?.wei
          )
      ) {
        dispatch(
          setSuccess({
            open: true,
            text: "Pockets Empty. Need to top up?",
            image: "QmQDgeCgQ3eefdGrramCn7s3WgS46WAbGrvnXHFXejWcs4",
          })
        );

        setCheckoutLoading(false);
        return;
      }

      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const unknownOpenAction = encodeActData(
        [0],
        [Number(chosenCartItem?.chosenAmount || 1)],
        encryptedFulfillment?.[0]?.data!,
        ACCEPTED_TOKENS?.find(
          (item) => item?.[1] == checkoutCurrency
        )?.[2]?.toLowerCase() as `0x${string}`
      );

      await actPost(
        `${toHexWithLeadingZero(
          Number(chosenCartItem?.item?.profileId)
        )}-${toHexWithLeadingZero(Number(chosenCartItem?.item?.pubId))}`,
        {
          unknownOpenAction,
        },
        dispatch,
        address as `0x${string}`,
        clientWallet,
        publicClient,
        t
      );
      setFulfillmentDetails({
        name: "",
        address: "",
        zip: "",
        city: "",
        state: "",
        country: "",
      });
      dispatch(
        setSuccess({
          open: true,
          text: "Checkout success! Stay up to date with fulfillment progress on your Account page.",
          image: "QmVdhEZQEFHKYX4v4MY3aRvrh5jbn8FKdtBtB9XZL5K7Hc",
        })
      );
    } catch (err: any) {
      console.error(err.message);
    }

    setCheckoutLoading(false);
  };

  const handleApproveSpend = async () => {
    setCheckoutLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: polygon,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: ACCEPTED_TOKENS?.find(
          (item) => item?.[1] == checkoutCurrency
        )?.[2]?.toLowerCase() as `0x${string}`,
        abi: [
          ACCEPTED_TOKENS?.find(
            (item) => item?.[1] == checkoutCurrency
          )?.[2]?.toLowerCase() === "0x6968105460f67c3bf751be7c15f92f5286fd0ce5"
            ? {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "tokens",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  { internalType: "bool", name: "success", type: "bool" },
                ],
                stateMutability: "nonpayable",
                type: "function",
              }
            : ACCEPTED_TOKENS?.find(
                (item) => item?.[1] == checkoutCurrency
              )?.[2]?.toLowerCase() ===
              "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
            ? {
                constant: false,
                inputs: [
                  { name: "guy", type: "address" },
                  { name: "wad", type: "uint256" },
                ],
                name: "approve",
                outputs: [{ name: "", type: "bool" }],
                payable: false,
                stateMutability: "nonpayable",
                type: "function",
              }
            : {
                inputs: [
                  {
                    internalType: "address",
                    name: "spender",
                    type: "address",
                  },
                  {
                    internalType: "uint256",
                    name: "amount",
                    type: "uint256",
                  },
                ],
                name: "approve",
                outputs: [
                  {
                    internalType: "bool",
                    name: "",
                    type: "bool",
                  },
                ],
                stateMutability: "nonpayable",
                type: "function",
              },
        ],
        functionName: "approve",
        chain: polygon,
        args: [
          COINOP_OPEN_ACTION,
          ((Number(
            Number(chosenCartItem?.item?.prices?.[0]) *
              Number(chosenCartItem?.chosenAmount) *
              10 ** 18
          ) /
            Number(
              oracleData?.find(
                (oracle) =>
                  oracle.currency ===
                  ACCEPTED_TOKENS.find(
                    (item) =>
                      item[2] ===
                      ACCEPTED_TOKENS?.find(
                        (item) => item?.[1] == checkoutCurrency
                      )?.[2]?.toLowerCase()
                  )?.[2]
              )?.rate
            )) *
            10 ** 18 *
            1.3) as any,
        ],
        account: address,
      });
      const res = await clientWallet.writeContract(request);
      await publicClient.waitForTransactionReceipt({ hash: res });
      setApproved(true);
    } catch (err: any) {
      console.error(err.message);
    }
    setCheckoutLoading(false);
  };

  useEffect(() => {
    if (storeItems?.length < 1) {
      getStore();
    }
  }, []);

  return {
    storeLoading,
    storeItems,
    checkoutItem,
    checkoutLoading,
    fulfillmentDetails,
    setFulfillmentDetails,
    chosenCartItem,
    setChosenCartItem,
    checkoutCurrency,
    handleApproveSpend,
    approved,
    setCheckoutCurrency,
    setStoreItems,
  };
};

export default useCheckout;

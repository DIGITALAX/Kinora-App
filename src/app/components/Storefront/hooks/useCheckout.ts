import { useContext, useEffect, useState } from "react";
import { createPublicClient, createWalletClient, custom, http } from "viem";
import { getAllStore } from "../../../../../graphql/getShop";
import handleCollectionProfilesAndPublications from "@/app/lib/helpers/handleCollectionProfilesAndPublications";
import { ModalContext } from "@/app/providers";
import {
  checkAndSignAuthMessage,
  LitNodeClient,
  uint8arrayFromString,
} from "@lit-protocol/lit-node-client";
import { LIT_NETWORK } from "@lit-protocol/constants";
import { AccessControlConditions } from "@lit-protocol/types";
import { useAccount } from "wagmi";
import {
  ACCEPTED_TOKENS,
  DIGITALAX_ADDRESS,
  KINORA_OPEN_ACTION_PRINT,
} from "@/app/lib/constants";
import { Collection, Indexar } from "../../Common/types/common.types";
import { CartItem, Details } from "../types/storefront.types";
import { chains } from "@lens-chain/sdk/viem";
import findBalance from "@/app/lib/helpers/findBalance";
import { ethers } from "ethers";
import { blockchainData } from "@lens-protocol/client";
import {
  executePostAction,
  fetchPostActionContracts,
} from "@lens-protocol/client/actions";
import pollResult from "@/app/lib/helpers/pollResult";

const useCheckout = (dict: any) => {
  const context = useContext(ModalContext);
  const { address } = useAccount();
  const [storeItems, setStoreItems] = useState<Collection[]>([]);
  const publicClient = createPublicClient({
    chain: chains.mainnet,
    transport: http("https://rpc.lens.xyz"),
  });
  const [storeLoading, setStoreLoading] = useState<boolean>(false);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
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
  const client = new LitNodeClient({
    litNetwork: LIT_NETWORK.Datil,
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
        context?.lensConectado!,
        context?.clienteLens!
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
      fulfillmentDetails?.state?.trim() === "" ||
      fulfillmentDetails?.zip?.trim() === "" ||
      fulfillmentDetails?.country?.trim() === ""
    )
      return;
    try {
      let nonce = await client.getLatestBlockhash();
      await checkAndSignAuthMessage({
        chain: "polygon",
        nonce: nonce!,
      });
      await client.connect();

      const accessControlConditions = [
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: address.toLowerCase(),
          },
        },
        {
          operator: "or",
        },
        {
          contractAddress: "",
          standardContractType: "",
          chain: "polygon",
          method: "",
          parameters: [":userAddress"],
          returnValueTest: {
            comparator: "=",
            value: DIGITALAX_ADDRESS?.toLowerCase() as string,
          },
        },
      ] as AccessControlConditions;

      const { ciphertext, dataToEncryptHash } = await client.encrypt({
        accessControlConditions,
        dataToEncrypt: uint8arrayFromString(
          JSON.stringify({
            address: fulfillmentDetails?.address,
            state: fulfillmentDetails?.state,
            country: fulfillmentDetails?.country,
            city: fulfillmentDetails?.city,
            zip: fulfillmentDetails?.zip,
            size: chosenCartItem?.chosenSize,
            color: "",
            origin: "4",
            fulfillerAddress: [DIGITALAX_ADDRESS],
          })
        ),
      });

      const ipfsRes = await fetch("/api/ipfs", {
        method: "POST",
        headers: {
          contentType: "application/json",
        },
        body: JSON.stringify({
          ciphertext,
          dataToEncryptHash,
          accessControlConditions,
          chain: "polygon",
        }),
      });
      const json = await ipfsRes.json();

      return "ipfs://" + json?.cid;
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const checkoutItem = async () => {
    if (!context?.lensConectado?.profile) return;
    const encryptedFulfillment = await encryptFulfillment();

    setCheckoutLoading(true);
    try {
      const balance = await findBalance(
        publicClient,
        chosenCartItem?.chosenCurrency!,
        address as `0x${string}`
      );

      if (
        Number(balance) <
        (Number(
          Number(chosenCartItem?.item?.price) *
            Number(chosenCartItem?.chosenAmount) *
            10 ** 18
        ) /
          Number(
            context?.oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                chosenCartItem?.chosenCurrency?.toLowerCase()
            )?.rate
          )) *
          Number(
            context?.oracleData?.find(
              (oracle) =>
                oracle.currency?.toLowerCase() ===
                chosenCartItem?.chosenCurrency?.toLowerCase()
            )?.wei
          )
      ) {
        context?.setSuccess({
          text: "Pockets Empty. Need to top up?",
          image: "QmQDgeCgQ3eefdGrramCn7s3WgS46WAbGrvnXHFXejWcs4",
        });

        setCheckoutLoading(false);
        return;
      }
      fetchPostActionContracts;
      const res = await executePostAction(
        context?.lensConectado?.sessionClient!,
        {
          post: chosenCartItem?.item?.postId,
          action: {
            unknown: {
              address: KINORA_OPEN_ACTION_PRINT,
              params: [
                {
                  key: ethers.utils.keccak256(
                    ethers.utils.toUtf8Bytes("lens.param.buyCoinop")
                  ),
                  data: blockchainData(
                    ethers.utils.defaultAbiCoder.encode(
                      ["string[]", "address[]", "uint256[]", "uint8[]"],
                      [
                        [encryptedFulfillment],
                        [chosenCartItem?.chosenCurrency],
                        [Number(chosenCartItem?.item?.collectionId)],
                        [Number(chosenCartItem?.chosenAmount || 1)],
                      ]
                    )
                  ),
                },
              ],
            },
          },
        }
      );

      if (res.isOk()) {
        if ((res.value as any)?.reason?.includes("Signless")) {
          context?.setSignless?.(true);
        } else if ((res.value as any)?.hash) {
          context?.setIndexar(Indexar.Indexando);
          if (
            await pollResult(
              (res.value as any)?.hash,
              context?.lensConectado?.sessionClient!
            )
          ) {
            context?.setIndexar(Indexar.Success);
            setFulfillmentDetails({
              name: "",
              address: "",
              zip: "",
              city: "",
              state: "",
              country: "",
            });
            context?.setSuccess({
              text: "Checkout success! Stay up to date with fulfillment progress on your Account page.",
              image: "QmVdhEZQEFHKYX4v4MY3aRvrh5jbn8FKdtBtB9XZL5K7Hc",
            });
          } else {
            context?.setModalOpen(dict?.error);
          }

          setTimeout(() => {
            context?.setIndexar(Indexar.Inactive);
          }, 3000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }

    setCheckoutLoading(false);
  };

  const handleApproveSpend = async () => {
    setCheckoutLoading(true);
    try {
      const clientWallet = createWalletClient({
        chain: chains?.mainnet,
        transport: custom((window as any).ethereum),
      });

      const { request } = await publicClient.simulateContract({
        address: chosenCartItem?.chosenCurrency as `0x${string}`,
        abi: [
          {
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
            outputs: [{ internalType: "bool", name: "success", type: "bool" }],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        functionName: "approve",
        chain: chains?.mainnet,
        args: [
          KINORA_OPEN_ACTION_PRINT,
          (((Number(chosenCartItem?.item?.price) * 10 ** 18) /
            Number(
              context?.oracleData?.find(
                (oracle) =>
                  oracle.currency?.toLowerCase() ===
                  chosenCartItem?.chosenCurrency?.toLowerCase()
              )?.rate
            )) *
            10 ** 18) as any,
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
    if (storeItems?.length < 1 && context?.clienteLens) {
      getStore();
    }
  }, [context?.clienteLens, context?.lensConectado?.sessionClient]);

  return {
    storeLoading,
    storeItems,
    checkoutItem,
    checkoutLoading,
    fulfillmentDetails,
    setFulfillmentDetails,
    chosenCartItem,
    setChosenCartItem,
    handleApproveSpend,
    approved,
    setStoreItems,
  };
};

export default useCheckout;

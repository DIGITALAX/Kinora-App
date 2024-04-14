import { Action, Dispatch } from "redux";
import { ActOnOpenActionInput } from "../../graphql/generated";
import { collectPost } from "../../graphql/lens/mutations/collect";
import { omit } from "lodash";
import { WalletClient, PublicClient } from "viem";
import broadcast from "../../graphql/lens/mutations/broadcast";
import handleIndexCheck from "../../graphql/lens/queries/indexed";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";
import { polygon } from "viem/chains";
import LensHubProxy from "./../../abis/LensHubProxy.json"
import { setSuccess } from "../../redux/reducers/successSlice";

const actPost = async (
  pubId: string,
  actOn: ActOnOpenActionInput,
  dispatch: Dispatch<Action>,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  t: (key: string) => string
): Promise<boolean | void> => {
  try {
    const { data } = await collectPost({
      for: pubId,
      actOn,
    });

    const typedData = data?.createActOnOpenActionTypedData.typedData;

    const signature = await clientWallet.signTypedData({
      domain: omit(typedData?.domain, ["__typename"]),
      types: omit(typedData?.types, ["__typename"]),
      primaryType: "Act",
      message: omit(typedData?.value, ["__typename"]),
      account: address as `0x${string}`,
    });

    const broadcastResult = await broadcast({
      id: data?.createActOnOpenActionTypedData?.id,
      signature,
    });

    if (
      broadcastResult?.data?.broadcastOnchain?.__typename === "RelaySuccess"
    ) {
      await handleIndexCheck(
        {
          forTxId: broadcastResult?.data?.broadcastOnchain.txId,
        },
        dispatch,
        t
      );
    } else {
      const { request } = await publicClient.simulateContract({
        address: LENS_HUB_PROXY_ADDRESS_MATIC,
        abi: LensHubProxy,
        functionName: "act",
        chain: polygon,
        args: [
          {
            publicationActedProfileId: parseInt(
              typedData?.value.publicationActedProfileId,
              16
            ),
            publicationActedId: parseInt(
              typedData?.value.publicationActedId,
              16
            ),
            actorProfileId: parseInt(typedData?.value.actorProfileId, 16),
            referrerProfileIds: typedData?.value.referrerProfileIds,
            referrerPubIds: typedData?.value.referrerPubIds,
            actionModuleAddress: typedData?.value.actionModuleAddress,
            actionModuleData: typedData?.value.actionModuleData,
          },
        ],
        account: address,
      });

      const res = await clientWallet.writeContract(request);
      const tx = await publicClient.waitForTransactionReceipt({ hash: res });

      await handleIndexCheck(
        {
          forTxHash: tx.transactionHash,
        },
        dispatch,
        t
      );
    }
    return true;
  } catch (err: any) {
    dispatch(
      setSuccess({
        open: true,
        text:
          "There was an issue estimating the tx gas. Try reducing the number of tokens you collect at once!",
        image: "QmSB49SHoFk2q2Aps4GwfSb5qHfotRq7GETxAe2any1Men",
      })
    );

    console.error(err.message);
  }
};

export default actPost;

import { omit } from "lodash";
import LensHubProxy from "./../../abis/LensHubProxy.json";
import { Action, Dispatch } from "redux";
import commentPost from "../../graphql/lens/mutations/comment";
import { OpenActionModuleInput, InputMaybe } from "../../graphql/generated";
import { polygon } from "viem/chains";
import { setIndexer } from "../../redux/reducers/indexerSlice";
import broadcast from "../../graphql/lens/mutations/broadcast";
import { LENS_HUB_PROXY_ADDRESS_MATIC } from "../constants";
import { PublicClient, WalletClient } from "viem";
import cleanCollect from "./cleanCollect";
import validateMetadata from "../../graphql/lens/queries/validate";
import { setInteractError } from "../../redux/reducers/interactErrorSlice";
import handleIndexCheck from "../../graphql/lens/queries/indexed";

const lensComment = async (
  id: string,
  contentURI: string,
  dispatch: Dispatch<Action>,
  openActionModules: InputMaybe<OpenActionModuleInput[]> | undefined,
  address: `0x${string}`,
  clientWallet: WalletClient,
  publicClient: PublicClient,
  clearComment: () => void,
  t: (key: string) => string
): Promise<void> => {
  if (
    openActionModules &&
    openActionModules?.[0]?.hasOwnProperty("collectOpenAction") &&
    openActionModules?.[0]?.collectOpenAction?.hasOwnProperty(
      "simpleCollectOpenAction"
    ) &&
    openActionModules?.[0]?.collectOpenAction?.simpleCollectOpenAction
  ) {
    openActionModules = cleanCollect(openActionModules);
  } else {
    openActionModules = [
      {
        collectOpenAction: {
          simpleCollectOpenAction: {
            followerOnly: false,
          },
        },
      },
    ];
  }
  const metadata = await validateMetadata({
    rawURI: contentURI,
  });

  if (!metadata?.data?.validatePublicationMetadata.valid) {
    dispatch(setInteractError(true));
    return;
  }

  const data = await commentPost({
    commentOn: id,
    contentURI: contentURI,
    openActionModules,
  });

  const typedData = data?.data?.createOnchainCommentTypedData.typedData;

  const signature = await clientWallet.signTypedData({
    domain: omit(typedData?.domain, ["__typename"]),
    types: omit(typedData?.types, ["__typename"]),
    primaryType: "Comment",
    message: omit(typedData?.value, ["__typename"]),
    account: address as `0x${string}`,
  });

  const broadcastResult = await broadcast({
    id: data?.data?.createOnchainCommentTypedData?.id,
    signature,
  });

  if (broadcastResult?.data?.broadcastOnchain.__typename === "RelaySuccess") {
    clearComment();
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
      functionName: "comment",
      chain: polygon,
      args: [
        {
          profileId: typedData?.value.profileId,
          contentURI: typedData?.value.contentURI,
          pointedProfileId: typedData?.value.pointedProfileId,
          pointedPubId: typedData?.value.pointedPubId,
          referrerProfileIds: typedData?.value.referrerProfileIds,
          referrerPubIds: typedData?.value.referrerPubIds,
          referenceModuleData: typedData?.value.referenceModuleData,
          actionModules: typedData?.value.actionModules,
          actionModulesInitDatas: typedData?.value.actionModulesInitDatas,
          referenceModule: typedData?.value.referenceModule,
          referenceModuleInitData: typedData?.value.referenceModuleInitData,
        },
      ],
      account: address,
    });
    const res = await clientWallet.writeContract(request);
    const tx = await publicClient.waitForTransactionReceipt({ hash: res });
    dispatch(
      setIndexer({
        actionOpen: true,
        actionMessage: t("ind"),
      })
    );
    clearComment();
    await handleIndexCheck(
      {
        forTxHash: tx.transactionHash,
      },
      dispatch,
      t
    );
  }
  setTimeout(() => {
    dispatch(
      setIndexer({
        actionOpen: false,
        actionMessage: undefined,
      })
    );
  }, 3000);
};

export default lensComment;

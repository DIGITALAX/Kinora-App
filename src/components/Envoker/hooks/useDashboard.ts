import { Quest } from "@/components/Quest/types/quest.types";
import { Envoker } from "kinora-sdk";
import { useEffect, useState } from "react";
import { apolloClient } from "../../../../lib/lens/client";
import { ethers } from "ethers";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { Dispatch } from "redux";
import { setSuccess } from "../../../../redux/reducers/successSlice";

const useDashboard = (envokedQuests: Quest[], dispatch: Dispatch) => {
  const [openQuest, setOpenQuest] = useState<boolean[]>([]);
  const [terminateLoading, setTerminateLoading] = useState<boolean>(false);
  const [approvalLoading, setApprovalLoading] = useState<boolean>(false);
  const questEnvoker = new Envoker({
    authedApolloClient: apolloClient,
  });

  const terminateQuest = async (id: number) => {
    setTerminateLoading(true);
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        80001
      );
      const signer = provider.getSigner();
      const { error, errorMessage } =
        await questEnvoker.terminateQuestAndWithdraw(
          id,
          signer as unknown as ethers.Wallet
        );

      if (error) {
        console.error(errorMessage);
        dispatch(setInteractError(true));
      } else {
        dispatch(
          setSuccess({
            open: true,
            image: "QmSuAzF6c9HXh4nVyaPakozhj449Bwa9YWwMn1q6nkcZJT",
            text: "Quest Successfully terminated.",
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setTerminateLoading(false);
  };

  const approvePlayerMilestone = async (
    id: number,
    milestone: number,
    playerProfileId: `0x${string}`
  ) => {
    setApprovalLoading(true);
    try {
      const { error, errorMessage } =
        await questEnvoker.setPlayerEligibleToClaimMilestone(
          id,
          milestone,
          playerProfileId,
          true
        );

      if (error) {
        console.error(errorMessage);
        dispatch(setInteractError(true));
      } else {
        dispatch(
          setSuccess({
            open: true,
            image: "QmZJT774gb65twy6TKjZrE3gythGCVDdTLdn8X7u1g1k77",
            text: "Player eligible to claim! Keep track of their progress in your dashboard.",
          })
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setApprovalLoading(false);
  };

  useEffect(() => {
    if (envokedQuests?.length > 0) {
      setOpenQuest(Array.from({ length: envokedQuests?.length }, () => false));
    }
  }, [envokedQuests]);

  return {
    terminateQuest,
    approvePlayerMilestone,
    openQuest,
    setOpenQuest,
    terminateLoading,
    approvalLoading,
  };
};

export default useDashboard;

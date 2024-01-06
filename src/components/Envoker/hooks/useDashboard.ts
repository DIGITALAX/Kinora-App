import { Quest } from "@/components/Quest/types/quest.types";
import { Envoker } from "kinora-sdk";
import { useEffect, useState } from "react";
import { apolloClient } from "../../../../lib/lens/client";
import { ethers } from "ethers";
import { setInteractError } from "../../../../redux/reducers/interactErrorSlice";
import { Dispatch } from "redux";
import { setSuccess } from "../../../../redux/reducers/successSlice";
import { Profile } from "../../../../graphql/generated";

const useDashboard = (
  allQuests: (Quest & { type: string })[],
  dispatch: Dispatch
) => {
  const [openQuest, setOpenQuest] = useState<boolean[]>([]);
  const [terminateLoading, setTerminateLoading] = useState<boolean[]>([]);
  const [openPlayerDetails, setOpenPlayerDetails] = useState<
    (Profile | undefined)[]
  >([]);
  const [approvalLoading, setApprovalLoading] = useState<boolean[]>([]);
  const [claimRewardLoading, setClaimRewardLoading] = useState<boolean[]>([]);
  const questEnvoker = new Envoker({
    authedApolloClient: apolloClient,
  });

  const terminateQuest = async (id: number, index: number) => {
    setTerminateLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
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
    setTerminateLoading((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  const approvePlayerMilestone = async (
    id: number,
    milestone: number,
    playerProfileId: `0x${string}`,
    index: number
  ) => {
    setApprovalLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
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
    setApprovalLoading((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  const playerClaimMilestoneReward = async (id: string, index: number) => {
    setClaimRewardLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
    try {
    } catch (err: any) {
      console.error(err.message);
    }
    setClaimRewardLoading((prev) => {
      const arr = [...prev];
      arr[index] = false;
      return arr;
    });
  };

  useEffect(() => {
    if (allQuests?.length > 0) {
      setOpenQuest(Array.from({ length: allQuests?.length }, () => false));
      setApprovalLoading(
        Array.from(
          {
            length: allQuests?.filter((item) => item?.type == "envoked")
              ?.length,
          },
          () => false
        )
      );
      setClaimRewardLoading(
        Array.from(
          {
            length: allQuests?.filter((item) => item?.type !== "envoked")
              ?.length,
          },
          () => false
        )
      );
      setTerminateLoading(
        Array.from(
          {
            length: allQuests?.filter((item) => item?.type == "envoked")
              ?.length,
          },
          () => false
        )
      );
      setOpenPlayerDetails(
        Array.from(
          {
            length: allQuests?.filter((item) => item?.type == "envoked")
              ?.length,
          },
          () => undefined
        )
      );
    }
  }, [allQuests]);

  return {
    terminateQuest,
    approvePlayerMilestone,
    openQuest,
    setOpenQuest,
    terminateLoading,
    approvalLoading,
    playerClaimMilestoneReward,
    claimRewardLoading,
    openPlayerDetails,
    setOpenPlayerDetails,
  };
};

export default useDashboard;

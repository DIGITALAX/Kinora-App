import { useContext, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import { ModalContext } from "@/app/providers";
import { Player, Quest, VideoActivity } from "../../Common/types/common.types";
import {
  KINORA_METRICS,
  KINORA_QUEST_DATA,
  KINORA_ESCROW,
} from "@/app/lib/constants";
import { Dispatch, Envoker } from "../../../../../../kinorasdk_refactor/dist";

const useDashboard = (
  dict: any,
  allQuests: (Quest & { type: string })[],
  questEnvoker: Envoker,
  kinoraDispatch: Dispatch
) => {
  const context = useContext(ModalContext);
  const [openQuest, setOpenQuest] = useState<Quest | undefined>();
  const [terminateLoading, setTerminateLoading] = useState<boolean[]>([]);
  const [openPlayerDetails, setOpenPlayerDetails] = useState<
    Player | undefined
  >();
  const [approvalLoading, setApprovalLoading] = useState<boolean[]>([]);
  const [claimRewardLoading, setClaimRewardLoading] = useState<boolean[]>([]);
  const [playerEligible, setPlayerEligible] = useState<{
    eligible: boolean;
    completed: VideoActivity[];
    toComplete: VideoActivity[];
  }>();

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
        232
      );
      const signer = provider.getSigner();
      const { error, errorMessage } =
        await questEnvoker.terminateQuestAndWithdraw(
          id,
          KINORA_ESCROW,
          signer as any
        );

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.error);
      } else {
        context?.setSuccess({
          image: "QmSuAzF6c9HXh4nVyaPakozhj449Bwa9YWwMn1q6nkcZJT",
          text: "Quest Successfully terminated.",
        });
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

  const playerEligibleToClaim = async () => {
    try {
      const { error, eligible, completed, toComplete } =
        await kinoraDispatch.playerMilestoneEligibilityCheck(
          openPlayerDetails?.playerProfile as `0x${string}`,
          Number(openQuest?.questId),
          openPlayerDetails?.milestonesCompleted?.findIndex(
            (value) => Number(value?.questId) == Number(openQuest?.questId)
          ) == -1 ||
            !openPlayerDetails?.milestonesCompleted?.findIndex(
              (value) => Number(value?.questId) == Number(openQuest?.questId)
            )
            ? 1
            : openPlayerDetails!?.milestonesCompleted?.findIndex(
                (value) => value?.questId == openQuest?.questId
              ),
          KINORA_QUEST_DATA
        );

      if (!error) {
        setPlayerEligible({
          eligible: eligible!,
          completed: completed! as VideoActivity[],
          toComplete: toComplete! as VideoActivity[],
        });
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const approvePlayerMilestone = async (
    id: number,
    milestone: number,
    playerProfile: `0x${string}`,
    index: number
  ) => {
    if (!playerEligible) return;
    setApprovalLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });

    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        232
      );
      const signer = provider.getSigner();
      const { error, errorMessage } =
        await questEnvoker.setPlayerEligibleToClaimMilestone(
          id,
          milestone,
          playerProfile,
          true,
          KINORA_METRICS,
          signer as any
        );

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.error);
      } else {
        context?.setSuccess({
          image: "QmZJT774gb65twy6TKjZrE3gythGCVDdTLdn8X7u1g1k77",
          text: "Player eligible to claim! Keep track of their progress in your dashboard.",
        });
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

  const playerClaimMilestoneReward = async (
    postId: string,
    index: number,
    questCompleted: boolean
  ) => {
    setClaimRewardLoading((prev) => {
      const arr = [...prev];
      arr[index] = true;
      return arr;
    });
    try {
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(
        (window as any).ethereum,
        232
      );
      const signer = provider.getSigner();

      const { error, errorMessage } =
        await kinoraDispatch.playerCompleteQuestMilestone(
          postId as `0x${string}`,
          signer as any
        );

      if (error) {
        console.error(errorMessage);
        context?.setModalOpen(dict?.error);
      } else {
        context?.setSuccess({
          image: "QmZJT774gb65twy6TKjZrE3gythGCVDdTLdn8X7u1g1k77",
          text: questCompleted
            ? "Quest Completed! You've leveled up. Ready for the next one?"
            : "Milestone Completed! See all your rewards in the dashboard.",
        });
      }
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
    }
  }, [allQuests]);

  useEffect(() => {
    if (openPlayerDetails) {
      playerEligibleToClaim();
    }
  }, [openPlayerDetails]);

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
    playerEligible,
  };
};

export default useDashboard;

import { Account, AccountStats } from "@lens-protocol/client";
import { Player, Quest, VideoActivity } from "../../Common/types/common.types";
import { SetStateAction } from "react";
import { Dispatch, Envoker } from "../../../../../../kinorasdk_refactor/dist";

export type BioProps = {
  profile: Account;
  dict: any;
  accountStats: AccountStats;
};

export type HomeProps = {
  questsLoading: boolean;
  quests: (Quest & { type: string })[];
  globalLoading: boolean;
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  getMore: () => Promise<void>;
  dict: any;
};

export type SavesProps = {
  dict: any;
  globalLoading: boolean;
  profile: Account | undefined;
};

export type DashboardProps = {
  dict: any;
  questEnvoker: Envoker;
  kinoraDispatch: Dispatch;
  getMore: () => Promise<void>;
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  allQuests: (Quest & { type: string })[];
};

export type AccountSwitchProps = {
  pageProfile: Account | undefined;
  dict: any;
  questEnvoker: Envoker;
  kinoraDispatch: Dispatch;
  questsLoading: boolean;
  quests: (Quest & { type: string })[];
  getMore: () => Promise<void>;
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  globalLoading: boolean;
};

export type PlayerMilestoneProps = {
  index: number;
  quest: Quest;
  openPlayerDetails: Player | undefined;
  setOpenPlayerDetails: (e: SetStateAction<Player | undefined>) => void;
  approvePlayerMilestone: (
    id: number,
    milestone: number,
    playerProfile: `0x${string}`,
    index: number
  ) => Promise<void>;
  approvalLoading: boolean[];
  playerEligible:
    | {
        eligible: boolean;
        completed: VideoActivity[];
        toComplete: VideoActivity[];
      }
    | undefined;
  player?: boolean;
  dict: any;
};

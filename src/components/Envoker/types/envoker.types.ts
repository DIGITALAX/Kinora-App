import { Action, Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import {
  Player,
  Quest,
  Reward,
  VideoActivity,
} from "@/components/Quest/types/quest.types";

export type AccountSwitchProps = {
  pageProfile: Profile | undefined;
  lensConnected: Profile | undefined;
  allSaves: Post[];
  getMore: () => Promise<void>;
  terminateQuest: (id: number, index: number) => Promise<void>;
  approvePlayerMilestone: (
    id: number,
    milestone: number,
    playerProfileId: `0x${string}`,
    index: number
  ) => Promise<void>;
  claimRewardLoading: boolean[];
  terminateLoading: boolean[];
  approvalLoading: boolean[];
  playerClaimMilestoneReward: (
    id: string,
    index: number,
    questCompleted: boolean
  ) => Promise<void>;
  openPlayerDetails: Player | undefined;
  setOpenPlayerDetails: (e: SetStateAction<Player | undefined>) => void;
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  quests: (Quest & { type: string })[];
  playerEligible:
    | {
        eligible: boolean;
        completed: VideoActivity[];
        toComplete: VideoActivity[];
      }
    | undefined;
  openQuest: Quest | undefined;
  setOpenQuest: (e: SetStateAction<Quest | undefined>) => void;
  router: NextRouter;
  questsLoading: boolean;
  accountType: AccountType;
  savesInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  getMoreSaves: () => Promise<void>;
  savesLoading: boolean;
  dispatch: Dispatch;
  globalLoading: boolean;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpen: boolean[];
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
    collect: boolean;
  }[];
  followProfile: (id: string, index: number, main?: boolean) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
};

export enum AccountType {
  Home,
  Save,
  Dashboard,
}

export type HomeProps = {
  questsLoading: boolean;
  quests: (Quest & { type: string })[];
  dispatch: Dispatch;
  globalLoading: boolean;
  lensConnected: Profile | undefined;
  router: NextRouter;
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  mirrorChoiceOpen: boolean[];
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
    collect: boolean;
  }[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  followProfile: (id: string, index: number, main?: boolean) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  getMore: () => Promise<void>;
};

export type SavesProps = {
  savesInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  router: NextRouter;
  getMoreSaves: () => Promise<void>;
  savesLoading: boolean;
  allSaves: Post[];
  dispatch: Dispatch;
  lensConnected: Profile | undefined;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpen: boolean[];
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
    collect: boolean;
  }[];
  followProfile: (id: string, index: number, main?: boolean) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  globalLoading: boolean;
};

export type BioProps = {
  profile: Profile;
  dispatch: Dispatch<Action>;
};

export type DashboardProps = {
  allQuests: (Quest & { type: string })[];
  terminateQuest: (id: number, index: number) => Promise<void>;
  approvePlayerMilestone: (
    id: number,
    milestone: number,
    playerProfileId: `0x${string}`,
    index: number
  ) => Promise<void>;
  claimRewardLoading: boolean[];
  terminateLoading: boolean[];
  approvalLoading: boolean[];
  playerClaimMilestoneReward: (
    id: string,
    index: number,
    questCompleted: boolean
  ) => Promise<void>;
  openQuest: Quest | undefined;
  playerEligible:
    | {
        eligible: boolean;
        completed: VideoActivity[];
        toComplete: VideoActivity[];
      }
    | undefined;
  lensConnected: Profile | undefined;
  setOpenQuest: (e: SetStateAction<Quest | undefined>) => void;
  getMore: () => Promise<void>;
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  router: NextRouter;
  openPlayerDetails: Player | undefined;
  setOpenPlayerDetails: (e: SetStateAction<Player | undefined>) => void;
};

export type PlayerMilestoneProps = {
  index: number;
  quest: Quest;
  openPlayerDetails: Player | undefined;
  setOpenPlayerDetails: (e: SetStateAction<Player | undefined>) => void;
  approvePlayerMilestone: (
    id: number,
    milestone: number,
    playerProfileId: `0x${string}`,
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
  router: NextRouter;
  player?: boolean;
};

export type RewardProps = {
  rewards: Reward[];
  dispatch: Dispatch;
};

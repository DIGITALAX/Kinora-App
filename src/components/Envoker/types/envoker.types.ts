import { Action, Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import { Quest } from "@/components/Quest/types/quest.types";

export type AccountSwitchProps = {
  pageProfile: Profile | undefined;
  lensConnected: Profile | undefined;
  allSaves: Post[];
  getMore: () => Promise<void>;
  terminateQuest: (id: number) => Promise<void>;
  approvePlayerMilestone: (
    id: number,
    milestone: number,
    playerProfileId: `0x${string}`
  ) => Promise<void>;
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  quests: (Quest & { type: string })[];
  openQuest: boolean[];
  setOpenQuest: (e: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  questsLoading: boolean;
  accountType: AccountType;
  savesInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  terminateLoading: boolean;
  approvalLoading: boolean;
  getMoreSaves: () => Promise<void>;
  savesLoading: boolean;
  dispatch: Dispatch;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpen: boolean[];
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
  ) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  followProfile: (id: string, index: number, type: string) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
};

export enum AccountType {
  Home,
  Save,
  History,
  Dashboard,
}

export type HomeProps = {
  questsLoading: boolean;
  quests: (Quest & { type: string })[];
  dispatch: Dispatch;
  lensConnected: Profile | undefined;
  router: NextRouter;
  mirror: (id: string) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
  ) => Promise<void>;
  mirrorChoiceOpen: boolean[];
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  followProfile: (id: string, index: number, type: string) => Promise<void>;
  unfollowProfile: (id: string, index: number, type: string) => Promise<void>;
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
  mirror: (id: string, ) => Promise<void>;
  bookmark: (id: string) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
  ) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  followProfile: (id: string, index: number, type: string) => Promise<void>;
  unfollowProfile: (id: string, index: number, type: string) => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
};

export type BioProps = {
  profile: Profile;
  dispatch: Dispatch<Action>;
  unfollowProfile: (id: string, index: number, main?: boolean) => Promise<void>;
  mainInteractionsLoading: {
    follow: boolean;
    unfollow: boolean;
  };
  followProfile: (
    id: string,
    index: number,
    type: string,
    main?: boolean
  ) => Promise<void>;
};

export type DashboardProps = {
  envokedQuests: Quest[];
  terminateQuest: (id: number) => Promise<void>;
  approvePlayerMilestone: (
    id: number,
    milestone: number,
    playerProfileId: `0x${string}`
  ) => Promise<void>;
  openQuest: boolean[];
  setOpenQuest: (e: SetStateAction<boolean[]>) => void;
  terminateLoading: boolean;
  approvalLoading: boolean;
};

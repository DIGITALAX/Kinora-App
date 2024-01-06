import { Action, Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import { Quest } from "@/components/Quest/types/quest.types";

export type AccountSwitchProps = {
  pageProfile: Profile | undefined;
  lensConnected: Profile | undefined;
  allSaves: Post[];
  setLiveQuests: (e: SetStateAction<Quest[]>) => void;
  setCompletedQuests: (e: SetStateAction<Quest[]>) => void;
  setEnvokedQuests: (e: SetStateAction<Quest[]>) => void;
  setAllSaves: (e: SetStateAction<Post[]>) => void;
  interactionsLoadingEnvoked: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  getMorePlayer: () => Promise<void>;
  getMoreEnvoked: () => Promise<void>;
  mirrorChoiceOpenEnvoked: boolean[];
  setMirrorChoiceOpenEnvoked: (e: SetStateAction<boolean[]>) => void;
  setProfileHoversEnvoked: (e: SetStateAction<boolean[]>) => void;
  profileHoversEnvoked: boolean[];
  envokedQuests: Quest[];
  router: NextRouter;
  questsLoading: boolean;
  accountType: AccountType;
  savesInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };

  liveQuests: Quest[];
  completedQuests: Quest[];
  getMoreSaves: () => Promise<void>;
  savesLoading: boolean;
  dispatch: Dispatch;
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpen: boolean[];
  mirror: (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string
  ) => Promise<void>;
  bookmark: (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void)
  ) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string
  ) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  followProfile: (id: string, index: number, type: string) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  mirrorChoiceOpenCompleted: boolean[];
  setMirrorChoiceOpenCompleted: (e: SetStateAction<boolean[]>) => void;
  interactionsLoadingCompleted: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  setProfileHoversCompleted: (e: SetStateAction<boolean[]>) => void;
  profileHoversCompleted: boolean[];
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
  liveQuests: Quest[];
  completedQuests: Quest[];
  envokedQuests: Quest[];
  dispatch: Dispatch;
  lensConnected: Profile | undefined;
  onlyHistory: boolean;
  router: NextRouter;
  mirrorChoiceOpenCompleted?: boolean[];
  setMirrorChoiceOpenCompleted?: (e: SetStateAction<boolean[]>) => void;
  mirror: (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string
  ) => Promise<void>;
  bookmark: (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void)
  ) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string
  ) => Promise<void>;
  interactionsLoadingCompleted?: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  mirrorChoiceOpen: boolean[];
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  setProfileHoversCompleted?: (e: SetStateAction<boolean[]>) => void;
  profileHoversCompleted?: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  followProfile: (id: string, index: number, type: string) => Promise<void>;
  unfollowProfile: (id: string, index: number, type: string) => Promise<void>;
  interactionsLoadingEnvoked: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  info: {
    hasMorePlayer: boolean;
    hasMoreEnvoked: boolean;
    playerCursor: number;
    envokedCursor: number;
  };
  getMorePlayer: () => Promise<void>;
  getMoreEnvoked: () => Promise<void>;
  mirrorChoiceOpenEnvoked: boolean[];
  setMirrorChoiceOpenEnvoked: (e: SetStateAction<boolean[]>) => void;
  setProfileHoversEnvoked: (e: SetStateAction<boolean[]>) => void;
  profileHoversEnvoked: boolean[];
  setLiveQuests: (e: SetStateAction<Quest[]>) => void;
  setCompletedQuests: (e: SetStateAction<Quest[]>) => void;
  setEnvokedQuests: (e: SetStateAction<Quest[]>) => void;
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
  mirror: (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string
  ) => Promise<void>;
  bookmark: (
    id: string,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void)
  ) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
    feed: (Quest | Post)[],
    itemSetter:
      | ((e: SetStateAction<Quest[]>) => void)
      | ((e: SetStateAction<Post[]>) => void),
    type: string
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
  setAllSaves: (e: SetStateAction<Post[]>) => void;
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

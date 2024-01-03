import { Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import { Quest } from "@/components/Quest/types/quest.types";

export type AccountSwitchProps = {
  pageProfile: Profile | undefined;
  lensConnected: Profile | undefined;
  allSaves: Post[];
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
  setMirrorChoiceOpenSave: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpenSave: boolean[];
  mirrorSave: (id: string, post?: boolean) => Promise<void>;
  bookmarkSave: (id: string, post?: boolean) => Promise<void>;
  likeSave: (id: string, post?: boolean) => Promise<void>;
  simpleCollectSave: (id: string, post?: boolean) => Promise<void>;
  interactionsLoadingSave: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
};

export enum AccountType {
  Home,
  Save,
  History,
  Stats,
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
  mirror: (id: string, post?: boolean) => Promise<void>;
  bookmark: (id: string, post?: boolean) => Promise<void>;
  like: (id: string, post?: boolean) => Promise<void>;
  simpleCollect: (id: string, post?: boolean | undefined) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
};

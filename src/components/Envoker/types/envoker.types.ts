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
  setEnvokedQuests: (e: SetStateAction<Quest[]>) => void;
  questsLoading: boolean;
  setLiveQuests: (e: SetStateAction<Quest[]>) => void;
  setCompletedQuests: (e: SetStateAction<Quest[]>) => void;
  setAllSaves: (e: SetStateAction<Post[]>) => void;
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
};

export enum AccountType {
  Home,
  Save,
  History,
  Stats,
}

export type HomeProps = {
  questsLoading: boolean;
  setCompletedQuests: (e: SetStateAction<Quest[]>) => void;
  setLiveQuests: (e: SetStateAction<Quest[]>) => void;
  liveQuests: Quest[];
  completedQuests: Quest[];
  envokedQuests: Quest[];
  setEnvokedQuests: (e: SetStateAction<Quest[]>) => void;
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
  setAllSaves: (e: SetStateAction<Post[]>) => void;
};

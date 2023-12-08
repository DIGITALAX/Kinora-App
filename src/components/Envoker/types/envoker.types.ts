import { Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";

export type AccountSwitchProps = {
  pageProfile: Profile | undefined;
  lensConnected: Profile | undefined;
  allSaves: Post[];
  questsLoading: boolean;
  setLiveQuests: (e: SetStateAction<Post[]>) => void;
  setCompletedQuests: (e: SetStateAction<Post[]>) => void;
  setAllSaves: (e: SetStateAction<Post[]>) => void;
  accountType: AccountType;
  savesInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  liveQuests: Post[];
  completedQuests: Post[];
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
  setCompletedQuests: (e: SetStateAction<Post[]>) => void;
  setLiveQuests: (e: SetStateAction<Post[]>) => void;
  liveQuests: Post[];
  completedQuests: Post[];
  dispatch: Dispatch;
  lensConnected: Profile | undefined;
  onlyHistory: boolean;
};

export type SavesProps = {
  savesInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  getMoreSaves: () => Promise<void>;
  savesLoading: boolean;
  allSaves: Post[];
  dispatch: Dispatch;
  lensConnected: Profile | undefined;
  setAllSaves: (e: SetStateAction<Post[]>) => void;
};

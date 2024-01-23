import { NextRouter } from "next/router";
import {
  Erc20,
  MultirecipientFeeCollectOpenActionSettings,
  Post,
  Profile,
  SimpleCollectOpenActionModuleInput,
  SimpleCollectOpenActionSettings,
} from "../../../../graphql/generated";
import { Action, Dispatch } from "redux";
import { SetStateAction } from "react";
import { MakePostComment, Quest } from "@/components/Quest/types/quest.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";
import { Collection } from "@/components/Envoke/types/envoke.types";

export type SidebarProps = {
  openSidebar: boolean;
  router: NextRouter;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  walletConnected: boolean;
  openConnectModal: (() => void) | undefined;
  handleLogIn: () => Promise<void>;
  newQuests: Quest[];
};

export type IndexProps = {
  message: string;
};

export type InteractErrorProps = {
  dispatch: Dispatch;
};

export type SuccessProps = {
  dispatch: Dispatch;
  image: string;
  text: string;
};

export type FollowCollectProps = {
  dispatch: Dispatch<Action>;
  type: string;
  collect:
    | {
        item:
          | SimpleCollectOpenActionSettings
          | MultirecipientFeeCollectOpenActionSettings
          | undefined;
        stats: number | undefined;
        id: string;
      }
    | undefined;
  follower: Profile | undefined;
  handleFollow: () => Promise<void>;
  handleCollect: () => Promise<void>;
  approveSpend: () => Promise<void>;
  transactionLoading: boolean;
  informationLoading: boolean;
  approved: boolean;
};

export type QuoteBoxProps = {
  dispatch: Dispatch<Action>;
  postCollectGif: PostCollectGifState;
  quote: Post;
  makeQuote: MakePostComment[];
  handleQuote: () => Promise<void>;
  lensConnected: Profile | undefined;
  caretCoord: {
    x: number;
    y: number;
  };
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  setMakeQuote: (e: SetStateAction<MakePostComment[]>) => void;
  quoteLoading: boolean[];
  router: NextRouter;
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  contentLoading: {
    image: boolean;
    video: boolean;
  }[];
};

export type ImageLargeProps = {
  mainImage: string;
  dispatch: Dispatch<Action>;
  type: string;
};

export type PostCollectGifProps = {
  dispatch: Dispatch<Action>;
  type: string | undefined;
  id: string;
  handleGif: (e: string) => Promise<void>;
  setCollects: (
    e: SetStateAction<SimpleCollectOpenActionModuleInput | undefined>
  ) => void;
  collects: SimpleCollectOpenActionModuleInput | undefined;
  gifInfo: {
    searchedGifs: string[];
    search: string;
  };
  setGifInfo: (
    e: SetStateAction<{
      searchedGifs: string[];
      search: string;
    }>
  ) => void;
  openMeasure: {
    collectibleOpen: boolean;
    collectible: string;
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  };
  setOpenMeasure: (
    e: SetStateAction<{
      collectibleOpen: boolean;
      collectible: string;
      award: string;
      whoCollectsOpen: boolean;
      creatorAwardOpen: boolean;
      currencyOpen: boolean;
      editionOpen: boolean;
      edition: string;
      timeOpen: boolean;
      time: string;
    }>
  ) => void;
  availableCurrencies: Erc20[];
  gifs:
    | {
        [key: string]: string[];
      }
    | undefined;
  collectTypes:
    | {
        [key: string]: SimpleCollectOpenActionModuleInput | undefined;
      }
    | undefined;
  searchGifLoading: boolean;
};

export type QuestGatesProps = {
  dispatch: Dispatch<Action>;
  gates: {
    erc20?: {
      address: string;
      amount: string;
    }[];
    erc721?: Collection[];
    oneOf?: boolean;
  };
};

export type FollowersProps = {
  dataLoading: boolean;
  followers: Profile[];
  hasMore: boolean;
  showMore: () => Promise<void>;
  router: NextRouter;
  dispatch: Dispatch<Action>;
};

export type ClaimProfileProps = {
  dispatch: Dispatch<Action>;
  handleLogOut: () => Promise<void>;
};

export type MissingValuesProps = {
  dispatch: Dispatch<Action>;
};

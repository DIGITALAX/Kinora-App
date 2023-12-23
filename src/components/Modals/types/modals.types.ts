import { NextRouter } from "next/router";
import {
  MultirecipientFeeCollectOpenActionSettings,
  Post,
  Profile,
  SimpleCollectOpenActionSettings,
} from "../../../../graphql/generated";
import { Action, Dispatch } from "redux";
import { SetStateAction } from "react";
import { MakePostComment } from "@/components/Quest/types/quest.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

export type SidebarProps = {
  openSidebar: boolean;
  router: NextRouter;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  walletConnected: boolean;
  openConnectModal: (() => void) | undefined;
  handleLogIn: () => Promise<void>;
};

export type IndexProps = {
  message: string;
};

export type InteractErrorProps = {
  dispatch: Dispatch;
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

import { Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { ChangeEvent, SetStateAction } from "react";
import { NextRouter } from "next/router";

export type QuestFeedProps = {
  questFeed: Post[];
  router: NextRouter;
  questInfo: {
    hasMore: boolean;
    cursor: string | undefined;
  };
  getMoreQuestFeed: () => Promise<void>;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
};

export type QuestPreviewProps = {
  quest: Post;
  router: NextRouter;
  height: string;
  width: string;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  questFeed: Post[];
  setItemFeed?: (e: SetStateAction<Post[]>) => void;
};

export type SaveQuestProps = {
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  questSaved: boolean;
  questId: string;
  questFeed: Post[];
  setItemFeed?: (e: SetStateAction<Post[]>) => void;
};

export type ConnectFirstProps = {
  openConnectModal: (() => void) | undefined;
  handleLogIn: () => Promise<void>;
  signLoading: boolean;
  walletConnected: boolean;
};

export type WaveFormProps = {
  keyValue: string;
  audio: string;
  video: string;
  type: string;
  upload?: boolean;
  loaderEnd?: () => void;
  loaderStart?: () => void;
  internalFunction?: (e: string) => void;
};

export type MediaProps = {
  type: string;
  srcUrl: string;
  srcCover?: string;
  classNameVideo?: string;
  classNameImage?: string;
  classNameAudio?: string;
  objectFit?: string;
  hidden?: boolean;
  autoPlay?: boolean;
};

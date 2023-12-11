import { Dispatch } from "redux";
import { Post, Profile } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import { Quest } from "@/components/Quest/types/quest.types";

export type QuestFeedProps = {
  questFeed: Quest[];
  router: NextRouter;
  questInfo: {
    hasMore: boolean;
    cursor: number;
  };
  getMoreQuestFeed: () => Promise<void>;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
};

export type QuestPreviewProps = {
  quest: Quest | Post;
  router: NextRouter;
  height: string;
  width: string;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  questFeed: Quest[] | Post[];
  setItemFeed?:
    | ((e: SetStateAction<Quest[]>) => void)
    | ((e: SetStateAction<Post[]>) => void);
  post?: boolean;
};

export type SaveQuestProps = {
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  questSaved: boolean;
  post?: boolean;
  questId: string;
  questFeed: Quest[] | Post[];
  setItemFeed?:
    | ((e: SetStateAction<Quest[]>) => void)
    | ((e: SetStateAction<Post[]>) => void);
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

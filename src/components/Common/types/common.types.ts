import { Action, Dispatch } from "redux";
import {
  ArticleMetadataV3,
  AudioMetadataV3,
  Comment,
  ImageMetadataV3,
  Mirror,
  Post,
  Profile,
  Quote,
  StoryMetadataV3,
  TextOnlyMetadataV3,
  VideoMetadataV3,
} from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { NextRouter } from "next/router";
import { MakePostComment, Quest } from "@/components/Quest/types/quest.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

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
  mirror: (id: string) => void;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  mirrorChoiceOpen: boolean[];
  bookmark: (id: string) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  setMirrorChoiceOpen: (id: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  setProfileHovers: (id: SetStateAction<boolean[]>) => void;
  unfollowProfile: (id: string, index: number) => void;
  followProfile: (id: string, index: number) => void;
};

export type QuestPreviewProps = {
  quest: Quest | Post;
  router: NextRouter;
  height: string;
  width: string;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  post?: boolean;
  index: number;
  mirror: (id: string) => void;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  mirrorChoiceOpen: boolean[];
  bookmark: (id: string) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  setMirrorChoiceOpen: (id: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  setProfileHovers: (id: SetStateAction<boolean[]>) => void;
  unfollowProfile: (id: string, index: number) => void;
  followProfile: (id: string, index: number) => void;
  mainFeed?: boolean;
};

export type InteractBarProps = {
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  index: number;
  interactionsLoading?: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  publication: Post;
  mirror?: (id: string, main?: boolean) => void;
  like?: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  mirrorChoiceOpen?: boolean[];
  bookmark?: (id: string) => Promise<void>;
  setMirrorChoiceOpen?: (id: SetStateAction<boolean[]>) => void;
  profileHovers?: boolean[];
  setProfileHovers?: (id: SetStateAction<boolean[]>) => void;
  unfollowProfile?: (id: string, index: number) => Promise<void>;
  followProfile?: (id: string, index: number) => Promise<void>;
  router: NextRouter;
  mainFeed?: boolean;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  setCommentsOpen?: (e: SetStateAction<boolean[]>) => void;
  main?: boolean;
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
  handlePlayVideo?: () => void;
  handlePauseVideo?: () => void;
  handleSeekVideo?: (e: number) => void;
  videoInfo?: {
    isPlaying: boolean;
    currentTime: number;
    duration: number;
  };
};

export type MediaProps = {
  type: string;
  srcUrl: string;
  srcCover?: string;
  classNameVideo?: React.CSSProperties;
  classNameImage?: string;
  classNameAudio?: string;
  objectFit?: string;
  hidden?: boolean;
  autoPlay?: boolean;
};

export type ProfileHoverProps = {
  unfollowProfile: (id: string, index: number) => void;
  followProfile: (id: string, index: number) => void;
  profile: Profile;
  index: number;
  followLoading: boolean;
  unfollowLoading: boolean;
  pfp: string | undefined;
  setProfileHovers: (id: SetStateAction<boolean[]>) => void;
  router: NextRouter;
  dispatch: Dispatch;
};

export type PostCommentProps = {
  makePostComment: MakePostComment;
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
  mentionProfiles: Profile[];
  profilesOpen: boolean;
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  lensConnected: Profile | undefined;
  postCollectGif: PostCollectGifState;
  setMakePostComment: (e: SetStateAction<MakePostComment[]>) => void;
  main?: boolean | undefined;
  commentPost:
    | ((id: string) => Promise<void>)
    | (() => Promise<void>)
    | ((id: string, main: boolean) => Promise<void>);
  commentPostLoading: boolean;
  id: string;
  height: string;
  dispatch: Dispatch<Action>;
  imageHeight: string;
  imageWidth: string;
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
  };
  index: number;
};

export type PostQuoteProps = {
  quote: Post | Comment;
  dispatch: Dispatch<Action>;
  disabled: boolean | undefined;
  router: NextRouter;
  index: number;
  lensConnected?: Profile | undefined;
  interactionsLoading?: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
    comment: boolean;
  }[];
  main?: boolean;
  mirror?: (id: string, main?: boolean | undefined) => void;
  like?: (
    id: string,
    hasReacted: boolean,
    main?: boolean | undefined
  ) => Promise<void>;
  mirrorChoiceOpen?: boolean[];
  setMirrorChoiceOpen?: (id: SetStateAction<boolean[]>) => void;
  profileHovers?: boolean[];
  setProfileHovers?: (id: SetStateAction<boolean[]>) => void;
  unfollowProfile?: (id: string, index: number) => Promise<void>;
  followProfile?: (id: string, index: number) => Promise<void>;
  simpleCollect?: (id: string, type: string) => Promise<void>;
  setCommentsOpen?: (e: SetStateAction<boolean[]>) => void;
  commentsOpen?: boolean[];
  makeComment?: MakePostComment[];
  caretCoord?: {
    x: number;
    y: number;
  };
  setCaretCoord?: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  mentionProfiles?: Profile[];
  profilesOpen?: boolean[];
  setMentionProfiles?: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen?: (e: SetStateAction<boolean[]>) => void;
  postCollectGif?: PostCollectGifState;
  setMakeComment?: (e: SetStateAction<MakePostComment[]>) => void;
  commentPost?: (id: string, main: boolean) => Promise<void>;
  contentLoading?: {
    image: boolean;
    video: boolean;
  }[];
  setContentLoading?: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
};

export type TextProps = {
  metadata: ArticleMetadataV3 | StoryMetadataV3 | TextOnlyMetadataV3;
  disabled: boolean;
};

export type PostSwitchProps = {
  dispatch: Dispatch<Action>;
  item: Post | Comment | Mirror;
  disabled: boolean | undefined;
};

export type MediaImageProps = {
  disabled: boolean | undefined;
  dispatch: Dispatch<Action>;
  metadata: ImageMetadataV3 | VideoMetadataV3 | AudioMetadataV3;
};

export enum ItemType {
  CoinOp = "coinop",
  Chromadin = "chromadin",
  Legend = "legend",
  Listener = "listener",
  F3M = "f3m",
  Other = "other",
  Kinora = "kinora",
  TheDial = "dial",
}

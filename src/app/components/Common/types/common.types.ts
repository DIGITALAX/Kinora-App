import { ApolloClient, NormalizedCacheObject } from "@apollo/client";
import {
  Account,
  ArticleMetadata,
  AudioMetadata,
  BigDecimal,
  DateTime,
  EvmAddress,
  ImageMetadata,
  Post,
  Repost,
  SessionClient,
  StoryMetadata,
  TextOnlyMetadata,
  VideoMetadata,
} from "@lens-protocol/client";
import { RefObject, SetStateAction } from "react";

export interface LensConnected {
  profile?: Account;
  sessionClient?: SessionClient;
  apollo?: ApolloClient<NormalizedCacheObject>;
}

export enum Indexar {
  Inactive = "inactive",
  Success = "suc",
  Indexando = "ind",
}

export interface PostQuoteProps {
  quote: Post;
  disabled?: boolean;
  dict: any;
}

export enum ItemType {
  Chromadin = "chromadin",
  CoinOp = "coinop",
  Listener = "listener",
  F3M = "f3m",
  Kinora = "kinora",
  TripleA = "triplea",
  Other = "other",
  TheDial = "dial",
}

export interface Quest {
  post: Post;
  gate: Gate;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
    videoCovers: {
      title: string;
      description: string;
      cover: string;
    }[];
  };
  status: boolean;
  postId: string;
  milestones: Milestone[];
  questId: string;
  transactionHash: string;
  uri: string;
  milestoneCount: string;
  players: Player[];
  maxPlayerCount: string;
  blockTimestamp: string;
}

export interface Milestone {
  gated: Gate;
  milestoneMetadata: {
    title: string;
    description: string;
    cover: string;
  };
  milestoneId: string;
  rewards: Reward[];
  rewardsLength: string;
  videoLength: string;
  videos: Video[];
}

export interface Player {
  milestonesCompleted: {
    questId: string;
    milestonesCompleted: String;
  }[];
  eligibile: {
    milestone: string;
    questId: string;
    status: boolean;
  }[];
  account: string;
  questsCompleted: string[];
  questsJoined: string[];
  videos: VideoActivity[];
  profile: Account;
  playerProfile: string;
}

export interface Video {
  uri: string;
  details?: {
    cover: string;
    title: string;
    description: string;
  };
  post?: Post;
  react: boolean;
  quote: boolean;
  postId: string;
  playerId: string;
  minPlayCount: string;
  mirror: boolean;
  minDuration: string;
  minAVD: string;
  minSecondaryQuoteOnQuote: string;
  minSecondaryMirrorOnQuote: string;
  minSecondaryReactOnQuote: string;
  minSecondaryCommentOnQuote: string;
  minSecondaryCollectOnQuote: string;
  minSecondaryQuoteOnComment: string;
  minSecondaryMirrorOnComment: string;
  minSecondaryReactOnComment: string;
  minSecondaryCommentOnComment: string;
  minSecondaryCollectOnComment: string;
  comment: boolean;
  bookmark: boolean;
}
export interface Gate {
  erc721Logic: Collection[];
  erc20Logic: {
    address: string;
    amount: string;
  }[];
  oneOf: boolean;
}

export interface Collection {
  amount: string;
  postId: string;
  uri: string;
  printType: string;
  price: number;
  acceptedTokens: string[];
  designer: string;
  tokenIdsMinted: string[];
  collectionId: string;
  unlimited: boolean;
  origin: string;
  post?: Post;
  profile?: Account;
  blockTimestamp: string;
  drop: {
    dropId: string;
    metadata: {
      title: string;
      cover: string;
    };
    uri: string;
    collections: Collection[];
  };
  metadata: {
    access: string[];
    colors: string[];
    sizes: string[];
    mediaCover: string;
    description: string;
    title: string;
    tags: string[];
    prompt: string;
    mediaTypes: string;
    microbrandCover: string;
    microbrand: string;
    images: string[];
    video: string;
    audio: string;
    extra: string;
    onChromadin: string;
    sex: string;
    style: string;
  };
}
export interface Reward {
  amount: string;
  tokenAddress: string;
  rewardMetadata: {
    mediaCover: string;
    images: string;
    video: string;
    mediaType: string;
    audio: string;
    title: string;
    description: string;
    prompt: string;
  };
  uri: string;
  type: string;
  questId: string;
  postId: string;
  milestone: string;
  questURI: string;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
    videoCovers: {
      title: string;
      description: string;
      cover: string;
    }[];
  };
}

export interface VideoActivity {
  playCount: number;
  postId: string;
  uri: string;
  details?: {
    cover: string;
    title: string;
    description: string;
  };
  videoMetadata: {
    cover: string;
    title: string;
    description: string;
  };
  playerId: string;
  mostReplayed: string;
  duration: number;
  hasReacted: boolean;
  hasQuoted: boolean;
  hasMirrored: boolean;
  hasCommented: boolean;
  hasBookmarked: boolean;
  avd: number;
  secondaryQuoteOnQuote: number;
  secondaryMirrorOnQuote: number;
  secondaryReactOnQuote: number;
  secondaryCommentOnQuote: number;
  secondaryCollectOnQuote: number;
  secondaryQuoteOnComment: number;
  secondaryMirrorOnComment: number;
  secondaryReactOnComment: number;
  secondaryCommentOnComment: number;
  secondaryCollectOnComment: number;
  post?: Post;
}

export type QuestPreviewProps = {
  quest: Quest | Post;
  height: string;
  width: string;
  post?: boolean;
  mainFeed?: boolean;
  border?: boolean;
  disabled?: boolean;
  dict: any;
};

export type InteractBarProps = {
  post: Post;
  border?: boolean;
  dict: any;
  mainFeed?: boolean;
  setCommentsOpen?: (e: SetStateAction<boolean>) => void;
};

export type ProfileHoverProps = {
  profile: Account;
  setProfileHover: (e: SetStateAction<boolean>) => void;
  dict: any;
};

export enum AccountType {
  Home,
  Save,
  Dashboard,
}

export type PostCommentProps = {
  dict: any;
  height: string;
  imageHeight: string;
  imageWidth: string;
  mentionProfiles: Account[];
  commentDetails: string;
  profilesOpen: boolean;
  searchProfiles: (e: any) => Promise<void>;
  caretCoord: {
    x: number;
    y: number;
  };
  id: string;
  comment: () => Promise<void>;
  commentLoading: boolean;
  setCommentDetails: (e: SetStateAction<string>) => void;
  setProfilesOpen: (e: SetStateAction<boolean>) => void;
  textElement: RefObject<HTMLTextAreaElement | null>;
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
  postId: string;
};

export interface SimpleCollect {
  isImmutable?: boolean | null | undefined;
  endsAt?: DateTime | null | undefined;
  followerOnGraph?:
    | {
        globalGraph: true;
      }
    | {
        graph: EvmAddress;
      }
    | null
    | undefined;
  collectLimit?: number | null | undefined;
  payToCollect?:
    | {
        referralShare?: number | null | undefined;
        recipients: {
          percent: number;
          address: EvmAddress;
        }[];
        amount: {
          value: BigDecimal;
          currency: EvmAddress;
        };
      }
    | null
    | undefined;
}

export type PostSwitchProps = {
  item: Post | Repost;
  disabled: boolean | undefined;
};

export type MediaImageProps = {
  disabled: boolean | undefined;
  postId: string;

  metadata: ImageMetadata | VideoMetadata | AudioMetadata;
};

export type TextProps = {
  disabled?: boolean;
  metadata: ArticleMetadata | StoryMetadata | TextOnlyMetadata;
};

export interface OracleData {
  currency: string;
  rate: string;
  wei: string;
}

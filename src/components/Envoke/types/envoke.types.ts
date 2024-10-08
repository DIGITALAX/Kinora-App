import { Action, Dispatch } from "redux";
import { QuestInfoState } from "../../../../redux/reducers/questInfoSlice";
import { SetStateAction } from "react";
import { Post, Profile } from "../../../../graphql/generated";
import { NextRouter } from "next/router";

export enum QuestStage {
  Details = "Set Details",
  Milestones = "Create Milestones",
  Storyboard = "Storyboard",
  Post = "Post Live",
}

export interface QuestDetails {
  title: string;
  description: string;
  cover: string;
  tags: string;
  gated: GatingLogic;
  maxPlayerCount: number;
}

export enum RewardType {
  ERC20,
  ERC721,
}

export interface GatingLogic {
  erc721Addresses: `0x${string}`[];
  erc721TokenIds: Collection[];
  erc20Addresses: `0x${string}`[];
  erc20Thresholds: number[];
  oneOf: boolean;
}

export interface ItemDetails {
  title: string;
  media: string;
  description: string;
  prompt: string;
  mediaCover: string;
  video: string;
  audio: string;
  images: string[];
  open: boolean;
}

export interface ERC721Reward {
  details: ItemDetails;
}

export interface ERC20Reward {
  amount: string;
  address: `0x${string}`;
  balance: boolean | undefined;
}

export interface Milestone {
  gated: GatingLogic;
  rewards: {
    rewards721: ERC721Reward[];
    rewards20: ERC20Reward[];
  };
  details: {
    title: string;
    cover: string;
    description: string;
  };
  eligibility: VideoEligible[];
}

export interface VideoEligible {
  video: Post;
  criteria: MilestoneEligibilityCriteria;
  open: boolean;
}

export interface MilestoneEligibility {
  internalPlaybackCriteria?: {
    playbackId: string;
    postId: string;
    playbackCriteria: MilestoneEligibilityCriteria;
  }[];
}

export interface MilestoneEligibilityCriteria {
  minPlayCount?: number;
  minAvd?: number;
  minDuration?: number;
  minSecondaryQuoteOnQuote?: number;
  minSecondaryMirrorOnQuote?: number;
  minSecondaryReactOnQuote?: number;
  minSecondaryCommentOnQuote?: number;
  minSecondaryCollectOnQuote?: number;
  minSecondaryQuoteOnComment?: number;
  minSecondaryMirrorOnComment?: number;
  minSecondaryReactOnComment?: number;
  minSecondaryCommentOnComment?: number;
  minSecondaryCollectOnComment?: number;
  quote?: boolean;
  mirror?: boolean;
  comment?: boolean;
  bookmark?: boolean;
  react?: boolean;
}

export interface MetricCriteria {
  minValue: number;
  maxValue: number;
  operator: "or" | "and";
}

export interface BoolLensCriteria {
  boolValue: boolean;
  operator: "or" | "and";
}

export type QuestSwitchProps = {
  questStage: QuestStage;
  questInfo: QuestInfoState;
  storyboardStage: StoryboardStage;
  milestoneStoryboardStage: number;
  dispatch: Dispatch<Action>;
  coverLoading: boolean;
  setVideoSearch: (e: SetStateAction<string>) => void;
  getVideosSearch: () => Promise<void>;
  getMoreVideosSearch: () => Promise<void>;
  videoInfo: {
    hasMoreChromadin: boolean;
    cursorChromadin: string | undefined;
    hasMoreKinora: boolean;
    cursorKinora: string | undefined;
  };
  videos: Post[];
  videoSearchLoading: boolean;
  videoSearch: string;
  router: NextRouter;
  t: (key: string) => string;
  getMoreVideosSample: () => Promise<void>;
  chromadinVideos: Post[];
  setCoverLoading: (e: SetStateAction<boolean>) => void;
  milestoneCoversLoading: boolean[];
  setMilestoneCoversLoading: (e: SetStateAction<boolean[]>) => void;
  milestonesOpen: boolean[];
  milestoneStage: number;
  collections: Collection[];
  collectionsSearch: string;
  setCollectionsSearch: (e: SetStateAction<string>) => void;
  getMoreCollectionsSearch: () => Promise<void>;
  getCollectionsSearch: () => Promise<void>;
  getMoreCollectionsSample: () => Promise<void>;
  setCollectionsInfo: (
    e: SetStateAction<{
      hasMore: boolean;
      cursor: number;
    }>
  ) => void;
  collectionsInfo: {
    hasMore: boolean;
    cursor: number;
  };
  handleBalance: (milestoneIndex: number, rewardIndex: number) => Promise<void>;
  balanceLoading: boolean[];
};

export type DetailsProps = {
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  coverLoading: boolean;
  t: (key: string) => string;
  setCoverLoading: (e: SetStateAction<boolean>) => void;
  collections: Collection[];
  collectionsSearch: string;
  setCollectionsSearch: (e: SetStateAction<string>) => void;
  getMoreCollectionsSearch: () => Promise<void>;
  getCollectionsSearch: () => Promise<void>;
  getMoreCollectionsSample: () => Promise<void>;
  setCollectionsInfo: (
    e: SetStateAction<{
      hasMore: boolean;
      cursor: number;
    }>
  ) => void;
  collectionsInfo: {
    hasMore: boolean;
    cursor: number;
  };
};

export type StagesProps = {
  dispatch: Dispatch<Action>;
  questStage: QuestStage;
  questInfo: QuestInfoState;
  t: (key: string) => string;
  postLoading: boolean;
  handlePostLive: () => Promise<void>;
  milestonesOpen: boolean[];
  setMilestonesOpen: (e: SetStateAction<boolean[]>) => void;
  milestoneStage: number;
  setMilestoneStage: (e: SetStateAction<number>) => void;
  storyboardStage: StoryboardStage;
  setStoryboardStage: (e: SetStateAction<StoryboardStage>) => void;
  milestoneStoryboardStage: number;
  setMilestoneStoryboardStage: (e: SetStateAction<number>) => void;
  tokensToApprove: {
    address: string;
    amount: string;
    approved: boolean;
  }[];
  handleApprove: (approveTokenAddress: `0x${string}`) => Promise<void>;
};

export type MilestoneDetailsProps = {
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  milestoneCoversLoading: boolean[];
  milestonesOpen: boolean[];
  t: (key: string) => string;
  setMilestoneCoversLoading: (e: SetStateAction<boolean[]>) => void;
};

export type MilestoneSwitchProps = {
  milestoneStage: number;
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  videoSearchLoading: boolean;
  videoSearch: string;
  router: NextRouter;
  setVideoSearch: (e: SetStateAction<string>) => void;
  getVideosSearch: () => Promise<void>;
  getMoreVideosSearch: () => Promise<void>;
  videoInfo: {
    hasMoreChromadin: boolean;
    cursorChromadin: string | undefined;
    hasMoreKinora: boolean;
    cursorKinora: string | undefined;
  };
  videos: Post[];
  getMoreVideosSample: () => Promise<void>;
  chromadinVideos: Post[];
  handleBalance: (milestoneIndex: number, rewardIndex: number) => Promise<void>;
  t: (key: string) => string
  balanceLoading: boolean[];
  milestoneCoversLoading: boolean[];
  milestonesOpen: boolean[];
  setMilestoneCoversLoading: (e: SetStateAction<boolean[]>) => void;
  collections: Collection[];
  collectionsSearch: string;
  setCollectionsSearch: (e: SetStateAction<string>) => void;
  getMoreCollectionsSearch: () => Promise<void>;
  getCollectionsSearch: () => Promise<void>;
  getMoreCollectionsSample: () => Promise<void>;
  setCollectionsInfo: (
    e: SetStateAction<{
      hasMore: boolean;
      cursor: number;
    }>
  ) => void;
  collectionsInfo: {
    hasMore: boolean;
    cursor: number;
  };
};

export type GatedLogicProps = {
  milestonesOpen?: boolean[];
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  collections: Collection[];
  t: (key: string) => string;
  collectionsSearch: string;
  setCollectionsSearch: (e: SetStateAction<string>) => void;
  getMoreCollectionsSearch: () => Promise<void>;
  getCollectionsSearch: () => Promise<void>;
  getMoreCollectionsSample: () => Promise<void>;
  setCollectionsInfo: (
    e: SetStateAction<{
      hasMore: boolean;
      cursor: number;
    }>
  ) => void;
  collectionsInfo: {
    hasMore: boolean;
    cursor: number;
  };
  join?: boolean;
};

export interface Collection {
  collectionId: string;
  soldTokens: string;
  dropMetadata: {
    dropCover: string;
    dropTitle: string;
  };
  collectionMetadata: {
    title: string;
    mediaCover: string;
    images: string[];
    sizes: string[];
    colors: string[];
    mediaTypes: string[];
    access: string[];
    communities: string[];
    tags: string[];
  };

  publication: Post;
  amount: string;
  prices: string[];
  origin: string;
  uri: string;
  profileId: string;
  pubId: string;
  profile: Profile;
}

export type RewardProps = {
  milestonesOpen: boolean[];
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  handleBalance: (milestoneIndex: number, rewardIndex: number) => Promise<void>;
  t: (key: string) => string;
  balanceLoading: boolean[];
};

export type MintProps = {
  item: ItemDetails;
  dispatch: Dispatch<Action>;
  questInfo: QuestInfoState;
  milestonesOpen: boolean[];
  index: number;
  t: (key: string) => string;
};

export type CriteriaProps = {
  router: NextRouter;
  videoSearchLoading: boolean;
  videoSearch: string;
  setVideoSearch: (e: SetStateAction<string>) => void;
  getVideosSearch: () => Promise<void>;
  getMoreVideosSearch: () => Promise<void>;
  videoInfo: {
    hasMoreChromadin: boolean;
    cursorChromadin: string | undefined;
    hasMoreKinora: boolean;
    cursorKinora: string | undefined;
  };
  videos: Post[];
  getMoreVideosSample: () => Promise<void>;
  chromadinVideos: Post[];
  milestonesOpen: boolean[];
  questInfo: QuestInfoState;
  t: (key: string) => string;
  dispatch: Dispatch<Action>;
};

export type EligibleProps = {
  item: VideoEligible;
  questInfo: QuestInfoState;
  dispatch: Dispatch;
  index: number;
  milestonesOpen: boolean[];
  t: (key: string) => string;
};

export type StoryboardDetailsProps = {
  details: QuestDetails;
  t: (key: string) => string;
};

export type StoryboardSwitchProps = {
  questInfo: QuestInfoState;
  storyboardStage: StoryboardStage;
  t: (key: string) => string;
  milestoneStoryboardStage: number;
};

export enum StoryboardStage {
  Details = "Details",
  Milestones = "Milestones",
}

export type StoryboardMilestonesProps = {
  milestone: Milestone;
  t: (key: string) => string;
};

export type PostLiveProps = {
  tokensToApprove: {
    address: string;
    amount: string;
    approved: boolean;
  }[];
  handleApprove: (approveTokenAddress: `0x${string}`) => Promise<void>;
};

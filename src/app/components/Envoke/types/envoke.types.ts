import { SetStateAction } from "react";
import { Collection } from "../../Common/types/common.types";
import { Post } from "@lens-protocol/client";
import { Envoker } from "../../../../../../kinorasdk_refactor/dist";

export enum QuestStage {
  Details = "Set Details",
  Milestones = "Create Milestones",
  Storyboard = "Storyboard",
  Post = "Post Live",
}

export enum StoryboardStage {
  Details = "Details",
  Milestones = "Milestones",
}

export interface QuestDetails {
  title: string;
  description: string;
  cover: string;
  tags: string;
  gated: GatingLogic;
  maxPlayerCount: number;
}

export interface GatingLogic {
  erc721Addresses: `0x${string}`[];
  erc721TokenIds: Collection[];
  erc20Addresses: `0x${string}`[];
  erc20Thresholds: number[];
  oneOf: boolean;
}

export type QuestSwitchProps = {
  storyboardStage: StoryboardStage;
  milestoneStoryboardStage: number;
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
  dict: any;
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

export type MintProps = {
  dict: any;
  item: ItemDetails;
  index: number;
  milestonesOpen: boolean[];
};

export type EligibleProps = {
  dict: any;
  item: VideoEligible;
  index: number;
  milestonesOpen: boolean[];
};

export type StagesProps = {
  dict: any;
  questEnvoker: Envoker;
  setCollectionsSearch: (e: SetStateAction<string>) => void;
  milestonesOpen: boolean[];
  setMilestonesOpen: (e: SetStateAction<boolean[]>) => void;
  milestoneStage: number;
  setMilestoneStage: (e: SetStateAction<number>) => void;
  storyboardStage: StoryboardStage;
  setStoryboardStage: (e: SetStateAction<StoryboardStage>) => void;
  milestoneStoryboardStage: number;
  setMilestoneStoryboardStage: (e: SetStateAction<number>) => void;
};

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

export interface MilestoneEnvoke {
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

export type PostLiveProps = {
  tokensToApprove: {
    address: string;
    amount: string;
    approved: boolean;
  }[];
  dict: any;
  handleApprove: (approveTokenAddress: `0x${string}`) => Promise<void>;
};

export type DetailsProps = {
  dict: any;
  coverLoading: boolean;
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

export type StoryboardSwitchProps = {
  storyboardStage: StoryboardStage;
  dict: any;
  milestoneStoryboardStage: number;
};

export type GatedLogicProps = {
  milestonesOpen?: boolean[];
  dict: any;
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
  join?: boolean;
};

export type StoryboardMilestonesProps = {
  dict: any;
  milestoneStoryboardStage: number;
};

export type MilestoneSwitchProps = {
  dict: any;
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
  handleBalance: (milestoneIndex: number, rewardIndex: number) => Promise<void>;
  milestoneStage: number;
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

export type RewardProps = {
  milestonesOpen: boolean[];
  handleBalance: (milestoneIndex: number, rewardIndex: number) => Promise<void>;
  dict: any;
  balanceLoading: boolean[];
};

export type CriteriaProps = {
  videoSearchLoading: boolean;
  videoSearch: string;
  dict: any;
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
};

export type MilestoneDetailsProps = {
  milestoneCoversLoading: boolean[];
  milestonesOpen: boolean[];
  dict: any;
  setMilestoneCoversLoading: (e: SetStateAction<boolean[]>) => void;
};

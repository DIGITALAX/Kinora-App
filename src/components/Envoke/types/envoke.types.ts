import { Action, Dispatch } from "redux";
import { QuestInfoState } from "../../../../redux/reducers/questInfoSlice";
import { SetStateAction } from "react";
import { Profile } from "../../../../graphql/generated";

export enum QuestStage {
  Details = "Set Details",
  Milestones = "Create Milestones",
  Encrypt = "Encrypt Key",
  Post = "Post Live",
}

export interface QuestDetails {
  title: string;
  description: string;
  cover: string;
  tags: string;
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
  balance: boolean;
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
  eligibility: MilestoneEligibility;
}

export interface MilestoneEligibility {
  internalPlaybackCriteria?: {
    playbackId: string;
    playbackCriteria: MilestoneEligibilityCriteria;
  }[];
  averageGlobalPlaybackCriteria?: {
    playbackId: string;
    playbackCriteria: MilestoneEligibilityCriteria;
  }[];
  averageInternalVideoStats: MilestoneEligibilityCriteria;
  averageGlobalVideoStats: MilestoneEligibilityCriteria;
}

export interface MilestoneEligibilityCriteria {
  averageAvd?: MetricCriteria;
  averageCtr?: MetricCriteria;
  totalPlayCount?: MetricCriteria;
  totalPauseCount?: MetricCriteria;
  totalClickCount?: MetricCriteria;
  totalSkipCount?: MetricCriteria;
  totalDuration?: MetricCriteria;
  totalImpressionCount?: MetricCriteria;
  totalVolumeChangeCount?: MetricCriteria;
  totalBufferCount?: MetricCriteria;
  averageEngagementRate?: MetricCriteria;
  averagePlayPauseRatio?: MetricCriteria;
  quoteLens?: BoolLensCriteria;
  mirrorLens?: BoolLensCriteria;
  likeLens?: BoolLensCriteria;
  bookmarkLens?: BoolLensCriteria;
  notInterestedLens?: BoolLensCriteria;
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
  dispatch: Dispatch<Action>;
  coverLoading: boolean;
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
  setCoverLoading: (e: SetStateAction<boolean>) => void;
};

export type StagesProps = {
  dispatch: Dispatch<Action>;
  questStage: QuestStage;
  questInfo: QuestInfoState;
  milestonesOpen: boolean[];
  setMilestonesOpen: (e: SetStateAction<boolean[]>) => void;
  milestoneStage: number;
  setMilestoneStage: (e: SetStateAction<number>) => void;
};

export type MilestoneDetailsProps = {
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  milestoneCoversLoading: boolean[];
  milestonesOpen: boolean[];
  setMilestoneCoversLoading: (e: SetStateAction<boolean[]>) => void;
};

export type MilestoneSwitchProps = {
  milestoneStage: number;
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  handleBalance: (milestoneIndex: number, rewardIndex: number) => Promise<void>;
  balanceLoading: boolean[]
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
  milestonesOpen: boolean[];
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
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

export interface Collection {
  collectionId: string;
  dropMetadata: {
    dropCover: string;
    dropTitle: string;
  };
  collectionMetadata: {
    title: string;
    mediaCover: string;
    images: string[];
  };
  profileId: string;
  profile: Profile;
}

export type RewardProps = {
  milestonesOpen: boolean[];
  questInfo: QuestInfoState;
  dispatch: Dispatch<Action>;
  handleBalance: (milestoneIndex: number, rewardIndex: number) => Promise<void>;
  balanceLoading: boolean[]
};

export type MintProps = {
  item: ItemDetails;
  dispatch: Dispatch<Action>;
  questInfo: QuestInfoState;
  milestonesOpen: boolean[];
  index: number;
};

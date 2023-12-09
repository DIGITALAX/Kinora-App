import { Action, Dispatch } from "redux";
import { QuestInfoState } from "../../../../redux/reducers/questInfoSlice";
import { ChangeEvent, SetStateAction } from "react";

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
  erc721TokenIds: number[][];
  erc20Addresses: `0x${string}`[];
  erc20Thresholds: string[];
  oneOf: boolean;
}

export interface Reward {
  type: RewardType;
  erc721URI?: string;
  erc20tokenAddress?: `0x${string}`;
  erc20tokenAmount?: string;
}

export interface Milestone {
  gated: GatingLogic;
  reward: Reward;
  milestone: number;
  details: QuestDetails;
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
  milestoneCoversLoading: boolean[];
  milestonesOpen: boolean[];
  setMilestoneCoversLoading: (e: SetStateAction<boolean[]>) => void;
};

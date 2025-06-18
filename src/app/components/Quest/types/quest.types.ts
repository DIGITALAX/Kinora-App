import { SetStateAction } from "react";
import {
  Milestone,
  Player,
  Quest,
  Reward,
  Video,
} from "../../Common/types/common.types";
import { SocialType } from "../../Video/types/video.types";

export type QuestBoxDetailsProps = {
  questInfo: Quest | undefined;
  dict: any;
  setSocialType: (e: SocialType) => void;
  joinLoading: boolean;
  handlePlayerJoin: () => Promise<void>;
  questInfoLoading: boolean;
};

export type MilestoneInfoProps = {
  completeLoading: boolean;
  handleCompleteMilestone: (questCompleted: boolean) => Promise<void>;
  milestone: Milestone;
  player: Player;
  questInfo: Quest;
  milestoneEligible: boolean;
  dict: any;
};

export type RewardProps = {
  rewards: Reward[];
};


export type QuestBoardSwitchProps = {
  questInfo: Quest | undefined;
  mainViewer: number;
  setSocialType: (e: SocialType) => void;
  joinLoading: boolean;
  handlePlayerJoin: () => Promise<void>;
  questInfoLoading: boolean;
  handleCompleteMilestone: (questCompleted: boolean) => Promise<void>;
  completeLoading: boolean;
  milestoneEligible: boolean;
  dict: any
};

export type ChannelsProps = {
  videos: Video[];
  setVideoPlaying: (e: SetStateAction<Video | undefined>) => void;
  videoPlaying: Video | undefined;
};

export type MilestoneBoardsProps = {
  milestones: Milestone[];
  mainViewer: number;
  quest: string;
  setMainViewer: (e: SetStateAction<number>) => void;
  setVideoPlaying: (e: SetStateAction<Video | undefined>) => void;
};

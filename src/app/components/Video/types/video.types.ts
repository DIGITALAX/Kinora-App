import { SetStateAction } from "react";
import { Quest, Video, VideoActivity } from "../../Common/types/common.types";
import { Account, Post } from "@lens-protocol/client";

export enum SocialType {
  Comments,
  Mirrors,
  Reacts,
  Players,
}

export type VideoInfoProps = {
  videoPlaying: Video | VideoActivity;
  setSocialType: (e: SocialType) => void;
  dict: any;
};

export type MainVideoProps = {
  videoPlaying: Video | VideoActivity;
  setVideoPlaying:
    | ((e: SetStateAction<Video | undefined>) => void)
    | ((e: SetStateAction<VideoActivity | undefined>) => void);
  allVideos?: Video[];
  height: string;
  width: string;
};

export type QuestSocialProps = {
  socialType: SocialType;
  questInfo?: Quest | undefined;
  reactors: Account[];
  quoters: Post[];
  hasMore: boolean;
  hasMoreQuote: boolean;
  showMore: () => void;
  videoPlaying: Video | VideoActivity | undefined;
  dict: any;
  mirrorQuote: boolean;
  setMirrorQuote: (e: SetStateAction<boolean>) => void;
};

export type MetricsProps = {
  milestoneMetrics?: Video;
  playerMetricsOnChain: VideoActivity;
  playerMetricsLive: VideoActivity | undefined;
  currentMetricsLoading: boolean;
  dict: any;
};

export type PlayerValuesProps = {
  metrics: VideoActivity;
  text: string;
};

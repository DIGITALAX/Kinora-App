import { NextRouter } from "next/router";
import { Comment, Post, Profile, Quote } from "../../../../graphql/generated";
import { SetStateAction } from "react";
import { Action, Dispatch } from "redux";
import { Collection } from "@/components/Envoke/types/envoke.types";
import { PostCollectGifState } from "../../../../redux/reducers/postCollectGifSlice";

export interface MakePostComment {
  content: string;
  images: { media: string; type: string }[];
  videos: string[];
  gifs: string[];
}

export interface Quest {
  publication: Post;
  gate: Gate;
  questMetadata: {
    title: string;
    description: string;
    cover: string;
  };
  pubId: string;
  profileId: string;
  milestones: Milestone[];
  questId: string;
  transactionHash: string;
  uri: string;
  milestoneCount: string;
  players: Player[];
  maxPlayerCount: string;
}

export interface VideoActivity {
  pubId: string;
  profileId: string;
  playCount: string;
  mostViewedSegment: string;
  mostReplayedArea: string;
  interactionRate: string;
  impressionCount: string;
  hasReacted: boolean;
  hasQuoted: boolean;
  hasMirrored: boolean;
  hasCommented: boolean;
  hasBookmarked: boolean;
  engagementRate: string;
  duration: string;
  ctr: string;
  avd: string;
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
  };
  eligibile: {
    milestone: string;
    questId: string;
    status: boolean;
  };
  profileId: string;
  questsCompleted: string[];
  questsJoined: string[];
  videos: VideoActivity[];
  profile: Profile;
}

export interface Video {
  videoBytes: string;
  publication?: Post;
  react: boolean;
  quote: boolean;
  pubId: string;
  profileId: string;
  playerId: string;
  minPlayCount: string;
  mirror: boolean;
  minImpressionCount: string;
  minEngagementRate: string;
  minDuration: string;
  minCTR: string;
  minAVD: string;
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

export interface Reward {
  amount: string;
  tokenAddress: string;
  uri: {
    cover: string;
    title: string;
    description: string;
  };
  type: string;
}

export type QuestBoxDetailsProps = {
  questInfo: Quest | undefined;
  router: NextRouter;
  lensConnected: Profile | undefined;
  setSocialType: (e: SocialType) => void;
  followProfile: (
    id: string,
    index?: number | undefined,
    main?: boolean | undefined
  ) => Promise<void>;
  unfollowProfile: (
    id: string,
    index?: number | undefined,
    main?: boolean | undefined
  ) => Promise<void>;
  dispatch: Dispatch<Action>;
  joinLoading: boolean;
  handlePlayerJoin: () => Promise<void>;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  questInfoLoading: boolean;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  mirror: (id: string, main?: boolean) => Promise<void>;
  bookmark: (
    on: string,
    hasBookmarked: boolean,
    index: number
  ) => Promise<void>;
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: boolean) => void;
};

export type MilestoneBoardsProps = {
  milestones: Milestone[];
  mainViewer: number;
  quest: string;
  setMainViewer: (e: SetStateAction<number>) => void;
  setVideoPlaying: (e: SetStateAction<Video | undefined>) => void;
};

export enum SocialType {
  Comments,
  Mirrors,
  Reacts,
  Players,
}

export type QuestSocialProps = {
  socialType: SocialType;
  questInfo: Quest | undefined;
  router: NextRouter;
  videoPlaying: Video | undefined;
  quoteMirrorSwitch: boolean;
  setQuoteMirrorSwitch: (e: boolean) => void;
  reactors: any[];
  quoters: Quote[];
  hasMoreQuote: boolean;
  hasMore: boolean;
  showMore: () => void;
  dispatch: Dispatch<Action>;
  lensConnected: Profile | undefined;
  commentPost: (id: string, main?: boolean | undefined) => Promise<void>;
  setCaretCoord: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  caretCoord: {
    x: number;
    y: number;
  };
  profilesOpen: boolean[];
  mentionProfiles: Profile[];
  setMentionProfiles: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpen: (e: SetStateAction<boolean[]>) => void;
  setMakeComment: (e: SetStateAction<MakePostComment[]>) => void;
  makeComment: MakePostComment[];
  contentLoading: {
    image: boolean;
    video: boolean;
  }[];
  setContentLoading: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
  postCollectGif: PostCollectGifState;
  mirror: (id: string, main?: boolean | undefined) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
    main?: boolean | undefined
  ) => Promise<void>;
  simpleCollect: (post: Post | Comment) => Promise<void>;
  interactionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirrorChoiceOpen: boolean[];
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  followProfile: (
    id: string,
    index?: number | undefined,
    main?: boolean | undefined
  ) => Promise<void>;
  unfollowProfile: (
    id: string,
    index?: number | undefined,
    main?: boolean | undefined
  ) => Promise<void>;
  setCommentsOpen: (e: SetStateAction<boolean[]>) => void;
  commentsOpen: boolean[];
  setCaretCoordMain: (
    e: SetStateAction<{
      x: number;
      y: number;
    }>
  ) => void;
  caretCoordMain: {
    x: number;
    y: number;
  };
  profilesOpenMain: boolean[];
  mentionProfilesMain: Profile[];
  setMentionProfilesMain: (e: SetStateAction<Profile[]>) => void;
  setProfilesOpenMain: (e: SetStateAction<boolean[]>) => void;
  setMakeCommentMain: (e: SetStateAction<MakePostComment[]>) => void;
  makeCommentMain: MakePostComment[];
  contentLoadingMain: {
    image: boolean;
    video: boolean;
  }[];
  setContentLoadingMain: (
    e: SetStateAction<
      {
        image: boolean;
        video: boolean;
      }[]
    >
  ) => void;
};

export type QuestBoardSwitchProps = {
  questInfo: Quest | undefined;
  mainViewer: number;
  router: NextRouter;
  lensConnected: Profile | undefined;
  setSocialType: (e: SocialType) => void;
  followProfile: (
    id: string,
    index?: number | undefined,
    main?: boolean | undefined
  ) => Promise<void>;
  unfollowProfile: (
    id: string,
    index?: number | undefined,
    main?: boolean | undefined
  ) => Promise<void>;
  dispatch: Dispatch<Action>;
  joinLoading: boolean;
  handlePlayerJoin: () => Promise<void>;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  questInfoLoading: boolean;
  like: (id: string, hasReacted: boolean, main?: boolean) => Promise<void>;
  mirror: (id: string, main?: boolean) => Promise<void>;
  bookmark: (
    on: string,
    hasBookmarked: boolean,
    index: number,
    main?: boolean
  ) => Promise<void>;
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: boolean) => void;
  handleCompleteMilestone: () => Promise<void>;
  completeLoading: boolean;
};

export type MilestoneInfoProps = {
  completeLoading: boolean;
  handleCompleteMilestone: () => Promise<void>;
  milestone: Milestone;
  player: Player;
  videoMetrics: boolean;
};

export type ChannelsProps = {
  videos: Video[];
  setVideoPlaying: (e: SetStateAction<Video | undefined>) => void;
  videoPlaying: Video | undefined;
};

export type MainVideoProps = {
  videoPlaying: Video;
  playing: boolean;
  setPlaying: (e: boolean) => void;
  setVolume: (e: number) => void;
  volume: number;
  seek: number;
  volumeOpen: boolean;
  setVolumeOpen: (e: boolean) => void;
  duration: number;
  setDuration: (e: number) => void;
  setSeek: (e: number) => void;
  setVideoPlaying: (e: SetStateAction<Video | undefined>) => void;
  allVideos: Video[];
};

export type MetricsProps = {
  milestoneMetrics: Video;
  playerMetricsOnChain: VideoActivity;
  playerMetricsLive: VideoActivity | undefined;
};

export type VideoInfoProps = {
  videoPlaying: Video;
  mirror: (id: string, main?: boolean | undefined) => Promise<void>;
  like: (
    id: string,
    hasReacted: boolean,
    main?: boolean | undefined
  ) => Promise<void>;
  bookmark: (
    on: string,
    hasBookmarked: boolean,
    index: number
  ) => Promise<void>;
  simpleCollect: (
    post: Post | Comment,
    main?: boolean | undefined
  ) => Promise<void>;
  lensConnected: Profile | undefined;
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
  setSocialType: (e: SocialType) => void;
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: boolean) => void;
  dispatch: Dispatch<Action>;
  router: NextRouter;
};

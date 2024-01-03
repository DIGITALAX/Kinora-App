import { NextRouter } from "next/router";
import { Post, Profile, Quote } from "../../../../graphql/generated";
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
    status: string;
  };
  profileId: string;
  questsCompleted: string[];
  questsJoined: string[];
  videos: VideoActivity[];
  profile: Profile;
}

export interface Video {
  videoBytes: string;
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
  uri: string;
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
    index: number,
    main?: boolean
  ) => Promise<void>;
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: boolean) => void;
};

export type MilestoneBoardsProps = {
  milestones: Milestone[];
  mainViewer: number;
  quest: string;
  setMainViewer: (e: SetStateAction<number>) => void;
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
  commentLoading: boolean;
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
};

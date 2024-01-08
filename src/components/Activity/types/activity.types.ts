import { Dispatch } from "redux";
import { Comment, Profile } from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import { Quest } from "@/components/Quest/types/quest.types";
import { SetStateAction } from "react";
import { Post } from "kinora-sdk/dist/@types/generated";

export type ActivityProps = {
  activityFeed: (Quest & {
    type: string;
    profile: Profile | undefined;
  })[];
  router: NextRouter;
  activityInfo: {
    hasMore: boolean;
    questDataCursor: number;
    newPlayerDataCursor: number;
    milestoneDataCursor: number;
    completionDataCursor: number;
    metricsDataCursor: number;
  };
  getMoreActivityFeed: () => Promise<void>;
  lensConnected: Profile | undefined;
  dispatch: Dispatch;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  mirrorChoiceOpen: boolean[];
  bookmark: (id: string) => Promise<void>;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
    simpleCollect: boolean;
  }[];
  setMirrorChoiceOpen: (id: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  setProfileHovers: (id: SetStateAction<boolean[]>) => void;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  followProfile: (id: string, index: number) => Promise<void>;
  simpleCollect: (
    post: Post | Comment,
    main?: boolean | undefined
  ) => Promise<void>;
};

export type MetricsAddedProps = {
  width: string;
  height: string;
  router: NextRouter;
  quest: Quest & {
    type: string;
    profile: Profile | undefined;
  };
  dispatch: Dispatch;
  mirrorChoiceOpen: boolean[];
  setMirrorChoiceOpen: (e: SetStateAction<boolean[]>) => void;
  mirror: (id: string) => Promise<void>;
  like: (id: string, hasReacted: boolean) => Promise<void>;
  profileHovers: boolean[];
  setProfileHovers: (e: SetStateAction<boolean[]>) => void;
  simpleCollect: (
    post: Post | Comment,
    main?: boolean | undefined
  ) => Promise<void>;
  index: number;
  interactionsLoading: {
    mirror: boolean;
    like: boolean;
    follow: boolean;
    unfollow: boolean;
    simpleCollect: boolean;
  }[];
  followProfile: (id: string, index: number, main?: boolean) => Promise<void>;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  lensConnected: Profile | undefined;
};

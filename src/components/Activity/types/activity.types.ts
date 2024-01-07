import { Dispatch } from "redux";
import { Profile } from "../../../../graphql/generated";
import { NextRouter } from "next/router";
import { Quest } from "@/components/Quest/types/quest.types";
import { SetStateAction } from "react";

export type ActivityProps = {
  activityFeed: (Quest & {
    type: string;
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
  }[];
  setMirrorChoiceOpen: (id: SetStateAction<boolean[]>) => void;
  profileHovers: boolean[];
  setProfileHovers: (id: SetStateAction<boolean[]>) => void;
  unfollowProfile: (id: string, index: number) => Promise<void>;
  followProfile: (id: string, index: number, type: string) => Promise<void>;
};

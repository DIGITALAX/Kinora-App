import { Account } from "@lens-protocol/client";
import { Quest } from "../../Common/types/common.types";

export type ActivityProps = {
  activityInfo: {
    hasMore: boolean;
    questDataCursor: number;
    newPlayerDataCursor: number;
    milestoneDataCursor: number;
    completionDataCursor: number;
    metricsDataCursor: number;
  };
  getMoreActivityFeed: () => Promise<void>;
  disabled?: boolean;
  dict: any;
};

export type MetricsAddedProps = {
  width: string;
  height: string;
  quest: Quest & {
    type: string;
    profile: Account | undefined;
    details?: {
      title: string;
      description: string;
      cover: string;
    };
  };
  dict: any;
  disabled?: boolean;
};

export type QuestCompletedProps = {
  width: string;
  height: string;
  quest: Quest & {
    type: string;
    profile: Account | undefined;
    milestone?: number;
    completedImage?: string;
  };
  dict: any;
  disabled?: boolean;
};

export type PlayerProps = {
  width: string;
  height: string;
  quest: Quest & {
    type: string;
    profile: Account | undefined;
  };
  dict: any;
  disabled?: boolean;
};

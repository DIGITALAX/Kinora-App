import { NextRouter } from "next/router";
import { Profile } from "../../../../graphql/generated";
import { Dispatch } from "redux";
import { SetStateAction } from "react";
import { SocialType } from "@/components/Quest/types/quest.types";

export type VideoDetailsProps = {
  lensConnected: Profile | undefined;
  router: NextRouter;
  dispatch: Dispatch;
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
  mainInteractionsLoading: {
    like: boolean;
    mirror: boolean;
    comment: boolean;
    bookmark: boolean;
    follow: boolean;
    unfollow: boolean;
  }[];
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
  mirrorChoiceOpen: boolean;
  setMirrorChoiceOpen: (e: SetStateAction<boolean>) => void;
  setSocialType: (e: SetStateAction<SocialType>) => void;
};

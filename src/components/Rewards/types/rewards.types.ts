import { Reward } from "@/components/Quest/types/quest.types";
import { NextRouter } from "next/router";
import { Dispatch } from "redux";

export type RewardProps = {
  reward: Reward;
  router: NextRouter;
  dispatch: Dispatch;
};

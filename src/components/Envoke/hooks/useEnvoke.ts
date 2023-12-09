import { useState } from "react";
import { Dispatch } from "redux";
import { QuestInfoState } from "../../../../redux/reducers/questInfoSlice";

const useEnvoke = (dispatch: Dispatch, questInfo: QuestInfoState) => {
  const [coverLoading, setCoverLoading] = useState<boolean>(false);
  const [milestoneCoversLoading, setMilestoneCoversLoading] = useState<
    boolean[]
  >(Array.from({ length: 3 }, () => false));
  const [milestoneStage, setMilestoneStage] = useState<number>(0);
  const [milestonesOpen, setMilestonesOpen] = useState<boolean[]>([
    true,
    false,
    false,
  ]);

  return {
    coverLoading,
    milestonesOpen,
    setMilestonesOpen,
    setCoverLoading,
    milestoneCoversLoading,
    setMilestoneCoversLoading,
    milestoneStage,
    setMilestoneStage,
  };
};

export default useEnvoke;

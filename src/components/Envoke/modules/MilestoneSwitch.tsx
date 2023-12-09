import { FunctionComponent } from "react";
import MilestoneDetails from "./MilestoneDetails";
import { MilestoneSwitchProps } from "../types/envoke.types";

const MilestoneSwitch: FunctionComponent<MilestoneSwitchProps> = ({
  milestoneStage,
  questInfo,
  dispatch,
  milestoneCoversLoading,
  setMilestoneCoversLoading,
  milestonesOpen,
}): JSX.Element => {
  switch (milestoneStage) {
    case 0:
      return (
        <MilestoneDetails
          setMilestoneCoversLoading={setMilestoneCoversLoading}
          milestoneCoversLoading={milestoneCoversLoading}
          questInfo={questInfo}
          dispatch={dispatch}
          milestonesOpen={milestonesOpen}
        />
      );

    case 1:

    case 2:

    case 3:
  }
};

export default MilestoneSwitch;

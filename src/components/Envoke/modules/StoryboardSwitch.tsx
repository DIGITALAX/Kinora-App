import { FunctionComponent } from "react";
import { StoryboardStage, StoryboardSwitchProps } from "../types/envoke.types";
import Details from "./storyboard/Details";

const StoryboardSwitch: FunctionComponent<StoryboardSwitchProps> = ({
  questInfo,
  storyboardStage,
  milestoneStoryboardStage
}): JSX.Element => {
  switch (storyboardStage) {
    case StoryboardStage.Details:
      return <Details details={questInfo?.details} />;

    case StoryboardStage?.Milestones:
      return <></>;
  }
};

export default StoryboardSwitch;

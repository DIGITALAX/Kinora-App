import { FunctionComponent } from "react";
import { StoryboardStage, StoryboardSwitchProps } from "../types/envoke.types";
import Details from "./storyboard/Details";
import Milestones from "./storyboard/Milestones";

const StoryboardSwitch: FunctionComponent<StoryboardSwitchProps> = ({
  questInfo,
  storyboardStage,
  milestoneStoryboardStage,
}): JSX.Element => {
  switch (storyboardStage) {
    case StoryboardStage.Details:
      return <Details details={questInfo?.details} />;

    case StoryboardStage?.Milestones:
      return (
        <Milestones
          milestone={questInfo?.milestones?.[milestoneStoryboardStage]}
        />
      );
  }
};

export default StoryboardSwitch;

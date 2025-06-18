import { FunctionComponent, JSX } from "react";
import { StoryboardStage, StoryboardSwitchProps } from "../types/envoke.types";
import Details from "./storyboard/Details";
import Milestones from "./storyboard/Milestones";

const StoryboardSwitch: FunctionComponent<StoryboardSwitchProps> = ({
  storyboardStage,
  milestoneStoryboardStage,
  dict,
}): JSX.Element => {
  switch (storyboardStage) {
    case StoryboardStage.Details:
      return <Details dict={dict} />;

    case StoryboardStage?.Milestones:
      return (
        <Milestones
          dict={dict}
          milestoneStoryboardStage={milestoneStoryboardStage}
        />
      );
  }
};

export default StoryboardSwitch;

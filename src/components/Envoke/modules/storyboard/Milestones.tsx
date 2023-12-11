import { FunctionComponent } from "react";
import { StoryboardMilestonesProps } from "../../types/envoke.types";

const Milestones: FunctionComponent<StoryboardMilestonesProps> = ({
  milestone,
  index,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-fit h-fit items-start justify-start opacity-70">
        Review your Quest storyboard before going live.
      </div>
    </div>
  );
};

export default Milestones;

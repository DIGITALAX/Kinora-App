import { FunctionComponent } from "react";
import { DashboardProps } from "../types/envoker.types";

const Dashboard: FunctionComponent<DashboardProps> = ({
  envokedQuests,
  terminateQuest,
  approvePlayerMilestone,
  openQuest,
  setOpenQuest
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-center">
      <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
        Dashboard
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start overflow-y-scroll">
        {
          // terminate quest
          // see players
          // approve players for milestone claim
          // see player health/trust score
        }
      </div>
    </div>
  );
};

export default Dashboard;

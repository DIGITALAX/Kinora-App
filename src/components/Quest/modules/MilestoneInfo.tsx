import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import { MilestoneInfoProps } from "../types/quest.types";

const MilestoneInfo: FunctionComponent<MilestoneInfoProps> = ({
  completeLoading,
  lensConnected,
  handleCompleteMilestone,
  milestone,
  player,
  videoMetrics,
}): JSX.Element => {
  return (
    <div className="relative rounded-md border border-gray-700 w-full h-full flex flex-col gap-3 p-2 items-start justify-between">
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xxs">
        <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
          <div className="relative w-fit h-fit flex items-center justify-center">
            Video Count:
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
            {milestone?.videoLength}
          </div>
          <div
            className="relative w-3.5 h-3.5 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => window.open("https://livepeer.studio/")}
          >
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmVa8AWMYyAfcQAEpbqdUoRSxSkntpH1DEMpdyajZWz4AR`}
            />
          </div>
        </div>
      </div>
      <div className="">Rewards</div>
      <div
        className={`relative w-full h-8 px-1.5 py-1 flex flex-row items-center gap-3 justify-center border border-gray-300 rounded-md ${
          completeLoading ||
          Number(player?.milestonesCompleted.milestonesCompleted) + 1 !==
            Number(milestone?.milestoneId) ||
          !player?.eligibile?.status ||
          !videoMetrics
            ? "opacity-70"
            : "cursor-pointer active:scale-95"
        }`}
        onClick={() =>
          !completeLoading &&
          Number(player?.milestonesCompleted.milestonesCompleted) + 1 ===
            Number(milestone?.milestoneId) &&
          player?.eligibile?.status &&
          videoMetrics &&
          handleCompleteMilestone()
        }
      >
        <div
          className={`relative w-4 h-4 flex items-center justify-center ${
            completeLoading && "animate-spin"
          }`}
        >
          {completeLoading ? (
            <AiOutlineLoading color={"FBD201"} size={15} />
          ) : (
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF`}
              draggable={false}
            />
          )}
        </div>
        <div className="relative w-fit h-fit text-sm font-vcr text-gray-300">
          {Number(player?.milestonesCompleted.milestonesCompleted) >=
          Number(milestone?.milestoneId)
            ? "Milestone Completed"
            : player?.eligibile?.status
            ? "Claim Reward"
            : videoMetrics
            ? "Envoker To Verify"
            : "Not Eligible Yet"}
        </div>
      </div>
    </div>
  );
};

export default MilestoneInfo;

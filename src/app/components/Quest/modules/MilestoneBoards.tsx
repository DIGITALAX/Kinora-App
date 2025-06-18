import { FunctionComponent, JSX } from "react";
import Image from "next/legacy/image";
import { Milestone } from "../../Common/types/common.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { MilestoneBoardsProps } from "../types/quest.types";

const MilestoneBoards: FunctionComponent<MilestoneBoardsProps> = ({
  milestones,
  mainViewer,
  setMainViewer,
  quest,
  setVideoPlaying,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-full flex overflow-x-scroll items-start justify-start max-w-[35rem]"
      id="xScroll"
    >
      <div className="relative flex w-fit h-full item-center justify-start flex-row gap-3">
        {[quest, ...(milestones || [])]?.map(
          (item: Milestone | string, index: number) => {
            return (
              <div
                key={index}
                className={`relative w-14 sm:w-40 h-full p-px flex items-center justify-center rounded-md cursor-pointer hover:opacity-70 ${
                  mainViewer == index && "opacity-30"
                }`}
                onClick={() => {
                  setMainViewer(index);
                  setVideoPlaying(undefined);
                }}
                id="northern"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-md">
                  <Image
                    className="rounded-md"
                    src={`${INFURA_GATEWAY}/ipfs/${
                      (index == 0
                        ? quest
                        : (item as Milestone)?.milestoneMetadata?.cover
                      )?.includes("ipfs://")
                        ? (index == 0
                            ? quest
                            : (item as Milestone)?.milestoneMetadata?.cover
                          )?.split("ipfs://")?.[1]
                        : index == 0
                        ? quest
                        : (item as Milestone)?.milestoneMetadata?.cover
                    }`}
                    draggable={false}
                    objectFit="cover"
                    layout="fill"
                  />
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default MilestoneBoards;

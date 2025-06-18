import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "@/app/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent, JSX } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { MilestoneInfoProps } from "../types/quest.types";
import { getLocaleFromPath } from "@/app/lib/helpers/getLocalPath";
import { usePathname } from "next/navigation";
import Rewards from "./Rewards";

const MilestoneInfo: FunctionComponent<MilestoneInfoProps> = ({
  completeLoading,
  handleCompleteMilestone,
  milestone,
  player,
  questInfo,
  milestoneEligible,
  dict,
}): JSX.Element => {
  const path = usePathname();
  return (
    <div className="relative rounded-sm bg-black border border-cost w-full h-full flex flex-col gap-3 p-2 items-start justify-between">
      <div className="relative w-full h-fit flex flex-col gap-5 overflow-y-scroll">
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xs">
          <div className="relative w-fit h-fit flex items-center justify-center text-gray-400 text-sm">
            {dict?.rewsM}
          </div>
          {milestone?.rewards && milestone?.rewards?.length > 0 && (
            <Rewards rewards={milestone?.rewards} />
          )}
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xs">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm text-gray-400">
            {dict?.gateM}
          </div>
          {milestone?.gated?.erc20Logic &&
            milestone?.gated?.erc20Logic?.length > 0 && (
              <div className="relative w-full h-fit flex flex-col items-start justify-center gap-2 break-words">
                <div className="relative w-fit h-fit flex items-center justify-center text-xxs">
                  {dict?.erc20}
                </div>
                <div className="relative w-fit h-fit justify-start items-center gap-4 flex flex-row flex-wrap">
                  {milestone?.gated?.erc20Logic?.map(
                    (
                      erc20: {
                        address: string;
                        amount: string;
                      },
                      index: number
                    ) => {
                      return (
                        <div
                          key={index}
                          className="relative w-fit h-fit flex items-center justify-center gap-1"
                        >
                          <div className="relative w-5 h-6 flex items-center justify-center">
                            <Image
                              draggable={false}
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/${
                                ACCEPTED_TOKENS?.filter(
                                  (token) =>
                                    erc20?.address?.toLowerCase() ==
                                    token[2]?.toLowerCase()
                                )?.[0]?.[0]
                              }`}
                            />
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-acei text-xxs">
                            {`${Number(erc20?.amount) / 10 ** 18} ${
                              ACCEPTED_TOKENS?.filter(
                                (token) =>
                                  erc20?.address?.toLowerCase() ==
                                  token[2]?.toLowerCase()
                              )?.[0]?.[1]
                            }`}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            )}
          {milestone?.gated?.erc721Logic &&
            milestone?.gated?.erc721Logic?.length > 0 && (
              <div className="relative w-full h-fit flex flex-col items-start justify-center gap-2 break-words">
                <div className="relative w-fit h-fit flex items-center justify-center text-xxs">
                  {dict?.erc721}
                </div>
                <div className="relative w-full h-fit justify-start items-center flex overflow-x-scroll">
                  <div className="relative w-fit h-fit justify-start items-center gap-2 flex flex-row">
                    {milestone?.gated?.erc721Logic?.map(
                      (erc721, index: number) => {
                        return (
                          <div
                            key={index}
                            className="relative w-12 h-12 flex items-center p-px justify-center gap-1 cursor-pointer active:scale-95 rounded-sm"
                            onClick={() =>
                              window.open(
                                `https://cypher.digitalax.xyz/item/${
                                  numberToItemTypeMap[Number(erc721?.origin)]
                                }/${erc721?.metadata?.title?.replaceAll(
                                  " ",
                                  "_"
                                )}`
                              )
                            }
                            id="northern"
                          >
                            <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                              <Image
                                draggable={false}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-sm"
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  erc721?.metadata?.mediaCover
                                    ? erc721?.metadata?.mediaCover?.split(
                                        "ipfs://"
                                      )?.[1]
                                    : erc721?.metadata?.images?.[0].split(
                                        "ipfs://"
                                      )?.[1]
                                }`}
                              />
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
      <div
        className={`relative w-full h-8 px-1.5 py-1 flex flex-row items-center gap-3 justify-center border border-gray-300 rounded-md ${
          completeLoading ||
          !player?.eligibile?.[
            player?.milestonesCompleted?.findIndex(
              (value) => Number(value?.questId) == Number(questInfo?.questId)
            ) == -1 ||
            !player?.milestonesCompleted?.findIndex(
              (value) => Number(value?.questId) == Number(questInfo?.questId)
            )
              ? 1
              : player?.milestonesCompleted?.findIndex(
                  (value) =>
                    Number(value?.questId) == Number(questInfo?.questId)
                )
          ]?.status ||
          !questInfo?.status ||
          Number(
            player?.milestonesCompleted?.[
              player?.milestonesCompleted?.findIndex(
                (value) => Number(value?.questId) == Number(questInfo?.questId)
              )
            ]?.milestonesCompleted
          ) >= Number(milestone?.milestoneId)
            ? "opacity-70"
            : "cursor-pointer active:scale-95"
        }`}
        onClick={() =>
          !completeLoading &&
          player?.eligibile?.[
            player?.milestonesCompleted?.findIndex(
              (value) => Number(value?.questId) == Number(questInfo?.questId)
            ) == -1 ||
            !player?.milestonesCompleted?.findIndex(
              (value) => Number(value?.questId) == Number(questInfo?.questId)
            )
              ? 1
              : player?.milestonesCompleted?.findIndex(
                  (value) =>
                    Number(value?.questId) == Number(questInfo?.questId)
                )
          ]?.status &&
          Number(
            player?.milestonesCompleted?.[
              player?.milestonesCompleted?.findIndex(
                (value) => Number(value?.questId) == Number(questInfo?.questId)
              )
            ]?.milestonesCompleted
          ) < Number(milestone?.milestoneId) &&
          questInfo?.status &&
          handleCompleteMilestone(
            Number(
              player?.milestonesCompleted?.[
                player?.milestonesCompleted?.findIndex(
                  (value) =>
                    Number(value?.questId) == Number(questInfo?.questId)
                )
              ]?.milestonesCompleted
            ) -
              1 ==
              Number(questInfo?.milestoneCount)
          )
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
        <div
          className={`relative w-fit h-fit font-vcr text-gray-300 ${
            getLocaleFromPath(path) ? "text-sm" : "text-xxs"
          }`}
        >
          {!questInfo?.status
            ? dict?.cloQ
            : Number(
                player?.milestonesCompleted?.[
                  player?.milestonesCompleted?.findIndex(
                    (value) =>
                      Number(value?.questId) == Number(questInfo?.questId)
                  )
                ]?.milestonesCompleted
              ) >= Number(milestone?.milestoneId)
            ? dict?.milM
            : !milestoneEligible
            ? dict?.edY
            : player?.eligibile?.[
                player?.milestonesCompleted?.findIndex(
                  (value) =>
                    Number(value?.questId) == Number(questInfo?.questId)
                ) == -1 ||
                !player?.milestonesCompleted?.findIndex(
                  (value) =>
                    Number(value?.questId) == Number(questInfo?.questId)
                )
                  ? 1
                  : player?.milestonesCompleted?.findIndex(
                      (value) =>
                        Number(value?.questId) == Number(questInfo?.questId)
                    )
              ]?.status
            ? Number(
                player?.milestonesCompleted?.[
                  player?.milestonesCompleted?.findIndex(
                    (value) =>
                      Number(value?.questId) == Number(questInfo?.questId)
                  )
                ]?.milestonesCompleted
              ) -
                1 ==
                Number(questInfo?.milestoneCount) ||
              (Number(questInfo?.milestoneCount) == 1 &&
                Number.isNaN(
                  Number(
                    player?.milestonesCompleted?.[
                      player?.milestonesCompleted?.findIndex(
                        (value) =>
                          Number(value?.questId) == Number(questInfo?.questId)
                      )
                    ]?.milestonesCompleted
                  )
                ))
              ? dict?.coQ
              : dict?.coR
            : dict?.enR}
        </div>
      </div>
    </div>
  );
};

export default MilestoneInfo;

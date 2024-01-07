import { FunctionComponent } from "react";
import {
  Milestone,
  QuestStage,
  StagesProps,
  StoryboardStage,
} from "../types/envoke.types";
import getStageArray from "../../../../lib/helpers/getStageArray";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import { setQuestStage } from "../../../../redux/reducers/questStageSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { setQuestInfo } from "../../../../redux/reducers/questInfoSlice";
import PostLive from "./PostLive";
import { AiOutlineLoading } from "react-icons/ai";

const Stages: FunctionComponent<StagesProps> = ({
  questStage,
  dispatch,
  questInfo,
  milestonesOpen,
  setMilestonesOpen,
  milestoneStage,
  setMilestoneStage,
  storyboardStage,
  setStoryboardStage,
  milestoneStoryboardStage,
  setMilestoneStoryboardStage,
  postLoading,
  handlePostLive,
  handleApprove,
  tokensToApprove,
}): JSX.Element => {
  return (
    <div
      className={`relative w-full h-fit p-px flex lg:top-20 ${
        questStage !== QuestStage.Post ? "lg:max-w-[20rem]" : "lg:max-w-[30rem]"
      }`}
    >
      <div className="relative w-full flex flex-col gap-6">
        <div className="relative w-full flex flex-col justify-between bg-black border border-cost rounded-sm">
          {questStage !== QuestStage.Post ? (
            <>
              <div className="relative w-full p-2 flex items-center justify-center text-white font-bit bg-black">
                {questStage}
              </div>
              <div
                className={`relative w-full flex flex-col p-4 gap-4 ${
                  questStage == QuestStage.Details
                    ? "justify-between items-center h-fit"
                    : "items-start justify-start h-full overflow-y-scroll"
                }`}
              >
                {getStageArray(
                  questStage,
                  questInfo?.milestones,
                  questInfo
                )?.map((item: any, index: number) => {
                  switch (questStage) {
                    case QuestStage.Details:
                      return (
                        <div
                          key={index}
                          className="relative w-fit h-fit flex items-center justify-center gap-1"
                        >
                          <div
                            className={`relative w-fit h-fit flex items-center justify-center text-white font-bit text-xs sm:text-base ${
                              ((item?.toLowerCase() != "gates" &&
                                (({ ["gated"]: _, ...rest }) => rest)(
                                  questInfo?.details
                                )[
                                  item?.toLowerCase() as keyof {
                                    title: string;
                                    description: string;
                                    cover: string;
                                    tags: string;
                                  }
                                ]?.trim() !== "") ||
                                (item?.toLowerCase() == "gates" &&
                                  (questInfo?.details?.gated?.erc20Addresses
                                    ?.length > 0 ||
                                    questInfo?.details?.gated?.erc20Addresses
                                      ?.length > 0 ||
                                    questInfo?.details?.gated?.erc20Thresholds
                                      ?.length > 0 ||
                                    questInfo?.details?.gated?.erc721TokenIds
                                      ?.length > 0))) &&
                              "line-through"
                            }`}
                          >
                            {item}
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center">
                            {(item?.toLowerCase() != "gates" &&
                              (({ ["gated"]: _, ...rest }) => rest)(
                                questInfo?.details
                              )[
                                item?.toLowerCase() as keyof {
                                  title: string;
                                  description: string;
                                  cover: string;
                                  tags: string;
                                }
                              ]?.trim() !== "") ||
                            (item?.toLowerCase() == "gates" &&
                              (questInfo?.details?.gated?.erc20Addresses
                                ?.length > 0 ||
                                questInfo?.details?.gated?.erc20Thresholds?.filter(
                                  Boolean
                                )?.length > 0 ||
                                questInfo?.details?.gated?.erc721TokenIds
                                  ?.length > 0)) ? (
                              <MdOutlineCheckBox color="white" size={15} />
                            ) : (
                              <MdOutlineCheckBoxOutlineBlank
                                color="white"
                                size={15}
                              />
                            )}
                          </div>
                        </div>
                      );

                    case QuestStage.Milestones:
                      return (
                        <div
                          key={index}
                          className="relative w-full h-fit flex items-start justify-start gap-1 flex-col"
                        >
                          <div
                            key={index}
                            className="relative w-fit h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
                            onClick={() => {
                              setMilestonesOpen((prev) => {
                                const arr = new Array(prev.length).fill(false);
                                arr[index] = !prev[index];
                                return arr;
                              });
                              setMilestoneStage(0);
                            }}
                          >
                            <div className="relative text-white font-bit flex items-center justify-center">
                              Milestone {index + 1}
                            </div>
                            <div
                              className={`relative flex items-center justify-center w-3 h-1.5 ${
                                milestonesOpen?.[index] && "rotate-90"
                              }`}
                            >
                              <Image
                                layout="fill"
                                src={`${INFURA_GATEWAY}/ipfs/QmW8oeGu3doJxd6e9fpoGzuZb6fSjKyu8BfXgtusNEWmjM`}
                                draggable={false}
                              />
                            </div>
                            {index > 2 && (
                              <div
                                className={`relative flex items-center justify-center w-3 h-3 hover:hue-rotate-60`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    setQuestInfo({
                                      actionDetails: questInfo?.details,

                                      actionMilestones:
                                        questInfo?.milestones?.filter(
                                          (_, i) => index !== i
                                        ),
                                    })
                                  );
                                }}
                              >
                                <Image
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/QmQ2tQQSqhLJruTU8MQBUS8GpckycwJiW7QmJPZ8zZzxKg`}
                                  draggable={false}
                                />
                              </div>
                            )}
                          </div>
                          {milestonesOpen?.[index] && (
                            <div className="pl-3 relative w-fit h-fit flex items-start justify-start flex-col gap-1.5">
                              {["Details", "Gates", "Rewards", "Video Ops"].map(
                                (item: string, index: number) => {
                                  return (
                                    <div
                                      key={index}
                                      className={`relative w-fit h-fit flex items-center justify-center gap-1 cursor-pointer hover:opacity-70 ${
                                        milestoneStage == index
                                          ? "text-ligera"
                                          : "text-white"
                                      }`}
                                      onClick={() => setMilestoneStage(index)}
                                    >
                                      <div
                                        className={`relative flex items-center justify-center w-1.5 h-1 rotate-90 flip`}
                                      >
                                        <Image
                                          layout="fill"
                                          src={`${INFURA_GATEWAY}/ipfs/QmW8oeGu3doJxd6e9fpoGzuZb6fSjKyu8BfXgtusNEWmjM`}
                                          draggable={false}
                                        />
                                      </div>
                                      <div
                                        className={`relative w-fit h-fit flex items-center justify-center font-bit text-xxs sm:text-sm`}
                                      >
                                        {item}
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}
                        </div>
                      );

                    case QuestStage.Storyboard:
                      return (
                        <div
                          key={index}
                          className={`relative w-fit h-fit flex flex-row items-center justify-center gap-1 hover:opacity-70 cursor-pointer`}
                          onClick={
                            item?.includes("Milestone")
                              ? () => {
                                  setStoryboardStage(
                                    StoryboardStage.Milestones
                                  );
                                  setMilestoneStoryboardStage(index - 1);
                                }
                              : () => {
                                  setMilestoneStoryboardStage(0);
                                  setStoryboardStage(
                                    Object.values(StoryboardStage)[
                                      (Object.values(StoryboardStage).indexOf(
                                        storyboardStage
                                      ) +
                                        1) %
                                        Object.values(StoryboardStage).length
                                    ]
                                  );
                                }
                          }
                        >
                          <div
                            className={`relative font-bit flex items-center justify-center top-px ${
                              (storyboardStage === StoryboardStage.Details &&
                                item?.includes("Details")) ||
                              (storyboardStage == StoryboardStage.Milestones &&
                                milestoneStoryboardStage == index - 1)
                                ? "text-ligera"
                                : "text-white"
                            }`}
                          >
                            {item}
                          </div>
                          <div
                            className={`relative flex items-center justify-center w-2.5 h-2.5`}
                          >
                            <Image
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/QmYPNwx7ptMnkZPWUBaxuzoWBDKPiZmc9Crbm3GRAHZD1N`}
                              draggable={false}
                            />
                          </div>
                        </div>
                      );
                  }
                })}
                {questStage == QuestStage.Milestones && (
                  <div className="relative w-full h-fit flex items-start justify-start gap-1 flex-col">
                    <div
                      className="relative w-fit h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
                      onClick={() => {
                        setMilestonesOpen((prev) => {
                          const arr = [...prev, false];
                          return arr;
                        });

                        dispatch(
                          setQuestInfo({
                            actionDetails: questInfo?.details,
                            actionMilestones: [
                              ...(questInfo?.milestones?.length < 1
                                ? Array.from({ length: 3 }, () => ({
                                    rewards: {
                                      reward721: [],
                                      reward20: [],
                                    },
                                    gated: {},
                                    details: {},
                                    eligibility: [],
                                  }))
                                : questInfo?.milestones),
                              {
                                rewards: {
                                  reward721: [],
                                  reward20: [],
                                },
                                gated: {},
                                details: {},
                                eligibility: [],
                              },
                            ],
                          })
                        );
                      }}
                    >
                      <div
                        className={`relative flex items-center justify-center w-3 h-2.5`}
                      >
                        <Image
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmYPNwx7ptMnkZPWUBaxuzoWBDKPiZmc9Crbm3GRAHZD1N`}
                          draggable={false}
                        />
                      </div>
                      <div className="relative text-white font-bit flex items-center justify-center top-px">
                        Add Milestone
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <PostLive
              handleApprove={handleApprove}
              tokensToApprove={tokensToApprove}
            />
          )}
        </div>
        <div className="relative w-full p-2 h-fit flex items-center justify-center text-white font-bit mb-0 flex-row gap-5">
          {questStage !== QuestStage.Details && (
            <div
              className={`relative w-32 bg-black text-xs h-8 p-1 rounded-sm border border-suave cursor-pointer hover:opacity-80 flex items-center justify-center gap-4 `}
              onClick={
                questStage === QuestStage.Milestones &&
                (milestonesOpen?.findIndex((item) => item == true) !== 0 ||
                  (milestonesOpen?.findIndex((item) => item == true) == 0 &&
                    milestoneStage !== 0))
                  ? () => {
                      if (milestoneStage - 1 < 0) {
                        setMilestonesOpen((prev) => {
                          const arr = new Array(prev.length).fill(false);
                          arr[
                            milestonesOpen?.findIndex((item) => item == true) -
                              1
                          ] = true;
                          return arr;
                        });
                        setMilestoneStage(3);
                      } else {
                        setMilestoneStage(milestoneStage - 1);
                      }
                    }
                  : questStage === QuestStage.Storyboard &&
                    storyboardStage !== StoryboardStage.Details
                  ? milestoneStoryboardStage > 0
                    ? () =>
                        setMilestoneStoryboardStage(
                          milestoneStoryboardStage - 1
                        )
                    : () =>
                        setStoryboardStage(
                          Object.values(StoryboardStage)[
                            (Object.values(StoryboardStage).indexOf(
                              storyboardStage
                            ) -
                              1) %
                              Object.values(StoryboardStage).length
                          ]
                        )
                  : () =>
                      dispatch(
                        setQuestStage(
                          Object.values(QuestStage)[
                            (Object.values(QuestStage).indexOf(questStage) -
                              1) %
                              Object.values(QuestStage).length
                          ]
                        )
                      )
              }
            >
              <div className="relative w-fit h-fit flex items-center justify-center">
                <div
                  className={`relative flex items-center justify-center  w-3 h-1.5 rotate-90`}
                >
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmevWsPP9a7teJEcq91cRWPBC4m7VZudYLMArBBgHaxkX9`}
                  />
                </div>
              </div>
              <div className={`flex items-center justify-center `}>
                Go Back Now
              </div>
            </div>
          )}
          {questStage === QuestStage.Post && (
            <div
              className={`relative cursor-pointer w-32 bg-black text-xs h-8 p-1 rounded-sm border border-acei hover:opacity-80 flex items-center justify-center gap-4 ${
                tokensToApprove?.filter((item) => !item.approved)?.length > 0
                  ? "opacity-70"
                  : "cursor-pointer active:scale-95"
              }`}
              onClick={() =>
                tokensToApprove?.filter((item) => !item.approved)?.length ==
                  0 &&
                !postLoading &&
                handlePostLive()
              }
            >
              <div
                className={`${
                  postLoading ? "animate-spin" : "top-1.5"
                } flex items-center justify-center `}
              >
                {postLoading ? (
                  <AiOutlineLoading color="white" size={15} />
                ) : (
                  "Post Quest"
                )}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                <div
                  className={`relative flex items-center justify-center  w-3 h-1.5 -rotate-90`}
                >
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmevWsPP9a7teJEcq91cRWPBC4m7VZudYLMArBBgHaxkX9`}
                  />
                </div>
              </div>
            </div>
          )}
          {questStage !== QuestStage.Post && (
            <div
              className={`relative w-32 bg-black text-xs h-8 p-1 rounded-sm border border-acei cursor-pointer hover:opacity-80 flex items-center justify-center gap-4 `}
              onClick={
                questStage === QuestStage.Milestones &&
                (milestonesOpen?.findIndex((item) => item == true) !==
                  milestonesOpen?.length - 1 ||
                  (milestonesOpen?.findIndex((item) => item == true) ==
                    milestonesOpen?.length - 1 &&
                    milestoneStage !== 3))
                  ? () => {
                      if (milestoneStage + 1 > 3) {
                        setMilestonesOpen((prev) => {
                          const arr = new Array(prev.length).fill(false);
                          arr[
                            milestonesOpen?.findIndex((item) => item == true) +
                              1
                          ] = true;
                          return arr;
                        });
                        setMilestoneStage(0);
                      } else {
                        setMilestoneStage(milestoneStage + 1);
                      }
                    }
                  : ((questStage === QuestStage.Storyboard &&
                      milestoneStoryboardStage <
                        questInfo?.milestones?.filter(
                          (item) =>
                            item?.details?.title?.trim() !== "" &&
                            item?.details?.title
                        )?.length - 1) ||
                      (questStage === QuestStage.Storyboard &&
                        storyboardStage !== StoryboardStage.Milestones)) &&
                    questInfo?.milestones?.filter(
                      (item) =>
                        item?.details?.title?.trim() !== "" &&
                        item?.details?.title
                    )?.length > 0
                  ? storyboardStage == StoryboardStage.Details
                    ? () =>
                        setStoryboardStage(
                          Object.values(StoryboardStage)[
                            (Object.values(StoryboardStage).indexOf(
                              storyboardStage
                            ) +
                              1) %
                              Object.values(StoryboardStage).length
                          ]
                        )
                    : () =>
                        setMilestoneStoryboardStage(
                          milestoneStoryboardStage + 1
                        )
                  : () => {
                      if (
                        Object.values(QuestStage)[
                          (Object.values(QuestStage).indexOf(questStage) + 1) %
                            Object.values(QuestStage).length
                        ] == QuestStage.Storyboard
                      ) {
                        dispatch(
                          setQuestInfo({
                            actionDetails: questInfo?.details,
                            actionMilestones: questInfo?.milestones?.filter(
                              (item) =>
                                item?.details?.title?.trim() !== "" &&
                                item?.details?.title
                            )?.map(
                              (value: Milestone) => ({
                                ...value,
                                gated: {
                                  ...(value?.gated || {}),
                                  erc20Thresholds:
                                    value?.gated?.erc20Thresholds?.filter(
                                      (item) => Number(item || 0) > 0
                                    ),
                                },
                                rewards: {
                                  rewards721:
                                    value?.rewards?.rewards721?.filter(
                                      (reward) =>
                                        reward.details.title?.trim() !== "" &&
                                        reward.details.description?.trim() !==
                                          "" &&
                                        ((reward?.details?.images?.length > 0 &&
                                          reward.details.images?.[0]?.trim() !==
                                            "") ||
                                          reward?.details?.audio?.trim() !==
                                            "" ||
                                          reward?.details?.video?.trim() !== "")
                                    ),
                                  rewards20: value?.rewards?.rewards20?.filter(
                                    (reward) => Number(reward?.amount || 0) > 0
                                  ),
                                },
                              })
                            ),
                          })
                        );
                      }

                      if (questStage == QuestStage.Milestones) {
                        dispatch(
                          setQuestInfo({
                            actionDetails: questInfo?.details,
                            actionMilestones: questInfo?.milestones?.filter(
                              (item) =>
                                item?.details?.title?.trim() !== "" &&
                                item?.details?.title
                            ),
                          })
                        );
                      }

                      dispatch(
                        setQuestStage(
                          Object.values(QuestStage)[
                            (Object.values(QuestStage).indexOf(questStage) +
                              1) %
                              Object.values(QuestStage).length
                          ]
                        )
                      );
                    }
              }
            >
              <div className={`flex items-center justify-center `}>
                Continue
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                <div
                  className={`relative flex items-center justify-center  w-3 h-1.5 -rotate-90`}
                >
                  <Image
                    draggable={false}
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmevWsPP9a7teJEcq91cRWPBC4m7VZudYLMArBBgHaxkX9`}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stages;

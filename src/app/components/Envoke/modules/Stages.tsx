import { FunctionComponent, JSX, useContext } from "react";
import {
  QuestStage,
  StagesProps,
  StoryboardStage,
} from "../types/envoke.types";
import {
  MdOutlineCheckBox,
  MdOutlineCheckBoxOutlineBlank,
} from "react-icons/md";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import getStageArray from "@/app/lib/helpers/getStageArray";
import { ModalContext } from "@/app/providers";
import filterValidErc20Pairs from "@/app/lib/helpers/filterValidPairs";
import PostLive from "./PostLive";
import usePostLive from "../hooks/usePostLive";

const Stages: FunctionComponent<StagesProps> = ({
  milestonesOpen,
  setMilestonesOpen,
  milestoneStage,
  setMilestoneStage,
  storyboardStage,
  dict,
  setStoryboardStage,
  milestoneStoryboardStage,
  setMilestoneStoryboardStage,
  setCollectionsSearch,
  questEnvoker
}): JSX.Element => {
  const context = useContext(ModalContext);
  const { handlePostLive, postLoading, tokensToApprove, handleApprove } =
    usePostLive(
      dict,
      setMilestonesOpen,
      setMilestoneStage,
      setCollectionsSearch,
      questEnvoker
    );
  return (
    <div
      className={`relative w-full xl:order-2 order-1 h-fit p-px flex lg:top-20  ${
        context?.questStage !== QuestStage.Post
          ? "xl:max-w-[20rem]"
          : "lg:max-w-[30rem]"
      }`}
    >
      <div className="relative w-full flex flex-col gap-6">
        <div className="relative w-full flex flex-col justify-between bg-black border border-cost rounded-sm">
          {context?.questStage !== QuestStage.Post ? (
            <>
              <div className="relative w-full p-2 flex items-center justify-center text-white font-bit bg-black">
                {context?.questStage}
              </div>
              <div
                className={`relative w-full max-h-[24rem] overflow-y-scroll flex flex-col p-4 gap-4 ${
                  context?.questStage == QuestStage.Details
                    ? "justify-between items-center h-fit"
                    : "items-start justify-start h-full"
                }`}
              >
                {getStageArray(
                  context?.questStage!,
                  context?.questInfo?.milestones || [],
                  context?.questInfo!
                )?.map((item: any, index: number) => {
                  switch (context?.questStage) {
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
                                  context?.questInfo?.details
                                )[
                                  item?.toLowerCase() as keyof {
                                    title: string;
                                    description: string;
                                    cover: string;
                                    tags: string;
                                  }
                                ]?.trim() !== "") ||
                                (item?.toLowerCase() == "gates" &&
                                  (context?.questInfo?.details?.gated
                                    ?.erc20Addresses?.length > 0 ||
                                    context?.questInfo?.details?.gated
                                      ?.erc20Addresses?.length > 0 ||
                                    context?.questInfo?.details?.gated
                                      ?.erc20Thresholds?.length > 0 ||
                                    context?.questInfo?.details?.gated
                                      ?.erc721TokenIds?.length > 0))) &&
                              "line-through"
                            }`}
                          >
                            {item}
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center">
                            {(item?.toLowerCase() != "gates" &&
                              (({ ["gated"]: _, ...rest }) => rest)(
                                context?.questInfo?.details
                              )[
                                item?.toLowerCase() as keyof {
                                  title: string;
                                  description: string;
                                  cover: string;
                                  tags: string;
                                }
                              ]?.trim() !== "") ||
                            (item?.toLowerCase() == "gates" &&
                              (context?.questInfo?.details?.gated
                                ?.erc20Addresses?.length > 0 ||
                                context?.questInfo?.details?.gated?.erc20Thresholds?.filter(
                                  Boolean
                                )?.length > 0 ||
                                context?.questInfo?.details?.gated
                                  ?.erc721TokenIds?.length > 0)) ? (
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
                                  context?.setQuestInfo((prev) => ({
                                    details: prev?.details,

                                    milestones: prev?.milestones?.filter(
                                      (_, i) => index !== i
                                    ),
                                  }));
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
                                        Object.values(StoryboardStage)?.length
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
                {context?.questStage == QuestStage.Milestones && (
                  <div className="relative w-full h-fit flex items-start justify-start gap-1 flex-col">
                    <div
                      className="relative w-fit h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
                      onClick={() => {
                        setMilestonesOpen((prev) => {
                          const arr = [...prev, false];
                          return arr;
                        });

                        context?.setQuestInfo((prev) => ({
                          ...prev,
                          actionMilestones: [
                            ...(prev?.milestones?.length < 1
                              ? Array.from({ length: 3 }, () => ({
                                  rewards: {
                                    reward721: [],
                                    reward20: [],
                                  },
                                  gated: {},
                                  details: {},
                                  eligibility: [],
                                }))
                              : prev?.milestones),
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
                        }));
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
              dict={dict}
              tokensToApprove={tokensToApprove}
              handleApprove={handleApprove}
            />
          )}
        </div>
        <div className="relative w-full p-2 h-fit flex items-center justify-center text-white font-bit mb-0 flex-col sm:flex-row gap-5">
          {context?.questStage !== QuestStage.Details && (
            <div
              className={`relative w-32 bg-black text-xs h-8 p-1 rounded-sm border border-suave cursor-pointer hover:opacity-80 flex items-center justify-center gap-4 `}
              onClick={
                context?.questStage === QuestStage.Milestones &&
                (milestonesOpen?.findIndex((item) => item == true) !== 0 ||
                  (milestonesOpen?.findIndex((item) => item == true) == 0 &&
                    milestoneStage !== 0))
                  ? () => {
                      if (milestoneStage - 1 < 0) {
                        setMilestonesOpen((prev) => {
                          const arr = new Array(prev?.length).fill(false);
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
                  : context?.questStage === QuestStage.Storyboard &&
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
                              Object.values(StoryboardStage)?.length
                          ]
                        )
                  : () =>
                      context?.setQuestStage(
                        Object.values(QuestStage)[
                          (Object.values(QuestStage).indexOf(
                            context?.questStage
                          ) -
                            1) %
                            Object.values(QuestStage)?.length
                        ]
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
                {dict?.back}
              </div>
            </div>
          )}
          {context?.questStage === QuestStage.Post && (
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
                  dict?.postQ
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
          {context?.questStage !== QuestStage.Post && (
            <div
              className={`relative w-32 bg-black text-xs h-8 p-1 rounded-sm border border-acei cursor-pointer hover:opacity-80 flex items-center justify-center gap-4 `}
              onClick={
                context?.questStage === QuestStage.Milestones &&
                (milestonesOpen?.findIndex((item) => item == true) !==
                  milestonesOpen?.length - 1 ||
                  (milestonesOpen?.findIndex((item) => item == true) ==
                    milestonesOpen?.length - 1 &&
                    milestoneStage !== 3))
                  ? () => {
                      if (milestoneStage + 1 > 3) {
                        setMilestonesOpen((prev) => {
                          const arr = new Array(prev?.length).fill(false);
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
                  : ((context?.questStage === QuestStage.Storyboard &&
                      milestoneStoryboardStage <
                        context?.questInfo?.milestones?.filter(
                          (item) =>
                            item?.details?.title?.trim() !== "" &&
                            item?.details?.title
                        )?.length -
                          1) ||
                      (context?.questStage === QuestStage.Storyboard &&
                        storyboardStage !== StoryboardStage.Milestones)) &&
                    context?.questInfo?.milestones?.filter(
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
                              Object.values(StoryboardStage)?.length
                          ]
                        )
                    : () =>
                        setMilestoneStoryboardStage(
                          milestoneStoryboardStage + 1
                        )
                  : () => {
                      if (
                        Object.values(QuestStage)[
                          (Object.values(QuestStage).indexOf(
                            context?.questStage!
                          ) +
                            1) %
                            Object.values(QuestStage)?.length
                        ] == QuestStage.Storyboard
                      ) {
                        context?.setQuestInfo((prev) => ({
                          details: {
                            ...prev?.details,
                            gated: {
                              ...(prev?.details?.gated || {}),
                              erc20Thresholds: filterValidErc20Pairs(
                                prev?.details?.gated?.erc20Addresses || [],
                                prev?.details?.gated?.erc20Thresholds || []
                              )?.finalThresholds,
                              erc20Addresses: filterValidErc20Pairs(
                                prev?.details?.gated?.erc20Addresses || [],
                                prev?.details?.gated?.erc20Thresholds || []
                              )?.finalAddresses as `0x${string}`[],
                            },
                          },
                          milestones: prev?.milestones
                            ?.filter(
                              (item) =>
                                item?.details?.title?.trim() !== "" &&
                                item?.details?.title
                            )
                            ?.map((value) => {
                              return {
                                ...value,
                                gated: {
                                  ...(value?.gated || {}),
                                  erc20Thresholds: filterValidErc20Pairs(
                                    value?.gated?.erc20Addresses || [],
                                    value?.gated?.erc20Thresholds || []
                                  )?.finalThresholds,
                                  erc20Addresses: filterValidErc20Pairs(
                                    value?.gated?.erc20Addresses || [],
                                    value?.gated?.erc20Thresholds || []
                                  )?.finalAddresses as `0x${string}`[],
                                },
                                rewards: {
                                  rewards721: value?.rewards?.rewards721
                                    ?.filter(Boolean)
                                    ?.filter(
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
                                  rewards20: (
                                    value?.rewards?.rewards20 || []
                                  )?.filter(
                                    (reward) =>
                                      Number(reward?.amount || 0) > 0 &&
                                      reward?.address &&
                                      reward?.address?.trim() !== "" &&
                                      reward.address !== "0x" &&
                                      reward.address !== "0x00"
                                  ),
                                },
                              };
                            }),
                        }));
                      }

                      context?.setQuestStage(
                        Object.values(QuestStage)[
                          (Object.values(QuestStage).indexOf(
                            context?.questStage
                          ) +
                            1) %
                            Object.values(QuestStage)?.length
                        ]
                      );
                    }
              }
            >
              <div className={`flex items-center justify-center `}>
                {dict?.cont}
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

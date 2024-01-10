import { FunctionComponent } from "react";
import { DashboardProps } from "../types/envoker.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Player, Quest, Reward } from "@/components/Quest/types/quest.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import numeral from "numeral";
import PlayerMilestone from "./PlayerMilestone";
import { AiOutlineLoading } from "react-icons/ai";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";
import Rewards from "./Rewards";

const Dashboard: FunctionComponent<DashboardProps> = ({
  allQuests,
  terminateQuest,
  approvePlayerMilestone,
  approvalLoading,
  openQuest,
  setOpenQuest,
  playerClaimMilestoneReward,
  claimRewardLoading,
  terminateLoading,
  getMore,
  info,
  openPlayerDetails,
  setOpenPlayerDetails,
  router,
  playerEligible,
  lensConnected,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-center gap-10">
      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
        <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
          Dashboard
        </div>
        <div className="relative w-full h-px bg-gray-700"></div>
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-14 overflow-y-scroll pb-10">
        {allQuests?.filter((item) => item?.type == "envoked")?.length > 0 && (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative text-sm font-bit text-white flex items-start justify-start">
              Envoked Quests
            </div>
            <InfiniteScroll
              dataLength={
                allQuests?.filter((item) => item?.type == "envoked")?.length
              }
              hasMore={info?.hasMoreEnvoked}
              next={getMore}
              loader={<></>}
              className="relative w-full h-full flex flex-col"
            >
              <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
                {allQuests
                  ?.filter((item) => item?.type == "envoked")
                  ?.sort(
                    (a, b) =>
                      Number(b.blockTimestamp) - Number(a.blockTimestamp)
                  )
                  ?.map((item: Quest, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-full p-px rounded-sm flex`}
                        id="northern"
                      >
                        <div className="relative w-full h-fit flex flex-col items-start justify-start rounded-sm bg-nave gap-7">
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${
                                item?.questMetadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                            />
                          </div>
                          <div
                            className="absolute top-0 left-0 w-full h-full items-center justify-center flex"
                            id="fadeOut"
                          ></div>
                          <div
                            className={`relative w-full flex items-center justify-start px-2 py-1 flex-row justify-between rounded-sm cursor-pointer h-16`}
                            onClick={() =>
                              setOpenQuest(
                                openQuest?.questId == item?.questId
                                  ? undefined
                                  : item
                              )
                            }
                          >
                            <div className="relative ml-0 flex items-center justify-center gap-3">
                              <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-sm">
                                {item?.questMetadata?.title?.length > 15
                                  ? item?.questMetadata?.title?.slice(0, 15)
                                  : item?.questMetadata?.title}
                              </div>
                            </div>
                            <div className="relative w-fit h-fit mr-0 flex flex-col gap-2 items-end justify-between">
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-1.5">
                                {[
                                  {
                                    title: "Players",
                                    value: item?.players?.length,
                                  },
                                  {
                                    title: "Milestones",
                                    value: Number(item?.milestoneCount),
                                  },
                                  {
                                    title: "Videos",
                                    value: item?.milestones?.reduce(
                                      (acumulador, valorActual) =>
                                        acumulador +
                                        Number(valorActual.videoLength),
                                      0
                                    ),
                                  },
                                ]?.map(
                                  (
                                    counter: {
                                      title: string;
                                      value: number;
                                    },
                                    index
                                  ) => {
                                    return (
                                      <div
                                        className="relative w-fit h-fit flex flex-row items-center justify-center text-right gap-1 font-bit"
                                        key={index}
                                      >
                                        <div className="relative w-full h-fit flex items-end justify-end text-gray-500 text-xs">
                                          {counter?.title}
                                        </div>
                                        <div className="relative text-white text-xxs flex items-end justify-end w-full h-fit">
                                          {counter?.value}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2.5">
                                {[
                                  {
                                    title: "Likes",
                                    value: item?.publication?.stats?.reactions,
                                    image:
                                      "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                                  },
                                  {
                                    title: "Mirrors",
                                    value: item?.publication?.stats?.mirrors,
                                    image:
                                      "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                                  },
                                  {
                                    title: "Quotes",
                                    value: item?.publication?.stats?.quotes,
                                    image:
                                      "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                                  },
                                  {
                                    title: "Bookmarks",
                                    value: item?.publication?.stats?.bookmarks,
                                    image:
                                      "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
                                  },
                                  {
                                    title: "Comments",
                                    value: item?.publication?.stats?.comments,
                                    image:
                                      "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                                  },
                                ]?.map(
                                  (
                                    counter: {
                                      title: string;
                                      value: number;
                                      image: string;
                                    },
                                    index
                                  ) => {
                                    return (
                                      <div
                                        className="relative w-fit h-fit flex flex-row items-center justify-center text-right gap-1 font-bit cursor-default"
                                        key={index}
                                        title={counter.title}
                                      >
                                        <div className="relative w-fit h-fit flex">
                                          <div className="relative w-4 h-4 flex items-end justify-end">
                                            <Image
                                              draggable={false}
                                              layout="fill"
                                              src={`${INFURA_GATEWAY}/ipfs/${counter.image}`}
                                            />
                                          </div>
                                        </div>
                                        <div className="relative text-white text-xxs flex items-end justify-end w-full h-fit">
                                          {numeral(counter?.value).format("0a")}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                                <div
                                  className="relative w-fit h-fit flex items-center justify-center cursor-pointer"
                                  onClick={() =>
                                    router.push(
                                      `/quest/${item?.publication?.id}`
                                    )
                                  }
                                >
                                  <div className="relative w-4 h-4 flex items-end justify-end">
                                    <Image
                                      src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                                      draggable={false}
                                      layout="fill"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {openQuest == item && (
                            <div className="relative w-full h-fit flex flex-col items-start justify-start px-2 py-1 gap-10">
                              <div className="relative w-full h-fit flex flex-col items-end ml-0 gap-2">
                                <div className="flex items-end justify-end text-right break-words font-bit text-white text-xxs max-w-[14rem]">
                                  Close Quest & Withdraw escrowed rewards?
                                </div>
                                <div
                                  className={`relative w-20 h-7 flex items-center justify-center font-bit text-white text-xxs border border-white rounded-sm px-1.5 py-1 ${
                                    !item?.status || terminateLoading[index]
                                      ? "opacity-70"
                                      : "cursor-pointer active:scale-95 hover:opacity-70"
                                  }`}
                                  onClick={() =>
                                    item?.status &&
                                    !terminateLoading[index] &&
                                    terminateQuest(Number(item?.questId), index)
                                  }
                                >
                                  <div
                                    className={`relative w-fit h-fit flex items-center justify-center ${
                                      terminateLoading[index]
                                        ? "animate-spin"
                                        : "top-px"
                                    }`}
                                  >
                                    {terminateLoading[index] ? (
                                      <AiOutlineLoading
                                        size={13}
                                        color="white"
                                      />
                                    ) : (
                                      "Close Quest"
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="relative w-full h-fit flex flex-col gap-2">
                                <div className="relative w-fit h-fit flex font-bit text-white text-xs">
                                  Verify Player Milestone Claim
                                </div>
                                <PlayerMilestone
                                  quest={item}
                                  router={router}
                                  approvePlayerMilestone={
                                    approvePlayerMilestone
                                  }
                                  playerEligible={playerEligible}
                                  approvalLoading={approvalLoading}
                                  index={index}
                                  openPlayerDetails={openPlayerDetails}
                                  setOpenPlayerDetails={setOpenPlayerDetails}
                                />
                              </div>
                              <div className="relative w-full h-fit flex flex-col gap-2">
                                <div className="relative w-fit h-fit flex font-bit text-white text-xs">
                                  Players Completed Quest
                                </div>
                                <div className="relative w-full h-fit flex overflow-x-scroll">
                                  <div className="relative w-fit h-fit flex flex-row gap-2">
                                    {item?.players?.filter((player) =>
                                      player?.questsCompleted?.includes(
                                        item?.questId
                                      )
                                    )?.length > 0 ? (
                                      item?.players
                                        ?.filter((player) =>
                                          player?.questsCompleted?.includes(
                                            item?.questId
                                          )
                                        )
                                        ?.map(
                                          (
                                            player: Player,
                                            playerIndex: number
                                          ) => {
                                            const pfp = createProfilePicture(
                                              player?.profile?.metadata?.picture
                                            );
                                            return (
                                              <div
                                                key={playerIndex}
                                                className="relative rounded-full p-px w-8 h-8 cursor-pointer"
                                                id="northern"
                                                onClick={() =>
                                                  router.push(
                                                    `/envoker/${
                                                      player?.profile?.handle?.suggestedFormatted?.localName?.split(
                                                        "@"
                                                      )?.[1]
                                                    }`
                                                  )
                                                }
                                              >
                                                <div className="relative w-full h-full rounded-full flex">
                                                  {pfp && (
                                                    <Image
                                                      src={pfp}
                                                      draggable={false}
                                                      layout="fill"
                                                      className="rounded-full"
                                                    />
                                                  )}
                                                </div>
                                              </div>
                                            );
                                          }
                                        )
                                    ) : (
                                      <div className="relative w-fit h-fit flex items-center justify-center text-left font-bit text-gray-600 text-xxs">
                                        No players have completed the Quest yet.
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </InfiniteScroll>
          </div>
        )}

        {allQuests?.filter((item) => item?.type != "envoked")?.length > 0 && (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative text-sm font-bit text-white flex items-start justify-start">
              Player Activity
            </div>
            <InfiniteScroll
              dataLength={
                allQuests?.filter((item) => item?.type !== "envoked")?.length
              }
              hasMore={info?.hasMorePlayer}
              next={getMore}
              loader={<></>}
              className="relative w-full h-full flex flex-col"
            >
              <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
                {allQuests
                  ?.filter((value) => value?.type !== "envoked")
                  ?.map((item: Quest & { type: string }, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-full p-px rounded-sm flex`}
                        id="northern"
                      >
                        <div className="relative w-full h-fit flex flex-col items-start justify-start rounded-sm bg-nave gap-7">
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${
                                item?.questMetadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                            />
                          </div>
                          <div
                            className="absolute top-0 left-0 w-full h-full items-center justify-center flex"
                            id="fadeOut"
                          ></div>
                          <div
                            className={`relative w-full flex items-center justify-start px-2 py-1 flex-row justify-between rounded-sm cursor-pointer h-16`}
                            onClick={() => {
                              setOpenQuest(
                                openQuest?.questId === item?.questId
                                  ? undefined
                                  : item
                              );

                              setOpenPlayerDetails(
                                openPlayerDetails ==
                                  item?.players?.find(
                                    (player) =>
                                      `${toHexWithLeadingZero(
                                        Number(player?.profileId)
                                      )}` == lensConnected?.id
                                  )
                                  ? undefined
                                  : item?.players?.find(
                                      (player) =>
                                        `${toHexWithLeadingZero(
                                          Number(player?.profileId)
                                        )}` == lensConnected?.id
                                    )
                              );
                            }}
                          >
                            <div className="relative ml-0 flex items-center justify-center gap-3">
                              <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-sm">
                                {item?.questMetadata?.title?.length > 15
                                  ? item?.questMetadata?.title?.slice(0, 15)
                                  : item?.questMetadata?.title}
                              </div>
                            </div>
                            <div className="relative w-fit h-fit mr-0 flex flex-col gap-2 items-end justify-between">
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-1.5">
                                {[
                                  {
                                    title: "Players",
                                    value: item?.players?.length,
                                  },
                                  {
                                    title: "Milestones",
                                    value: Number(item?.milestoneCount),
                                  },
                                  {
                                    title: "Videos",
                                    value: item?.milestones?.reduce(
                                      (acumulador, valorActual) =>
                                        acumulador +
                                        Number(valorActual.videoLength),
                                      0
                                    ),
                                  },
                                ]?.map(
                                  (
                                    counter: {
                                      title: string;
                                      value: number;
                                    },
                                    index
                                  ) => {
                                    return (
                                      <div
                                        className="relative w-fit h-fit flex flex-row items-center justify-center text-right gap-1 font-bit"
                                        key={index}
                                      >
                                        <div className="relative w-full h-fit flex items-end justify-end text-gray-500 text-xs">
                                          {counter?.title}
                                        </div>
                                        <div className="relative text-white text-xxs flex items-end justify-end w-full h-fit">
                                          {counter?.value}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2.5">
                                {[
                                  {
                                    title: "Likes",
                                    value: item?.publication?.stats?.reactions,
                                    image:
                                      "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                                  },
                                  {
                                    title: "Mirrors",
                                    value: item?.publication?.stats?.mirrors,
                                    image:
                                      "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                                  },
                                  {
                                    title: "Quotes",
                                    value: item?.publication?.stats?.quotes,
                                    image:
                                      "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                                  },
                                  {
                                    title: "Bookmarks",
                                    value: item?.publication?.stats?.bookmarks,
                                    image:
                                      "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
                                  },
                                  {
                                    title: "Comments",
                                    value: item?.publication?.stats?.comments,
                                    image:
                                      "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                                  },
                                ]?.map(
                                  (
                                    counter: {
                                      title: string;
                                      value: number;
                                      image: string;
                                    },
                                    index
                                  ) => {
                                    return (
                                      <div
                                        className="relative w-fit h-fit flex flex-row items-center justify-center text-right gap-1 font-bit cursor-default"
                                        key={index}
                                        title={counter.title}
                                      >
                                        <div className="relative w-fit h-fit flex">
                                          <div className="relative w-4 h-4 flex items-end justify-end">
                                            <Image
                                              draggable={false}
                                              layout="fill"
                                              src={`${INFURA_GATEWAY}/ipfs/${counter.image}`}
                                            />
                                          </div>
                                        </div>
                                        <div className="relative text-white text-xxs flex items-end justify-end w-full h-fit">
                                          {numeral(counter?.value).format("0a")}
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                                <div
                                  className="relative w-fit h-fit flex items-center justify-center cursor-pointer"
                                  onClick={() =>
                                    router.push(
                                      `/quest/${item?.publication?.id}`
                                    )
                                  }
                                >
                                  <div className="relative w-4 h-4 flex items-end justify-end">
                                    <Image
                                      src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                                      draggable={false}
                                      layout="fill"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {openQuest == item && (
                            <div className="relative w-full h-fit flex flex-col items-start justify-start px-2 pt-1 pb-3 gap-10">
                              <div className="relative w-full h-fit flex flex-col items-end ml-0 gap-2">
                                <div className="flex items-end justify-end text-right break-words font-bit text-white text-xxs">
                                  Quest Status
                                </div>
                                <div
                                  title="Verify Player for Rewards Claim"
                                  className={`relative w-28 h-7 flex items-center justify-center font-bit text-white text-xxs border border-suave rounded-sm px-1.5 py-1 ${
                                    !openPlayerDetails!?.eligibile?.[
                                      openPlayerDetails?.milestonesCompleted?.findIndex(
                                        (value) =>
                                          value?.questId == item?.questId
                                      ) == -1 ||
                                      openPlayerDetails?.milestonesCompleted?.findIndex(
                                        (value) =>
                                          value?.questId == item?.questId
                                      )
                                        ? 1
                                        : openPlayerDetails!?.milestonesCompleted?.findIndex(
                                            (value) =>
                                              value?.questId == item?.questId
                                          )
                                    ]?.status ||
                                    claimRewardLoading[
                                      index +
                                        allQuests?.filter(
                                          (item) => item?.type == "envoked"
                                        )?.length
                                    ] ||
                                    !item?.status ||
                                    item?.type !== "completed" ||
                                    !playerEligible?.eligible
                                      ? "opacity-70"
                                      : "cursor-pointer active:scale-95 hover:opacity-70"
                                  }`}
                                  onClick={() =>
                                    openPlayerDetails!?.eligibile?.[
                                      openPlayerDetails?.milestonesCompleted?.findIndex(
                                        (value) =>
                                          value?.questId == item?.questId
                                      ) == -1 ||
                                      openPlayerDetails?.milestonesCompleted?.findIndex(
                                        (value) =>
                                          value?.questId == item?.questId
                                      )
                                        ? 1
                                        : openPlayerDetails!?.milestonesCompleted?.findIndex(
                                            (value) =>
                                              value?.questId == item?.questId
                                          )
                                    ]?.status &&
                                    !claimRewardLoading &&
                                    item?.type !== "completed" &&
                                    playerEligible?.eligible &&
                                    item?.status &&
                                    playerClaimMilestoneReward(
                                      item?.publication?.id,
                                      index +
                                        allQuests?.filter(
                                          (item) => item?.type == "envoked"
                                        )?.length,
                                      Number(
                                        openPlayerDetails
                                          ?.milestonesCompleted?.[
                                          openPlayerDetails?.milestonesCompleted?.findIndex(
                                            (value) =>
                                              Number(value?.questId) ==
                                              Number(item?.questId)
                                          )
                                        ]?.milestonesCompleted
                                      ) -
                                        1 ==
                                        Number(item?.milestoneCount)
                                    )
                                  }
                                >
                                  <div
                                    className={`relative w-fit h-fit flex items-center justify-center ${
                                      claimRewardLoading[
                                        index +
                                          allQuests?.filter(
                                            (item) => item?.type == "envoked"
                                          )?.length
                                      ]
                                        ? "animate-spin"
                                        : "top-px"
                                    }`}
                                  >
                                    {item?.type == "completed" ? (
                                      "Quest Completed"
                                    ) : !item?.status ? (
                                      "Quest Closed"
                                    ) : !playerEligible?.eligible ? (
                                      "Not Eligible"
                                    ) : !openPlayerDetails!?.eligibile?.[
                                        openPlayerDetails?.milestonesCompleted?.findIndex(
                                          (value) =>
                                            value?.questId == item?.questId
                                        ) == -1 ||
                                        openPlayerDetails?.milestonesCompleted?.findIndex(
                                          (value) =>
                                            value?.questId == item?.questId
                                        )
                                          ? 1
                                          : openPlayerDetails!?.milestonesCompleted?.findIndex(
                                              (value) =>
                                                value?.questId == item?.questId
                                            )
                                      ]?.status ? (
                                      "Envoker to Verify"
                                    ) : claimRewardLoading[
                                        index +
                                          allQuests?.filter(
                                            (item) => item?.type == "envoked"
                                          )?.length
                                      ] ? (
                                      <AiOutlineLoading
                                        color="white"
                                        size={12}
                                      />
                                    ) : Number(
                                        openPlayerDetails
                                          ?.milestonesCompleted?.[
                                          openPlayerDetails?.milestonesCompleted?.findIndex(
                                            (value) =>
                                              Number(value?.questId) ==
                                              Number(item?.questId)
                                          )
                                        ]?.milestonesCompleted
                                      ) -
                                        1 ==
                                      Number(item?.milestoneCount) ? (
                                      "Complete Quest"
                                    ) : (
                                      "Verify Milestone"
                                    )}
                                  </div>
                                </div>

                                <div className="relative w-fit h-fit flex items-center justify-center gap-2 flex-row">
                                  <div className="flex items-end justify-end text-right break-words font-bit text-suave text-xxs">
                                    {item?.type}
                                  </div>
                                  <div className="relative w-5 h-5 flex items-center justify-center mr-0">
                                    <Image
                                      draggable={false}
                                      layout="fill"
                                      src={`${INFURA_GATEWAY}/ipfs/${
                                        item?.type == "live"
                                          ? "QmXbN1QTu4t6pt6LZCLsHuPsnh9FD2DK2tDoERSEfFPz66"
                                          : "QmdF7g97oEJXZrSeXtRwwuwYRoCgiDbt514C2Buj1zCgCB"
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                              {openPlayerDetails?.milestonesCompleted?.find(
                                (mile) =>
                                  Number(mile?.questId) == Number(item?.questId)
                              ) && (
                                <div className="relative w-full h-fit flex flex-col items-start gap-2">
                                  <div className="flex items-end justify-end text-right break-words font-bit text-white text-xs">
                                    Rewards Claimed
                                  </div>
                                  {openPlayerDetails?.milestonesCompleted &&
                                    openPlayerDetails?.milestonesCompleted
                                      ?.length > 0 && (
                                      <Rewards
                                        rewards={
                                          item?.milestones
                                            ?.map((milestone) => {
                                              if (
                                                openPlayerDetails?.milestonesCompleted?.filter(
                                                  (value) =>
                                                    value?.questId ==
                                                      item?.questId &&
                                                    value?.milestonesCompleted?.includes(
                                                      milestone?.milestoneId
                                                    )
                                                )
                                              ) {
                                                return milestone?.rewards;
                                              }
                                            })
                                            .filter(Boolean) as any[]
                                        }
                                      />
                                    )}
                                </div>
                              )}
                              <div className="relative w-full h-fit flex flex-col gap-2">
                                <div className="relative w-fit h-fit flex font-bit text-white text-xs">
                                  Milestone Activity
                                </div>
                                <PlayerMilestone
                                  player
                                  quest={item}
                                  router={router}
                                  approvePlayerMilestone={
                                    approvePlayerMilestone
                                  }
                                  playerEligible={playerEligible}
                                  approvalLoading={approvalLoading}
                                  index={
                                    index +
                                    allQuests?.filter(
                                      (item) => item?.type == "envoked"
                                    )?.length
                                  }
                                  openPlayerDetails={openPlayerDetails}
                                  setOpenPlayerDetails={setOpenPlayerDetails}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

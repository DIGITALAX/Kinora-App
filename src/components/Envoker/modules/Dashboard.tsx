import { FunctionComponent } from "react";
import { DashboardProps } from "../types/envoker.types";
import InfiniteScroll from "react-infinite-scroll-component";
import { Player, Quest, Video } from "@/components/Quest/types/quest.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import numeral from "numeral";
import PlayerMilestone from "./PlayerMilestone";
import { AiOutlineLoading } from "react-icons/ai";

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
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-center gap-10">
      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
        <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
          Dashboard
        </div>
        <div className="relative w-full h-px bg-gray-700"></div>
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start overflow-y-scroll gap-14">
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
              className="relative w-full h-full flex flex-col overflow-y-scroll"
            >
              <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
                {allQuests
                  ?.filter((item) => item?.type == "envoked")
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
                              setOpenQuest((prev) => {
                                const arr = [...prev];
                                arr[index] = !arr[index];
                                return arr;
                              })
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
                          {openQuest[index] && (
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
                                  approvePlayerMilestone={
                                    approvePlayerMilestone
                                  }
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
                                                className="relative rounded-full p-px w-8 h-8"
                                                id="northern"
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
              className="relative w-full h-full flex flex-col overflow-y-scroll"
            >
              <div className="relative w-full h-fit flex flex-col gap-3 items-start justify-start">
                {allQuests
                  ?.filter((item) => item?.type !== "envoked")
                  ?.map((item: Quest & { type: string }, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-full p-px rounded-sm flex flex-col items-start justify-start h-fit`}
                        id="northern"
                      >
                        <div
                          className={`relative w-full flex items-center justify-start px-2 py-1 flex-row justify-between bg-nave rounded-sm cursor-pointer h-16`}
                          onClick={() =>
                            setOpenQuest((prev) => {
                              const arr = [...prev];
                              arr[
                                index +
                                  allQuests?.filter(
                                    (item) => item?.type == "envoked"
                                  )?.length
                              ] =
                                !arr[
                                  index +
                                    allQuests?.filter(
                                      (item) => item?.type == "envoked"
                                    )?.length
                                ];
                              return arr;
                            })
                          }
                        >
                          <div className="relative w-fit h-fit flex items-center justify-center mr-0"></div>
                        </div>
                        {openQuest[
                          index +
                            allQuests?.filter((item) => item?.type == "envoked")
                              ?.length
                        ] && (
                          <div className="relative w-full h-fit flex flex-col items-start justify-start"></div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </InfiniteScroll>
          </div>
        )}
        {
          // check status
          // claim rewards
          // check completed
          // see all rewards
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

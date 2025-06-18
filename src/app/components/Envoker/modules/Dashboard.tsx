import { FunctionComponent, JSX, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import numeral from "numeral";
import { AiOutlineLoading } from "react-icons/ai";
import { ModalContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import useDashboard from "../hooks/useDashboard";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { DashboardProps } from "../types/envoker.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import Rewards from "../../Quest/modules/Rewards";
import PlayerMilestone from "./PlayerMilestone";

const Dashboard: FunctionComponent<DashboardProps> = ({
  dict,
  getMore,
  info,
  allQuests,
  kinoraDispatch,
  questEnvoker,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const {
    terminateQuest,
    approvePlayerMilestone,
    approvalLoading,
    openQuest,
    setOpenQuest,
    playerClaimMilestoneReward,
    claimRewardLoading,
    terminateLoading,
    openPlayerDetails,
    setOpenPlayerDetails,
    playerEligible,
  } = useDashboard(dict, allQuests, questEnvoker, kinoraDispatch);
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-center gap-10">
      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
        <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
          {dict?.dash}
        </div>
        <div className="relative w-full h-px bg-gray-700"></div>
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-14 overflow-y-scroll pb-10">
        {allQuests?.filter((item) => item?.type == "envoked")?.length > 0 && (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative text-sm font-bit text-white flex items-start justify-start">
              {dict?.envQ}
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
                  ?.map((item, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-full p-px rounded-sm flex h-full`}
                        id="northern"
                      >
                        <div className="relative w-full h-fit flex flex-col items-start justify-start rounded-sm bg-nave gap-7 rounded-md">
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0 rounded-md">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${
                                item?.questMetadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                            />
                          </div>
                          <div
                            className="absolute top-0 left-0 w-full h-full items-center justify-center flex rounded-md"
                            id="fadeOut"
                          ></div>
                          <div
                            className={`relative w-full flex items-center px-2 py-2 sm:py-1 flex-col sm:flex-row justify-between rounded-sm cursor-pointer sm:gap-1 gap-3 h-24 sm:h-16 sm:flex-nowrap flex-wrap rounded-md`}
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
                                  ? item?.questMetadata?.title?.slice(0, 15) +
                                    "..."
                                  : item?.questMetadata?.title}
                              </div>
                            </div>
                            <div className="relative w-fit h-fit mr-0 flex flex-col gap-2 items-end justify-between sm:flex-nowrap flex-wrap">
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-1.5">
                                {[
                                  {
                                    title: dict?.plas,
                                    value: item?.players?.length,
                                  },
                                  {
                                    title: dict?.mils,
                                    value: Number(item?.milestoneCount),
                                  },
                                  {
                                    title: dict?.videos,
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
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2.5 sm:flex-nowrap flex-wrap">
                                {[
                                  {
                                    title: dict?.lis,
                                    value: item?.post?.stats?.upvotes,
                                    image:
                                      "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                                  },
                                  {
                                    title: dict?.mis,
                                    value: item?.post?.stats?.reposts,
                                    image:
                                      "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                                  },
                                  {
                                    title: dict?.quos,
                                    value: item?.post?.stats?.quotes,
                                    image:
                                      "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                                  },
                                  {
                                    title: dict?.books,
                                    value: item?.post?.stats?.bookmarks,
                                    image:
                                      "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
                                  },
                                  {
                                    title: dict?.coms,
                                    value: item?.post?.stats?.comments,
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
                                  onClick={() => {
                                    context?.setRouterChangeLoading(true);

                                    router.push(`/quest/${item?.post?.id}`);
                                  }}
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
                                  {dict?.close}
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
                                      dict?.closeQ
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="relative w-full h-fit flex flex-col gap-2">
                                <div className="relative w-fit h-fit flex font-bit text-white text-xs">
                                  {dict?.claim}
                                </div>
                                <PlayerMilestone
                                  dict={dict}
                                  quest={item}
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
                                  {dict?.compl}
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
                                        ?.map((player, playerIndex: number) => {
                                          return (
                                            <div
                                              key={playerIndex}
                                              className="relative rounded-full p-px w-8 h-8 cursor-pointer"
                                              id="northern"
                                              onClick={() => {
                                                context?.setRouterChangeLoading(
                                                  true
                                                );

                                                router.push(
                                                  `/envoker/${player?.profile?.username?.localName}`
                                                );
                                              }}
                                            >
                                              <div className="relative w-full h-full rounded-full flex">
                                                <Image
                                                  src={handleProfilePicture(
                                                    player?.profile?.metadata
                                                      ?.picture
                                                  )}
                                                  draggable={false}
                                                  layout="fill"
                                                  className="rounded-full"
                                                />
                                              </div>
                                            </div>
                                          );
                                        })
                                    ) : (
                                      <div className="relative w-fit h-fit flex items-center justify-center text-left font-bit text-gray-600 text-xxs">
                                        {dict?.nop}
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
              {dict?.plaA}
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
                  ?.map((item, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-full p-px rounded-sm flex h-full`}
                        id="northern"
                      >
                        <div className="relative w-full h-fit flex flex-col items-start justify-start rounded-sm bg-nave gap-7">
                          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-0 rounded-md">
                            <Image
                              layout="fill"
                              objectFit="cover"
                              className="rounded-md"
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${
                                item?.questMetadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                              }`}
                            />
                          </div>
                          <div
                            className="absolute top-0 left-0 w-full h-full items-center justify-center flex rounded-md"
                            id="fadeOut"
                          ></div>
                          <div
                            className={`relative w-full flex items-center px-2 py-2 sm:py-1 flex-col sm:flex-row justify-between rounded-sm cursor-pointer sm:gap-1 gap-3 h-24 sm:h-16 sm:flex-nowrap flex-wrap rounded-md`}
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
                                      player?.profile?.address ==
                                      context?.lensConectado?.profile?.address
                                  )
                                  ? undefined
                                  : item?.players?.find(
                                      (player) =>
                                        player?.profile?.address ==
                                        context?.lensConectado?.profile?.address
                                    )
                              );
                            }}
                          >
                            <div className="relative ml-0 flex items-center justify-center gap-3">
                              <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-sm">
                                {item?.questMetadata?.title?.length > 15
                                  ? item?.questMetadata?.title?.slice(0, 15) +
                                    "..."
                                  : item?.questMetadata?.title}
                              </div>
                            </div>
                            <div className="relative w-fit h-fit mr-0 flex flex-col gap-2 items-end justify-between sm:flex-nowrap flex-wrap">
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-1.5">
                                {[
                                  {
                                    title: dict?.plas,
                                    value: item?.players?.length,
                                  },
                                  {
                                    title: dict?.mils,
                                    value: Number(item?.milestoneCount),
                                  },
                                  {
                                    title: dict?.videos,
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
                              <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2.5 sm:flex-nowrap flex-wrap">
                                {[
                                  {
                                    title: dict?.lis,
                                    value: item?.post?.stats?.upvotes,
                                    image:
                                      "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                                  },
                                  {
                                    title: dict?.mis,
                                    value: item?.post?.stats?.reposts,
                                    image:
                                      "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                                  },
                                  {
                                    title: dict?.quos,
                                    value: item?.post?.stats?.quotes,
                                    image:
                                      "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                                  },
                                  {
                                    title: dict?.books,
                                    value: item?.post?.stats?.bookmarks,
                                    image:
                                      "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
                                  },
                                  {
                                    title: dict?.coms,
                                    value: item?.post?.stats?.comments,
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
                                  onClick={() => {
                                    context?.setRouterChangeLoading(true);

                                    router.push(`/quest/${item?.post?.id}`);
                                  }}
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
                                  {dict?.stat}
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
                                    item?.type == "completed" ||
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
                                    !claimRewardLoading?.[index] &&
                                    item?.type !== "completed" &&
                                    playerEligible?.eligible &&
                                    item?.status &&
                                    playerClaimMilestoneReward(
                                      item?.post?.id,
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
                                        Number(item?.milestoneCount) ||
                                      (Number(item?.milestoneCount) == 1 &&
                                        Number.isNaN(
                                          Number(
                                            openPlayerDetails
                                              ?.milestonesCompleted?.[
                                              openPlayerDetails?.milestonesCompleted?.findIndex(
                                                (value) =>
                                                  Number(value?.questId) ==
                                                  Number(item?.questId)
                                              )
                                            ]?.milestonesCompleted
                                          )
                                        )) ? (
                                      dict?.coQ
                                    ) : (
                                      dict?.coR
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
                                    {dict?.clam}
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
                                  {dict?.milA}
                                </div>
                                <PlayerMilestone
                                  player
                                  dict={dict}
                                  quest={item}
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

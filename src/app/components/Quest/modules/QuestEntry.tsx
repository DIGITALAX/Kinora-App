"use client";

import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import QuestPreview from "../../Common/modules/QuestPreview";
import VideoInfo from "../../Video/modules/VideoInfo";
import QuestSocial from "../../Video/modules/QuestSocial";
import MainVideo from "../../Video/modules/MainVideo";
import Metrics from "../../Video/modules/Metrics";
import useVideos from "../../Video/hooks/useVideos";
import useWho from "../../Video/hooks/useWho";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import useSuggested from "../hooks/useSuggested";
import useJoin from "../hooks/useJoin";
import QuestBoardSwitch from "./QuestBoardSwitch";
import Channels from "./Channels";
import MilestoneBoards from "./MilestoneBoards";
import { Dispatch } from "../../../../../../kinorasdk_refactor/dist";

export default function QuestEntry({
  dict,
  quest,
}: {
  dict: any;
  quest: string;
}) {
  const context = useContext(ModalContext);
  const kinoraDispatch = new Dispatch({
    playerAuthedApolloClient: context?.lensConectado?.apollo as any,
  });
  const {
    questInfoLoading,
    questInfo,
    setShowFullText,
    showFullText,
    mainViewer,
    setMainViewer,
    joinLoading,
    handlePlayerJoin,
    socialType,
    setSocialType,
    handleCompleteMilestone,
    completeLoading,
    getQuestInfo,
  } = useJoin(quest, dict, kinoraDispatch);
  const {
    videoPlaying,
    setVideoPlaying,
    metricsLoading,
    handleSendMetrics,
    playerMetricsLive,
    currentMetricsLoading,
    chainMetrics,
    milestoneEligible,
  } = useVideos(dict, getQuestInfo, kinoraDispatch, undefined, questInfo, mainViewer);
  const {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    mirrorQuote,
    setMirrorQuote,
  } = useWho(quest, socialType, videoPlaying);
  const { suggestedLoading, suggestedQuests, suggestedInfo, getMoreSuggested } =
    useSuggested();

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col gap-14"
        style={{
          width:
            typeof window !== "undefined" &&
            window.innerWidth > 684 &&
            context?.openSidebar
              ? "calc(100vw - 10rem)"
              : "calc(100vw - 2.5rem)",
        }}
        id={!context?.openSidebar ? "closeSide" : ""}
      >
        <div
          className={`relative h-fit xl:h-[38rem] w-full flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-10 xl:min-h-[38rem]`}
        >
          <div
            className={`relative w-full flex flex-col lg:flex-row gap-10 items-start justify-start xl:h-full ${
              videoPlaying ? "lg:h-[40rem]" : "h-[70rem] lg:h-[30rem]"
            }`}
          >
            <div className="relative w-full lg:w-fit h-full flex items-start justify-start">
              <div className="relative h-full w-full lg:w-80 flex items-start justify-start flex-col gap-6 rounded-sm border border-cost bg-black p-3 max-h-[30rem] overflow-y-scroll lg:max-h-full">
                {videoPlaying && (
                  <VideoInfo
                    dict={dict}
                    setSocialType={setSocialType}
                    videoPlaying={videoPlaying}
                  />
                )}
                {dataLoading ? (
                  <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
                    <div className="relative w-full h-fit flex items-start justify-start flex-wrap gap-3 overflow-y-scroll animate-pulse">
                      {Array.from({ length: 30 })?.map((_, index: number) => {
                        return (
                          <div
                            id="northern"
                            key={index}
                            className="relative h-20 rounded-md w-full flex"
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <QuestSocial
                    dict={dict}
                    videoPlaying={videoPlaying}
                    socialType={socialType}
                    questInfo={questInfo}
                    reactors={reactors}
                    quoters={quoters}
                    hasMore={hasMore}
                    hasMoreQuote={hasMoreQuote}
                    showMore={showMore}
                    mirrorQuote={mirrorQuote}
                    setMirrorQuote={setMirrorQuote}
                  />
                )}
              </div>
            </div>
            <div className="relative w-full h-full flex flex-col gap-4">
              {mainViewer !== 0 && (
                <div className="relative w-full h-fit flex items-start justify-start">
                  <div className="relative w-full h-10 sm:h-20 flex items-start justify-start gap-10">
                    <Channels
                      videos={questInfo?.milestones[mainViewer - 1]?.videos!}
                      videoPlaying={videoPlaying}
                      setVideoPlaying={setVideoPlaying}
                    />
                  </div>
                </div>
              )}
              <div
                className={`relative w-full h-full flex p-px rounded-md ${
                  questInfoLoading && "animate-pulse"
                }`}
                id="northern"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-md bg-black">
                  {!questInfoLoading &&
                    (!videoPlaying ? (
                      <Image
                        objectFit="cover"
                        layout="fill"
                        draggable={false}
                        className="relative w-full h-full rounded-md"
                        src={`${INFURA_GATEWAY}/ipfs/${
                          mainViewer == 0
                            ? questInfo?.questMetadata?.cover?.includes(
                                "ipfs://"
                              )
                              ? questInfo?.questMetadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                              : questInfo?.questMetadata?.cover
                            : questInfo?.milestones[
                                mainViewer - 1
                              ]?.milestoneMetadata?.cover?.includes("ipfs://")
                            ? questInfo?.milestones[
                                mainViewer - 1
                              ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
                            : questInfo?.milestones[mainViewer - 1]
                                ?.milestoneMetadata?.cover
                        }`}
                      />
                    ) : (
                      <MainVideo
                        allVideos={
                          questInfo?.milestones[mainViewer - 1]?.videos!
                        }
                        height={"25.8rem"}
                        width={"100%"}
                        setVideoPlaying={setVideoPlaying}
                        videoPlaying={videoPlaying}
                      />
                    ))}
                </div>
              </div>
              <div className="relative w-full h-fit flex items-start justify-start">
                <div className="relative w-full h-10 sm:h-20 flex items-start justify-start gap-10">
                  <MilestoneBoards
                    quest={questInfo?.questMetadata?.cover!}
                    milestones={questInfo?.milestones!}
                    mainViewer={mainViewer}
                    setMainViewer={setMainViewer}
                    setVideoPlaying={setVideoPlaying}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full xl:w-fit h-fit xl:h-full flex items-start justify-start">
            {!videoPlaying ? (
              <div className="relative h-fit xl:h-full w-full xl:w-60 flex items-start justify-start flex-col gap-6">
                <div className="relative w-full h-fit flex items-start justify-start flex-col gap-3">
                  {mainViewer !== 0 && (
                    <div className="relative w-full h-fit flex items-start justify-start text-azul font-bit text-lg">
                      {`${dict?.mil} ${mainViewer}`}
                    </div>
                  )}
                  <div
                    className={`relative w-fit h-fit flex items-start justify-start font-vcr text-white text-xl break-words ${
                      questInfoLoading && "animate-pulse"
                    }`}
                  >
                    {questInfoLoading
                      ? dict?.load
                      : mainViewer == 0
                      ? questInfo?.questMetadata?.title
                      : questInfo?.milestones?.[mainViewer - 1]
                          ?.milestoneMetadata?.title}
                  </div>
                  <div
                    className={`relative flex items-start justify-start gap-2 w-full h-fit ${
                      questInfoLoading && "animate-pulse"
                    }`}
                  >
                    <div className="relative w-full flex-1 items-start justify-start font-vcr text-gray-400 text-sm break-words text-overflow-truncate h-[6rem] overflow-y-scroll">
                      {questInfoLoading
                        ? "....".repeat(50)
                        : mainViewer === 0
                        ? questInfo?.questMetadata?.description &&
                          questInfo?.questMetadata?.description?.length > 100 &&
                          !showFullText
                          ? questInfo?.questMetadata?.description?.slice(
                              0,
                              100
                            ) + "..."
                          : questInfo?.questMetadata?.description
                        : questInfo?.milestones?.[mainViewer - 1]
                            ?.milestoneMetadata?.description &&
                          questInfo?.milestones?.[mainViewer - 1]
                            ?.milestoneMetadata?.description?.length > 100 &&
                          !showFullText
                        ? questInfo?.milestones?.[
                            mainViewer - 1
                          ]?.milestoneMetadata?.description?.slice(0, 100) +
                          "..."
                        : questInfo?.milestones?.[mainViewer - 1]
                            ?.milestoneMetadata?.description}
                    </div>
                    {(mainViewer == 0
                      ? questInfo?.questMetadata?.description &&
                        questInfo?.questMetadata?.description?.length > 100
                      : questInfo?.milestones?.[mainViewer - 1]
                          ?.milestoneMetadata?.description &&
                        questInfo?.milestones?.[mainViewer - 1]
                          ?.milestoneMetadata?.description?.length > 100) && (
                      <div
                        className="relative flex items-center justify-center w-fit h-fit cursor-pointer"
                        onClick={() => setShowFullText(!showFullText)}
                      >
                        {showFullText ? (
                          <FaChevronUp color={"4b5563"} size={10} />
                        ) : (
                          <FaChevronDown color={"4b5563"} size={10} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {mainViewer == 0 ? (
                  <div className="relative w-fit h-fit flex">
                    <div className="relative w-full h-fit flex flex-row items-center justify-start text-white font-bit text-xxs gap-3">
                      <div className="relative w-4 h-4 flex items-start justify-start ">
                        <Image
                          draggable={false}
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmcopbBnP4dJgRKCHJ7TN7nHFt5wpe6w8VBhztaBXGYvft`}
                        />
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center">{`${
                        dict?.maxP
                      } ${
                        questInfoLoading
                          ? "0"
                          : Number(questInfo?.maxPlayerCount) ==
                            Number(questInfo?.players?.length)
                          ? dict?.limR
                          : `${Number(questInfo?.players?.length)} / ${Number(
                              questInfo?.maxPlayerCount
                            )}`
                      }`}</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xs">
                    <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        {dict?.vidC}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                        {questInfo?.milestones?.[mainViewer - 1]?.videoLength}
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
                )}
                <QuestBoardSwitch
                  dict={dict}
                  milestoneEligible={milestoneEligible}
                  handleCompleteMilestone={handleCompleteMilestone}
                  completeLoading={completeLoading}
                  questInfo={questInfo}
                  questInfoLoading={questInfoLoading}
                  joinLoading={joinLoading}
                  handlePlayerJoin={handlePlayerJoin}
                  setSocialType={setSocialType}
                  mainViewer={mainViewer}
                />
              </div>
            ) : (
              <div className="relative h-full w-full xl:w-60 flex items-between justify-start flex-col gap-6 rounded-sm border border-cost bg-black p-2">
                <div className="relative w-full h-full flex flex-col gap-6 items-start justify-start overflow-y-scroll">
                  <div className="relative w-full h-fit gap-2 flex items-center justify-center flex-col">
                    <div className="relative w-full h-fit flex items-center justify-center text-gray-400 font-bit text-sm">
                      {dict?.miVid}
                    </div>
                    <div className="relative w-full h-px bg-gray-700"></div>
                  </div>
                  <Metrics
                    currentMetricsLoading={currentMetricsLoading}
                    playerMetricsLive={playerMetricsLive}
                    milestoneMetrics={videoPlaying!}
                    playerMetricsOnChain={chainMetrics!}
                    dict={dict}
                  />
                </div>
                <div
                  className={`relative w-full h-8 px-1.5 py-1 flex flex-row items-center gap-3 justify-center border border-gray-300 mb-0 rounded-md ${
                    metricsLoading || !playerMetricsLive || !context?.isPlayer
                      ? "opacity-70"
                      : "cursor-pointer active:scale-95"
                  }`}
                  onClick={() =>
                    !metricsLoading &&
                    playerMetricsLive &&
                    context?.isPlayer &&
                    handleSendMetrics()
                  }
                >
                  <div
                    className={`relative w-4 h-4 flex items-center justify-center  ${
                      metricsLoading && "animate-spin"
                    }`}
                  >
                    {metricsLoading ? (
                      <AiOutlineLoading color={"FBD201"} size={15} />
                    ) : (
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF`}
                        draggable={false}
                      />
                    )}
                  </div>
                  <div className="relative w-fit h-fit text-xxs sm:text-xs font-vcr text-gray-300">
                    {dict?.curM}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {suggestedLoading ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit flex flex-row gap-3 sm:flex-nowrap flex-wrap">
              {Array.from({ length: 4 })?.map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 sm:h-96 flex rounded-sm animate-pulse"
                    id="northern"
                  ></div>
                );
              })}
            </div>
            <div className="w-full h-fit grid-cols-1 sm:grid-cols-2 grid gap-3">
              {Array.from({ length: 10 }).map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 flex rounded-sm animate-pulse"
                    id="northern"
                  ></div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-fit flex flex-col gap-3 lg:flex-nowrap flex-wrap">
            <div className="relative w-full h-fit flex flex-row gap-3 lg:flex-nowrap flex-wrap">
              {suggestedQuests?.slice(0, 4)?.map((item, index: number) => {
                return (
                  <QuestPreview
                    key={index}
                    width="100%"
                    height="32rem"
                    quest={item}
                    dict={dict}
                    mainFeed={true}
                  />
                );
              })}
            </div>
            <InfiniteScroll
              loader={<></>}
              hasMore={suggestedInfo.hasMore}
              dataLength={suggestedQuests?.length!}
              next={getMoreSuggested}
              className="relative w-full h-fit flex-col items-center justify-start"
            >
              <div className="w-full h-fit flex flex-col md:grid md:grid-cols-2 justify-center items-start gap-3 flex-wrap pb-4">
                {suggestedQuests?.slice(4)?.map((item, index: number) => {
                  return (
                    <QuestPreview
                      key={index}
                      width="100%"
                      height="16rem"
                      quest={item}
                      mainFeed={true}
                      dict={dict}
                    />
                  );
                })}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
    </div>
  );
}

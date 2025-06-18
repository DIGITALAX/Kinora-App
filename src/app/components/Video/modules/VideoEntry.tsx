"use client";

import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { useContext } from "react";
import useVideo from "../hooks/useVideo";
import VideoInfo from "./VideoInfo";
import QuestSocial from "./QuestSocial";
import MainVideo from "./MainVideo";
import { AiOutlineLoading } from "react-icons/ai";
import useVideos from "../hooks/useVideos";
import useWho from "../hooks/useWho";
import Metrics from "./Metrics";
import InfiniteScroll from "react-infinite-scroll-component";
import QuestPreview from "../../Common/modules/QuestPreview";
import { Dispatch } from "kinora-sdk";

export default function VideoEntry({
  dict,
  video,
}: {
  dict: any;
  video: string;
}) {
  const context = useContext(ModalContext);

  const kinoraDispatch = new Dispatch({
    playerAuthedApolloClient: context?.lensConectado?.apollo as any,
  });
  const {
    videoDataLoading,
    videoData,
    socialType,
    setSocialType,
    relatedQuests,
    relatedQuestsLoading,
    getMoreRelatedQuests,
    videoInfo,
    getVideoDetails,
    setVideoData,
  } = useVideo(video as string);
  const {
    metricsLoading,
    handleSendMetrics,
    playerMetricsLive,
    currentMetricsLoading,
  } = useVideos(dict, getVideoDetails, kinoraDispatch, videoData);
  const {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    mirrorQuote,
    setMirrorQuote,
  } = useWho(video, socialType, videoData);

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
        <div className="relative h-fit xl:h-[28rem] w-full gap-10 xl:min-h-[28rem] flex flex-col xl:flex-row items-center justify-center xl:justify-between">
          <div
            className={`relative w-full flex flex-col lg:flex-row gap-10 items-start justify-start xl:h-full lg:h-[40rem]`}
          >
            <div className="relative w-full lg:w-fit h-full flex items-start justify-start">
              <div className="relative h-full w-full lg:w-80 flex items-start justify-start flex-col gap-6 rounded-sm border border-cost bg-black p-3 max-h-[30rem] overflow-y-scroll lg:max-h-full">
                {videoData && (
                  <VideoInfo
                    setSocialType={setSocialType}
                    videoPlaying={videoData}
                    dict={dict}
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
                    videoPlaying={videoData}
                    socialType={socialType}
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
              <div
                className={`relative w-full h-full flex p-px rounded-md ${
                  videoDataLoading && "animate-pulse"
                }`}
                id="northern"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-md bg-black">
                  {videoData && (
                    <MainVideo
                      setVideoPlaying={setVideoData}
                      videoPlaying={videoData}
                      height={"25.8rem"}
                      width={"100%"}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full xl:w-fit h-fit xl:h-full flex items-start justify-start">
            <div className="relative h-full w-full xl:w-60 flex items-between justify-start flex-col gap-6 rounded-sm border border-cost bg-black p-2">
              <div className="relative w-full h-full flex flex-col gap-6 items-start justify-start overflow-y-scroll">
                <div className="relative w-full h-fit gap-2 flex items-center justify-center flex-col">
                  <div className="relative w-full h-fit flex items-center justify-center text-gray-400 font-bit text-sm">
                    {dict?.logV}
                  </div>
                  <div className="relative w-full h-px bg-gray-700"></div>
                </div>
                <Metrics
                  dict={dict}
                  currentMetricsLoading={currentMetricsLoading}
                  playerMetricsLive={playerMetricsLive}
                  playerMetricsOnChain={videoData!}
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
          </div>
        </div>
        {relatedQuestsLoading ? (
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
              {relatedQuests?.slice(0, 4)?.map((item, index: number) => {
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
              hasMore={videoInfo.hasMore}
              dataLength={relatedQuests?.length!}
              next={getMoreRelatedQuests}
              className="relative w-full h-fit flex-col items-center justify-start"
            >
              <div className="w-full h-fit flex flex-col md:grid md:grid-cols-2 justify-center items-start gap-3 flex-wrap pb-4">
                {relatedQuests?.slice(4)?.map((item, index: number) => {
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

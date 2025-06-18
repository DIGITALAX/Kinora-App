"use client";

import { ModalContext } from "@/app/providers";
import { useContext } from "react";
import { useAccount } from "wagmi";
import ConnectFirst from "../../Upload/modules/ConnectFirst";
import { QuestStage } from "../types/envoke.types";
import QuestSwitch from "./QuestSwitch";
import useCriteria from "../hooks/useCriteria";
import useEnvoke from "../hooks/useEnvoke";
import Stages from "./Stages";
import { Envoker } from "../../../../../../kinorasdk_refactor/dist";

export default function EnvokeEntry({ dict }: { dict: any }) {
  const context = useContext(ModalContext);
  const { isConnected } = useAccount();
  const questEnvoker = new Envoker({
    authedApolloClient: context?.lensConectado?.apollo as any,
  });
  const {
    coverLoading,
    setCoverLoading,
    milestonesOpen,
    setMilestonesOpen,
    milestoneCoversLoading,
    setMilestoneCoversLoading,
    milestoneStage,
    setMilestoneStage,
    collections,
    collectionsSearch,
    setCollectionsSearch,
    getMoreCollectionsSearch,
    getCollectionsSearch,
    collectionsInfo,
    getMoreCollectionsSample,
    setCollectionsInfo,
    handleBalance,
    balanceLoading,
  } = useEnvoke();
  const {
    getMoreVideosSample,
    getMoreVideosSearch,
    getVideosSearch,
    videoInfo,
    videoSearch,
    videoSearchLoading,
    videos,
    setVideoSearch,
    chromadinVideos,
    storyboardStage,
    setStoryboardStage,
    milestoneStoryboardStage,
    setMilestoneStoryboardStage,
  } = useCriteria();
  return (
    <>
      {isConnected && context?.lensConectado?.profile ? (
        <div
          className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
          style={{
            height: "calc(100vh - 5.5rem)",
          }}
        >
          <div
            className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col"
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
            <div className="relative w-fit h-fit flex items-start justify-start text-2xl pb-10 font-bit text-white">
              {dict?.env}
            </div>
            <div
              className={`relative w-full h-fit flex flex-col xl:flex-row gap-8 pb-2 items-start  ${
                context?.questStage !== QuestStage.Post
                  ? "justify-end"
                  : "justify-center"
              }`}
            >
              {context?.questStage !== QuestStage.Post && (
                <QuestSwitch
                  dict={dict}
                  setCoverLoading={setCoverLoading}
                  coverLoading={coverLoading}
                  milestoneCoversLoading={milestoneCoversLoading}
                  setMilestoneCoversLoading={setMilestoneCoversLoading}
                  milestonesOpen={milestonesOpen}
                  milestoneStage={milestoneStage}
                  collections={collections}
                  collectionsSearch={collectionsSearch}
                  setCollectionsSearch={setCollectionsSearch}
                  getMoreCollectionsSearch={getMoreCollectionsSearch}
                  getCollectionsSearch={getCollectionsSearch}
                  collectionsInfo={collectionsInfo}
                  getMoreCollectionsSample={getMoreCollectionsSample}
                  setCollectionsInfo={setCollectionsInfo}
                  handleBalance={handleBalance}
                  balanceLoading={balanceLoading}
                  getMoreVideosSample={getMoreVideosSample}
                  getMoreVideosSearch={getMoreVideosSearch}
                  getVideosSearch={getVideosSearch}
                  videoInfo={videoInfo}
                  videoSearch={videoSearch}
                  videoSearchLoading={videoSearchLoading}
                  videos={videos}
                  setVideoSearch={setVideoSearch}
                  chromadinVideos={chromadinVideos}
                  storyboardStage={storyboardStage}
                  milestoneStoryboardStage={milestoneStoryboardStage}
                />
              )}
              <Stages
                dict={dict}
                questEnvoker={questEnvoker}
                milestonesOpen={milestonesOpen}
                setCollectionsSearch={setCollectionsSearch}
                setMilestonesOpen={setMilestonesOpen}
                milestoneStage={milestoneStage}
                setMilestoneStage={setMilestoneStage}
                milestoneStoryboardStage={milestoneStoryboardStage}
                setMilestoneStoryboardStage={setMilestoneStoryboardStage}
                setStoryboardStage={setStoryboardStage}
                storyboardStage={storyboardStage}
              />
            </div>
          </div>
        </div>
      ) : (
        <ConnectFirst dict={dict} />
      )}
    </>
  );
}

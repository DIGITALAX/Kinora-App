import { FunctionComponent } from "react";
import { QuestStage, QuestSwitchProps } from "../types/envoke.types";
import Details from "./Details";
import MilestoneSwitch from "./MilestoneSwitch";
import StoryboardSwitch from "./StoryboardSwitch";

const QuestSwitch: FunctionComponent<QuestSwitchProps> = ({
  questStage,
  dispatch,
  questInfo,
  coverLoading,
  setCoverLoading,
  setMilestoneCoversLoading,
  milestoneCoversLoading,
  milestonesOpen,
  milestoneStage,
  collections,
  collectionsSearch,
  setCollectionsSearch,
  getMoreCollectionsSearch,
  getCollectionsSearch,
  collectionsInfo,
  getMoreCollectionsSample,
  setCollectionsInfo,
  balanceLoading,
  handleBalance,
  getMoreVideosSample,
  getMoreVideosSearch,
  getVideosSearch,
  videoInfo,
  videoSearch,
  videoSearchLoading,
  videos,
  setVideoSearch,
  chromadinVideos,
  router,
  storyboardStage,
  milestoneStoryboardStage,
}): JSX.Element => {
  switch (questStage) {
    case QuestStage.Details:
      return (
        <Details
          coverLoading={coverLoading}
          setCoverLoading={setCoverLoading}
          questInfo={questInfo}
          dispatch={dispatch}
          collections={collections}
          collectionsSearch={collectionsSearch}
          setCollectionsSearch={setCollectionsSearch}
          getMoreCollectionsSearch={getMoreCollectionsSearch}
          getCollectionsSearch={getCollectionsSearch}
          collectionsInfo={collectionsInfo}
          getMoreCollectionsSample={getMoreCollectionsSample}
          setCollectionsInfo={setCollectionsInfo}
        />
      );

    case QuestStage.Milestones:
      return (
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-8 font-bit text-white">
          <div className="relative w-fit h-fit flex items-start justify-start underline underline-offset-4">
            Milestone{" "}
            {milestonesOpen.findIndex((item: boolean) => item == true) !== -1
              ? milestonesOpen.findIndex((item: boolean) => item == true) + 1
              : 1}
          </div>
          <MilestoneSwitch
            router={router}
            balanceLoading={balanceLoading}
            handleBalance={handleBalance}
            milestoneStage={milestoneStage}
            setMilestoneCoversLoading={setMilestoneCoversLoading}
            milestoneCoversLoading={milestoneCoversLoading}
            questInfo={questInfo}
            dispatch={dispatch}
            milestonesOpen={milestonesOpen}
            collections={collections}
            collectionsSearch={collectionsSearch}
            setCollectionsSearch={setCollectionsSearch}
            getMoreCollectionsSearch={getMoreCollectionsSearch}
            getCollectionsSearch={getCollectionsSearch}
            collectionsInfo={collectionsInfo}
            getMoreCollectionsSample={getMoreCollectionsSample}
            setCollectionsInfo={setCollectionsInfo}
            getMoreVideosSample={getMoreVideosSample}
            getMoreVideosSearch={getMoreVideosSearch}
            getVideosSearch={getVideosSearch}
            videoInfo={videoInfo}
            videoSearch={videoSearch}
            videoSearchLoading={videoSearchLoading}
            videos={videos}
            setVideoSearch={setVideoSearch}
            chromadinVideos={chromadinVideos}
          />
        </div>
      );

    case QuestStage.Storyboard:
      return (
        <StoryboardSwitch
          storyboardStage={storyboardStage}
          questInfo={questInfo}
          milestoneStoryboardStage={milestoneStoryboardStage}
        />
      );

    case QuestStage.Post:
      return <></>;
  }
};

export default QuestSwitch;

import { FunctionComponent, JSX, useContext } from "react";
import { QuestStage, QuestSwitchProps } from "../types/envoke.types";
import { ModalContext } from "@/app/providers";
import Details from "./Details";
import StoryboardSwitch from "./StoryboardSwitch";
import MilestoneSwitch from "./MilestoneSwitch";

const QuestSwitch: FunctionComponent<QuestSwitchProps> = ({
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
  storyboardStage,
  milestoneStoryboardStage,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  switch (context?.questStage) {
    case QuestStage.Details:
      return (
        <Details
          dict={dict}
          coverLoading={coverLoading}
          setCoverLoading={setCoverLoading}
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
            {dict?.mil}{" "}
            {milestonesOpen.findIndex((item: boolean) => item == true) !== -1
              ? milestonesOpen.findIndex((item: boolean) => item == true) + 1
              : 1}
          </div>
          <MilestoneSwitch
            dict={dict}
            balanceLoading={balanceLoading}
            handleBalance={handleBalance}
            milestoneStage={milestoneStage}
            setMilestoneCoversLoading={setMilestoneCoversLoading}
            milestoneCoversLoading={milestoneCoversLoading}
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
          dict={dict}
          storyboardStage={storyboardStage}
          milestoneStoryboardStage={milestoneStoryboardStage}
        />
      );

    default:
      return <></>;
  }
};

export default QuestSwitch;

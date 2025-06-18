import { FunctionComponent, JSX } from "react";
import Criteria from "./milestones/Criteria";
import Reward from "./milestones/Reward";
import GatedLogic from "./GatedLogic";
import MilestoneDetails from "./milestones/MilestoneDetails";
import { MilestoneSwitchProps } from "../types/envoke.types";

const MilestoneSwitch: FunctionComponent<MilestoneSwitchProps> = ({
  milestoneStage,
  dict,
  milestoneCoversLoading,
  setMilestoneCoversLoading,
  milestonesOpen,
  collections,
  collectionsInfo,
  collectionsSearch,
  getMoreCollectionsSample,
  getCollectionsSearch,
  getMoreCollectionsSearch,
  setCollectionsInfo,
  setCollectionsSearch,
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
}): JSX.Element => {
  switch (milestoneStage) {
    case 0:
    default:
      return (
        <MilestoneDetails
          setMilestoneCoversLoading={setMilestoneCoversLoading}
          milestoneCoversLoading={milestoneCoversLoading}
          dict={dict}
          milestonesOpen={milestonesOpen}
        />
      );

    case 1:
      return (
        <GatedLogic
          milestonesOpen={milestonesOpen}
          collections={collections}
          collectionsSearch={collectionsSearch}
          setCollectionsSearch={setCollectionsSearch}
          getMoreCollectionsSearch={getMoreCollectionsSearch}
          dict={dict}
          getCollectionsSearch={getCollectionsSearch}
          collectionsInfo={collectionsInfo}
          getMoreCollectionsSample={getMoreCollectionsSample}
          setCollectionsInfo={setCollectionsInfo}
        />
      );

    case 2:
      return (
        <Reward
          milestonesOpen={milestonesOpen}
          balanceLoading={balanceLoading}
          handleBalance={handleBalance}
          dict={dict}
        />
      );

    case 3:
      return (
        <Criteria
          milestonesOpen={milestonesOpen}
          dict={dict}
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
      );
  }
};

export default MilestoneSwitch;

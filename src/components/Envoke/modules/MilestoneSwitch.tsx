import { FunctionComponent } from "react";
import MilestoneDetails from "./milestones/MilestoneDetails";
import { MilestoneSwitchProps } from "../types/envoke.types";
import GatedLogic from "./milestones/GatedLogic";
import Reward from "./milestones/Reward";
import Criteria from "./milestones/Criteria";

const MilestoneSwitch: FunctionComponent<MilestoneSwitchProps> = ({
  milestoneStage,
  questInfo,
  dispatch,
  t,
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
  router,
}): JSX.Element => {
  switch (milestoneStage) {
    case 0:
    default:
      return (
        <MilestoneDetails
          setMilestoneCoversLoading={setMilestoneCoversLoading}
          milestoneCoversLoading={milestoneCoversLoading}
          questInfo={questInfo}
          t={t}
          dispatch={dispatch}
          milestonesOpen={milestonesOpen}
        />
      );

    case 1:
      return (
        <GatedLogic
          questInfo={questInfo}
          dispatch={dispatch}
          milestonesOpen={milestonesOpen}
          collections={collections}
          collectionsSearch={collectionsSearch}
          setCollectionsSearch={setCollectionsSearch}
          getMoreCollectionsSearch={getMoreCollectionsSearch}
          t={t}
          getCollectionsSearch={getCollectionsSearch}
          collectionsInfo={collectionsInfo}
          getMoreCollectionsSample={getMoreCollectionsSample}
          setCollectionsInfo={setCollectionsInfo}
        />
      );

    case 2:
      return (
        <Reward
          questInfo={questInfo}
          dispatch={dispatch}
          milestonesOpen={milestonesOpen}
          balanceLoading={balanceLoading}
          handleBalance={handleBalance}
          t={t}
        />
      );

    case 3:
      return (
        <Criteria
          milestonesOpen={milestonesOpen}
          dispatch={dispatch}
          questInfo={questInfo}
          router={router}
          getMoreVideosSample={getMoreVideosSample}
          getMoreVideosSearch={getMoreVideosSearch}
          getVideosSearch={getVideosSearch}
          videoInfo={videoInfo}
          videoSearch={videoSearch}
          videoSearchLoading={videoSearchLoading}
          videos={videos}
          setVideoSearch={setVideoSearch}
          chromadinVideos={chromadinVideos}
          t={t}
        />
      );
  }
};

export default MilestoneSwitch;

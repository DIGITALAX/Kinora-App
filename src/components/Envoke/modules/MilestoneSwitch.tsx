import { FunctionComponent } from "react";
import MilestoneDetails from "./milestones/MilestoneDetails";
import { MilestoneSwitchProps } from "../types/envoke.types";
import GatedLogic from "./milestones/GatedLogic";
import Reward from "./milestones/Reward";
import Criteria from "./milestones/Criteria";
import Overview from "./milestones/Overview";

const MilestoneSwitch: FunctionComponent<MilestoneSwitchProps> = ({
  milestoneStage,
  questInfo,
  dispatch,
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
}): JSX.Element => {
  switch (milestoneStage) {
    case 0:
    default:
      return (
        <MilestoneDetails
          setMilestoneCoversLoading={setMilestoneCoversLoading}
          milestoneCoversLoading={milestoneCoversLoading}
          questInfo={questInfo}
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
        />
      );

    case 3:
      return <Criteria />;

    case 4:
      return <Overview />;
  }
};

export default MilestoneSwitch;

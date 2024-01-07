import { FunctionComponent } from "react";
import { ActivityProps } from "../types/activity.types";
import InfiniteScroll from "react-infinite-scroll-component";
import QuestPreview from "@/components/Common/modules/QuestPreview";
import Player from "./Player";
import QuestCompleted from "./QuestCompleted";
import MilestoneCompleted from "./MilestoneCompleted";
import MetricsAdded from "./MetricsAdded";
import { Quest } from "@/components/Quest/types/quest.types";

const Activity: FunctionComponent<ActivityProps> = ({
  activityFeed,
  activityInfo,
  lensConnected,
  like,
  mirror,
  mirrorChoiceOpen,
  dispatch,
  getMoreActivityFeed,
  profileHovers,
  setMirrorChoiceOpen,
  setProfileHovers,
  unfollowProfile,
  followProfile,
  router,
  bookmark,
  interactionsLoading,
  simpleCollect
}): JSX.Element => {
  return (
    <InfiniteScroll
      loader={<></>}
      hasMore={activityInfo.hasMore}
      dataLength={activityFeed?.length}
      next={getMoreActivityFeed}
      className="relative w-full h-fit flex-col items-center justify-start"
    >
      <div className="w-full h-fit grid grid-cols-2 justify-center items-start gap-3">
        {activityFeed?.map(
          (
            item: Quest & {
              type: string;
            },
            index: number
          ) => {
            switch (item?.type) {
              case "metrics":
                return (
                  <MetricsAdded
                    key={index}
                    width="100%"
                    height="16rem"
                    dispatch={dispatch}
                    lensConnected={lensConnected}
                    quest={item}
                    mirror={mirror}
                    mirrorChoiceOpen={mirrorChoiceOpen}
                    setMirrorChoiceOpen={setMirrorChoiceOpen}
                    like={like}
                    index={index}
                    interactionsLoading={interactionsLoading}
                    simpleCollect={simpleCollect}
                    router={router}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    setProfileHovers={setProfileHovers}
                    profileHovers={profileHovers}
                  />
                );

              case "completed":
                return (
                  <QuestCompleted
                    key={index}
                    width="100%"
                    height="16rem"
                    dispatch={dispatch}
                    lensConnected={lensConnected}
                    quest={item}
                    mirror={mirror}
                    mirrorChoiceOpen={mirrorChoiceOpen}
                    setMirrorChoiceOpen={setMirrorChoiceOpen}
                    like={like}
                    index={index}
                    interactionsLoading={interactionsLoading}
                    bookmark={bookmark}
                    router={router}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    setProfileHovers={setProfileHovers}
                    profileHovers={profileHovers}
                    mainFeed={true}
                  />
                );

              case "milestone":
                return (
                  <MilestoneCompleted
                    key={index}
                    width="100%"
                    height="16rem"
                    dispatch={dispatch}
                    lensConnected={lensConnected}
                    quest={item}
                    mirror={mirror}
                    mirrorChoiceOpen={mirrorChoiceOpen}
                    setMirrorChoiceOpen={setMirrorChoiceOpen}
                    like={like}
                    index={index}
                    interactionsLoading={interactionsLoading}
                    bookmark={bookmark}
                    router={router}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    setProfileHovers={setProfileHovers}
                    profileHovers={profileHovers}
                    mainFeed={true}
                  />
                );

              case "player":
                return (
                  <Player
                    key={index}
                    width="10rem"
                    height="16rem"
                    dispatch={dispatch}
                    lensConnected={lensConnected}
                    quest={item}
                    mirror={mirror}
                    mirrorChoiceOpen={mirrorChoiceOpen}
                    setMirrorChoiceOpen={setMirrorChoiceOpen}
                    like={like}
                    index={index}
                    interactionsLoading={interactionsLoading}
                    bookmark={bookmark}
                    router={router}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    setProfileHovers={setProfileHovers}
                    profileHovers={profileHovers}
                    mainFeed={true}
                  />
                );

              default:
                return (
                  <QuestPreview
                    key={index}
                    width="100%"
                    height="16rem"
                    dispatch={dispatch}
                    lensConnected={lensConnected}
                    quest={item}
                    mirror={mirror}
                    mirrorChoiceOpen={mirrorChoiceOpen}
                    setMirrorChoiceOpen={setMirrorChoiceOpen}
                    like={like}
                    index={index}
                    interactionsLoading={interactionsLoading}
                    bookmark={bookmark}
                    router={router}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    setProfileHovers={setProfileHovers}
                    profileHovers={profileHovers}
                    mainFeed={true}
                  />
                );
            }
          }
        )}
      </div>
    </InfiniteScroll>
  );
};

export default Activity;

import { FunctionComponent } from "react";
import { ActivityProps } from "../types/activity.types";
import InfiniteScroll from "react-infinite-scroll-component";
import QuestCompleted from "./QuestCompleted";
import MetricsAdded from "./MetricsAdded";
import { Quest } from "@/components/Quest/types/quest.types";
import { Profile } from "../../../../graphql/generated";
import Player from "./Player";
import QuestPreview from "@/components/Common/modules/QuestPreview";

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
  simpleCollect,
  disabled,
}): JSX.Element => {
  return (
    <InfiniteScroll
      loader={<></>}
      hasMore={activityInfo?.hasMore}
      dataLength={activityFeed?.length}
      next={getMoreActivityFeed}
      className="relative w-full h-fit flex-col items-start justify-start"
    >
      <div
        className={`w-full h-fit justify-start items-start gap-8 ${
          disabled ? "flex flex-col" : "grid grid-cols-3"
        }`}
      >
        {activityFeed?.map(
          (
            item: Quest & {
              type: string;
              profile: Profile | undefined;
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
                    mirror={mirror!}
                    mirrorChoiceOpen={mirrorChoiceOpen!}
                    setMirrorChoiceOpen={setMirrorChoiceOpen!}
                    like={like!}
                    index={index}
                    interactionsLoading={interactionsLoading!}
                    simpleCollect={simpleCollect!}
                    router={router}
                    followProfile={followProfile!}
                    unfollowProfile={unfollowProfile!}
                    setProfileHovers={setProfileHovers!}
                    profileHovers={profileHovers!}
                    disabled={disabled}
                  />
                );

              case "milestone":
              case "completed":
                return (
                  <QuestCompleted
                    interactionsLoading={interactionsLoading!}
                    key={index}
                    width="100%"
                    height="9rem"
                    dispatch={dispatch}
                    quest={item}
                    index={index}
                    router={router}
                    followProfile={followProfile!}
                    unfollowProfile={unfollowProfile!}
                    setProfileHovers={setProfileHovers!}
                    profileHovers={profileHovers!}
                    disabled={disabled}
                  />
                );

              case "player":
                return (
                  <Player
                    key={index}
                    width="100%"
                    height="16rem"
                    dispatch={dispatch}
                    interactionsLoading={interactionsLoading!}
                    quest={item}
                    index={index}
                    router={router}
                    followProfile={followProfile!}
                    unfollowProfile={unfollowProfile!}
                    setProfileHovers={setProfileHovers!}
                    profileHovers={profileHovers!}
                    disabled={disabled}
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
                    mirror={mirror!}
                    mirrorChoiceOpen={mirrorChoiceOpen!}
                    setMirrorChoiceOpen={setMirrorChoiceOpen!}
                    like={like!}
                    index={index}
                    interactionsLoading={interactionsLoading!}
                    bookmark={bookmark!}
                    router={router}
                    followProfile={followProfile!}
                    unfollowProfile={unfollowProfile!}
                    setProfileHovers={setProfileHovers!}
                    profileHovers={profileHovers!}
                    mainFeed={true}
                    border
                    disabled={disabled}
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
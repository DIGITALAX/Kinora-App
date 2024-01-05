import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { QuestFeedProps } from "../types/common.types";
import QuestPreview from "./QuestPreview";
import { Quest } from "@/components/Quest/types/quest.types";

const QuestFeed: FunctionComponent<QuestFeedProps> = ({
  questFeed,
  questInfo,
  getMoreQuestFeed,
  dispatch,
  lensConnected,
  router,
  mirror,
  like,
  mirrorChoiceOpen,
  bookmark,
  interactionsLoading,
  setMirrorChoiceOpen,
  followProfile,
  unfollowProfile,
  setProfileHovers,
  profileHovers,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-3">
      <div className="relative w-full h-fit flex flex-row gap-3">
        {questFeed?.slice(0, 4)?.map((item: Quest, index: number) => {
          return (
            <QuestPreview
              key={index}
              width="100%"
              height="32rem"
              lensConnected={lensConnected}
              dispatch={dispatch}
              quest={item}
              router={router}
              mirror={mirror}
              mirrorChoiceOpen={mirrorChoiceOpen}
              setMirrorChoiceOpen={setMirrorChoiceOpen}
              like={like}
              index={index}
              interactionsLoading={interactionsLoading}
              bookmark={bookmark}
              followProfile={followProfile}
              unfollowProfile={unfollowProfile}
              setProfileHovers={setProfileHovers}
              profileHovers={profileHovers}
              mainFeed={true}
              type="feed"
              feed={questFeed}
            />
          );
        })}
      </div>
      <InfiniteScroll
        loader={<></>}
        hasMore={questInfo.hasMore}
        dataLength={questFeed?.length}
        next={getMoreQuestFeed}
        className="relative w-full h-fit flex-col items-center justify-start"
      >
        <div className="w-full h-fit grid grid-cols-2 justify-center items-start gap-3">
          {questFeed
            ?.slice(4)

            ?.map((item: Quest, index: number) => {
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
                  index={index + 4}
                  interactionsLoading={interactionsLoading}
                  bookmark={bookmark}
                  router={router}
                  followProfile={followProfile}
                  unfollowProfile={unfollowProfile}
                  setProfileHovers={setProfileHovers}
                  profileHovers={profileHovers}
                  mainFeed={true}
                  type="feed"
                  feed={questFeed}
                />
              );
            })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default QuestFeed;

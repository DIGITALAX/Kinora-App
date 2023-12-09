import { FunctionComponent } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { Post } from "../../../../graphql/generated";
import { QuestFeedProps } from "../types/common.types";
import QuestPreview from "./QuestPreview";

const QuestFeed: FunctionComponent<QuestFeedProps> = ({
  questFeed,
  questInfo,
  getMoreQuestFeed,
  dispatch,
  lensConnected,
  router,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-3">
      <div className="relative w-full h-fit flex flex-row gap-3">
        {questFeed?.slice(0, 4)?.map((item: Post, index: number) => {
          return (
            <QuestPreview
              key={index}
              width="100%"
              height="32rem"
              lensConnected={lensConnected}
              dispatch={dispatch}
              quest={item}
              questFeed={questFeed}
              router={router}
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
          {questFeed?.slice(4)?.map((item: Post, index: number) => {
            return (
              <QuestPreview
                key={index}
                width="100%"
                height="16rem"
                dispatch={dispatch}
                lensConnected={lensConnected}
                quest={item}
                questFeed={questFeed}
                router={router}
              />
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default QuestFeed;

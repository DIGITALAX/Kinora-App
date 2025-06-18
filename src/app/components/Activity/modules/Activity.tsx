import { ModalContext } from "@/app/providers";
import { FunctionComponent, JSX, useContext } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ActivityProps } from "../types/activity.types";
import MetricsAdded from "./MetricsAdded";
import QuestCompleted from "./QuestCompleted";
import Player from "./Player";
import QuestPreview from "../../Common/modules/QuestPreview";

const Activity: FunctionComponent<ActivityProps> = ({
  activityInfo,
  getMoreActivityFeed,
  disabled,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <InfiniteScroll
      loader={<></>}
      hasMore={activityInfo?.hasMore}
      dataLength={context?.activityFeed?.length!}
      next={getMoreActivityFeed}
      className="relative w-full h-fit flex-col items-start justify-start pb-6"
    >
      <div
        className={`w-full h-fit justify-start items-start gap-6 md:gap-8 ${
          disabled
            ? "flex flex-col"
            : "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
        }`}
      >
        {context?.activityFeed?.map((item, index: number) => {
          switch (item?.type) {
            case "metrics":
              return (
                <MetricsAdded
                  dict={dict}
                  key={index}
                  width="100%"
                  height="16rem"
                  quest={item as any}
                  disabled={disabled}
                />
              );

            case "milestone":
            case "completed":
              return (
                <QuestCompleted
                  key={index}
                  width="100%"
                  height="9rem"
                  dict={dict}
                  quest={item as any}
                  disabled={disabled}
                />
              );

            case "player":
              return (
                <Player
                  dict={dict}
                  key={index}
                  width="100%"
                  height="16rem"
                  quest={item as any}
                  disabled={disabled}
                />
              );

            default:
              return (
                <QuestPreview
                  key={index}
                  width="100%"
                  height="16rem"
                  dict={dict}
                  quest={item}
                  mainFeed={true}
                  border
                  disabled={disabled}
                />
              );
          }
        })}
      </div>
    </InfiniteScroll>
  );
};

export default Activity;

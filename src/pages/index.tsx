import useFeed from "@/components/Common/hooks/useFeed";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QuestFeed from "@/components/Common/modules/QuestFeed";
import { NextRouter } from "next/router";

export default function Home({ router }: { router: NextRouter }) {
  const dispatch = useDispatch();
  const questFeed = useSelector(
    (state: RootState) => state.app.questFeedReducer.feed
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const { feedLoading, questInfo, getMoreQuestFeed } = useFeed(
    dispatch,
    questFeed,
    lensConnected
  );

  return (
    <div
      className="relative overflow-y-scroll flex min-h-full w-full justify-end"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="h-fit p-2 relative flex flex-col"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        {feedLoading ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit flex flex-row gap-3">
              {Array.from({ length: 4 })?.map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-96 flex rounded-sm animate-pulse"
                    id="rainbow"
                  ></div>
                );
              })}
            </div>
            <div className="w-full h-fit grid-cols-2 grid gap-3">
              {Array.from({ length: 10 }).map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 flex rounded-sm animate-pulse"
                    id="rainbow"
                  ></div>
                );
              })}
            </div>
          </div>
        ) : (
          <QuestFeed
            questFeed={questFeed}
            getMoreQuestFeed={getMoreQuestFeed}
            questInfo={questInfo}
            lensConnected={lensConnected}
            dispatch={dispatch}
            router={router}
          />
        )}
      </div>
    </div>
  );
}

import { FunctionComponent } from "react";
import { SavesProps } from "../types/envoker.types";
import QuestPreview from "@/components/Common/modules/QuestPreview";
import { Post } from "../../../../graphql/generated";
import InfiniteScroll from "react-infinite-scroll-component";

const Saves: FunctionComponent<SavesProps> = ({
  allSaves,
  savesInfo,
  savesLoading,
  getMoreSaves,
  dispatch,
  lensConnected,
  setAllSaves,
  router,
}): JSX.Element => {
  return (
    <>
      {savesLoading ? (
        <div className="w-full h-fit grid-cols-3 grid gap-3">
          {Array.from({ length: 10 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full h-80 flex rounded-sm animate-pulse"
                id="rainbow"
              ></div>
            );
          })}
        </div>
      ) : allSaves?.length > 1 ? (
        <div className="relative text-white font-bit text-base text-center flex items-center justify-center w-full h-fit">
          No Saved Quests Yet.
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-col items-start justify-center">
          <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
            Saved Quests
          </div>
          <InfiniteScroll
            hasMore={savesInfo?.hasMore}
            next={getMoreSaves}
            loader={<></>}
            dataLength={allSaves?.length}
            className="relative w-full h-fit flex overflow-y-scroll"
          >
            <div className="relative w-full gap-3 h-fit grid grid-cols-3">
              {allSaves?.map((quest: Post, index: number) => {
                return (
                  <QuestPreview
                    quest={quest}
                    key={index}
                    width="100%"
                    height="11rem"
                    lensConnected={lensConnected}
                    dispatch={dispatch}
                    questFeed={allSaves}
                    setItemFeed={setAllSaves}
                    router={router}
                  />
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};

export default Saves;

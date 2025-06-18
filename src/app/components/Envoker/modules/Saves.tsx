import { FunctionComponent, JSX } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import QuestPreview from "../../Common/modules/QuestPreview";
import useSaves from "../hooks/useSaves";
import { SavesProps } from "../types/envoker.types";

const Saves: FunctionComponent<SavesProps> = ({
  dict,
  globalLoading,
  profile,
}): JSX.Element => {
  const { getMoreSaves, savesLoading, savesInfo, allSaves } =
    useSaves(profile);
  return (
    <>
      {savesLoading || globalLoading ? (
        <div className="w-full h-fit grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid gap-3">
          {Array.from({ length: 10 }).map((_, index: number) => {
            return (
              <div
                key={index}
                className="relative w-full h-80 flex rounded-sm animate-pulse"
                id="northern"
              ></div>
            );
          })}
        </div>
      ) : allSaves?.length < 1 ? (
        <div className="relative text-white font-bit text-base text-center flex items-center justify-center w-full h-fit">
          No Saved Quests Yet.
        </div>
      ) : (
        <div className="relative w-full h-full flex flex-col items-start justify-center">
          <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
            Saved Quests
          </div>
          <InfiniteScroll
            hasMore={savesInfo?.hasMore}
            next={getMoreSaves}
            loader={<></>}
            dataLength={allSaves?.length}
            className="relative w-full h-full flex overflow-y-scroll"
          >
            <div className="relative w-full gap-3 h-fit grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {allSaves?.map((quest, index: number) => {
                return (
                  <QuestPreview
                    dict={dict}
                    quest={quest}
                    post
                    key={index}
                    width="100%"
                    height="11rem"
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

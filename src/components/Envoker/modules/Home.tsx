import { FunctionComponent } from "react";
import { HomeProps } from "../types/envoker.types";
import QuestPreview from "@/components/Common/modules/QuestPreview";
import { Quest } from "@/components/Quest/types/quest.types";
import InfiniteScroll from "react-infinite-scroll-component";

const Home: FunctionComponent<HomeProps> = ({
  lensConnected,
  dispatch,
  onlyHistory,
  liveQuests,
  completedQuests,
  questsLoading,
  envokedQuests,
  router,
  mirror,
  like,
  bookmark,
  interactionsLoading,
  interactionsLoadingCompleted,
  mirrorChoiceOpenCompleted,
  setMirrorChoiceOpenCompleted,
  setProfileHoversCompleted,
  profileHoversCompleted,
  interactionsLoadingEnvoked,
  mirrorChoiceOpenEnvoked,
  setMirrorChoiceOpenEnvoked,
  setProfileHoversEnvoked,
  profileHoversEnvoked,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  profileHovers,
  setProfileHovers,
  followProfile,
  unfollowProfile,
  info,
  getMorePlayer,
  getMoreEnvoked,
  setLiveQuests,
  setCompletedQuests,
  setEnvokedQuests,
}): JSX.Element => {
  return (
    <>
      {questsLoading ? (
        <div className="w-full h-fit grid-cols-2 grid gap-3">
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
      ) : liveQuests?.length < 1 &&
        completedQuests?.length < 1 &&
        envokedQuests?.length < 1 ? (
        <div className="relative text-white font-bit text-base text-center flex items-center justify-center w-full h-fit">
          No Active Quest Data Yet.
        </div>
      ) : (
        <div className="relative w-full h-fit flex flex-col gap-10 items-start justify-start">
          {!onlyHistory && (
            <>
              {liveQuests?.length < 1 ? (
                <div className="relative text-white font-bit text-base text-center flex items-center justify-center w-full h-fit">
                  No Live Quests Currently.
                </div>
              ) : (
                <div className="relative w-full h-fit flex flex-col items-start justify-center">
                  <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
                    Live Quests
                  </div>
                  <InfiniteScroll
                    hasMore={info?.hasMorePlayer}
                    next={getMorePlayer}
                    loader={<></>}
                    dataLength={liveQuests?.length}
                    className="relative w-full h-full flex overflow-x-scroll"
                  >
                    <div className="relative w-fit h-fit flex flex-row items-start justify-start gap-4">
                      {liveQuests?.map((quest: Quest, index: number) => {
                        return (
                          <QuestPreview
                            quest={quest}
                            key={index}
                            width="18rem"
                            height="11rem"
                            lensConnected={lensConnected}
                            dispatch={dispatch}
                            mirror={mirror}
                            mirrorChoiceOpen={mirrorChoiceOpen}
                            setMirrorChoiceOpen={setMirrorChoiceOpen}
                            like={like}
                            index={index}
                            interactionsLoading={interactionsLoading}
                            bookmark={bookmark}
                            router={router}
                            unfollowProfile={unfollowProfile}
                            followProfile={followProfile}
                            setProfileHovers={setProfileHovers}
                            profileHovers={profileHovers}
                            type="feed"
                            itemSetter={setLiveQuests}
                            feed={liveQuests}
                          />
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                </div>
              )}
              {envokedQuests?.length < 1 ? (
                <div className="relative text-white font-bit text-base text-center flex items-center justify-center w-full h-fit">
                  No Envoked Quests Yet.
                </div>
              ) : (
                <div className="relative w-full h-fit flex flex-col items-start justify-center">
                  <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
                    Envoked Quests
                  </div>
                  <InfiniteScroll
                    hasMore={info?.hasMoreEnvoked}
                    next={getMoreEnvoked}
                    loader={<></>}
                    dataLength={envokedQuests?.length}
                    className="relative w-full h-full flex overflow-x-scroll"
                  >
                    <div className="relative w-fit h-fit flex flex-row items-start justify-start gap-4">
                      {envokedQuests?.map((quest: Quest, index: number) => {
                        return (
                          <QuestPreview
                            quest={quest}
                            key={index}
                            width="18rem"
                            height="11rem"
                            lensConnected={lensConnected}
                            dispatch={dispatch}
                            mirror={mirror}
                            mirrorChoiceOpen={mirrorChoiceOpenEnvoked}
                            setMirrorChoiceOpen={setMirrorChoiceOpenEnvoked}
                            like={like}
                            index={index}
                            interactionsLoading={interactionsLoadingEnvoked}
                            bookmark={bookmark}
                            router={router}
                            unfollowProfile={unfollowProfile}
                            followProfile={followProfile}
                            setProfileHovers={setProfileHoversEnvoked}
                            profileHovers={profileHoversEnvoked}
                            type="envoked"
                            itemSetter={setEnvokedQuests}
                            feed={envokedQuests}
                          />
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                </div>
              )}
            </>
          )}
          {completedQuests?.length < 1 ? (
            <div className="relative text-white font-bit text-base text-center flex items-center justify-center w-full h-fit">
              No Completed Quests Yet.
            </div>
          ) : (
            <div className="relative w-full h-fit flex flex-col items-start justify-center">
              <div className="relative w-fit h-fit flex w-fit h-fit text-left text-base font-bit text-white">
                Completed Quests
              </div>
              <InfiniteScroll
                hasMore={info?.hasMorePlayer}
                next={getMorePlayer}
                loader={<></>}
                dataLength={completedQuests?.length}
                className="relative w-full h-full flex overflow-y-scroll"
              >
                <div className="relative w-full gap-4 h-fit grid grid-cols-4">
                  {completedQuests?.map((quest: Quest, index: number) => {
                    return (
                      <QuestPreview
                        quest={quest}
                        key={index}
                        width="100%"
                        height="11rem"
                        lensConnected={lensConnected}
                        dispatch={dispatch}
                        mirror={mirror}
                        mirrorChoiceOpen={mirrorChoiceOpenCompleted!}
                        setMirrorChoiceOpen={setMirrorChoiceOpenCompleted!}
                        like={like}
                        index={index}
                        interactionsLoading={interactionsLoadingCompleted!}
                        bookmark={bookmark}
                        router={router}
                        unfollowProfile={unfollowProfile}
                        followProfile={followProfile}
                        setProfileHovers={setProfileHoversCompleted!}
                        profileHovers={profileHoversCompleted!}
                        type="completed"
                        itemSetter={setCompletedQuests}
                        feed={completedQuests}
                      />
                    );
                  })}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;

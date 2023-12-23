import { FunctionComponent } from "react";
import { HomeProps } from "../types/envoker.types";
import QuestPreview from "@/components/Common/modules/QuestPreview";
import { Quest } from "@/components/Quest/types/quest.types";

const Home: FunctionComponent<HomeProps> = ({
  lensConnected,
  dispatch,
  onlyHistory,
  liveQuests,
  completedQuests,
  questsLoading,
  envokedQuests,
  router,
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
                  <div className="relative w-full h-fit flex overflow-x-scroll">
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
                            simpleCollect={simpleCollect}
                            like={like}
                            index={index}
                            interactionsLoading={interactionsLoading}
                            bookmark={bookmark}
                            router={router}
                          />
                        );
                      })}
                    </div>
                  </div>
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
                  <div className="relative w-full h-fit flex overflow-x-scroll">
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
                            mirrorChoiceOpen={mirrorChoiceOpen}
                            setMirrorChoiceOpen={setMirrorChoiceOpen}
                            simpleCollect={simpleCollect}
                            like={like}
                            index={index}
                            interactionsLoading={interactionsLoading}
                            bookmark={bookmark}
                            router={router}
                          />
                        );
                      })}
                    </div>
                  </div>
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
              <div className="relative w-full h-fit flex overflow-y-scroll">
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
                        mirrorChoiceOpen={mirrorChoiceOpen}
                        setMirrorChoiceOpen={setMirrorChoiceOpen}
                        simpleCollect={simpleCollect}
                        like={like}
                        index={index}
                        interactionsLoading={interactionsLoading}
                        bookmark={bookmark}
                        router={router}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;

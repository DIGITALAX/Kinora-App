import { FunctionComponent } from "react";
import { HomeProps } from "../types/envoker.types";
import QuestPreview from "@/components/Common/modules/QuestPreview";
import { Quest } from "@/components/Quest/types/quest.types";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const Home: FunctionComponent<HomeProps> = ({
  lensConnected,
  dispatch,
  questsLoading,
  router,
  mirror,
  like,
  bookmark,
  interactionsLoading,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  profileHovers,
  setProfileHovers,
  followProfile,
  unfollowProfile,
  info,
  getMore,
  quests,
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
      ) : quests?.length < 1 ? (
        <div className="relative text-white font-bit text-base text-center flex items-center justify-center w-full h-fit">
          No Active Quest Data Yet.
        </div>
      ) : (
        <div className="relative w-full h-fit flex items-start justify-start pb-10">
          <InfiniteScroll
            hasMore={info?.hasMorePlayer || info?.hasMoreEnvoked}
            next={getMore}
            loader={<></>}
            dataLength={quests?.length}
            className="relative w-full h-full flex overflow-y-scroll"
          >
            <div className="relative w-full h-fit grid grid-cols-4 items-start justify-start gap-4">
              {quests?.map((quest: Quest & { type: string }, index: number) => {
                return (
                  <div
                    className="relative w-full h-fit flex flex-col gap-1.5"
                    key={index}
                  >
                    <div className="rounded-sm relative w-full flex flex-row h-fit">
                      <div
                        className="relative w-5 h-5 flex items-center justify-center mr-0"
                        title={quest?.type}
                      >
                        <Image
                          draggable={false}
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/${
                            quest?.type == "envoked"
                              ? "QmVrCzvYyFbgaDq1FSSJE5y8p7p6YcBx5R6GQVgR3ypVFM"
                              : quest?.type == "live"
                              ? "Qmchi9tnWKKA8jCPJxc48hX4pJ7zVgQU8tvrdXyEmbWmsQ"
                              : "QmZnrqwbHbzo7kXh65ojh7YipX4VdqDDZ1NiH4fCq7MZNg"
                          }`}
                        />
                      </div>
                    </div>
                    <QuestPreview
                      quest={quest}
                      width="100%"
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
                    />
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      )}
    </>
  );
};

export default Home;

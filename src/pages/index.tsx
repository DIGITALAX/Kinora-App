import useFeed from "@/components/Common/hooks/useFeed";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QuestFeed from "@/components/Common/modules/QuestFeed";
import { NextRouter } from "next/router";
import useInteractions from "@/components/Common/hooks/useInteractions";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { setQuestFeed } from "../../redux/reducers/questFeedSlice";
import { Quest } from "@/components/Quest/types/quest.types";

export default function Home({ router }: { router: NextRouter }) {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
  });
  const questFeed = useSelector(
    (state: RootState) => state.app.questFeedReducer.feed
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const accountType = useSelector(
    (state: RootState) => state.app.accountSwitchReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const { feedLoading, questInfo, getMoreQuestFeed } = useFeed(
    dispatch,
    questFeed,
    lensConnected
  );
  const {
    mirror,
    like,
    bookmark,
    interactionsLoading,
    setMirrorChoiceOpen,
    mirrorChoiceOpen,
    profileHovers,
    setProfileHovers,
    followProfile,
    unfollowProfile,
  } = useInteractions(
    lensConnected,
    dispatch,
    questFeed,
    address,
    publicClient,
    (newItems) => dispatch(setQuestFeed(newItems as Quest[]))
  );

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col"
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
            mirror={mirror}
            like={like}
            interactionsLoading={interactionsLoading}
            bookmark={bookmark}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            mirrorChoiceOpen={mirrorChoiceOpen}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
          />
        )}
      </div>
    </div>
  );
}

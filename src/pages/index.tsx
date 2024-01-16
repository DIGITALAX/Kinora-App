import useFeed from "@/components/Common/hooks/useFeed";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import QuestFeed from "@/components/Common/modules/QuestFeed";
import { NextRouter } from "next/router";
import useInteractions from "@/components/Common/hooks/useInteractions";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { setQuestFeed } from "../../redux/reducers/questFeedSlice";
import { Quest } from "@/components/Quest/types/quest.types";
import Head from "next/head";

export default function Home({ router }: { router: NextRouter }) {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
     `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
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
    (newItems: any) => dispatch(setQuestFeed(newItems as Quest[]))
  );

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <Head>
        <title>Kinora</title>
        <meta name="og:url" content={`https://kinora.irrevocable.dev/`} />
        <meta name="og:title" content={"Kinora"} />
        <meta name="og:description" content={"On-Chain Video Social Quests."} />
        <meta
          name="og:image"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <meta name="twitter:url" content={`https://kinora.irrevocable.dev/`} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://kinora.irrevocable.dev/fonts/Bitblox.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="https://kinora.irrevocable.dev/fonts/Vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <div
        className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col"
        style={{
          width:
            typeof window !== "undefined" &&
            window.innerWidth > 684 &&
            openSidebar
              ? "calc(100vw - 10rem)"
              : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        {feedLoading ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit md:flex-nowrap flex-wrap flex flex-row gap-3">
              {Array.from({ length: 4 })?.map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 sm:h-96 flex rounded-sm animate-pulse"
                    id="northern"
                  ></div>
                );
              })}
            </div>
            <div className="w-full h-fit flex flex-col md:grid md:grid-cols-2 justify-center items-start gap-3 flex-wrap">
              {Array.from({ length: 10 }).map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-60 flex rounded-sm animate-pulse"
                    id="northern"
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

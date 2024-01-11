import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NextRouter } from "next/router";
import Activity from "@/components/Activity/modules/Activity";
import useActivity from "@/components/Activity/hooks/useActivity";
import useInteractions from "@/components/Common/hooks/useInteractions";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { Quest } from "@/components/Quest/types/quest.types";
import { Profile } from "../../graphql/generated";
import { setActivityFeed } from "../../redux/reducers/activityFeedSlice";
import Head from "next/head";

export default function Envoke({ router }: { router: NextRouter }) {
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const { address } = useAccount();
  const dispatch = useDispatch();
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const activityFeed = useSelector(
    (state: RootState) => state.app.activityFeedReducer.feed
  );
  const { activityLoading, getMoreActivityFeed, activityInfo } = useActivity(
    lensConnected,
    activityFeed,
    dispatch
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
    simpleCollect,
  } = useInteractions(
    lensConnected,
    dispatch,
    activityFeed,
    address,
    publicClient,
    (newItems: any) =>
      dispatch(
        setActivityFeed(
          newItems as (Quest & { type: string; profile: Profile | undefined })[]
        )
      )
  );

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <Head>
        <title>Kinora Activity Feed</title>
        <meta
          name="og:url"
          content={`https://kinora.irrevocable.dev/activity`}
        />
        <meta name="og:title" content={"Kinora Activity Feed"} />
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
        <meta
          name="twitter:url"
          content={`https://kinora.irrevocable.dev/activity`}
        />
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
        {activityLoading ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit flex sm:flex-nowrap flex-wrap flex-row gap-3">
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
            <div className="w-full h-fit grid-cols-1 sm:grid-cols-2 grid gap-3">
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
          <Activity
            simpleCollect={simpleCollect}
            activityFeed={activityFeed}
            getMoreActivityFeed={getMoreActivityFeed}
            activityInfo={activityInfo}
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

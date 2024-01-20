import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { NextRouter } from "next/router";
import Head from "next/head";
import useRewards from "@/components/Rewards/hooks/useRewards";
import { Reward as RewardType } from "@/components/Quest/types/quest.types";
import InfiniteScroll from "react-infinite-scroll-component";
import Reward from "@/components/Rewards/modules/Reward";

export default function Awards({ router }: { router: NextRouter }) {
  const dispatch = useDispatch();
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const {
    rewardsLoading,
    getMoreRewards,
    rewardsInfo,
    allRewards,
    moreLoading,
  } = useRewards();

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <Head>
        <title>Kinora Awards Feed</title>
        <meta
          name="og:url"
          content={`https://kinora.irrevocable.dev/awards`}
        />
        <meta name="og:title" content={"Kinora Awards"} />
        <meta name="og:description" content={"On-Chain Video Social Quests."} />
        <link rel="icon" href="/favicon.ico" />
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
          content={`https://kinora.irrevocable.dev/awards`}
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
        {rewardsLoading ? (
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
          <InfiniteScroll
            loader={<></>}
            hasMore={rewardsInfo?.hasMore}
            dataLength={
              moreLoading ? allRewards?.length + 10 : allRewards?.length
            }
            next={getMoreRewards}
            className="relative w-full h-fit flex-col items-start justify-start pb-6"
            height={"calc(100vh - 5.5rem)"}
          >
            <div
              className={`w-full h-fit justify-start items-start gap-6 md:gap-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3`}
            >
              {allRewards?.map((item: RewardType, index: number) => {
                return (
                  <Reward
                    key={index}
                    reward={item}
                    router={router}
                    dispatch={dispatch}
                  />
                );
              })}
              {moreLoading &&
                Array.from({ length: 10 }).map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-40 sm:h-80 flex rounded-sm animate-pulse"
                      id="northern"
                    ></div>
                  );
                })}
            </div>
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}

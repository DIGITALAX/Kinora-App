import QuestSwitch from "@/components/Envoke/modules/QuestSwitch";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import useEnvoke from "@/components/Envoke/hooks/useEnvoke";
import Stages from "@/components/Envoke/modules/Stages";
import ConnectFirst from "@/components/Common/modules/ConnectFirst";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "@/components/Layout/hooks/useSignIn";
import { useAccount } from "wagmi";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import useCriteria from "@/components/Envoke/hooks/useCriteria";
import { NextRouter } from "next/router";
import usePostLive from "@/components/Envoke/hooks/usePostLive";
import { QuestStage } from "@/components/Envoke/types/envoke.types";
import Head from "next/head";

export default function Envoke({ router }: { router: NextRouter }) {
  const dispatch = useDispatch();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const questInfo = useSelector(
    (state: RootState) => state.app.questInfoReducer
  );
  const allUploaded = useSelector(
    (state: RootState) => state.app.allUploadedReducer.videos
  );
  const verifiedEnvoker = useSelector(
    (state: RootState) => state.app.verifiedEnvokerReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const questStage = useSelector(
    (state: RootState) => state.app.questStageReducer.value
  );
  const oracleData = useSelector(
    (state: RootState) => state.app.oracleDataReducer.data
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const {
    coverLoading,
    setCoverLoading,
    milestonesOpen,
    setMilestonesOpen,
    milestoneCoversLoading,
    setMilestoneCoversLoading,
    milestoneStage,
    setMilestoneStage,
    collections,
    collectionsSearch,
    setCollectionsSearch,
    getMoreCollectionsSearch,
    getCollectionsSearch,
    collectionsInfo,
    getMoreCollectionsSample,
    setCollectionsInfo,
    handleBalance,
    balanceLoading,
  } = useEnvoke(publicClient, dispatch, questInfo, address);
  const { handleLogIn, signLoading } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address,
    allUploaded,
    oracleData,
    publicClient
  );
  const {
    getMoreVideosSample,
    getMoreVideosSearch,
    getVideosSearch,
    videoInfo,
    videoSearch,
    videoSearchLoading,
    videos,
    setVideoSearch,
    chromadinVideos,
    storyboardStage,
    setStoryboardStage,
    milestoneStoryboardStage,
    setMilestoneStoryboardStage,
  } = useCriteria(lensConnected);
  const { handlePostLive, postLoading, handleApprove, tokensToApprove } =
    usePostLive(
      dispatch,
      questInfo,
      address,
      publicClient,
      allUploaded,
      setMilestonesOpen,
      setMilestoneStage,
      setCollectionsSearch,
      lensConnected,
      walletConnected,
      verifiedEnvoker
    );
  return (
    <>
      <Head>
        <title>Envoke New Quest</title>
        <meta name="og:url" content={`https://kinora.irrevocable.dev/envoke`} />
        <meta name="og:title" content={"Envoke New Quest"} />
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
          content={`https://kinora.irrevocable.dev/envoke`}
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
      {walletConnected && lensConnected ? (
        <div
          className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
          style={{
            height: "calc(100vh - 5.5rem)",
          }}
        >
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
            <div className="relative w-fit h-fit flex items-start justify-start text-2xl pb-10 font-bit text-white">
              Envoke New Quest
            </div>
            <div
              className={`relative w-full h-fit flex flex-col xl:flex-row gap-8 pb-2 items-start  ${
                questStage !== QuestStage.Post
                  ? "justify-end"
                  : "justify-center"
              }`}
            >
              {questStage !== QuestStage.Post && (
                <QuestSwitch
                  questStage={questStage}
                  dispatch={dispatch}
                  questInfo={questInfo}
                  setCoverLoading={setCoverLoading}
                  coverLoading={coverLoading}
                  milestoneCoversLoading={milestoneCoversLoading}
                  setMilestoneCoversLoading={setMilestoneCoversLoading}
                  milestonesOpen={milestonesOpen}
                  milestoneStage={milestoneStage}
                  collections={collections}
                  collectionsSearch={collectionsSearch}
                  setCollectionsSearch={setCollectionsSearch}
                  getMoreCollectionsSearch={getMoreCollectionsSearch}
                  getCollectionsSearch={getCollectionsSearch}
                  collectionsInfo={collectionsInfo}
                  getMoreCollectionsSample={getMoreCollectionsSample}
                  setCollectionsInfo={setCollectionsInfo}
                  handleBalance={handleBalance}
                  balanceLoading={balanceLoading}
                  getMoreVideosSample={getMoreVideosSample}
                  getMoreVideosSearch={getMoreVideosSearch}
                  getVideosSearch={getVideosSearch}
                  videoInfo={videoInfo}
                  videoSearch={videoSearch}
                  videoSearchLoading={videoSearchLoading}
                  videos={videos}
                  setVideoSearch={setVideoSearch}
                  chromadinVideos={chromadinVideos}
                  router={router}
                  storyboardStage={storyboardStage}
                  milestoneStoryboardStage={milestoneStoryboardStage}
                />
              )}
              <Stages
                questInfo={questInfo}
                questStage={questStage}
                dispatch={dispatch}
                milestonesOpen={milestonesOpen}
                setMilestonesOpen={setMilestonesOpen}
                milestoneStage={milestoneStage}
                setMilestoneStage={setMilestoneStage}
                milestoneStoryboardStage={milestoneStoryboardStage}
                setMilestoneStoryboardStage={setMilestoneStoryboardStage}
                setStoryboardStage={setStoryboardStage}
                storyboardStage={storyboardStage}
                handlePostLive={handlePostLive}
                postLoading={postLoading}
                handleApprove={handleApprove}
                tokensToApprove={tokensToApprove}
              />
            </div>
          </div>
        </div>
      ) : (
        <ConnectFirst
          signLoading={signLoading}
          openConnectModal={openConnectModal}
          handleLogIn={handleLogIn}
          walletConnected={walletConnected}
        />
      )}
    </>
  );
}

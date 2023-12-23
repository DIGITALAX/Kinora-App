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
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const questStage = useSelector(
    (state: RootState) => state.app.questStageReducer.value
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
    address
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
  const { handlePostLive, postLoading } = usePostLive(dispatch);
  return (
    <>
      {walletConnected && lensConnected ? (
        <div
          className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end"
          style={{
            height: "calc(100vh - 5.5rem)",
          }}
        >
          <div
            className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col"
            style={{
              width: openSidebar
                ? "calc(100vw - 10rem)"
                : "calc(100vw - 2.5rem)",
            }}
            id={!openSidebar ? "closeSide" : ""}
          >
            <div className="relative w-fit h-fit flex items-start justify-start font-bit text-white text-xl pb-10">
              Envoke A New Quest
            </div>
            <div
              className={`relative w-full h-full flex flex-col md:flex-row gap-8 pb-2 items-start  ${
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

import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon } from "viem/chains";
import { RootState } from "../../../redux/store";
import { NextRouter } from "next/router";
import useInteractions from "@/components/Quest/hooks/useInteractions";
import useInteractionsSuggested from "@/components/Common/hooks/useInteractions";
import { Dispatch as KinoraDispatch } from "kinora-sdk";
import { useAccount } from "wagmi";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../lib/constants";
import QuestSocial from "@/components/Quest/modules/QuestSocial";
import useWho from "@/components/Quest/hooks/useWho";
import { Quest, SocialType } from "@/components/Quest/types/quest.types";
import MainVideo from "@/components/Quest/modules/MainVideo";
import { AiOutlineLoading } from "react-icons/ai";
import VideoInfo from "@/components/Quest/modules/VideoInfo";
import QuestFeed from "@/components/Common/modules/QuestFeed";
import useVideo from "@/components/Video/hooks/useVideo";
import useVideos from "@/components/Quest/hooks/useVideos";
import Metrics from "@/components/Quest/modules/Metrics";
import { apolloClient } from "../../../lib/lens/client";
import Head from "next/head";
import { VideoMetadataV3 } from "../../../graphql/generated";

export default function VideoId({ router }: { router: NextRouter }) {
  const { videoId } = router.query;
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygon,
    transport: http(
      `https://polygon.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const kinoraDispatch = new KinoraDispatch({
    playerAuthedApolloClient: apolloClient,
  });
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const isPlayer = useSelector(
    (state: RootState) => state.app.isPlayerReducer.value
  );
  const postCollectGif = useSelector(
    (state: RootState) => state.app.postCollectGifReducer
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const {
    videoDataLoading,
    videoData,
    socialType,
    setSocialType,
    relatedQuests,
    relatedQuestsLoading,
    getMoreRelatedQuests,
    videoInfo,
    getVideoDetails,
    setVideoData,
    setRelatedQuests,
  } = useVideo(videoId as string, lensConnected);
  const {
    playing,
    setPlaying,
    volume,
    setVolume,
    seek,
    setSeek,
    volumeOpen,
    setVolumeOpen,
    duration,
    setDuration,
    metricsLoading,
    handleSendMetrics,
    playerMetricsLive,
    currentMetricsLoading,
    setOpenControls,
    openControls,
  } = useVideos(
    lensConnected,
    dispatch,
    getVideoDetails,
    kinoraDispatch,
    videoData
  );
  const {
    dataLoading,
    reactors,
    quoters,
    hasMore,
    hasMoreQuote,
    showMore,
    showComments,
    quoteMirrorSwitch,
    setQuoteMirrorSwitch,
    setReactors,
    setQuoters,
  } = useWho(lensConnected, videoId as string, socialType, videoData);
  const {
    mirror,
    like,
    comment,
    followProfile,
    unfollowProfile,
    mainInteractionsLoading,
    commentsOpen,
    profilesOpenMain,
    setProfilesOpenMain,
    handleBookmark,
    mirrorChoiceOpenMain,
    setMirrorChoiceOpenMain,
    setMakeComment,
    contentLoading,
    setContentLoading,
    caretCoordMain,
    setCaretCoordMain,
    caretCoord,
    setCaretCoord,
    profilesOpen,
    setProfilesOpen,
    makeComment,
    mentionProfiles,
    setMentionProfiles,
    mentionProfilesMain,
    setMentionProfilesMain,
    mainMakeComment,
    setMainMakeComment,
    mainContentLoading,
    setMainContentLoading,
    interactionsItemsLoading,
    setCommentsOpen,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    simpleCollect,
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    postCollectGif,
    socialType == SocialType.Comments
      ? reactors
      : socialType == SocialType.Mirrors
      ? quoters
      : [],
    socialType == SocialType.Comments
      ? setReactors
      : socialType == SocialType.Mirrors
      ? setQuoters
      : undefined,
    showComments,
    videoData,
    setVideoData
  );
  const {
    mirror: suggestedMirror,
    like: suggestedLike,
    bookmark: suggestedBookmark,
    interactionsLoading: suggestedInteractionsLoading,
    setMirrorChoiceOpen: suggestedSetMirrorChoiceOpen,
    mirrorChoiceOpen: suggestedMirrorChoiceOpen,
    profileHovers: suggestedProfileHovers,
    setProfileHovers: suggestedSetProfileHovers,
    followProfile: suggestedFollowerProfile,
    unfollowProfile: suggestedUnfollowProfile,
  } = useInteractionsSuggested(
    lensConnected,
    dispatch,
    relatedQuests,
    address,
    publicClient,
    (newItems: any) => setRelatedQuests(newItems as Quest[])
  );

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <Head>
        <title>
          {(videoData?.publication?.metadata as VideoMetadataV3)?.title
            ? (videoData?.publication?.metadata as VideoMetadataV3)?.title
            : "Video Log"}
        </title>
        <meta
          name="og:url"
          content={`https://kinora.irrevocable.dev/video/${videoData?.publication?.id}`}
        />
        <meta
          name="og:title"
          content={
            (videoData?.publication?.metadata as VideoMetadataV3)?.title
              ? (videoData?.publication?.metadata as VideoMetadataV3)?.title
              : "Video Log"
          }
        />
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
          content={`https://kinora.irrevocable.dev/video/${videoData?.publication?.id}`}
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
        className="md:h-full h-fit w-full items-start justify-start px-3 sm:px-6 pb-2 pt-6 relative flex flex-col gap-14"
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
        <div className="relative h-fit xl:h-[28rem] w-full gap-10 xl:min-h-[28rem] flex flex-col xl:flex-row items-center justify-center xl:justify-between">
          <div
            className={`relative w-full flex flex-col lg:flex-row gap-10 items-start justify-start xl:h-full lg:h-[40rem]`}
          >
            <div className="relative w-full lg:w-fit h-full flex items-start justify-start">
              <div className="relative h-full w-full lg:w-80 flex items-start justify-start flex-col gap-6 rounded-sm border border-cost bg-black p-3 max-h-[30rem] overflow-y-scroll lg:max-h-full">
                {videoData && (
                  <VideoInfo
                    router={router}
                    setSocialType={setSocialType}
                    dispatch={dispatch}
                    setMirrorChoiceOpen={setMirrorChoiceOpenMain}
                    mirrorChoiceOpen={mirrorChoiceOpenMain}
                    simpleCollect={simpleCollect}
                    videoPlaying={videoData}
                    mirror={mirror}
                    bookmark={handleBookmark}
                    like={like}
                    mainInteractionsLoading={mainInteractionsLoading}
                    lensConnected={lensConnected}
                  />
                )}
                {dataLoading ? (
                  <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
                    <div className="relative w-full h-fit flex items-start justify-start flex-wrap gap-3 overflow-y-scroll animate-pulse">
                      {Array.from({ length: 30 })?.map((_, index: number) => {
                        return (
                          <div
                            id="northern"
                            key={index}
                            className="relative h-20 rounded-md w-full flex"
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <QuestSocial
                    videoPlaying={videoData}
                    mirrorChoiceOpen={mirrorChoiceOpen}
                    profilesOpen={profilesOpen}
                    mentionProfiles={mentionProfiles}
                    setMirrorChoiceOpen={setMirrorChoiceOpen}
                    profileHovers={profilesOpen}
                    setProfileHovers={setProfilesOpen}
                    followProfile={followProfile}
                    unfollowProfile={unfollowProfile}
                    simpleCollect={simpleCollect}
                    setCommentsOpen={setCommentsOpen}
                    commentsOpen={commentsOpen}
                    mirror={mirror}
                    like={like}
                    interactionsLoading={interactionsItemsLoading}
                    mainInteractionsLoading={mainInteractionsLoading}
                    setQuoteMirrorSwitch={setQuoteMirrorSwitch}
                    quoteMirrorSwitch={quoteMirrorSwitch}
                    socialType={socialType}
                    router={router}
                    reactors={reactors}
                    quoters={quoters}
                    hasMore={hasMore}
                    hasMoreQuote={hasMoreQuote}
                    showMore={showMore}
                    lensConnected={lensConnected}
                    dispatch={dispatch}
                    commentPost={comment}
                    setCaretCoordMain={setCaretCoordMain}
                    caretCoordMain={caretCoordMain}
                    mentionProfilesMain={mentionProfilesMain}
                    profilesOpenMain={profilesOpenMain}
                    setMentionProfilesMain={setMentionProfilesMain}
                    setProfilesOpenMain={setProfilesOpenMain}
                    makeCommentMain={mainMakeComment}
                    setContentLoadingMain={setMainContentLoading}
                    setMakeCommentMain={setMainMakeComment}
                    contentLoadingMain={mainContentLoading}
                    postCollectGif={postCollectGif}
                    contentLoading={contentLoading}
                    setContentLoading={setContentLoading}
                    setCaretCoord={setCaretCoord}
                    setMakeComment={setMakeComment}
                    setMentionProfiles={setMentionProfiles}
                    setProfilesOpen={setProfilesOpen}
                    makeComment={makeComment}
                    caretCoord={caretCoord}
                  />
                )}
              </div>
            </div>
            <div className="relative w-full h-full flex flex-col gap-4">
              <div
                className={`relative w-full h-full flex p-px rounded-md ${
                  videoDataLoading && "animate-pulse"
                }`}
                id="northern"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-md bg-black">
                  {videoData && (
                    <MainVideo
                      setOpenControls={setOpenControls}
                      openControls={openControls}
                      setVideoPlaying={setVideoData}
                      videoPlaying={videoData}
                      height={"25.8rem"}
                      width={"100%"}
                      playing={playing}
                      setPlaying={setPlaying}
                      volume={volume}
                      setVolume={setVolume}
                      seek={seek}
                      setSeek={setSeek}
                      volumeOpen={volumeOpen}
                      setVolumeOpen={setVolumeOpen}
                      duration={duration}
                      setDuration={setDuration}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full xl:w-fit h-fit xl:h-full flex items-start justify-start">
            <div className="relative h-full w-full xl:w-60 flex items-between justify-start flex-col gap-6 rounded-sm border border-cost bg-black p-2">
              <div className="relative w-full h-full flex flex-col gap-6 items-start justify-start overflow-y-scroll">
                <div className="relative w-full h-fit gap-2 flex items-center justify-center flex-col">
                  <div className="relative w-full h-fit flex items-center justify-center text-gray-400 font-bit text-sm">
                    Milestone Video Metrics
                  </div>
                  <div className="relative w-full h-px bg-gray-700"></div>
                </div>
                <Metrics
                  currentMetricsLoading={currentMetricsLoading}
                  playerMetricsLive={playerMetricsLive}
                  //   milestoneMetrics={videoData!}
                  playerMetricsOnChain={videoData!}
                />
              </div>
              <div
                className={`relative w-full h-8 px-1.5 py-1 flex flex-row items-center gap-3 justify-center border border-gray-300 mb-0 rounded-md ${
                  metricsLoading || !playerMetricsLive || !isPlayer
                    ? "opacity-70"
                    : "cursor-pointer active:scale-95"
                }`}
                onClick={() =>
                  !metricsLoading &&
                  playerMetricsLive &&
                  isPlayer &&
                  handleSendMetrics()
                }
              >
                <div
                  className={`relative w-4 h-4 flex items-center justify-center  ${
                    metricsLoading && "animate-spin"
                  }`}
                >
                  {metricsLoading ? (
                    <AiOutlineLoading color={"FBD201"} size={15} />
                  ) : (
                    <Image
                      layout="fill"
                      src={`${INFURA_GATEWAY}/ipfs/QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF`}
                      draggable={false}
                    />
                  )}
                </div>
                <div className="relative w-fit h-fit text-xxs sm:text-sm font-vcr text-gray-300">
                  {"Add Current Metrics"}
                </div>
              </div>
            </div>
          </div>
        </div>
        {relatedQuestsLoading ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit flex flex-row gap-3 sm:flex-nowrap flex-wrap">
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
          <QuestFeed
            router={router}
            interactionsLoading={suggestedInteractionsLoading}
            questInfo={videoInfo}
            questFeed={relatedQuests}
            mirror={suggestedMirror}
            like={suggestedLike}
            setMirrorChoiceOpen={suggestedSetMirrorChoiceOpen}
            mirrorChoiceOpen={suggestedMirrorChoiceOpen}
            setProfileHovers={suggestedSetProfileHovers}
            profileHovers={suggestedProfileHovers}
            dispatch={dispatch}
            lensConnected={lensConnected}
            bookmark={suggestedBookmark}
            followProfile={suggestedFollowerProfile}
            unfollowProfile={suggestedUnfollowProfile}
            getMoreQuestFeed={getMoreRelatedQuests}
          />
        )}
      </div>
    </div>
  );
}

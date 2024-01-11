import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { RootState } from "../../../redux/store";
import { NextRouter } from "next/router";
import useJoin from "@/components/Quest/hooks/useJoin";
import useInteractions from "@/components/Quest/hooks/useInteractions";
import useInteractionsSuggested from "@/components/Common/hooks/useInteractions";
import { useAccount } from "wagmi";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../lib/constants";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import QuestSocial from "@/components/Quest/modules/QuestSocial";
import MilestoneBoards from "@/components/Quest/modules/MilestoneBoards";
import useWho from "@/components/Quest/hooks/useWho";
import { Quest, SocialType } from "@/components/Quest/types/quest.types";
import { Dispatch as KinoraDispatch } from "kinora-sdk";
import QuestBoardSwitch from "@/components/Quest/modules/QuestBoardSwitch";
import Channels from "@/components/Quest/modules/Channels";
import useVideos from "@/components/Quest/hooks/useVideos";
import MainVideo from "@/components/Quest/modules/MainVideo";
import { AiOutlineLoading } from "react-icons/ai";
import Metrics from "@/components/Quest/modules/Metrics";
import VideoInfo from "@/components/Quest/modules/VideoInfo";
import useSuggested from "@/components/Quest/hooks/useSuggested";
import QuestFeed from "@/components/Common/modules/QuestFeed";
import { apolloClient } from "../../../lib/lens/client";
import Head from "next/head";

export default function QuestId({ router }: { router: NextRouter }) {
  const { questId } = router.query;
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
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
    questInfoLoading,
    questInfo,
    setQuestInfo,
    setShowFullText,
    showFullText,
    mainViewer,
    setMainViewer,
    joinLoading,
    handlePlayerJoin,
    socialType,
    setSocialType,
    handleCompleteMilestone,
    completeLoading,
    getQuestInfo,
  } = useJoin(
    questId as string,
    lensConnected,
    dispatch,
    address,
    publicClient,
    kinoraDispatch
  );
  const {
    videoPlaying,
    setVideoPlaying,
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
    chainMetrics,
    milestoneEligible,
    openControls,
    setOpenControls,
  } = useVideos(
    lensConnected,
    dispatch,
    getQuestInfo,
    kinoraDispatch,
    undefined,
    questInfo,
    mainViewer
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
  } = useWho(lensConnected, questId as string, socialType, videoPlaying);
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
    videoPlaying,
    setVideoPlaying,
    setQuestInfo
  );
  const {
    suggestedLoading,
    suggestedQuests,
    suggestedInfo,
    getMoreSuggested,
    setSuggestedQuests,
  } = useSuggested(lensConnected);
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
    suggestedQuests,
    address,
    publicClient,
    (newItems: any) => setSuggestedQuests(newItems as Quest[])
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
          {questInfo?.questMetadata?.title
            ? questInfo?.questMetadata?.title
            : "Quest Log"}
        </title>
        <meta
          name="og:url"
          content={`https://kinora.irrevocable.dev/quest/${questInfo?.publication?.id}`}
        />
        <meta
          name="og:title"
          content={
            questInfo?.questMetadata?.title
              ? questInfo?.questMetadata?.title
              : "Quest Log"
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
          content={`https://kinora.irrevocable.dev/quest/${questInfo?.publication?.id}`}
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
        <div
          className={`relative h-fit xl:h-[38rem] w-full flex flex-col xl:flex-row items-center justify-center xl:justify-between gap-10 xl:min-h-[38rem]`}
        >
          <div
            className={`relative w-full flex flex-col lg:flex-row gap-10 items-start justify-start xl:h-full ${
              videoPlaying
                ? "lg:h-[40rem]"
                : "h-[70rem] lg:h-[30rem]"
            }`}
          >
            <div className="relative w-full lg:w-fit h-full flex items-start justify-start">
              <div className="relative h-full w-full lg:w-80 flex items-start justify-start flex-col gap-6 rounded-sm border border-cost bg-black p-3 max-h-[30rem] overflow-y-scroll lg:max-h-full">
                {videoPlaying && (
                  <VideoInfo
                    router={router}
                    setSocialType={setSocialType}
                    dispatch={dispatch}
                    setMirrorChoiceOpen={setMirrorChoiceOpenMain}
                    mirrorChoiceOpen={mirrorChoiceOpenMain}
                    simpleCollect={simpleCollect}
                    videoPlaying={videoPlaying}
                    mirror={mirror}
                    bookmark={handleBookmark}
                    like={like}
                    mainInteractionsLoading={mainInteractionsLoading}
                    lensConnected={lensConnected}
                  />
                )}
                {!dataLoading ? (
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
                    videoPlaying={videoPlaying}
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
                    questInfo={questInfo}
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
              {mainViewer !== 0 && (
                <div className="relative w-full h-fit flex items-start justify-start">
                  <div className="relative w-full h-10 sm:h-20 flex items-start justify-start gap-10">
                    <Channels
                      videos={questInfo?.milestones[mainViewer - 1]?.videos!}
                      videoPlaying={videoPlaying}
                      setVideoPlaying={setVideoPlaying}
                    />
                  </div>
                </div>
              )}
              <div
                className={`relative w-full h-full flex p-px rounded-md ${
                  questInfoLoading && "animate-pulse"
                }`}
                id="northern"
              >
                <div className="relative w-full h-full flex items-center justify-center rounded-md bg-black">
                  {!questInfoLoading &&
                    (!videoPlaying ? (
                      <Image
                        objectFit="cover"
                        layout="fill"
                        draggable={false}
                        className="relative w-full h-full rounded-md"
                        src={`${INFURA_GATEWAY}/ipfs/${
                          mainViewer == 0
                            ? questInfo?.questMetadata?.cover?.includes(
                                "ipfs://"
                              )
                              ? questInfo?.questMetadata?.cover?.split(
                                  "ipfs://"
                                )?.[1]
                              : questInfo?.questMetadata?.cover
                            : questInfo?.milestones[
                                mainViewer - 1
                              ]?.milestoneMetadata?.cover?.includes("ipfs://")
                            ? questInfo?.milestones[
                                mainViewer - 1
                              ]?.milestoneMetadata?.cover?.split("ipfs://")?.[1]
                            : questInfo?.milestones[mainViewer - 1]
                                ?.milestoneMetadata?.cover
                        }`}
                      />
                    ) : (
                      <MainVideo
                        allVideos={
                          questInfo?.milestones[mainViewer - 1]?.videos!
                        }
                        openControls={openControls}
                        setOpenControls={setOpenControls}
                        height={"25.8rem"}
                        width={"100%"}
                        setVideoPlaying={setVideoPlaying}
                        videoPlaying={videoPlaying}
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
                    ))}
                </div>
              </div>
              <div className="relative w-full h-fit flex items-start justify-start">
                <div className="relative w-full h-10 sm:h-20 flex items-start justify-start gap-10">
                  <MilestoneBoards
                    quest={questInfo?.questMetadata?.cover!}
                    milestones={questInfo?.milestones!}
                    mainViewer={mainViewer}
                    setMainViewer={setMainViewer}
                    setVideoPlaying={setVideoPlaying}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="relative w-full xl:w-fit h-fit xl:h-full flex items-start justify-start">
            {!videoPlaying ? (
              <div className="relative h-fit xl:h-full w-full xl:w-60 flex items-start justify-start flex-col gap-6">
                <div className="relative w-full h-fit flex items-start justify-start flex-col gap-3">
                  {mainViewer !== 0 && (
                    <div className="relative w-full h-fit flex items-start justify-start text-azul font-bit text-lg">
                      {`Milestone ${mainViewer}`}
                    </div>
                  )}
                  <div
                    className={`relative w-fit h-fit flex items-start justify-start font-vcr text-white text-xl break-words ${
                      questInfoLoading && "animate-pulse"
                    }`}
                  >
                    {questInfoLoading
                      ? "Quest Loading..."
                      : mainViewer == 0
                      ? questInfo?.questMetadata?.title
                      : questInfo?.milestones?.[mainViewer - 1]
                          ?.milestoneMetadata?.title}
                  </div>
                  <div
                    className={`relative flex items-start justify-start gap-2 w-full h-fit ${
                      questInfoLoading && "animate-pulse"
                    }`}
                  >
                    <div className="relative w-full flex-1 items-start justify-start font-vcr text-gray-400 text-sm break-words text-overflow-truncate h-[6rem] overflow-y-scroll">
                      {questInfoLoading
                        ? "....".repeat(50)
                        : mainViewer === 0
                        ? questInfo?.questMetadata?.description &&
                          questInfo?.questMetadata?.description?.length > 100 &&
                          !showFullText
                          ? questInfo?.questMetadata?.description?.slice(
                              0,
                              100
                            ) + "..."
                          : questInfo?.questMetadata?.description
                        : questInfo?.milestones?.[mainViewer - 1]
                            ?.milestoneMetadata?.description &&
                          questInfo?.milestones?.[mainViewer - 1]
                            ?.milestoneMetadata?.description?.length > 100 &&
                          !showFullText
                        ? questInfo?.milestones?.[
                            mainViewer - 1
                          ]?.milestoneMetadata?.description?.slice(0, 100) +
                          "..."
                        : questInfo?.milestones?.[mainViewer - 1]
                            ?.milestoneMetadata?.description}
                    </div>
                    {(mainViewer == 0
                      ? questInfo?.questMetadata?.description &&
                        questInfo?.questMetadata?.description?.length > 100
                      : questInfo?.milestones?.[mainViewer - 1]
                          ?.milestoneMetadata?.description &&
                        questInfo?.milestones?.[mainViewer - 1]
                          ?.milestoneMetadata?.description?.length > 100) && (
                      <div
                        className="relative flex items-center justify-center w-fit h-fit cursor-pointer"
                        onClick={() => setShowFullText(!showFullText)}
                      >
                        {showFullText ? (
                          <FaChevronUp color={"4b5563"} size={10} />
                        ) : (
                          <FaChevronDown color={"4b5563"} size={10} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {mainViewer == 0 ? (
                  <div className="relative w-fit h-fit flex">
                    <div className="relative w-full h-fit flex flex-row items-center justify-start text-white font-bit text-xs gap-3">
                      <div className="relative w-4 h-4 flex items-start justify-start ">
                        <Image
                          draggable={false}
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmcopbBnP4dJgRKCHJ7TN7nHFt5wpe6w8VBhztaBXGYvft`}
                        />
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center">{`Max Player Count: ${
                        questInfoLoading
                          ? "0"
                          : Number(questInfo?.maxPlayerCount) ==
                            Number(questInfo?.players?.length)
                          ? "Limit Reached"
                          : `${Number(questInfo?.players?.length)} / ${Number(
                              questInfo?.maxPlayerCount
                            )}`
                      }`}</div>
                    </div>
                  </div>
                ) : (
                  <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xs">
                    <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        Video Count:
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                        {questInfo?.milestones?.[mainViewer - 1]?.videoLength}
                      </div>
                      <div
                        className="relative w-3.5 h-3.5 flex items-center justify-center cursor-pointer active:scale-95"
                        onClick={() => window.open("https://livepeer.studio/")}
                      >
                        <Image
                          draggable={false}
                          layout="fill"
                          src={`${INFURA_GATEWAY}/ipfs/QmVa8AWMYyAfcQAEpbqdUoRSxSkntpH1DEMpdyajZWz4AR`}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <QuestBoardSwitch
                  milestoneEligible={milestoneEligible}
                  handleCompleteMilestone={handleCompleteMilestone}
                  completeLoading={completeLoading}
                  lensConnected={lensConnected}
                  questInfo={questInfo}
                  questInfoLoading={questInfoLoading}
                  router={router}
                  dispatch={dispatch}
                  joinLoading={joinLoading}
                  handlePlayerJoin={handlePlayerJoin}
                  followProfile={followProfile}
                  unfollowProfile={unfollowProfile}
                  mainInteractionsLoading={mainInteractionsLoading}
                  mirror={mirror}
                  like={like}
                  bookmark={handleBookmark}
                  mirrorChoiceOpen={mirrorChoiceOpenMain}
                  setMirrorChoiceOpen={setMirrorChoiceOpenMain}
                  setSocialType={setSocialType}
                  mainViewer={mainViewer}
                />
              </div>
            ) : (
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
                    milestoneMetrics={videoPlaying!}
                    playerMetricsOnChain={chainMetrics!}
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
            )}
          </div>
        </div>
        {suggestedLoading ? (
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
            questInfo={suggestedInfo}
            questFeed={suggestedQuests}
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
            getMoreQuestFeed={getMoreSuggested}
          />
        )}
      </div>
    </div>
  );
}

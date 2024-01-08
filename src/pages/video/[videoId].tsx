import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { RootState } from "../../../redux/store";
import { NextRouter } from "next/router";
import useInteractions from "@/components/Quest/hooks/useInteractions";
import useInteractionsSuggested from "@/components/Common/hooks/useInteractions";
import { useAccount } from "wagmi";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../lib/constants";
import QuestSocial from "@/components/Quest/modules/QuestSocial";
import useWho from "@/components/Quest/hooks/useWho";
import { Quest, SocialType } from "@/components/Quest/types/quest.types";
import MainVideo from "@/components/Quest/modules/MainVideo";
import { AiOutlineLoading } from "react-icons/ai";
import VideoInfo from "@/components/Quest/modules/VideoInfo";
import useSuggested from "@/components/Quest/hooks/useSuggested";
import QuestFeed from "@/components/Common/modules/QuestFeed";
import useVideo from "@/components/Video/hooks/useVideo";
import useVideos from "@/components/Quest/hooks/useVideos";
import Metrics from "@/components/Quest/modules/Metrics";

export default function VideoId({ router }: { router: NextRouter }) {
  const { videoId } = router.query;
  const dispatch = useDispatch();
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
    ),
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
  } = useVideos(lensConnected, dispatch, getVideoDetails, undefined, videoData);
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
    (newItems) => setRelatedQuests(newItems as Quest[])
  );
  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col gap-14"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div className="relative h-[28rem] w-full flex items-center justify-start gap-10 min-h-[28rem]">
          <div className="relative w-fit h-full flex items-start justify-start">
            <div className="relative h-full w-80 flex items-start justify-start flex-col gap-6 rounded-md border border-gray-700 p-3">
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
              <div className="relative w-full h-full flex items-center justify-center rounded-md">
                {videoData && (
                  <MainVideo
                    setVideoPlaying={setVideoData}
                    videoPlaying={videoData}
                    height="100%"
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
          <div className="relative w-fit h-full flex items-start justify-start">
            <div className="relative h-full w-60 flex items-between justify-start flex-col gap-6 rounded-md border border-gray-700 p-2">
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
                <div className="relative w-fit h-fit text-sm font-vcr text-gray-300">
                  {"Add Current Metrics"}
                </div>
              </div>
            </div>
          </div>
        </div>
        {relatedQuestsLoading || dataLoading ? (
          <div className="relative w-full h-fit flex flex-col gap-3">
            <div className="relative w-full h-fit flex flex-row gap-3">
              {Array.from({ length: 4 })?.map((_, index: number) => {
                return (
                  <div
                    key={index}
                    className="relative w-full h-96 flex rounded-sm animate-pulse"
                    id="northern"
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

import { useDispatch, useSelector } from "react-redux";
import { createPublicClient, http } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { RootState } from "../../../redux/store";
import { NextRouter } from "next/router";
import useJoin from "@/components/Quest/hooks/useJoin";
import useInteractions from "@/components/Quest/hooks/useInteractions";
import { useAccount } from "wagmi";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../lib/constants";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import QuestBoxDetails from "@/components/Quest/modules/QuestBoxDetails";
import QuestSocial from "@/components/Quest/modules/QuestSocial";
import MilestoneBoards from "@/components/Quest/modules/MilestoneBoards";
import useWho from "@/components/Quest/hooks/useWho";
import { SocialType } from "@/components/Quest/types/quest.types";

export default function QuestId({ router }: { router: NextRouter }) {
  const { questId } = router.query;
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
  } = useJoin(questId as string, lensConnected);
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
  } = useWho(lensConnected, questId as string, socialType);
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
  } = useInteractions(
    lensConnected,
    dispatch,
    address,
    publicClient,
    postCollectGif,
    setQuestInfo,
    socialType == SocialType.Comments ? reactors : [],
    showComments
  );

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <div
        className="h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col gap-4 min-h-fit"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div className="relative h-[38rem] w-full flex items-center justify-start gap-10">
          <div className="relative w-fit h-full flex items-start justify-start">
            <div className="relative h-full w-80 flex items-start justify-start flex-col gap-6 rounded-md border border-gray-700 p-3">
              {dataLoading ? (
                <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full">
                  <div className="relative w-full h-fit flex items-start justify-start flex-wrap gap-3 overflow-y-scroll animate-pulse">
                    {Array.from({ length: 30 })?.map((_, index: number) => {
                      return (
                        <div
                          id="rainbow"
                          key={index}
                          className="relative h-20 rounded-md w-full flex"
                        ></div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <QuestSocial
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
                  commentLoading={mainInteractionsLoading?.[0]?.comment}
                  setCaretCoord={setCaretCoordMain}
                  caretCoord={caretCoordMain}
                  mentionProfiles={mentionProfilesMain}
                  profilesOpen={profilesOpenMain}
                  setMentionProfiles={setMentionProfilesMain}
                  setProfilesOpen={setProfilesOpenMain}
                  makeComment={mainMakeComment}
                  contentLoading={mainContentLoading}
                  setMakeComment={setMainMakeComment}
                  setContentLoading={setMainContentLoading}
                  postCollectGif={postCollectGif}
                />
              )}
            </div>
          </div>
          <div className="relative w-full h-full flex flex-col gap-4">
            <div
              className={`relative w-full h-full flex p-px rounded-md ${
                questInfoLoading && "animate-pulse"
              }`}
              id="rainbow"
            >
              <div className="relative w-full h-full flex items-center justify-center rounded-md">
                {!questInfoLoading && (
                  <Image
                    objectFit="cover"
                    layout="fill"
                    draggable={false}
                    className="relative w-full h-full rounded-md"
                    src={`${INFURA_GATEWAY}/ipfs/${
                      questInfo?.questMetadata?.cover?.includes("ipfs://")
                        ? questInfo?.questMetadata?.cover?.split("ipfs://")?.[1]
                        : questInfo?.questMetadata?.cover
                    }`}
                  />
                )}
              </div>
            </div>
            <div className="relative w-full h-fit flex items-start justify-start">
              <div className="relative w-full h-20 flex items-start justify-start gap-10">
                <MilestoneBoards
                  quest={questInfo?.questMetadata?.cover!}
                  milestones={questInfo?.milestones!}
                  mainViewer={mainViewer}
                  setMainViewer={setMainViewer}
                />
              </div>
            </div>
          </div>
          <div className="relative w-fit h-full flex items-start justify-start">
            <div className="relative h-full w-60 flex items-start justify-start flex-col gap-6">
              <div className="relative w-full h-fit flex items-start justify-start flex-col gap-3">
                <div
                  className={`relative w-fit h-fit flex items-start justify-start font-vcr text-white text-xl break-words ${
                    questInfoLoading && "animate-pulse"
                  }`}
                >
                  {questInfoLoading
                    ? "Quest Loading..."
                    : questInfo?.questMetadata?.title}
                </div>
                <div
                  className={`relative flex items-start justify-start gap-2 w-full h-fit ${
                    questInfoLoading && "animate-pulse"
                  }`}
                >
                  <div className="relative w-full flex-1 items-start justify-start font-vcr text-gray-400 text-sm break-words text-overflow-truncate h-[6rem] overflow-y-scroll">
                    {questInfoLoading
                      ? "....".repeat(50)
                      : questInfo?.questMetadata?.description &&
                        questInfo?.questMetadata?.description?.length > 100 &&
                        !showFullText
                      ? questInfo?.questMetadata?.description?.slice(0, 100) +
                        "..."
                      : questInfo?.questMetadata?.description}
                  </div>
                  {questInfo?.questMetadata?.description &&
                    questInfo?.questMetadata?.description?.length > 100 && (
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
              <QuestBoxDetails
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

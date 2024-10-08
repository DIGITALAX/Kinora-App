import { FunctionComponent } from "react";
import { Player, QuestSocialProps, SocialType } from "../types/quest.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import Image from "next/legacy/image";
import InfiniteScroll from "react-infinite-scroll-component";
import PostComment from "@/components/Common/modules/PostComment";
import PostQuote from "@/components/Common/modules/PostQuote";
import { Comment, Post, Quote } from "../../../../graphql/generated";
import numeral from "numeral";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const QuestSocial: FunctionComponent<QuestSocialProps> = ({
  socialType,
  questInfo,
  router,
  reactors,
  quoters,
  hasMore,
  hasMoreQuote,
  showMore,
  lensConnected,
  dispatch,
  commentPost,
  setCaretCoord,
  caretCoord,
  profilesOpen,
  mentionProfiles,
  setMentionProfiles,
  setProfilesOpen,
  setMakeComment,
  makeComment,
  contentLoading,
  setContentLoading,
  postCollectGif,
  quoteMirrorSwitch,
  setQuoteMirrorSwitch,
  mirror,
  like,
  simpleCollect,
  interactionsLoading,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
  profileHovers,
  setProfileHovers,
  unfollowProfile,
  followProfile,
  setCommentsOpen,
  commentsOpen,
  setCaretCoordMain,
  setContentLoadingMain,
  setMakeCommentMain,
  setMentionProfilesMain,
  setProfilesOpenMain,
  profilesOpenMain,
  makeCommentMain,
  mentionProfilesMain,
  caretCoordMain,
  contentLoadingMain,
  mainInteractionsLoading,
  videoPlaying,
  t,
}): JSX.Element => {
  switch (socialType) {
    case SocialType.Comments:
      return (
        <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
          <div className="relative w-full h-fit flex flex-col gap-2">
            <PostComment
              t={t}
              setCaretCoord={setCaretCoordMain}
              caretCoord={caretCoordMain}
              profilesOpen={profilesOpenMain?.[0]}
              mentionProfiles={mentionProfilesMain}
              setMentionProfiles={setMentionProfilesMain}
              setProfilesOpen={setProfilesOpenMain}
              lensConnected={lensConnected}
              main={true}
              setMakePostComment={setMakeCommentMain}
              makePostComment={makeCommentMain?.[0]}
              commentPostLoading={mainInteractionsLoading?.[0]?.comment}
              commentPost={commentPost}
              height="8rem"
              imageHeight="1rem"
              imageWidth="1rem"
              contentLoading={contentLoadingMain?.[0]}
              index={0}
              setContentLoading={setContentLoadingMain}
              dispatch={dispatch}
              postCollectGif={postCollectGif}
              id={
                videoPlaying
                  ? videoPlaying?.publication?.id
                  : questInfo?.publication?.id
              }
            />
          </div>
          <div className="relative text-white font-vcr text-lg">
            {t("whoC")}
          </div>
          <div className="relative w-full h-px bg-gray-700"></div>
          {reactors?.length > 0 ? (
            <div className="relative w-full h-full flex flex-col overflow-y-scroll min-h-[30rem]">
              <InfiniteScroll
                hasMore={hasMore}
                dataLength={reactors?.length}
                next={showMore}
                loader={""}
                className="relative w-full h-fit flex flex-col gap-4 overflow-y-scroll items-start justify-start"
              >
                {reactors?.map((reactor: Comment, index: number) => {
                  return (
                    <PostQuote
                      t={t}
                      router={router}
                      key={index}
                      dispatch={dispatch}
                      quote={reactor!}
                      disabled={false}
                      index={index}
                      lensConnected={lensConnected!}
                      mirror={mirror}
                      like={like}
                      setMirrorChoiceOpen={setMirrorChoiceOpen}
                      mirrorChoiceOpen={mirrorChoiceOpen}
                      interactionsLoading={interactionsLoading}
                      profileHovers={profileHovers}
                      setProfileHovers={setProfileHovers}
                      unfollowProfile={unfollowProfile}
                      followProfile={followProfile}
                      simpleCollect={simpleCollect}
                      setCommentsOpen={setCommentsOpen}
                      commentsOpen={commentsOpen}
                      setCaretCoord={setCaretCoord}
                      caretCoord={caretCoord}
                      profilesOpen={profilesOpen}
                      mentionProfiles={mentionProfiles}
                      setMentionProfiles={setMentionProfiles}
                      setProfilesOpen={setProfilesOpen}
                      setMakeComment={setMakeComment}
                      makeComment={makeComment}
                      commentPost={commentPost}
                      contentLoading={contentLoading}
                      setContentLoading={setContentLoading}
                      postCollectGif={postCollectGif}
                    />
                  );
                })}
              </InfiniteScroll>
            </div>
          ) : (
            <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
              {t("noCom")}
            </div>
          )}
        </div>
      );

    case SocialType.Mirrors:
      return (
        <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
          <div className="relative w-full h-fit flex flex-row gap-2 items-center justify-center">
            <div
              className={`relative w-6 h-6 flex items-center justify-center cursor-pointer ${
                !quoteMirrorSwitch && "opacity-50"
              }`}
              onClick={() => setQuoteMirrorSwitch(false)}
            >
              <Image
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3`}
                layout="fill"
              />
            </div>
            <div
              className={`relative w-6 h-6 flex items-center justify-center cursor-pointer ${
                quoteMirrorSwitch && "opacity-50"
              }`}
              onClick={() => setQuoteMirrorSwitch(true)}
            >
              <Image
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM`}
                layout="fill"
              />
            </div>
          </div>
          {quoteMirrorSwitch ? (
            quoters?.length > 0 ? (
              <>
                <div className="relative text-white font-vcr text-lg">
                  {t("whoQ")}
                </div>
                <div className="relative w-full h-px bg-gray-700"></div>
                <div className="relative w-full h-full flex flex-col overflow-y-scroll">
                  <InfiniteScroll
                    hasMore={hasMoreQuote}
                    dataLength={quoters?.length}
                    next={showMore}
                    loader={""}
                    className="relative w-full h-fit flex flex-col gap-4 overflow-y-scroll items-start justify-start"
                  >
                    {quoters?.map((quote: Quote, index: number) => {
                      return (
                        <div
                          className="relative w-full h-fit flex items-start justify-start"
                          key={index}
                        >
                          <PostQuote
                            router={router}
                            dispatch={dispatch}
                            quote={(quote as Post)!}
                            disabled={false}
                            t={t}
                            index={index}
                            mirror={mirror}
                            like={like}
                            lensConnected={lensConnected!}
                            setMirrorChoiceOpen={setMirrorChoiceOpen}
                            mirrorChoiceOpen={mirrorChoiceOpen}
                            interactionsLoading={interactionsLoading}
                            profileHovers={profileHovers}
                            setProfileHovers={setProfileHovers}
                            unfollowProfile={unfollowProfile}
                            followProfile={followProfile}
                            simpleCollect={simpleCollect}
                            setCommentsOpen={setCommentsOpen}
                            commentsOpen={commentsOpen}
                            setCaretCoord={setCaretCoord}
                            caretCoord={caretCoord}
                            profilesOpen={profilesOpen}
                            mentionProfiles={mentionProfiles}
                            setMentionProfiles={setMentionProfiles}
                            setProfilesOpen={setProfilesOpen}
                            setMakeComment={setMakeComment}
                            makeComment={makeComment}
                            commentPost={commentPost}
                            contentLoading={contentLoading}
                            setContentLoading={setContentLoading}
                            postCollectGif={postCollectGif}
                          />
                        </div>
                      );
                    })}
                  </InfiniteScroll>
                </div>
              </>
            ) : (
              <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
                {t("noQ")}
              </div>
            )
          ) : reactors?.length > 0 ? (
            <>
              <div className="relative text-white font-vcr text-lg">
                {t("whoM")}
              </div>
              <div className="relative w-full h-px bg-gray-700"></div>
              <div className="relative w-full h-full flex flex-col overflow-y-scroll">
                <InfiniteScroll
                  hasMore={hasMore}
                  dataLength={reactors?.length}
                  next={showMore}
                  loader={""}
                  className="relative w-full h-fit flex flex-col gap-4 overflow-y-scroll items-start justify-start"
                >
                  {reactors?.map((reactor: any, index: number) => {
                    const account = reactor?.by;

                    const profileImage = createProfilePicture(
                      account?.metadata?.picture
                    );

                    return (
                      <div
                        key={index}
                        className="relative w-full h-fit flex flex-row items-center justify-start font-vcr text-white cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/envoker/${
                              account?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )[1]
                            }`
                          )
                        }
                      >
                        <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                          <div
                            className="relative w-8 h-8 rounded-full p-px items-center justify-center"
                            id="northern"
                          >
                            <div className="relative w-full h-full flex items-center justify-center rounded-full">
                              {profileImage && (
                                <Image
                                  src={profileImage}
                                  objectFit="cover"
                                  layout="fill"
                                  alt="pfp"
                                  className="relative w-fit h-fit rounded-full self-center flex"
                                  draggable={false}
                                />
                              )}
                            </div>
                          </div>
                          <div
                            id="handle"
                            className="relative w-fit h-fit justify-center items-center flex text-xs"
                          >
                            {account?.handle?.suggestedFormatted?.localName}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </InfiniteScroll>
              </div>
            </>
          ) : (
            <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
              {t("noM")}
            </div>
          )}
        </div>
      );

    case SocialType.Reacts:
      return (
        <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
          <div className="relative text-white font-vcr text-lg">
            {t("whoR")}
          </div>
          <div className="relative w-full h-px bg-gray-700"></div>
          {reactors?.length > 0 ? (
            <div className="relative w-full h-full flex flex-col overflow-y-scroll">
              <InfiniteScroll
                hasMore={hasMore}
                dataLength={reactors?.length}
                next={showMore}
                loader={""}
                className="relative w-full h-fit flex flex-col gap-4 overflow-y-scroll items-start justify-start"
              >
                {reactors?.map((reactor: any, index: number) => {
                  const account = reactor?.profile;

                  const profileImage = createProfilePicture(
                    account?.metadata?.picture
                  );

                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-row items-center justify-start font-vcr text-white cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/envoker/${
                            account?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )[1]
                          }`
                        )
                      }
                    >
                      <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                        <div
                          className="relative w-8 h-8 rounded-full p-px items-center justify-center"
                          id="northern"
                        >
                          <div className="relative w-full h-full flex items-center justify-center rounded-full">
                            {profileImage && (
                              <Image
                                src={profileImage}
                                objectFit="cover"
                                layout="fill"
                                alt="pfp"
                                className="relative w-fit h-fit rounded-full self-center flex"
                                draggable={false}
                              />
                            )}
                          </div>
                        </div>
                        <div
                          id="handle"
                          className="relative w-fit h-fit justify-center items-center flex text-xs"
                        >
                          {account?.handle?.suggestedFormatted?.localName}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          ) : (
            <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
              {t("noR")}
            </div>
          )}
        </div>
      );

    default:
      return (
        <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
          <div className="relative text-white font-vcr text-lg">
            {`${
              videoPlaying
                ? t("whoCo")
                : `${t("whoP")} ( ${numeral(
                    questInfo?.players?.length || 0
                  ).format("0a")} )`
            }`}
          </div>
          <div className="relative w-full h-px bg-gray-700"></div>
          {(videoPlaying &&
            Number(videoPlaying?.publication?.stats?.countOpenActions || 0) >
              0) ||
          (questInfo?.players && questInfo?.players?.length > 0) ? (
            <div className="relative w-full h-fit flex items-start justify-start flex-wrap gap-3 overflow-y-scroll">
              {(videoPlaying ? reactors : questInfo?.players)?.map(
                (player: Player, index: number) => {
                  const playerPfp = createProfilePicture(
                    (videoPlaying ? (player as any) : player?.profile)?.metadata
                      ?.picture
                  );

                  return (
                    <div
                      key={index}
                      className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer active:scale-95 p-px"
                      onClick={() =>
                        router.push(
                          `/envoker/${
                            (videoPlaying
                              ? (player as any)
                              : player?.profile
                            )?.handle?.suggestedFormatted?.localName?.split(
                              "@"
                            )?.[1]
                          }`
                        )
                      }
                      id="northern"
                    >
                      <div className="relative w-full h-full flex items-center justify-center rounded-full">
                        {playerPfp && (
                          <Image
                            layout="fill"
                            src={playerPfp}
                            objectFit="cover"
                            className="rounded-full"
                            draggable={false}
                          />
                        )}
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
              {videoPlaying ? t("noCols") : t("noPlays")}
            </div>
          )}
        </div>
      );
  }
};

export default QuestSocial;

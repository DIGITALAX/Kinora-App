import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import InfiniteScroll from "react-infinite-scroll-component";
import numeral from "numeral";
import PostComment from "../../Common/modules/PostComment";
import PostQuote from "../../Common/modules/PostQuote";
import { QuestSocialProps, SocialType } from "../types/video.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
import { Account } from "@lens-protocol/client";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { Player } from "../../Common/types/common.types";
import useComment from "../../Common/hooks/useComment";
import { ModalContext } from "@/app/providers";

const QuestSocial: FunctionComponent<QuestSocialProps> = ({
  socialType,
  questInfo,
  reactors,
  quoters,
  hasMore,
  hasMoreQuote,
  showMore,
  videoPlaying,
  dict,
  mirrorQuote,
  setMirrorQuote,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const {
    searchProfiles,
    setProfilesOpen,
    profilesFound,
    profilesOpen,
    commentLoading,
    setCommentDetails,
    commentDetails,
    textElement,
    caretCoord,
    comment,
  } = useComment();

  switch (socialType) {
    case SocialType.Comments:
      return (
        <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
          <div className="relative w-full h-fit flex flex-col gap-2">
            <PostComment
              dict={dict}
              commentDetails={commentDetails}
              searchProfiles={searchProfiles}
              caretCoord={caretCoord}
              comment={comment}
              commentLoading={commentLoading}
              textElement={textElement}
              setCommentDetails={setCommentDetails}
              profilesOpen={profilesOpen}
              mentionProfiles={profilesFound}
              setProfilesOpen={setProfilesOpen}
              height="8rem"
              imageHeight="1rem"
              imageWidth="1rem"
              id={String(
                videoPlaying ? videoPlaying?.post?.id : questInfo?.post?.id
              )}
            />
          </div>
          <div className="relative text-white font-vcr text-lg">
            {dict?.whoC}
          </div>
          <div className="relative w-full h-px bg-gray-700"></div>
          {quoters?.length > 0 ? (
            <div className="relative w-full h-full flex flex-col overflow-y-scroll min-h-[30rem]">
              <InfiniteScroll
                hasMore={hasMoreQuote}
                dataLength={quoters?.length}
                next={showMore}
                loader={""}
                className="relative w-full h-fit flex flex-col gap-4 overflow-y-scroll items-start justify-start"
              >
                {quoters?.map((quote, index: number) => {
                  return (
                    <PostQuote
                      dict={dict}
                      key={index}
                      quote={quote}
                      disabled={false}
                    />
                  );
                })}
              </InfiniteScroll>
            </div>
          ) : (
            <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
              {dict?.noCom}
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
                !mirrorQuote && "opacity-50"
              }`}
              onClick={() => setMirrorQuote(false)}
            >
              <Image
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3`}
                layout="fill"
              />
            </div>
            <div
              className={`relative w-6 h-6 flex items-center justify-center cursor-pointer ${
                mirrorQuote && "opacity-50"
              }`}
              onClick={() => setMirrorQuote(true)}
            >
              <Image
                draggable={false}
                src={`${INFURA_GATEWAY}/ipfs/QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM`}
                layout="fill"
              />
            </div>
          </div>
          {mirrorQuote ? (
            quoters?.length > 0 ? (
              <>
                <div className="relative text-white font-vcr text-lg">
                  {dict?.whoQ}
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
                    {quoters?.map((quote, index: number) => {
                      return (
                        <div
                          className="relative w-full h-fit flex items-start justify-start"
                          key={index}
                        >
                          <PostQuote
                            quote={quote}
                            disabled={false}
                            dict={dict}
                          />
                        </div>
                      );
                    })}
                  </InfiniteScroll>
                </div>
              </>
            ) : (
              <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
                {dict?.noQ}
              </div>
            )
          ) : reactors?.length > 0 ? (
            <>
              <div className="relative text-white font-vcr text-lg">
                {dict?.whoM}
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
                  {reactors?.map((reactor, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative w-full h-fit flex flex-row items-center justify-start font-vcr text-white cursor-pointer"
                        onClick={() => {
                          context?.setRouterChangeLoading(true);

                          router.push(
                            `/envoker/${reactor?.username?.localName}`
                          );
                        }}
                      >
                        <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                          <div
                            className="relative w-8 h-8 rounded-full p-px items-center justify-center"
                            id="northern"
                          >
                            <div className="relative w-full h-full flex items-center justify-center rounded-full">
                              <Image
                                src={handleProfilePicture(
                                  reactor?.metadata?.picture
                                )}
                                objectFit="cover"
                                layout="fill"
                                alt="pfp"
                                className="relative w-fit h-fit rounded-full self-center flex"
                                draggable={false}
                              />
                            </div>
                          </div>
                          <div
                            id="handle"
                            className="relative w-fit h-fit justify-center items-center flex text-xs"
                          >
                            {reactor?.username?.localName}
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
              {dict?.noM}
            </div>
          )}
        </div>
      );

    case SocialType.Reacts:
      return (
        <div className="relative flex items-start justify-start flex-col gap-5 h-full w-full overflow-y-scroll">
          <div className="relative text-white font-vcr text-lg">
            {dict?.whoR}
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
                {reactors?.map((reactor, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-fit flex flex-row items-center justify-start font-vcr text-white cursor-pointer"
                      onClick={() => {
                        context?.setRouterChangeLoading(true);

                        router.push(`/envoker/${reactor?.username?.localName}`);
                      }}
                    >
                      <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                        <div
                          className="relative w-8 h-8 rounded-full p-px items-center justify-center"
                          id="northern"
                        >
                          <div className="relative w-full h-full flex items-center justify-center rounded-full">
                            <Image
                              src={handleProfilePicture(
                                reactor?.metadata?.picture
                              )}
                              objectFit="cover"
                              layout="fill"
                              alt="pfp"
                              className="relative w-fit h-fit rounded-full self-center flex"
                              draggable={false}
                            />
                          </div>
                        </div>
                        <div
                          id="handle"
                          className="relative w-fit h-fit justify-center items-center flex text-xs"
                        >
                          {reactor?.username?.localName}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          ) : (
            <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
              {dict?.noR}
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
                ? dict?.whoCo
                : `${dict?.whoP} ( ${numeral(
                    questInfo?.players?.length || 0
                  ).format("0a")} )`
            }`}
          </div>
          <div className="relative w-full h-px bg-gray-700"></div>
          {(videoPlaying &&
            Number(videoPlaying?.post?.stats?.collects || 0) > 0) ||
          (questInfo?.players && questInfo?.players?.length > 0) ? (
            <div className="relative w-full h-fit flex items-start justify-start flex-wrap gap-3 overflow-y-scroll">
              {(videoPlaying ? reactors : questInfo?.players)?.map(
                (player, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer active:scale-95 p-px"
                      onClick={() => {
                        context?.setRouterChangeLoading(true);

                        router.push(
                          `/envoker/${
                            (player as Account)?.username
                              ? (player as Account)?.username?.localName
                              : (player as Player)?.profile?.username?.localName
                          }`
                        );
                      }}
                      id="northern"
                    >
                      <div className="relative w-full h-full flex items-center justify-center rounded-full">
                        <Image
                          layout="fill"
                          src={handleProfilePicture(
                            (player as Account)?.username
                              ? (player as Account)?.metadata?.picture
                              : (player as Player)?.profile?.metadata?.picture
                          )}
                          objectFit="cover"
                          className="rounded-full"
                          draggable={false}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <div className="realtive w-full text-center h-fit flex items-center justify-center font-bit text-gray-500 text-sm break-words">
              {videoPlaying ? dict?.noCols : dict?.noPlays}
            </div>
          )}
        </div>
      );
  }
};

export default QuestSocial;

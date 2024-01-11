import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import numeral from "numeral";
import { setQuote } from "../../../../redux/reducers/quoteSlice";
import { SocialType, VideoInfoProps } from "../types/quest.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import moment from "moment";
import { VideoMetadataV3 } from "../../../../graphql/generated";

const VideoInfo: FunctionComponent<VideoInfoProps> = ({
  videoPlaying,
  mirror,
  like,
  bookmark,
  simpleCollect,
  lensConnected,
  mainInteractionsLoading,
  setSocialType,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  dispatch,
  router,
}): JSX.Element => {
  const pfp = createProfilePicture(
    videoPlaying?.publication?.by?.metadata?.picture
  );
  return (
    <div className="relative flex flex-col w-full h-fit gap-8">
      <div className="relative w-full h-fit flex gap-5 flex-row justify-between">
        <div className="relative w-fit ml-0 h-fit items-center flex flex-row gap-2">
          {!router?.asPath?.includes("/video/") && (
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div
                className="relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() =>
                  router.push(`/video/${videoPlaying?.publication?.id}`)
                }
              >
                <Image
                  layout="fill"
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/QmRkAoLMAh2hxZfh5WvaxuxRUMhs285umdJWuvLa5wt6Ht`}
                />
              </div>
            </div>
          )}
          <div
            className="relative w-fit h-fit flex items-center justify-center ml-auto p-px rounded-full"
            id="northern"
          >
            <div
              className="relative flex items-center justify-center rounded-full  w-6 h-6 cursor-pointer"
              onClick={() =>
                router.push(
                  `/envoker/${
                    videoPlaying?.publication?.by?.handle?.suggestedFormatted?.localName?.split(
                      "@"
                    )?.[1]
                  }`
                )
              }
            >
              {pfp && (
                <Image
                  layout="fill"
                  src={pfp}
                  draggable={false}
                  objectFit="cover"
                  className="rounded-full"
                />
              )}
            </div>
          </div>
          <div className="relative flex flex-col gap-px items-start justify-center font-bit">
            <div className="relative w-fit h-fit flex items-center justify-center text-white text-xs break-words">
              {
                videoPlaying?.publication?.by?.handle?.suggestedFormatted
                  ?.localName
              }
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-xxs text-gray-600 break-words">
              {videoPlaying?.publication?.by?.handle?.localName}
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit flex font-bit text-gray-600 items-center justify-center text-xxs mr-0">
          {videoPlaying?.publication?.createdAt &&
            moment(videoPlaying?.publication?.createdAt).fromNow()}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col gap-1.5">
        <div className="relative w-full h-fit items-start justify-start text-white font-bit text-base">
          {(videoPlaying?.publication?.metadata as VideoMetadataV3)?.title
            ?.length > 20
            ? (
                videoPlaying?.publication?.metadata as VideoMetadataV3
              )?.title?.slice(0, 20) + "..."
            : (videoPlaying?.publication?.metadata as VideoMetadataV3)?.title}
        </div>
        <div className="relative w-full h-fit max-h-[6rem] overflow-y-scroll items-start justify-start text-gray-600 font-vcr text-base">
          {(videoPlaying?.publication?.metadata as VideoMetadataV3)?.content}
        </div>
      </div>
      <div className="relative w-full h-fit flex items-start justify-between flex-row flex-wrap gap-4">
        {[
          {
            image: "QmbRSySsuGtwTvxmNtpEm2poV8FbQ46vPWBNYTd2eewCdj",
            amount: videoPlaying?.publication?.stats?.countOpenActions || 0,
            title: "Collect",
            reacted:
              videoPlaying?.publication?.operations?.hasActed
                ?.isFinalisedOnchain || false,
            function: () => simpleCollect(videoPlaying?.publication!, true),
            loader: mainInteractionsLoading?.[0]?.collect,
            otherFunction: () => setSocialType(SocialType.Players),
          },
          {
            image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
            amount: videoPlaying?.publication?.stats?.reactions || 0,
            title: "Like",
            reacted: videoPlaying?.publication?.operations?.hasReacted || false,
            function: () =>
              like(
                videoPlaying?.publication?.id,
                videoPlaying?.publication?.operations?.hasReacted!,
                true
              ),
            loader: mainInteractionsLoading?.[0]?.like,
            otherFunction: () => setSocialType(SocialType.Reacts),
          },
          {
            image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            amount:
              (videoPlaying?.publication?.stats?.mirrors || 0) +
              (videoPlaying?.publication?.stats?.quotes || 0),
            title: "Mirror",
            reacted:
              videoPlaying?.publication?.operations?.hasMirrored ||
              videoPlaying?.publication?.operations?.hasQuoted ||
              false,
            function: () => setMirrorChoiceOpen(!mirrorChoiceOpen),
            loader: false,
            otherFunction: () => setSocialType(SocialType.Mirrors),
          },
          {
            image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
            amount: videoPlaying?.publication?.stats?.comments || 0,
            title: "Comment",
            reacted: false,
            function: () => setSocialType(SocialType.Comments),
            loader: false,
            otherFunction: () => setSocialType(SocialType.Comments),
          },
          {
            image: "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
            amount: videoPlaying?.publication?.stats?.bookmarks || 0,
            title: "Bookmark",
            reacted:
              videoPlaying?.publication?.operations?.hasBookmarked || false,
            function: () =>
              bookmark(
                videoPlaying?.publication?.id,
                videoPlaying?.publication?.operations?.hasBookmarked!,
                0
              ),
            loader: mainInteractionsLoading?.[0]?.bookmark,
            otherFunction: () => {},
          },
        ]?.map(
          (
            item: {
              image: string;
              amount: number;
              title: string;
              reacted: boolean;
              function: () => void;
              loader: boolean;
              otherFunction: () => void;
            },
            index: number
          ) => {
            return (
              <div
                key={index}
                className="relative w-fit h-fit flex items-center justify-center flex-row gap-2 font-bit text-white text-xs"
              >
                <div
                  key={item?.title}
                  className={`relative w-4 h-4 flex items-center justify-center ${
                    item?.reacted && "hue-rotate-60"
                  } ${
                    !lensConnected?.id
                      ? "opacity-80"
                      : "cursor-pointer active:scale-95"
                  } ${item?.loader && "animate-spin"}`}
                  onClick={() => item.function()}
                >
                  {item?.loader ? (
                    <AiOutlineLoading color={"white"} size={15} />
                  ) : (
                    <Image
                      layout="fill"
                      draggable={false}
                      src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                    />
                  )}
                </div>
                <div
                  className="relative flex w-fit h-fit items-center justify-center cursor-pointer active:scale-95"
                  onClick={() => item.otherFunction()}
                >
                  {numeral(item?.amount).format("0a")}
                </div>
              </div>
            );
          }
        )}
      </div>
      {mirrorChoiceOpen && (
        <div
          className="absolute w-fit h-fit rounded-md bottom-3 left-24 flex bg-nave p-px"
          id="northern"
        >
          <div className="relative w-fit h-fit flex flex-row gap-1.5 p-1 bg-nave rounded-md">
            {[
              {
                icon: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                function: () => mirror(videoPlaying?.publication?.id, true),
                title: "Mirror Quest",
                reacted:
                  videoPlaying?.publication?.operations?.hasMirrored || false,
                loader: mainInteractionsLoading?.[0]?.mirror || false,
                width: "1rem",
                height: "0.8rem",
              },
              {
                icon: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                function: () =>
                  dispatch(
                    setQuote({
                      actionOpen: true,
                      actionPublication: videoPlaying?.publication,
                    })
                  ),
                title: "Quote Quest",
                reacted:
                  videoPlaying?.publication?.operations?.hasQuoted || false,
                loader: false,
                width: "0.8rem",
                height: "0.8rem",
              },
            ]?.map(
              (
                item: {
                  icon: string;
                  function: () => void;
                  title: string;
                  reacted: boolean;
                  loader: boolean;
                  width: string;
                  height: string;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className={`relative hover:opacity-80 w-7 p-1 h-6 rounded-full flex cursor-pointer active:scale-95 items-center justify-center ${
                      item?.reacted && "hue-rotate-60"
                    } ${
                      !lensConnected?.id
                        ? "opacity-80"
                        : "cursor-pointer active:scale-95"
                    }`}
                    title={item.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.function();
                    }}
                  >
                    {item?.loader ? (
                      <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                        <AiOutlineLoading size={15} color={"white"} />
                      </div>
                    ) : (
                      <div
                        className="relative flex items-center justify-center"
                        style={{
                          width: item.width,
                          height: item.height,
                        }}
                      >
                        <Image
                          draggable={false}
                          layout="fill"
                          objectFit="contain"
                          src={`${INFURA_GATEWAY}/ipfs/${item.icon}`}
                        />
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoInfo;

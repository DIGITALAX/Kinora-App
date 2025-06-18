import Image from "next/legacy/image";
import { FunctionComponent, JSX, useContext } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import numeral from "numeral";
import moment from "moment";
import { usePathname, useRouter } from "next/navigation";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { VideoMetadata } from "@lens-protocol/client";
import { ModalContext } from "@/app/providers";
import useInteractions from "../../Common/hooks/useInteractions";
import { SocialType, VideoInfoProps } from "../types/video.types";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const VideoInfo: FunctionComponent<VideoInfoProps> = ({
  videoPlaying,
  dict,
  setSocialType,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  const path = usePathname();
  const {
    openMirrorChoice,
    setOpenMirrorChoice,
    interactionsLoading,
    like,
    collect,
    handleBookmark,
    mirror,
    interactions,
  } = useInteractions(dict, videoPlaying?.post!);
  return (
    <div className="relative flex flex-col w-full h-fit gap-8">
      <div className="relative w-full h-fit flex gap-5 flex-row justify-between">
        <div className="relative w-fit ml-0 h-fit items-center flex flex-row gap-2">
          {!path?.includes("/video/") && (
            <div className="relative w-fit h-fit flex items-center justify-center">
              <div
                className="relative w-4 h-4 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => {
                  context?.setRouterChangeLoading(true);
                  router.push(`/video/${videoPlaying?.post?.id}`);
                }}
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
              onClick={() => {
                context?.setRouterChangeLoading(true);

                router.push(
                  `/envoker/${videoPlaying?.post?.author?.username?.localName}`
                );
              }}
            >
              <Image
                layout="fill"
                src={handleProfilePicture(
                  videoPlaying?.post?.author?.metadata?.picture
                )}
                draggable={false}
                objectFit="cover"
                className="rounded-full"
              />
            </div>
          </div>
          <div className="relative flex flex-col gap-px items-start justify-center font-bit">
            <div className="relative w-fit h-fit flex items-center justify-center text-white text-xs break-words">
              {videoPlaying?.post?.author?.username?.value}
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-xxs text-gray-600 break-words">
              {videoPlaying?.post?.author?.username?.localName}
            </div>
          </div>
        </div>
        <div className="relative w-fit h-fit flex font-bit text-gray-600 items-center justify-center text-xxs mr-0">
          {videoPlaying?.post?.timestamp &&
            moment(videoPlaying?.post?.timestamp).fromNow()}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col gap-1.5">
        <div className="relative w-full h-fit items-start justify-start text-white font-bit text-base">
          {Number(
            (videoPlaying?.post?.metadata as VideoMetadata)?.title?.length
          ) > 20
            ? (videoPlaying?.post?.metadata as VideoMetadata)?.title?.slice(
                0,
                20
              ) + "..."
            : (videoPlaying?.post?.metadata as VideoMetadata)?.title}
        </div>
        <div className="relative w-full h-fit max-h-[3rem] overflow-y-scroll items-start justify-start text-gray-600 font-vcr text-base">
          {(videoPlaying?.post?.metadata as VideoMetadata)?.content}
        </div>
      </div>
      <div className="relative w-full h-fit flex items-start justify-between flex-row flex-wrap gap-4">
        {[
          {
            image: "QmbRSySsuGtwTvxmNtpEm2poV8FbQ46vPWBNYTd2eewCdj",
            amount: interactions?.collects || 0,
            title: dict?.cols,
            reacted: interactions?.hasSimpleCollected || false,
            function: () => collect(),
            loader: interactionsLoading?.collect,
            otherFunction: () => setSocialType(SocialType.Players),
          },
          {
            image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
            amount: interactions?.upvotes || 0,
            title: dict?.like,
            reacted: interactions?.hasUpVoted || false,
            function: () => like(),
            loader: interactionsLoading?.like,
            otherFunction: () => setSocialType(SocialType.Reacts),
          },
          {
            image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
            amount: (interactions?.reposts || 0) + (interactions?.quotes || 0),
            title: dict?.mir,
            reacted:
              interactions?.hasReposted || interactions?.hasQuoted || false,
            function: () => setOpenMirrorChoice((prev) => !prev),
            loader: false,
            otherFunction: () => setSocialType(SocialType.Mirrors),
          },
          {
            image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
            amount: videoPlaying?.post?.stats?.comments || 0,
            title: dict?.como,
            reacted: false,
            function: () => setSocialType(SocialType.Comments),
            loader: false,
            otherFunction: () => setSocialType(SocialType.Comments),
          },
          {
            image: "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
            amount: interactions?.bookmarks || 0,
            title: dict?.book,
            reacted: interactions?.hasBookmarked || false,
            function: () => handleBookmark(),
            loader: interactionsLoading?.bookmark,
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
                    !context?.lensConectado?.profile
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
      {openMirrorChoice && (
        <div
          className="absolute w-fit h-fit rounded-md bottom-10 md:bottom-3 left-24 flex bg-nave p-px"
          id="northern"
        >
          <div className="relative w-fit h-fit flex flex-row gap-1.5 p-1 bg-nave rounded-md">
            {[
              {
                icon: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                function: () => mirror(),
                title: dict?.mirQ,
                reacted: interactions?.hasReposted || false,
                loader: interactionsLoading?.mirror || false,
                width: "1rem",
                height: "0.8rem",
              },
              {
                icon: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                function: () =>
                  context?.setQuote({
                    open: true,
                    post: videoPlaying?.post,
                  }),
                title: dict?.quQ,
                reacted: interactions?.hasQuoted || false,
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
                      !context?.lensConectado?.profile
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

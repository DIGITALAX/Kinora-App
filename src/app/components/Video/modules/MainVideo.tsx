import { FunctionComponent, JSX, SetStateAction } from "react";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { Player } from "@livepeer/react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import formatDuration from "@/app/lib/helpers/formatDuration";
import useVideoControls from "../hooks/useVideoControls";
import { MainVideoProps } from "../types/video.types";
import { Video } from "../../Common/types/common.types";
import { VideoMetadata } from "@lens-protocol/client";

const MainVideo: FunctionComponent<MainVideoProps> = ({
  videoPlaying,
  setVideoPlaying,
  allVideos,
  height,
  width,
}): JSX.Element => {
  const {
    openControls,
    setOpenControls,
    duration,
    setDuration,
    seek,
    setSeek,
    setVolumeOpen,
    volumeOpen,
    playing,
    setPlaying,
    volume,
    setVolume,
  } = useVideoControls();
  return (
    <>
      <div
        id={videoPlaying?.post?.id?.toString()}
        style={{
          borderRadius: "0.375rem",
          objectFit: "cover",
          width,
          height: "100%",
          overflow: "hidden",
          maxHeight: height,
          position: "relative",
          justifyContent: "between",
          alignItems: "center",
          display: "flex",
        }}
      >
        <KinoraPlayerWrapper
          parentId={videoPlaying?.post?.id?.toString()!}
          key={videoPlaying?.postId.toString()}
          customControls={true}
          play={playing}
          postId={videoPlaying?.post?.id}
          styles={{
            borderRadius: "0.375rem",
            objectFit: "cover",
            width: "100%",
            height: "100%",
            position: "relative",
            justifyContent: "center",
            alignItems: "center",
            // display: "flex",
          }}
          onEnded={() => {
            setPlaying(false);
            setSeek(0);
          }}
          onTimeUpdate={(e) => setSeek((e.target as any)?.currentTime)}
          onCanPlay={(e) => setDuration((e.target as any)?.duration)}
          fillWidthHeight
          volume={{
            id: Math.random() * 0.5,
            level: volume,
          }}
          seekTo={{
            id: Math.random() * 0.5,
            time: seek,
          }}
        >
          {(setMediaElement: (node: HTMLVideoElement) => void) => (
            <Player
              mediaElementRef={setMediaElement}
              playbackId={videoPlaying?.playerId}
              src={
                // videoPlaying?.playerId == "7e04dq739p9pp8mz"
                //   ?
                //    ENSHIT_LINK
                // :
                (videoPlaying?.post?.metadata as VideoMetadata)?.video?.item ||
                (videoPlaying?.post?.metadata as VideoMetadata)?.video?.item
              }
              showLoadingSpinner={false}
              objectFit="cover"
              // autoUrlUpload={{
              //   fallback: true,
              //   ipfsGateway: INFURA_GATEWAY,
              // }}
            />
          )}
        </KinoraPlayerWrapper>
      </div>
      <div className="absolute w-full bg-black/70 h-fit sm:h-8 flex items-center justify-center sm:justify-between gap-3 sm:gap-7 sm:flex-nowrap flex-wrap flex-row z-10 left-0 bottom-0 sm:py-auto py-1 galaxy:py-2 sm:px-2 rounded-b-md">
        <div className="flex flex-row gap-1.5 items-center justify-center ml-0 sm:hidden">
          <div
            className="relative w-4 h-3 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => setOpenControls(!openControls)}
          >
            <Image
              src={`${INFURA_GATEWAY}/ipfs/${
                openControls
                  ? "QmNR25iXcfzH4wDxSMGrJRp2seHFLbk9dDpXi2MRfpiJTz"
                  : "Qmf27dpbinvX1Qe1p82WEw2zYRcuR1cYPyCrNwBpXSwz2C"
              }`}
              draggable={false}
              layout="fill"
            />
          </div>
        </div>
        {(openControls ||
          (typeof window !== "undefined" && window.innerWidth > 684)) && (
          <>
            <div className="flex flex-row gap-1.5 items-center justify-center sm:ml-0 ">
              <div
                className="relative w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => setVolumeOpen(!volumeOpen)}
              >
                <Image
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/QmYjgnnGnLQ8Y3cQvuJcMFcbJ1yotUGUA2L2ksGC3ZxZHR`}
                  layout="fill"
                />
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center">
                <div className="w-fit h-fit flex items-center justify-center font-vcr text-white text-xxs sm:text-sm">
                  <span className="text-rosa">{formatDuration(seek || 0)}</span>
                  /
                  <span className="text-light">
                    {formatDuration(duration || 0)}
                  </span>
                </div>
              </div>
            </div>
            {volumeOpen && (
              <input
                className="absolute flex w-40 h-fit bottom-20 sm:bottom-10 z-20"
                type="range"
                max={1}
                min={0}
                step={0.01}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
            )}
            <div
              className="relative w-full h-2 flex items-center justify-center bg-white/40 rounded-full cursor-pointer"
              onClick={(e) => {
                const progressRect = (
                  e as any
                ).currentTarget.getBoundingClientRect();
                const seekPosition =
                  ((e as any).clientX - progressRect.left) / progressRect.width;
                setSeek(seekPosition * duration);
              }}
            >
              <div
                className="absolute flex left-0 h-full bg-white/80 rounded-sm"
                style={{
                  width: `${((seek || 0) / (duration || 0)) * 100}%`,
                }}
              ></div>
            </div>

            <div className="flex flex-row gap-2 items-center justify-center mr-0">
              {allVideos && (
                <div
                  className="relative w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center cursor-pointer active:scale-95"
                  onClick={() => {
                    const index = allVideos?.findIndex(
                      (video) => video?.postId == videoPlaying?.post?.id
                    );

                    (setVideoPlaying as (e: SetStateAction<Video>) => void)(
                      allVideos?.[index > 0 ? index - 1 : allVideos?.length - 1]
                    );
                    setSeek(0);
                    setPlaying(false);
                  }}
                >
                  <Image
                    draggable={false}
                    src={`${INFURA_GATEWAY}/ipfs/QmXHiztRHRPx8rhBvyFtVhSwTktvA6BE394yd9jCSgXiDT`}
                    layout="fill"
                  />
                </div>
              )}
              <div
                className="relative w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => {
                  setSeek(0);
                  setPlaying(false);
                }}
              >
                <Image
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/QmNQVd2ZbGMRydePz5cq8Z2UFbvqMHiq7xau8rDKbctkbX`}
                  layout="fill"
                />
              </div>

              <div
                className="relative w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => setPlaying(true)}
              >
                <Image
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/QmfHJQSZkUeCDL6ALH7VNksTji2BNZJjRoXn6kTKDagEt1`}
                  layout="fill"
                />
              </div>
              <div
                className="relative w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => setPlaying(false)}
              >
                <Image
                  draggable={false}
                  src={`${INFURA_GATEWAY}/ipfs/QmWPf6tx77UXfP7ZdjSatVDtyYew9Xw153qadfqyW5fZUo`}
                  layout="fill"
                />
              </div>
              {allVideos && (
                <div
                  className="relative w-3 h-3 sm:w-5 sm:h-5 flex items-center justify-center cursor-pointer active:scale-95"
                  onClick={() => {
                    const index = allVideos?.findIndex(
                      (video) => video?.postId == videoPlaying?.post?.id
                    );

                    (setVideoPlaying as (e: SetStateAction<Video>) => void)(
                      allVideos?.[index < allVideos?.length - 1 ? index + 1 : 0]
                    );
                    setSeek(0);
                    setPlaying(false);
                  }}
                >
                  <Image
                    draggable={false}
                    src={`${INFURA_GATEWAY}/ipfs/QmQVzZhwASAspnT9xfGGrB3tybQrzgDAggUjmz6Ti6v1vn`}
                    layout="fill"
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MainVideo;

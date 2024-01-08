import { FunctionComponent, SetStateAction } from "react";
import { MainVideoProps, Video } from "../types/quest.types";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { Player } from "@livepeer/react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import Image from "next/legacy/image";
import { VideoMetadataV3 } from "../../../../graphql/generated";
import formatDuration from "../../../../lib/helpers/formatDuration";

const MainVideo: FunctionComponent<MainVideoProps> = ({
  videoPlaying,
  playing,
  setPlaying,
  setVolume,
  volume,
  seek,
  volumeOpen,
  setVolumeOpen,
  duration,
  setDuration,
  setSeek,
  setVideoPlaying,
  allVideos,
  height,
}): JSX.Element => {
  return (
    <div
      id={(
        Number(videoPlaying?.pubId) + Number(videoPlaying?.profileId)
      ).toString()}
      style={{
        borderRadius: "0.375rem",
        objectFit: "cover",
        width: "100%",
        height,
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
      }}
    >
      <KinoraPlayerWrapper
        parentId={(
          Number(videoPlaying?.pubId) + Number(videoPlaying?.profileId)
        ).toString()}
        key={(
          Number(videoPlaying?.pubId) + Number(videoPlaying?.profileId)
        ).toString()}
        customControls={true}
        play={playing}
        postId={videoPlaying?.publication?.id}
        styles={{
          borderRadius: "0.375rem",
          objectFit: "cover",
          width: "100%",
          height: "100%",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
        }}
        onEnded={() => setPlaying(false)}
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
            // playbackId={videoPlaying?.playerId}
            src={`${INFURA_GATEWAY}/ipfs/${
              (
                videoPlaying?.publication?.metadata as VideoMetadataV3
              )?.asset?.video?.raw?.uri?.split("ipfs://")?.[1]
            }`}
            showLoadingSpinner={false}
            objectFit="cover"
            autoUrlUpload={{
              fallback: true,
              ipfsGateway: INFURA_GATEWAY,
            }}
          />
        )}
      </KinoraPlayerWrapper>
      <div className="absolute w-full bg-black/70 h-8 flex items-center justify-between gap-7 flex-row z-10 left-0 bottom-0 px-2 rounded-b-md">
        <div className="flex flex-row gap-1.5 items-center justify-center ml-0">
          <div
            className="relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => setVolumeOpen(!volumeOpen)}
          >
            <Image
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/QmYjgnnGnLQ8Y3cQvuJcMFcbJ1yotUGUA2L2ksGC3ZxZHR`}
              layout="fill"
            />
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center">
            <div className="w-fit h-fit flex items-center justify-center font-vcr text-white text-sm">
              <span className="text-rosa">{formatDuration(seek || 0)}</span>/
              <span className="text-light">
                {formatDuration(duration || 0)}
              </span>
            </div>
          </div>
        </div>
        {volumeOpen && (
          <input
            className="absolute w-40 h-fit bottom-10"
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
            className="absolute left-0 h-full bg-white/80 rounded-sm"
            style={{
              width: `${((seek || 0) / (duration || 0)) * 100}%`,
            }}
          ></div>
        </div>
        <div className="flex flex-row gap-2 items-center justify-center mr-0">
          {allVideos && (
            <div
              className="relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() => {
                const index = allVideos?.findIndex(
                  (video) => video?.pubId == videoPlaying?.pubId
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
            className="relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95"
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
            className="relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => setPlaying(true)}
          >
            <Image
              draggable={false}
              src={`${INFURA_GATEWAY}/ipfs/QmfHJQSZkUeCDL6ALH7VNksTji2BNZJjRoXn6kTKDagEt1`}
              layout="fill"
            />
          </div>
          <div
            className="relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95"
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
              className="relative w-5 h-5 flex items-center justify-center cursor-pointer active:scale-95"
              onClick={() => {
                const index = allVideos?.findIndex(
                  (video) => video?.pubId == videoPlaying?.pubId
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
      </div>
    </div>
  );
};

export default MainVideo;

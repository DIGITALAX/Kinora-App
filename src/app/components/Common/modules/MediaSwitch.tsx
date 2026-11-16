import Image from "next/legacy/image";
import { FunctionComponent, JSX, useState } from "react";
import { MediaProps } from "../types/common.types";
import Waveform from "./Waveform";
import { KinoraPlayerWrapper } from "kinora-sdk";
import NativeVideo from "./NativeVideo";
import getVideoSrc from "@/app/lib/helpers/getVideoSrc";

const MediaSwitch: FunctionComponent<MediaProps> = ({
  type,
  srcUrl,
  srcCover,
  classNameVideo,
  classNameImage,
  classNameAudio,
  objectFit,
  hidden,
  autoPlay,
  postId,
}): JSX.Element => {
  const [videoInfo, setVideoInfo] = useState<{
    loading: boolean;
    currentTime: number;
    duration: number;
    isPlaying: boolean;
  }>({
    loading: false,
    currentTime: 0,
    duration: 0,
    isPlaying: false,
  });

  switch (type?.toLowerCase()) {
    case "video":
      const keyValueVideo = srcUrl;
      return hidden ? (
        <video muted autoPlay loop style={classNameVideo}>
          <source src={getVideoSrc(srcUrl)} />
        </video>
      ) : (
        <>
          <div id={keyValueVideo} style={classNameVideo}>
            <KinoraPlayerWrapper
              parentId={keyValueVideo}
              key={keyValueVideo}
              customControls={true}
              play={videoInfo?.isPlaying}
              styles={classNameVideo}
              fillWidthHeight
              postId={postId}
              seekTo={{
                id: Math.random() * 0.5,
                time: videoInfo?.currentTime,
              }}
              onTimeUpdate={(e) =>
                setVideoInfo((prev) => ({
                  ...prev,
                  currentTime: (e.target as any)?.currentTime || 0,
                }))
              }
              onCanPlay={() =>
                setVideoInfo((prev) => ({
                  ...prev,
                  isPlaying: true,
                }))
              }
              volume={{
                id: Math.random() * 0.5,
                level: hidden ? 0 : 0.5,
              }}
            >
              {(setMediaElement: (node: HTMLVideoElement) => void) => (
                <NativeVideo
                  setMediaElement={setMediaElement}
                  src={srcUrl}
                  loop={hidden}
                  autoPlay={autoPlay}
                  muted={true}
                  styles={classNameVideo}
                />
              )}
            </KinoraPlayerWrapper>
          </div>
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"video"}
              keyValue={keyValueVideo}
              video={srcUrl}
              handlePauseVideo={() =>
                setVideoInfo((prev) => {
                  return {
                    ...prev,
                    isPlaying: false,
                  };
                })
              }
              handlePlayVideo={() =>
                setVideoInfo((prev) => {
                  return {
                    ...prev,
                    isPlaying: true,
                  };
                })
              }
              handleSeekVideo={(e) =>
                setVideoInfo((prev) => ({
                  ...prev,
                  currentTime: e * videoInfo?.duration,
                }))
              }
              videoInfo={videoInfo}
            />
          )}
        </>
      );

    case "audio":
      const keyValueAudio = srcUrl + Math.random().toString();
      return (
        <>
          <Image
            src={srcCover!}
            layout="fill"
            objectFit={objectFit ? "contain" : "cover"}
            className={classNameAudio}
            draggable={false}
          />
          {!hidden && (
            <Waveform
              audio={srcUrl}
              type={"audio"}
              keyValue={keyValueAudio}
              video={srcUrl}
            />
          )}
        </>
      );

    default:
      return (
        <Image
          src={srcUrl}
          layout="fill"
          objectFit={objectFit ? "contain" : "cover"}
          objectPosition={"center"}
          className={classNameImage}
          draggable={false}
        />
      );
  }
};

export default MediaSwitch;

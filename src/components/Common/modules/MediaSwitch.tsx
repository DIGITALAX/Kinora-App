import Image from "next/legacy/image";
import { FunctionComponent, useState } from "react";
import Waveform from "./Waveform";
import { MediaProps } from "../types/common.types";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { Player } from "@livepeer/react";
import { INFURA_GATEWAY } from "../../../../lib/constants";

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
      const keyValueVideo = srcUrl + Math.random().toString();
      return (
        <>
          <div id={keyValueVideo} className={classNameVideo}>
            <KinoraPlayerWrapper
              parentId={keyValueVideo}
              key={keyValueVideo}
              customControls={true}
              play={videoInfo?.isPlaying}
              fillWidthHeight
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
            >
              {(setMediaElement: (node: HTMLVideoElement) => void) => (
                <Player
                  mediaElementRef={setMediaElement}
                  src={srcUrl}
                  poster={srcCover}
                  objectFit="cover"
                  autoUrlUpload={{
                    fallback: true,
                    ipfsGateway: INFURA_GATEWAY,
                  }}
                  loop={hidden}
                  autoPlay={hidden}
                  muted={hidden}
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

import { FunctionComponent } from "react";
import { ChannelsProps, Video } from "../types/quest.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { VideoMetadataV3 } from "../../../../graphql/generated";

const Channels: FunctionComponent<ChannelsProps> = ({
  videos,
  setVideoPlaying,
  videoPlaying,
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-full flex overflow-x-scroll items-start justify-start max-w-[35rem]"
      id="xScroll"
    >
      <div className="relative flex w-fit h-full item-center justify-start flex-row gap-3">
        {(videos || [])?.map((video: Video, index: number) => {
          return (
            <div
              key={index}
              className={`relative w-14 sm:w-40 h-full p-px flex items-center justify-center rounded-md cursor-pointer hover:opacity-70 ${
                videoPlaying == video && "opacity-30"
              }`}
              onClick={() => setVideoPlaying(video)}
              id="northern"
            >
              <div className="relative w-full h-full flex items-center justify-center rounded-md">
                {(video?.publication?.metadata as VideoMetadataV3)?.asset?.cover
                  ?.raw?.uri && (
                  <Image
                    className="rounded-md"
                    src={`${INFURA_GATEWAY}/ipfs/${
                      (
                        video?.publication?.metadata as VideoMetadataV3
                      )?.asset?.cover?.raw?.uri?.split("ipfs://")?.[1]
                    }`}
                    draggable={false}
                    objectFit="cover"
                    layout="fill"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Channels;

import { buildCover } from "@/app/lib/helpers/getVideoCover";
import { VideoMetadata } from "@lens-protocol/client";
import { FunctionComponent, JSX } from "react";
import MediaSwitch from "../../Common/modules/MediaSwitch";
import { ChannelsProps } from "../types/quest.types";
import { handleMedia } from "@/app/lib/helpers/handleMedia";

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
        {(videos || [])?.map((video, index: number) => {
          const videosource = handleMedia(
            (video?.post?.metadata as VideoMetadata)?.video
          );
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
                <MediaSwitch
                  classNameImage="rounded-md"
                  classNameVideo={{
                    borderRadius: "0.375rem",
                    objectFit: "cover",
                    width: "100%",
                    height: "100%",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  objectFit={"cover"}
                  srcCover={videosource?.cover}
                  postId={video?.postId}
                  classNameAudio="rounded-md"
                  hidden
                  type={"video"}
                  srcUrl={videosource?.url!}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Channels;

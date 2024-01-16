import { FunctionComponent } from "react";
import { ChannelsProps, Video } from "../types/quest.types";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { VideoMetadataV3 } from "../../../../graphql/generated";
import { buildCover } from "../../../../lib/helpers/getVideoCover";

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
          const videosource = buildCover(
            (video?.publication?.metadata as VideoMetadataV3)?.asset?.video?.raw
              ?.uri
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
                  postId={""}
                  classNameAudio="rounded-md"
                  hidden
                  type={"video"}
                  srcUrl={videosource}
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

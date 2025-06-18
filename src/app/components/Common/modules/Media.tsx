import descriptionRegex from "@/app/lib/helpers/descriptionRegex";
import { ModalContext } from "@/app/providers";
import { MediaAudio, MediaImage, MediaVideo } from "@lens-protocol/client";
import { FunctionComponent, JSX, useContext } from "react";
import MediaSwitch from "./MediaSwitch";
import { handleMedia } from "@/app/lib/helpers/handleMedia";
import { MediaImageProps } from "../types/common.types";

const Media: FunctionComponent<MediaImageProps> = ({
  metadata,
  disabled,
  postId,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3 break-words max-w-full">
      {((metadata?.content && metadata?.content?.trim() !== "") ||
        (metadata?.title && metadata?.title?.trim() !== "")) && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-vcr  text-left items-start justify-start break-words flex overflow-y-scroll py-3 text-xs whitespace-preline ${
            metadata?.__typename === "VideoMetadata"
              ? "bg-viol text-black"
              : "bg-nave text-white"
          }`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              disabled
                ? metadata?.content?.slice(0, 100) + "..."
                : metadata?.content,
              metadata?.__typename === "VideoMetadata" ? true : false
            ),
          }}
        ></div>
      )}
      <div
        className={`relative w-full h-fit overflow-x-scroll gap-2 items-center justify-start flex`}
      >
        <div className="relative w-fit h-fit gap-2 flex flex-row items-center justify-start">
          {[
            metadata?.__typename == "AudioMetadata"
              ? metadata?.audio
              : metadata?.__typename == "VideoMetadata"
              ? metadata?.video
              : metadata?.image,
            ...(metadata?.attachments || []),
          ]
            ?.filter(Boolean)
            ?.map(
              (item: MediaAudio | MediaImage | MediaVideo, index: number) => {
                const media = handleMedia(item);

                return (
                  <div
                    key={index}
                    className={`w-44 rounded-sm h-44 flex items-center justify-center p-px ${
                      media?.url && !disabled && "cursor-pointer"
                    }`}
                    id="northern"
                    onClick={() =>
                      media?.type === "Image" &&
                      !disabled &&
                      context?.setImageViewer({
                        type: "png",
                        image: media?.url,
                      })
                    }
                  >
                    <div className="relative w-full h-full flex rounded-sm items-center justify-center">
                      {media?.url && (
                        <MediaSwitch
                          type={media?.type}
                          srcUrl={media?.url}
                          srcCover={media?.cover}
                          classNameVideo={{
                            borderRadius: "0.125rem",
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            display: "flex",
                          }}
                          postId={postId}
                          classNameImage={"rounded-sm"}
                          classNameAudio={"rounded-md"}
                        />
                      )}
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>
    </div>
  );
};

export default Media;

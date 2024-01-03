import { FunctionComponent } from "react";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { PublicationMetadataMedia } from "../../../../graphql/generated";
import { metadataMedia } from "../../../../lib/helpers/metadataMedia";
import descriptionRegex from "../../../../lib/helpers/descriptionRegex";
import { setImageViewer } from "../../../../redux/reducers/imageViewerSlice";
import { MediaImageProps } from "../types/common.types";

const Media: FunctionComponent<MediaImageProps> = ({
  dispatch,
  metadata,
  disabled,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col justify-start items-center gap-3 break-words max-w-full">
      {((metadata?.content && metadata?.content?.trim() !== "") ||
        (metadata?.title && metadata?.title?.trim() !== "")) && (
        <div
          className={`relative w-full h-fit max-h-[12rem] font-vcr  text-left items-start justify-start break-words flex overflow-y-scroll py-3 text-xs whitespace-preline ${
            metadata?.__typename === "VideoMetadataV3"
              ? "bg-viol text-black"
              : "bg-nave text-white"
          }`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              disabled
                ? metadata?.content?.slice(0, 100) + "..."
                : metadata?.content,
              metadata?.__typename === "VideoMetadataV3" ? true : false
            ),
          }}
        ></div>
      )}
      <div
        className={`relative w-full h-fit overflow-x-scroll gap-2 items-center justify-start flex`}
      >
        <div className="relative w-fit h-fit gap-2 flex flex-row items-center justify-start">
          {[metadata?.asset, ...(metadata?.attachments || [])]
            ?.filter(Boolean)
            ?.map((item: PublicationMetadataMedia, index: number) => {
              const media = metadataMedia(item);

              return (
                <div
                  key={index}
                  className={`w-44 rounded-sm h-44 flex items-center justify-center p-px ${
                    media?.url && !disabled && "cursor-pointer"
                  }`}
                  id="rainbow"
                  onClick={() =>
                    media?.type === "Image" &&
                    !disabled &&
                    dispatch(
                      setImageViewer({
                        actionValue: true,
                        actionType: "png",
                        actionImage: media?.url,
                      })
                    )
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
                        classNameImage={"rounded-sm"}
                        classNameAudio={"rounded-md"}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Media;

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
          className={`relative w-full h-fit max-h-[12rem] font-aust  text-left items-start justify-start break-words flex overflow-y-scroll p-3 text-sm whitespace-preline ${
            metadata?.__typename === "ImageMetadataV3"
              ? "bg-offBlack text-white"
              : metadata?.__typename === "VideoMetadataV3"
              ? "bg-viol text-black"
              : "bg-nuba text-black"
          }`}
          dangerouslySetInnerHTML={{
            __html: descriptionRegex(
              metadata?.content,
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
                  className={`w-60 border border-white rounded-sm h-60 flex items-center justify-center bg-offBlack ${
                    media?.url && !disabled && "cursor-pointer"
                  }`}
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
                        classNameVideo={
                          "rounded-sm absolute w-full h-full object-cover"
                        }
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
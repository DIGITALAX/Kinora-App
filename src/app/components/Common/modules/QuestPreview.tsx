import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { useRouter } from "next/navigation";
import { ImageMetadata, Post, VideoMetadata } from "@lens-protocol/client";
import { Quest, QuestPreviewProps } from "../types/common.types";
import { handleImage } from "@/app/lib/helpers/handleImage";
import InteractBar from "./InteractBar";
import { ModalContext } from "@/app/providers";

const QuestPreview: FunctionComponent<QuestPreviewProps> = ({
  quest,
  height,
  width,
  dict,
  mainFeed,
  border,
  disabled,
  post,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px cursor-pointer hover:opacity-80 flex rounded-sm"
        id="northern"
        style={{
          width,
          height,
        }}
        onClick={() => {
          context?.setRouterChangeLoading(true);

          router.push(
            `/quest/${(post ? (quest as Post) : (quest as Quest)?.post)?.id}`
          );
        }}
      >
        <div className="relative rounded-sm w-full h-full flex items-center justify-center">
          <Image
            src={handleImage(
              post
                ? ((quest as Post)?.metadata as ImageMetadata)?.image?.item
                : (quest as Quest)?.questMetadata?.cover
            )}
            objectFit="cover"
            draggable={false}
            className="rounded-sm"
            layout="fill"
          />
        </div>
      </div>
      {!disabled && (
        <InteractBar
          dict={dict}
          post={post ? (quest as Post) : (quest as Quest)?.post}
          mainFeed={mainFeed}
          border={border}
        />
      )}
      <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-sm break-words">
        {Number(
          (
            (post ? (quest as Post) : (quest as Quest)?.post)
              ?.metadata as VideoMetadata
          )?.title?.length
        ) > 20
          ? (
              (post ? (quest as Post) : (quest as Quest)?.post)
                ?.metadata as VideoMetadata
            )?.title?.slice(0, 20) + "..."
          : (
              (post ? (quest as Post) : (quest as Quest)?.post)
                ?.metadata as VideoMetadata
            )?.title}
      </div>
    </div>
  );
};

export default QuestPreview;

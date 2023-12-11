import { FunctionComponent } from "react";
import { QuestPreviewProps } from "../types/common.types";
import createMedia from "../../../../lib/helpers/createMedia";
import SaveQuest from "./SaveQuest";
import { Post, VideoMetadataV3 } from "../../../../graphql/generated";
import Image from "next/legacy/image";
import { Quest } from "@/components/Quest/types/quest.types";

const QuestPreview: FunctionComponent<QuestPreviewProps> = ({
  quest,
  height,
  width,
  dispatch,
  lensConnected,
  questFeed,
  setItemFeed,
  router,
  post,
}): JSX.Element => {
  const image = createMedia(
    (post ? (quest as Post) : (quest as Quest)?.publication)?.metadata
  );
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px cursor-pointer hover:opacity-80 flex rounded-sm"
        id="rainbow"
        style={{
          width,
          height,
        }}
        onClick={() =>
          router.push(
            `/quest/${
              (post ? (quest as Post) : (quest as Quest)?.publication)?.id
            }`
          )
        }
      >
        {image?.asset && (
          <Image
            src={image?.asset}
            objectFit="cover"
            draggable={false}
            className="rounded-sm"
          />
        )}
        <SaveQuest
          dispatch={dispatch}
          lensConnected={lensConnected}
          questSaved={
            (post ? (quest as Post) : (quest as Quest)?.publication)?.operations
              ?.hasBookmarked
          }
          post={post}
          questId={(post ? (quest as Post) : (quest as Quest)?.publication)?.id}
          questFeed={questFeed}
          setItemFeed={setItemFeed}
        />
      </div>
      <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-sm break-words">
        {(
          (post ? (quest as Post) : (quest as Quest)?.publication)
            ?.metadata as VideoMetadataV3
        )?.title?.length > 20
          ? (
              (post ? (quest as Post) : (quest as Quest)?.publication)
                ?.metadata as VideoMetadataV3
            )?.title?.slice(0, 20) + "..."
          : (
              (post ? (quest as Post) : (quest as Quest)?.publication)
                ?.metadata as VideoMetadataV3
            )?.title}
      </div>
    </div>
  );
};

export default QuestPreview;

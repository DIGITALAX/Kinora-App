import { FunctionComponent } from "react";
import { QuestPreviewProps } from "../types/common.types";
import createMedia from "../../../../lib/helpers/createMedia";
import SaveQuest from "./SaveQuest";
import { VideoMetadataV3 } from "../../../../graphql/generated";
import Image from "next/legacy/image";

const QuestPreview: FunctionComponent<QuestPreviewProps> = ({
  quest,
  height,
  width,
  dispatch,
  lensConnected,
  questFeed,
  setItemFeed,
  router,
}): JSX.Element => {
  const image = createMedia(quest?.metadata);
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px cursor-pointer hover:opacity-80 flex rounded-sm"
        id="rainbow"
        style={{
          width,
          height,
        }}
        onClick={() => router.push(`/quest/${quest?.id}`)}
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
          questSaved={quest?.operations?.hasBookmarked}
          questId={quest?.id}
          questFeed={questFeed}
          setItemFeed={setItemFeed}
        />
      </div>
      <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-sm break-words">
        {(quest?.metadata as VideoMetadataV3)?.title?.length > 20
          ? (quest?.metadata as VideoMetadataV3)?.title?.slice(0, 20) + "..."
          : (quest?.metadata as VideoMetadataV3)?.title}
      </div>
    </div>
  );
};

export default QuestPreview;

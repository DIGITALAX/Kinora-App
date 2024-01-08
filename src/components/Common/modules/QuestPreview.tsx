import { FunctionComponent } from "react";
import { QuestPreviewProps } from "../types/common.types";
import {
  ImageMetadataV3,
  Post,
  VideoMetadataV3,
} from "../../../../graphql/generated";
import Image from "next/legacy/image";
import { Quest } from "@/components/Quest/types/quest.types";
import InteractBar from "./InteractBar";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const QuestPreview: FunctionComponent<QuestPreviewProps> = ({
  quest,
  height,
  width,
  dispatch,
  lensConnected,
  router,
  post,
  interactionsLoading,
  mirror,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  like,
  bookmark,
  index,
  profileHovers,
  setProfileHovers,
  followProfile,
  unfollowProfile,
  mainFeed,
  border,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px cursor-pointer hover:opacity-80 flex rounded-sm"
        id="northern"
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
        <div className="relative rounded-sm w-full h-full flex items-center justify-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              post
                ? (
                    (quest as Post)?.metadata as ImageMetadataV3
                  )?.asset?.image?.raw?.uri?.split("ipfs://")?.[1]
                : (quest as Quest)?.questMetadata?.cover?.includes("ipfs://")
                ? (quest as Quest)?.questMetadata?.cover?.split("ipfs://")?.[1]
                : (quest as Quest)?.questMetadata?.cover
            }`}
            objectFit="cover"
            draggable={false}
            className="rounded-sm"
            layout="fill"
          />
        </div>
      </div>
      <InteractBar
        dispatch={dispatch}
        lensConnected={lensConnected}
        publication={post ? (quest as Post) : (quest as Quest)?.publication}
        mirror={mirror}
        mirrorChoiceOpen={mirrorChoiceOpen}
        setMirrorChoiceOpen={setMirrorChoiceOpen}
        like={like}
        bookmark={bookmark}
        index={index}
        interactionsLoading={interactionsLoading}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        setProfileHovers={setProfileHovers}
        profileHovers={profileHovers}
        router={router}
        mainFeed={mainFeed}
        border={border}
      />
      {!border && (
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
      )}
    </div>
  );
};

export default QuestPreview;

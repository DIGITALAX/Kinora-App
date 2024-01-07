import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import InteractBar from "@/components/Common/modules/InteractBar";
import { VideoMetadataV3 } from "../../../../graphql/generated";
import { MetricsAddedProps } from "../types/activity.types";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";

const MetricsAdded: FunctionComponent<MetricsAddedProps> = ({
  width,
  height,
  router,
  quest,
  dispatch,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  mirror,
  like,
  profileHovers,
  setProfileHovers,
  simpleCollect,
  index,
  interactionsLoading,
  followProfile,
  unfollowProfile,
  lensConnected,
}): JSX.Element => {
  const pfp = createProfilePicture(quest?.profile?.metadata?.picture);

  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px flex rounded-sm"
        id="rainbow"
        style={{
          width,
          height,
        }}
      >
        <div className="relative rounded-sm w-full h-full flex items-center justify-center">
          <Image
            src={`${INFURA_GATEWAY}/ipfs/${
              (
                quest?.publication?.metadata as VideoMetadataV3
              )?.asset?.cover?.raw?.uri?.includes("ipfs://")
                ? (
                    quest?.publication?.metadata as VideoMetadataV3
                  )?.asset?.cover?.raw?.uri?.split("ipfs://")?.[1]
                : (quest?.publication?.metadata as VideoMetadataV3)?.asset
                    ?.cover?.raw?.uri
            }`}
            objectFit="cover"
            draggable={false}
            className="rounded-sm"
            layout="fill"
          />
        </div>
        <div className="absolute top-4 right-4 px-2 py-1 rounded-md flex flex-col font-bit gap-2">
          <div className="relative w-fit h-fit flex items-center justify-center top-px text-xxs text-gray-200">
            Video Activity Metrics
          </div>

          <div
            className="relative w-full h-fit flex flex-row items-end justify-end gap-1 cursor-pointer"
            onClick={() =>
              router.push(
                `envoker/${
                  quest?.profile?.handle?.suggestedFormatted?.localName?.split(
                    "@"
                  )?.[1]
                }`
              )
            }
          >
            <div className="relative w-6 h-6 flex items-center justify-center">
              <Image
                src={`${INFURA_GATEWAY}/ipfs/QmXU6eCV833e916n8PbJhNLhg4h44rhfro1c7gP18kunkF`}
                draggable={false}
                className="rounded-full"
                objectFit="cover"
                layout="fill"
              />
            </div>
            <div
              className="rounded-full w-6 h-6 p-px flex items-center justify-center"
              id="rainbow"
            >
              <div className="relative w-full h-full flex items-center justify-center">
                {pfp && (
                  <Image
                    src={pfp}
                    draggable={false}
                    className="rounded-full"
                    objectFit="cover"
                    layout="fill"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <InteractBar
        dispatch={dispatch}
        lensConnected={lensConnected}
        publication={quest?.publication!}
        mirror={mirror}
        mirrorChoiceOpen={mirrorChoiceOpen}
        setMirrorChoiceOpen={setMirrorChoiceOpen}
        like={like}
        simpleCollect={simpleCollect}
        index={index}
        interactionsLoading={interactionsLoading}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        setProfileHovers={setProfileHovers}
        profileHovers={profileHovers}
        router={router}
      />
      <div className="relative w-fit h-fit flex items-center justify-center text-white font-bit text-sm break-words">
        {(quest?.publication?.metadata as VideoMetadataV3)?.title?.length > 20
          ? (quest?.publication?.metadata as VideoMetadataV3)?.title?.slice(
              0,
              20
            ) + "..."
          : (quest?.publication?.metadata as VideoMetadataV3)?.title}
      </div>
    </div>
  );
};

export default MetricsAdded;

import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import InteractBar from "@/components/Common/modules/InteractBar";
import { VideoMetadataV3 } from "../../../../graphql/generated";
import { MetricsAddedProps } from "../types/activity.types";

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
  disabled,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex flex-col gap-2 flex items-start justify-start">
      <div
        className="relative w-full p-px flex rounded-lg cursor-pointer"
        id="rainbow"
        style={{
          width,
          height,
        }}
        onClick={() => router.push(`/video/${quest?.publication?.id}`)}
      >
        <div className="relative rounded-lg w-full h-full flex items-center justify-center">
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
            className="rounded-lg"
            layout="fill"
          />
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center justify-end sm:justify-between font-bit break-words gap-3">
        <div className="relative flex flex-row gap-1.5 items-center justify-center w-fit h-fit">
          <div className="relative w-3 h-3 flex items-center justify-center">
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmS6GgvqEKRjvXtYfiXWTQZMz7nt2ucuKFaWv8sTgUDGNq`}
            />
          </div>
          <div className="text-gris relative flex items-center justify-center text-xxs break-words">
            Video Metric <br /> Activity Updated
          </div>
        </div>
        <div className="relative w-fit h-fit flex items-center justify-end text-white text-right sm:text-sm text-xs break-words">
          {(quest?.publication?.metadata as VideoMetadataV3)?.title?.length > 20
            ? (quest?.publication?.metadata as VideoMetadataV3)?.title?.slice(
                0,
                20
              ) + "..."
            : (quest?.publication?.metadata as VideoMetadataV3)?.title}
        </div>
      </div>
      <div className="relative w-full mr-0 h-fit flex items-center justify-end text-suave text-xxs font-bit flex-row gap-1">
        <div className="flex items-center justify-center top-px relative">
          New Activity Detected
        </div>
        <div className="relative w-3 h-3 flex items-center justify-center">
          <Image
            draggable={false}
            layout="fill"
            src={`${INFURA_GATEWAY}/ipfs/QmNoZzuUVsCDT5pYS7TNp1YkUmU5vDav7AwaoYZ8Jeuhrx`}
          />
        </div>
      </div>
      {!disabled && (
        <InteractBar
          dispatch={dispatch}
          lensConnected={lensConnected}
          publication={quest?.publication!}
          mirror={mirror}
          mirrorChoiceOpen={mirrorChoiceOpen}
          setMirrorChoiceOpen={setMirrorChoiceOpen}
          like={like}
          border
          simpleCollect={simpleCollect}
          index={index}
          interactionsLoading={interactionsLoading}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          setProfileHovers={setProfileHovers}
          profileHovers={profileHovers}
          router={router}
        />
      )}
    </div>
  );
};

export default MetricsAdded;

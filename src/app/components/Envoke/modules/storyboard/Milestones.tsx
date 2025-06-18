import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  IPFS_REGEX,
} from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import { StoryboardMilestonesProps } from "../../types/envoke.types";
import MediaSwitch from "@/app/components/Common/modules/MediaSwitch";
import { VideoMetadata } from "@lens-protocol/client";
import { handleMedia } from "@/app/lib/helpers/handleMedia";

const Milestones: FunctionComponent<StoryboardMilestonesProps> = ({
  milestoneStoryboardStage,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const milestone = context?.questInfo?.milestones?.[milestoneStoryboardStage];
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10 h-fit sm:max-h-[40rem] overflow-y-scroll">
      <div className="relative w-fit h-fit items-start justify-start opacity-70">
        {dict?.story}
      </div>
      <div className="relative w-full h-fit flex flex-col gap-6 items-center justify-center">
        <div
          className={`relative flex items-center w-full h-28 rounded-md justify-center p-px`}
          id="northern"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-md">
            <Image
              layout="fill"
              className="rounded-md"
              objectFit="cover"
              src={
                IPFS_REGEX.test(milestone?.details?.cover!)
                  ? `${INFURA_GATEWAY}/ipfs/${milestone?.details?.cover}`
                  : milestone?.details?.cover!
              }
              draggable={false}
            />
            <div className="absolute w-full h-full top-0 right-0 rounded-md bg-black/70"></div>
          </div>
          <div className="absolute left-3 bottom-3 w-fit h-fit flex items-center justify-center">
            {milestone?.details?.title}
          </div>
        </div>
        <div className="relative w-full h-fit flex items-start justify-start max-h-[10rem] overflow-y-scroll  whitespace-preline text-sm">
          {milestone?.details?.description}
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-6">
        <div className="relative underline underline-offset-4 text-base items-start justify-start flex">
          {dict?.gat}
        </div>
        {Number(milestone?.gated?.erc721TokenIds?.length) > 0 && (
          <div className="relative w-full h-fit flex flex-col gap-2">
            <div className="relative text-sm items-start justify-start flex">
              {dict?.tokG}
            </div>
            <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-5">
              {milestone?.gated?.erc721TokenIds?.map((item, index: number) => {
                return (
                  <div
                    key={index}
                    className={`relative w-14 h-14 flex items-center hover:opacity-80 justify-center p-px rounded-md`}
                    id="northern"
                  >
                    <div className="relative w-full h-full relative rounded-md">
                      {(item?.metadata?.mediaCover ||
                        item?.metadata?.images?.[0]) && (
                        <Image
                          className={"rounded-md"}
                          draggable={false}
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.metadata?.mediaCover
                              ? item?.metadata?.mediaCover?.split(
                                  "ipfs://"
                                )?.[1]
                              : item?.metadata?.images?.[0]?.split(
                                  "ipfs://"
                                )?.[1]
                          }`}
                          layout="fill"
                          objectFit="cover"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {Number(milestone?.gated?.erc20Addresses?.length) > 0 && (
          <div className="relative w-full h-fit flex flex-col gap-2">
            <div className="relative text-base items-start justify-start flex text-sm">
              {dict?.tokGE}
            </div>
            <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-5">
              {milestone?.gated?.erc20Addresses?.map(
                (item: string, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`relative w-fit h-fit flex flex-row  items-center justify-center gap-2`}
                    >
                      <div
                        className={`relative w-fit h-fit rounded-full flex items-center active:scale-95`}
                        key={index}
                      >
                        <div className="relative w-7 h-8 flex items-center justify-center rounded-full">
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${
                              ACCEPTED_TOKENS?.find(
                                (value) => value[2] === item
                              )?.[0]
                            }`}
                            className="flex rounded-full"
                            draggable={false}
                            layout="fill"
                          />
                        </div>
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        <input
                          value={
                            milestone?.gated?.erc20Thresholds?.[index] || ""
                          }
                          disabled
                          type="number"
                          className="h-10 w-20 px-2 bg-black border border-white rounded-md py-1 text-xs"
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-6">
        <div className="relative underline underline-offset-4 text-base items-start justify-start flex">
          {dict?.rews}
        </div>
        <div className="relative w-full h-fit flex flex-col gap-2">
          <div className="relative text-sm items-start justify-start flex">
            {dict?.rewsT}
          </div>
          <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-5">
            {milestone?.rewards?.rewards20?.map((item, index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-fit h-fit flex flex-row  items-center justify-center gap-2`}
                >
                  <div
                    className={`relative w-fit h-fit rounded-full flex items-center active:scale-95`}
                    key={index}
                  >
                    <div className="relative w-7 h-8 flex items-center justify-center rounded-full">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${
                          ACCEPTED_TOKENS?.find(
                            (value) =>
                              value[2]?.toLowerCase() ===
                              item?.address?.toLowerCase()
                          )?.[0]
                        }`}
                        className="flex rounded-full"
                        draggable={false}
                        layout="fill"
                      />
                    </div>
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    <input
                      value={
                        milestone?.rewards?.rewards20?.[index]?.amount || ""
                      }
                      disabled
                      type="number"
                      className="h-10 w-20 px-2 bg-black border border-white rounded-md py-1 text-xs"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col gap-2">
          <div className="relative text-sm items-start justify-start flex">
            {dict?.rewsN}
          </div>
          <div className="relative w-full h-fit items-start justify-start flex flex-wrap gap-5">
            {milestone?.rewards?.rewards721?.map((item, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-full h-fit flex flex-row items-center justify-start gap-6 cursor-pointer hover:opacity-80 font-bit text-white text-sm"
                >
                  <div
                    className="relative w-fit h-fit flex items-center justify-center p-px rounded-sm"
                    id="northern"
                  >
                    <div className="relative w-16 h-16 flex items-center justify-center rounded-sm">
                      <MediaSwitch
                        classNameImage="rounded-sm"
                        classNameVideo={{
                          borderRadius: "0.125rem",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        postId={""}
                        classNameAudio="rounded-sm"
                        hidden
                        type={item?.details?.media}
                        srcUrl={
                          item?.details?.media == "video"
                            ? item?.details?.video
                            : item?.details?.media == "audio"
                            ? item?.details?.audio
                            : item?.details?.images?.[0]
                        }
                        srcCover={item?.details?.mediaCover}
                      />
                    </div>
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {item?.details?.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col items-start justify-start gap-3">
        <div className="relative text-base underline underline-offset-4 items-start justify-start flex">
          {dict?.vids}
        </div>
        <div className="relative w-fit h-fit flex flex-col gap-7  items-start justify-start">
          {milestone?.eligibility?.map((item, index: number) => {
            const media = handleMedia(
              (item?.video?.metadata as VideoMetadata)?.video
            );
            return (
              <div
                key={index}
                className="relative w-full h-fit flex flex-col lg:flex-row gap-4 items-start justify-start"
              >
                <div className="relative w-full sm:w-fit h-fit items-start justify-start gap-2 flex flex-col">
                  <div className="relative w-fit h-fit flex items-start justify-start text-xs">
                    {Number(
                      (item?.video?.metadata as VideoMetadata)?.title?.length
                    ) > 30
                      ? (item?.video?.metadata as VideoMetadata)?.title?.slice(
                          0,
                          30
                        ) + "..."
                      : (item?.video?.metadata as VideoMetadata)?.title}
                  </div>
                  <div
                    className="relative w-3/4 galaxy:w-full sm:w-60 full sm:h-44 p-px rounded-md flex items-center justify-center"
                    id="northern"
                  >
                    <div className="relative w-full h-full flex items-center justify-center">
                      <MediaSwitch
                        postId={""}
                        srcUrl={media?.url!}
                        srcCover={media?.cover!}
                        classNameVideo={{
                          borderRadius: "0.375rem",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        type="video"
                        hidden
                      />
                    </div>
                  </div>
                </div>
                <div className="relative w-fit h-fit flex flex-wrap gap-4 items-start justify-start">
                  {Object.entries(item.criteria)
                    .map(([key, value]) => ({ key, value }))
                    .map((item, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative w-fit h-fit items-start justify-start gap-2 font-bit text-white text-xxs flex flex-col"
                        >
                          <div className="flex items-start justify-start">
                            {item?.key
                              ?.replace(/([A-Z])/g, " $1")
                              .trim()
                              .replace(/^./, (str) => str.toUpperCase())}
                          </div>
                          <div className="relative w-fit h-fit flex items-start justify-start">
                            {!item?.key?.includes("Lens") ? (
                              <input
                                className="bg-black border border-white rounded-md px-1.5 py-1 h-8 w-full"
                                value={String(item?.value) || ""}
                                disabled
                              />
                            ) : (
                              <div className="relative w-fit h-8 flex items-center justify-center rounded-md border border-white flex-row gap-1 text-xxs bg-black">
                                <div
                                  className={`relative w-12 h-fit flex p-2 items-center justify-center rounded-md ${
                                    item?.value === true
                                      ? "bg-verde text-black"
                                      : "text-white"
                                  }`}
                                >
                                  {dict?.yes}
                                </div>
                                <div
                                  className={`relative w-12 h-fit flex p-2 items-center justify-center rounded-md ${
                                    !item?.value
                                      ? "bg-verde text-black"
                                      : "text-white"
                                  }`}
                                >
                                  {dict?.no}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Milestones;

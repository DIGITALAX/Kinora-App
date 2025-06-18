import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import { BsShuffle } from "react-icons/bs";
import { ModalContext } from "@/app/providers";
import {
  COVER_CONSTANTS,
  HASHTAG_CONSTANTS,
  INFURA_GATEWAY,
  IPFS_REGEX,
} from "@/app/lib/constants";
import handleMediaUpload from "@/app/lib/helpers/handleMediaUpload";
import { DetailsProps } from "../types/envoke.types";
import GatedLogic from "./GatedLogic";

const Details: FunctionComponent<DetailsProps> = ({
  dict,
  setCoverLoading,
  coverLoading,
  collections,
  collectionsSearch,
  setCollectionsSearch,
  getMoreCollectionsSearch,
  getCollectionsSearch,
  collectionsInfo,
  getMoreCollectionsSample,
  setCollectionsInfo,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-6 overflow-y-scroll font-bit text-white pb-3">
      <div className="relative w-full h-fit flex items-start justify-start flex-col lg:flex-row gap-6">
        <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
          <div className="relative w-fit h-fit flex items-start justify-start">
            {dict?.cover}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2">
            <div
              className="relative w-6 h-6 flex items-center justify-center cursor-pointer rounded-full p-1 bg-black border border-acei active:scale-95"
              onClick={() =>
                context?.setQuestInfo((prev) => ({
                  ...prev,
                  details: {
                    ...prev?.details,
                    cover: COVER_CONSTANTS.sort(() => 0.5 - Math.random())[0],
                  },
                }))
              }
            >
              <div className="relative w-fit h-fit flex items-center justify-center">
                <BsShuffle size={10} color={"white"} />
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-xxs opacity-70 break-all whitespace-preline">
              {dict?.shuff}
            </div>
          </div>
          <label
            className={`relative flex items-center w-full h-60 rounded-md justify-center cursor-pointer p-px`}
            id="northern"
          >
            <div className="relative w-full h-full flex items-center justify-center rounded-md">
              {coverLoading ? (
                <div className="relative w-full rounded-md h-full flex items-center justify-center animate-spin">
                  <AiOutlineLoading color="black" size={15} />
                </div>
              ) : (
                context?.questInfo?.details?.cover && (
                  <Image
                    layout="fill"
                    className="rounded-md"
                    objectFit="cover"
                    src={
                      IPFS_REGEX.test(context?.questInfo?.details?.cover)
                        ? `${INFURA_GATEWAY}/ipfs/${context?.questInfo?.details?.cover}`
                        : context?.questInfo?.details?.cover
                    }
                    draggable={false}
                  />
                )
              )}
              <input
                hidden
                type="file"
                accept={"image/png, image/gif"}
                multiple={true}
                onChange={(e) =>
                  e?.target?.files?.[0] &&
                  handleMediaUpload(
                    e,
                    () => setCoverLoading(true),
                    () => setCoverLoading(false),
                    (cover: string) =>
                      context?.setQuestInfo((prev) => ({
                        ...prev,
                        details: {
                          ...prev?.details,
                          cover,
                        },
                      }))
                  )
                }
              />
            </div>
          </label>
        </div>
        <div className="relative w-full h-fit flex items-start justify-start flex-col gap-6 font-bit text-white lg:top-16">
          <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
            <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
              {dict?.tit}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
            <div className="relative w-full h-fit flex p-px rounded-md">
              <input
                className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
                placeholder={dict?.namQ}
                value={context?.questInfo?.details?.title}
                onChange={(e) =>
                  context?.setQuestInfo((prev) => ({
                    ...prev,
                    details: {
                      ...prev?.details,
                      title: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
            <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
              {dict?.tags}{" "}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
            <div className="relative w-full h-fit flex p-px rounded-md">
              <input
                value={context?.questInfo?.details?.tags}
                onChange={(e) =>
                  context?.setQuestInfo((prev) => ({
                    ...prev,
                    details: {
                      ...prev?.details,
                      tags: e.target.value,
                    },
                  }))
                }
                placeholder={dict?.tagA}
                className="relative bg-black border border-acei rounded-md p-1 text-xs h-10 w-full"
                style={{
                  resize: "none",
                }}
              />
            </div>
            {context?.questInfo?.details?.tags?.split(",").pop()?.trim() &&
              HASHTAG_CONSTANTS?.some((tag) =>
                tag
                  .toLowerCase()
                  .includes(
                    context?.questInfo?.details?.tags
                      ?.split(",")
                      .pop()
                      ?.trim()
                      .toLowerCase()!
                  )
              ) && (
                <div className="absolute top-16 bg-black z-10 w-full max-h-[6rem] h-fit flex border border-sol rounded-md overflow-y-scroll">
                  <div className="relative w-full h-fit flex flex-col items-center justify-start">
                    {HASHTAG_CONSTANTS?.filter((tag) =>
                      tag.toLowerCase().includes(
                        context?.questInfo?.details?.tags
                          ?.split(/,\s*|\s+|\s*$/)
                          ?.pop()
                          ?.toLowerCase() || ""
                      )
                    ).map((tag: string, index: number) => (
                      <div
                        key={index}
                        className="relative py-1 h-10 w-full flex items-center justify-center text-white border-y border-sol font-aust text-xs cursor-pointer hover:opacity-80"
                        onClick={() => {
                          const allArray = context?.questInfo?.details?.tags
                            .split(/,\s*/)
                            .map((t) => t.trim());

                          if (!allArray?.includes(tag.trim())) {
                            const tagsArray =
                              context?.questInfo?.details?.tags?.split(/,\s*/);
                            tagsArray![tagsArray!?.length - 1] = tag;
                            const newTags = tagsArray?.join(", ") + ", ";

                            context?.setQuestInfo((prev) => ({
                              ...prev,
                              details: {
                                ...prev?.details,
                                tags: newTags,
                              },
                            }));
                          }
                        }}
                      >
                        <div className="relative w-fit h-fit flex items-center gap-1.5 justify-start">
                          {tag}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </div>
          <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
            <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
              {dict?.max}{" "}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
            <div className="relative w-full h-fit flex p-px rounded-md">
              <input
                value={context?.questInfo?.details?.maxPlayerCount}
                onChange={(e) =>
                  context?.setQuestInfo((prev) => ({
                    ...prev,
                    details: {
                      ...prev?.details,
                      maxPlayerCount: Number(e.target.value),
                    },
                  }))
                }
                placeholder={dict?.maxA}
                className="relative border border-acei rounded-md p-1 bg-black text-xs h-10 w-full"
                style={{
                  resize: "none",
                }}
                type="number"
                min={1}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
        <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
          {dict?.des} <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
        </div>
        <div className="relative w-full h-fit flex p-px rounded-md">
          <textarea
            className="h-40 w-full border-acei border bg-black rounded-md p-2 text-xs"
            style={{
              resize: "none",
            }}
            placeholder={dict?.short}
            value={context?.questInfo?.details?.description}
            onChange={(e) =>
              context?.setQuestInfo((prev) => ({
                ...prev,
                details: {
                  ...prev?.details,
                  description: e.target.value,
                },
              }))
            }
          ></textarea>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
        <div className="relative w-fit h-fit text-sm break-words">
          {dict?.set}
        </div>
        <GatedLogic
          join={true}
          dict={dict}
          collections={collections}
          collectionsSearch={collectionsSearch}
          setCollectionsSearch={setCollectionsSearch}
          getMoreCollectionsSearch={getMoreCollectionsSearch}
          getCollectionsSearch={getCollectionsSearch}
          collectionsInfo={collectionsInfo}
          getMoreCollectionsSample={getMoreCollectionsSample}
          setCollectionsInfo={setCollectionsInfo}
        />
      </div>
    </div>
  );
};

export default Details;

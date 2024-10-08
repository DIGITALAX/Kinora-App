import { FunctionComponent } from "react";
import { DetailsProps } from "../types/envoke.types";
import Image from "next/legacy/image";
import { setQuestInfo } from "../../../../redux/reducers/questInfoSlice";
import { AiOutlineLoading } from "react-icons/ai";
import { BsShuffle } from "react-icons/bs";
import {
  COVER_CONSTANTS,
  HASHTAG_CONSTANTS,
  INFURA_GATEWAY,
  IPFS_REGEX,
} from "../../../../lib/constants";
import handleMediaUpload from "../../../../lib/helpers/handleMediaUpload";
import GatedLogic from "./milestones/GatedLogic";

const Details: FunctionComponent<DetailsProps> = ({
  questInfo,
  dispatch,
  t,
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
  return (
    <div className="relative w-full h-fit flex flex-col items-start justify-start gap-6 overflow-y-scroll font-bit text-white pb-3">
      <div className="relative w-full h-fit flex items-start justify-start flex-col lg:flex-row gap-6">
        <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
          <div className="relative w-fit h-fit flex items-start justify-start">
            {t("cover")}
          </div>
          <div className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2">
            <div
              className="relative w-6 h-6 flex items-center justify-center cursor-pointer rounded-full p-1 bg-black border border-acei active:scale-95"
              onClick={() =>
                dispatch(
                  setQuestInfo({
                    actionDetails: {
                      ...questInfo?.details,
                      cover: COVER_CONSTANTS.sort(() => 0.5 - Math.random())[0],
                    },
                    actionMilestones: questInfo?.milestones,
                  })
                )
              }
            >
              <div className="relative w-fit h-fit flex items-center justify-center">
                <BsShuffle size={10} color={"white"} />
              </div>
            </div>
            <div className="relative w-fit h-fit flex items-center justify-center text-xxs opacity-70 break-all whitespace-preline">
              {t("shuff")}
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
                questInfo?.details?.cover && (
                  <Image
                    layout="fill"
                    className="rounded-md"
                    objectFit="cover"
                    src={
                      IPFS_REGEX.test(questInfo?.details?.cover)
                        ? `${INFURA_GATEWAY}/ipfs/${questInfo?.details?.cover}`
                        : questInfo?.details?.cover
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
                      dispatch(
                        setQuestInfo({
                          actionDetails: {
                            ...questInfo?.details,
                            cover,
                          },
                          actionMilestones: questInfo?.milestones,
                        })
                      )
                  )
                }
              />
            </div>
          </label>
        </div>
        <div className="relative w-full h-fit flex items-start justify-start flex-col gap-6 font-bit text-white lg:top-16">
          <div className="relative w-full h-fit flex items-start justify-start gap-2 flex-col">
            <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
              {t("tit")}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
            <div className="relative w-full h-fit flex p-px rounded-md">
              <input
                className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
                placeholder={t("namQ")}
                value={questInfo?.details?.title}
                onChange={(e) =>
                  dispatch(
                    setQuestInfo({
                      actionDetails: {
                        ...questInfo?.details,
                        title: e.target.value,
                      },
                      actionMilestones: questInfo?.milestones,
                    })
                  )
                }
              />
            </div>
          </div>
          <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
            <div className="relative w-fit h-fit text-xs break-words flex items-start justify-start">
              {t("tags")}{" "}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
            <div className="relative w-full h-fit flex p-px rounded-md">
              <input
                value={questInfo?.details?.tags}
                onChange={(e) =>
                  dispatch(
                    setQuestInfo({
                      actionDetails: {
                        ...questInfo?.details,
                        tags: e.target.value,
                      },
                      actionMilestones: questInfo?.milestones,
                    })
                  )
                }
                placeholder={t("tagA")}
                className="relative bg-black border border-acei rounded-md p-1 text-xs h-10 w-full"
                style={{
                  resize: "none",
                }}
              />
            </div>
            {questInfo?.details?.tags?.split(",").pop()?.trim() &&
              HASHTAG_CONSTANTS?.some((tag) =>
                tag
                  .toLowerCase()
                  .includes(
                    questInfo?.details?.tags
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
                        questInfo?.details?.tags
                          ?.split(/,\s*|\s+|\s*$/)
                          ?.pop()
                          ?.toLowerCase() || ""
                      )
                    ).map((tag: string, index: number) => (
                      <div
                        key={index}
                        className="relative py-1 h-10 w-full flex items-center justify-center text-white border-y border-sol font-aust text-xs cursor-pointer hover:opacity-80"
                        onClick={() => {
                          const allArray = questInfo?.details?.tags
                            .split(/,\s*/)
                            .map((t) => t.trim());

                          if (!allArray.includes(tag.trim())) {
                            const tagsArray =
                              questInfo?.details?.tags?.split(/,\s*/);
                            tagsArray[tagsArray?.length - 1] = tag;
                            const newTags = tagsArray?.join(", ") + ", ";

                            dispatch(
                              setQuestInfo({
                                actionDetails: {
                                  ...questInfo?.details,
                                  tags: newTags,
                                },
                                actionMilestones: questInfo?.milestones,
                              })
                            );
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
              {t("max")}{" "}
              <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
            </div>
            <div className="relative w-full h-fit flex p-px rounded-md">
              <input
                value={questInfo?.details?.maxPlayerCount}
                onChange={(e) =>
                  dispatch(
                    setQuestInfo({
                      actionDetails: {
                        ...questInfo?.details,
                        maxPlayerCount: Number(e.target.value),
                      },
                      actionMilestones: questInfo?.milestones,
                    })
                  )
                }
                placeholder={t("maxA")}
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
          {t("des")} <p className="pl-2 flex text-sm text-calcetine">{">"}</p>
        </div>
        <div className="relative w-full h-fit flex p-px rounded-md">
          <textarea
            className="h-40 w-full border-acei border bg-black rounded-md p-2 text-xs"
            style={{
              resize: "none",
            }}
            placeholder={t("short")}
            value={questInfo?.details?.description}
            onChange={(e) =>
              dispatch(
                setQuestInfo({
                  actionDetails: {
                    ...questInfo?.details,
                    description: e.target.value,
                  },
                  actionMilestones: questInfo?.milestones,
                })
              )
            }
          ></textarea>
        </div>
      </div>
      <div className="flex flex-col items-start justify-start w-full h-fit gap-1 relative">
        <div className="relative w-fit h-fit text-sm break-words">
          {t("set")}
        </div>
        <GatedLogic
          questInfo={questInfo}
          dispatch={dispatch}
          join={true}
          t={t}
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

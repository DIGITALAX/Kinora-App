import { FunctionComponent } from "react";
import { CriteriaProps, VideoEligible } from "../../types/envoke.types";
import Image from "next/legacy/image";
import InfiniteScroll from "react-infinite-scroll-component";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import { Post, VideoMetadataV3 } from "../../../../../graphql/generated";
import { setQuestInfo } from "../../../../../redux/reducers/questInfoSlice";
import createMedia from "../../../../../lib/helpers/createMedia";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import { AiOutlineLoading } from "react-icons/ai";
import Eligible from "./Eligible";

const Criteria: FunctionComponent<CriteriaProps> = ({
  router,
  videoSearchLoading,
  videoSearch,
  setVideoSearch,
  getVideosSearch,
  getMoreVideosSearch,
  videoInfo,
  videos,
  getMoreVideosSample,
  chromadinVideos,
  dispatch,
  questInfo,
  milestonesOpen,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-full h-fit flex flex-col lg:flex-row gap-6 justify-start items-start">
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            <div className="relative w-fit h-fit items-start justify-start flex flex-col gap-1">
              <div className="relative w-fit h-fit items-start justify-start opacity-70">
                Kinora & Chromadin Video Search.
              </div>
              <div
                className="relative w-fit h-fit flex items-center justify-center text-xs cursor-pointer hover:opacity-70"
                onClick={() => router.push("/upload")}
              >
                Cant find a vid that you&apos;re looking for? Upload & post your
                own.
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex">
            <input
              className={`h-10 w-full bg-black border border-acei rounded-md p-1 text-xs ${
                videoSearchLoading && "opacity-70"
              }`}
              placeholder="Search video library."
              value={videoSearch || ""}
              onChange={(e) => {
                setVideoSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && videoSearch?.trim() !== "") {
                  getVideosSearch();
                }
              }}
            />
            {videoSearchLoading && (
              <div className="absolute z-1 right-4 w-fit h-full flex items-center justify-center">
                <div className="relative w-fit h-fit flex animate-spin items-center justify-center">
                  <AiOutlineLoading color={"white"} size={15} />
                </div>
              </div>
            )}
          </div>
          <div className="relative flex w-full h-fit items-start justify-start">
            {(videos?.length > 0 || chromadinVideos?.length > 0) && (
              <InfiniteScroll
                dataLength={
                  videoSearch?.trim() !== "" && videos?.length > 0
                    ? videos?.length + chromadinVideos?.length
                    : chromadinVideos?.length
                }
                hasMore={
                  videoSearch?.trim() !== "" && videos?.length > 0
                    ? videoInfo?.hasMoreKinora
                    : videoInfo?.hasMoreChromadin
                }
                next={
                  videoSearch?.trim() !== "" && videos?.length > 0
                    ? getMoreVideosSearch
                    : getMoreVideosSample
                }
                loader={<></>}
                className="relative w-full h-fit flex overflow-y-scroll"
              >
                <div className="relative w-full flex flex-wrap gap-3 items-start justify-start h-fit max-h-[28rem] rounded-md">
                  {(videoSearch?.trim() !== "" && videos?.length > 0
                    ? videos
                    : chromadinVideos
                  )?.map((item: Post, index: number) => {
                    const pfp = createProfilePicture(
                      item?.by?.metadata?.picture
                    );
                    const image = createMedia(item?.metadata);
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-60 flex items-center cursor-pointer hover:opacity-80 justify-center p-px rounded-md ${
                          (Array.isArray(
                            questInfo?.milestones?.[
                              milestonesOpen.findIndex(
                                (item: boolean) => item === true
                              ) !== -1
                                ? milestonesOpen.findIndex(
                                    (item: boolean) => item === true
                                  )
                                : 0
                            ]?.eligibility
                          )
                            ? questInfo?.milestones?.[
                                milestonesOpen.findIndex(
                                  (item: boolean) => item === true
                                ) !== -1
                                  ? milestonesOpen.findIndex(
                                      (item: boolean) => item === true
                                    )
                                  : 0
                              ]?.eligibility
                            : []
                          ).filter(
                            (value) => value?.video?.id === item?.id
                          )?.[0] && "border-2 border-acei opacity-50"
                        }`}
                        id="northern"
                        onClick={() => {
                          const milestones = [...questInfo?.milestones];

                          milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ] = {
                            ...milestones[
                              milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ],
                            eligibility: (
                              questInfo?.milestones?.[
                                milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ]?.eligibility || []
                            )?.filter(
                              (value) => value?.video?.id == item?.id
                            )?.[0]
                              ? questInfo?.milestones?.[
                                  milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen.findIndex(
                                        (item: boolean) => item == true
                                      )
                                    : 0
                                ]?.eligibility?.map((item) => {
                                  return {
                                    ...item,
                                    open: false,
                                  };
                                })
                              : [
                                  ...(questInfo?.milestones?.[
                                    milestonesOpen.findIndex(
                                      (item: boolean) => item == true
                                    ) !== -1
                                      ? milestonesOpen.findIndex(
                                          (item: boolean) => item == true
                                        )
                                      : 0
                                  ]?.eligibility?.map((item) => {
                                    return {
                                      ...item,
                                      open: false,
                                    };
                                  }) || []),
                                  {
                                    video: item,
                                    open: true,
                                    criteria: {},
                                  },
                                ],
                          };

                          dispatch(
                            setQuestInfo({
                              actionDetails: questInfo?.details,
                              actionMilestones: milestones,
                            })
                          );
                        }}
                      >
                        <div className="relative w-full h-full relative rounded-md flex">
                          <MediaSwitch
                            srcUrl={image?.cover!}
                            classNameImage={
                              "relative rounded-md w-full h-full flex"
                            }
                            type="static"
                            postId={""}
                          />
                        </div>
                        <div className="absolute flex flex-col gap-1 text-xxs items-start justify-start top-2 left-2 z-10">
                          <div className="relative w-fit h-fit flex items-start justify-start">
                            {(item?.metadata as VideoMetadataV3)?.title}
                          </div>
                          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1">
                            <div
                              className="rounded-full w-4 h-4 p-px flex items-center justify-center"
                              id="northern"
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
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {item?.by?.handle?.suggestedFormatted?.localName}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfiniteScroll>
            )}
          </div>
        </div>
        <div className="relative w-full h-fit flex max-h-[35rem] overflow-y-scroll">
          <div className="relative justify-start items-start flex w-full h-fit flex-col gap-4">
            {(
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility || []
            )?.map((item: VideoEligible, index: number) => {
              const image = createMedia(item?.video?.metadata);
              return item?.open ? (
                <Eligible
                  item={item}
                  index={index}
                  key={index}
                  dispatch={dispatch}
                  questInfo={questInfo}
                  milestonesOpen={milestonesOpen}
                />
              ) : (
                <div
                  key={index}
                  className="relative w-full h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
                  onClick={() => {
                    const milestones = [...questInfo?.milestones];
                    let eligibility = [
                      ...(milestones?.[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.eligibility || []),
                    ]?.map((item) => {
                      return {
                        ...item,
                        open: false,
                      };
                    });

                    eligibility[index] = {
                      ...eligibility[index],
                      open: true,
                    };
                    milestones[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ] = {
                      ...milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ],
                      eligibility,
                    };

                    dispatch(
                      setQuestInfo({
                        actionDetails: questInfo?.details,
                        actionMilestones: milestones,
                      })
                    );
                  }}
                >
                  <div
                    className="relative w-16 h-10 p-px rounded-md flex items-center justify-center"
                    id="northern"
                  >
                    <div className="relative w-full h-full flex items-center justify-center bg-black rounded-md">
                      <MediaSwitch
                        srcUrl={image?.asset!}
                        srcCover={image?.cover!}
                        classNameVideo={{
                          borderRadius: "0.375rem",
                          objectFit: "cover",
                          width: "100%",
                          height: "100%",
                          position: "relative",
                          display: "flex",
                        }}
                        type="video"
                        hidden
                        postId={""}
                      />
                    </div>
                  </div>
                  <div className="relative w-fit h-fit flex items-start justify-start text-xxs">
                    {(item?.video?.metadata as VideoMetadataV3)?.title?.length >
                    30
                      ? (
                          item?.video?.metadata as VideoMetadataV3
                        )?.title?.slice(0, 28) + "..."
                      : (item?.video?.metadata as VideoMetadataV3)?.title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Criteria;

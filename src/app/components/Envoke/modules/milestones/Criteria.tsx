import { FunctionComponent, JSX, useContext } from "react";
import { CriteriaProps, VideoEligible } from "../../types/envoke.types";
import Image from "next/legacy/image";
import InfiniteScroll from "react-infinite-scroll-component";
import { AiOutlineLoading } from "react-icons/ai";
import Eligible from "./Eligible";
import { ModalContext } from "@/app/providers";
import { useRouter } from "next/navigation";
import { Post, VideoMetadata } from "@lens-protocol/client";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import MediaSwitch from "@/app/components/Common/modules/MediaSwitch";
import { handleMedia } from "@/app/lib/helpers/handleMedia";

const Criteria: FunctionComponent<CriteriaProps> = ({
  videoSearchLoading,
  videoSearch,
  setVideoSearch,
  getVideosSearch,
  getMoreVideosSearch,
  videoInfo,
  videos,
  getMoreVideosSample,
  chromadinVideos,
  milestonesOpen,
  dict,
}): JSX.Element => {
  const router = useRouter();
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-full h-fit flex flex-col lg:flex-row gap-6 justify-start items-start">
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            <div className="relative w-fit h-fit items-start justify-start flex flex-col gap-1">
              <div className="relative w-fit h-fit items-start justify-start opacity-70">
                {dict?.search}
              </div>
              <div
                className="relative w-fit h-fit flex items-center justify-center break-all whitespace-preline text-xs cursor-pointer hover:opacity-70"
                onClick={() => {
                  context?.setRouterChangeLoading(true);
                  router.push("/upload");
                }}
              >
                {dict?.find}
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex">
            <input
              className={`h-10 w-full bg-black border border-acei rounded-md p-1 text-xs ${
                videoSearchLoading && "opacity-70"
              }`}
              placeholder={dict?.lib}
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
                height={"28rem"}
                className="relative w-full h-fit flex overflow-y-scroll"
              >
                <div className="relative w-full flex flex-wrap gap-3 items-start justify-start h-fit max-h-[28rem] rounded-md">
                  {(videoSearch?.trim() !== "" && videos?.length > 0
                    ? videos
                    : chromadinVideos
                  )?.map((item: Post, index: number) => {
                    const image = handleMedia(
                      (item?.metadata as VideoMetadata)?.video
                    );
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-60 flex items-center cursor-pointer hover:opacity-80 justify-center p-px rounded-md ${
                          (Array.isArray(
                            context?.questInfo?.milestones?.[
                              milestonesOpen.findIndex(
                                (item: boolean) => item === true
                              ) !== -1
                                ? milestonesOpen.findIndex(
                                    (item: boolean) => item === true
                                  )
                                : 0
                            ]?.eligibility
                          )
                            ? context?.questInfo?.milestones?.[
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
                          const milestones = [
                            ...(context?.questInfo?.milestones || []),
                          ];

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
                              context?.questInfo?.milestones?.[
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
                              ? context?.questInfo?.milestones?.[
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
                                })!
                              : [
                                  ...(context?.questInfo?.milestones?.[
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

                          context?.setQuestInfo((prev) => ({
                            ...prev,
                            milestones,
                          }));
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
                            {(item?.metadata as VideoMetadata)?.title}
                          </div>
                          <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1">
                            <div
                              className="rounded-full w-4 h-4 p-px flex items-center justify-center"
                              id="northern"
                            >
                              <div className="relative w-full h-full flex items-center justify-center rounded-full">
                                <Image
                                  src={handleProfilePicture(
                                    item?.author?.metadata?.picture
                                  )}
                                  draggable={false}
                                  className="rounded-full"
                                  objectFit="cover"
                                  layout="fill"
                                />
                              </div>
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {Number(item?.author?.username?.localName) > 10
                                ? item?.author?.username?.localName?.slice(
                                    0,
                                    10
                                  ) + "..."
                                : item?.author?.username?.localName}
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
              context?.questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.eligibility || []
            )?.map((item: VideoEligible, index: number) => {
              const image = handleMedia(
                (item?.video?.metadata as VideoMetadata)?.video
              );
              return item?.open ? (
                <Eligible
                  dict={dict}
                  item={item}
                  index={index}
                  key={index}
                  milestonesOpen={milestonesOpen}
                />
              ) : (
                <div
                  key={index}
                  className="relative w-full h-fit flex items-center justify-start flex-row gap-2 cursor-pointer hover:opacity-70"
                  onClick={() => {
                    const milestones = [
                      ...(context?.questInfo?.milestones || []),
                    ];
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

                    context?.setQuestInfo((prev) => ({
                      ...prev,
                      milestones,
                    }));
                  }}
                >
                  <div
                    className="relative w-16 h-10 p-px rounded-md flex items-center justify-center"
                    id="northern"
                  >
                    <div className="relative w-full h-full flex items-center justify-center bg-black rounded-md">
                      <MediaSwitch
                        srcUrl={image?.url!}
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
                    {Number(
                      (item?.video?.metadata as VideoMetadata)?.title?.length
                    ) > 30
                      ? (item?.video?.metadata as VideoMetadata)?.title?.slice(
                          0,
                          28
                        ) + "..."
                      : (item?.video?.metadata as VideoMetadata)?.title}
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

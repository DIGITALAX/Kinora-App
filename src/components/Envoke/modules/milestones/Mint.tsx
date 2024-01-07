import Waveform from "@/components/Common/modules/Waveform";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../../lib/constants";
import { MintProps } from "../../types/envoke.types";
import handleMediaUpload from "../../../../../lib/helpers/handleMediaUpload";
import { setQuestInfo } from "../../../../../redux/reducers/questInfoSlice";
import MediaSwitch from "@/components/Common/modules/MediaSwitch";
import {
  IoMusicalNotesOutline,
  IoVideocamOutline,
  IoImageOutline,
} from "react-icons/io5";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { Player } from "@livepeer/react";

const Mint: FunctionComponent<MintProps> = ({
  item,
  dispatch,
  questInfo,
  milestonesOpen,
  index,
}): JSX.Element => {
  return item?.open ? (
    <div className="relative w-full h-fit flex items-start justify-start flex-col sm:flex-row md:flex-col xl:flex-row gap-6 font-bit text-white">
      <div className="relative w-fit h-fit flex items-center justify-center">
        <label
          className="relative w-52 h-52 rounded-sm cursor-pointer p-px"
          id="northern"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-sm">
            {item?.images?.[0] || item?.media === "static" ? (
              <Image
                layout="fill"
                src={
                  item?.images?.[0]?.includes("ipfs://")
                    ? `${INFURA_GATEWAY}/ipfs/${
                        item?.images?.[0]?.split("ipfs://")?.[1]
                      }`
                    : item?.images?.[0]
                }
                objectFit="cover"
                draggable={false}
                className="relative rounded-sm w-full h-full flex"
              />
            ) : (
              <>
                {item?.media === "audio" ? (
                  item?.mediaCover && (
                    <Image
                      layout="fill"
                      src={
                        item?.mediaCover?.includes("ipfs://")
                          ? `${INFURA_GATEWAY}/ipfs/${
                              item?.mediaCover?.split("ipfs://")?.[1]
                            }`
                          : item?.mediaCover
                      }
                      objectFit="cover"
                      draggable={false}
                      className="relative rounded-sm w-full h-full flex"
                    />
                  )
                ) : (
                  <div
                    id={item?.video}
                    className="relative rounded-sm w-full h-full flex object-cover"
                  >
                    <KinoraPlayerWrapper
                      parentId={item?.video}
                      key={item?.video}
                      customControls={true}
                      play={true}
                      fillWidthHeight
                      volume={{
                        id: Math.random() * 0.5,
                        level: 0,
                      }}
                    >
                      {(setMediaElement: (node: HTMLVideoElement) => void) => (
                        <Player
                          mediaElementRef={setMediaElement}
                          src={
                            item?.video?.includes("ipfs://")
                              ? `${INFURA_GATEWAY}/ipfs/${
                                  item?.video?.split("ipfs://")?.[1]
                                }`
                              : item?.video?.includes("ar://")
                              ? `https://arweave.net/${item?.video
                                  ?.split("ar://")?.[1]
                                  ?.replace(/"/g, "")
                                  ?.trim()}`
                              : item?.video
                          }
                          muted
                          loop
                          autoPlay
                          objectFit="cover"
                          autoUrlUpload={{
                            fallback: true,
                            ipfsGateway: INFURA_GATEWAY,
                          }}
                        />
                      )}
                    </KinoraPlayerWrapper>
                  </div>
                )}
              </>
            )}
            <input
              hidden
              type="file"
              accept={
                item?.media === "video" ? "video/mp4" : "image/png, image/gif"
              }
              multiple={false}
              onChange={(e) =>
                e?.target?.files?.[0] &&
                handleMediaUpload(
                  e,
                  () => {},
                  () => {},
                  (e) => {
                    const milestones = [...questInfo?.milestones];
                    const rewards = [
                      ...milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.rewards?.rewards721,
                    ];
                    rewards[index] = {
                      ...milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.rewards?.rewards721?.[index],
                      details: {
                        ...milestones[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards?.rewards721?.[index]?.details,
                        images:
                          milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.rewards?.rewards721?.[index]?.details?.media ==
                          "static"
                            ? [e]
                            : [],
                        video:
                          milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.rewards?.rewards721?.[index]?.details?.media ==
                          "video"
                            ? e
                            : "",
                        mediaCover:
                          milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.rewards?.rewards721?.[index]?.details?.media ==
                          "audio"
                            ? e
                            : "",
                      },
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
                      rewards: {
                        ...milestones[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards,
                        rewards721: rewards,
                      },
                    };

                    dispatch(
                      setQuestInfo({
                        actionDetails: questInfo?.details,
                        actionMilestones: milestones,
                      })
                    );
                  }
                )
              }
            />
          </div>
        </label>
        <div className="absolute z-10 left-2 top-2 flex flex-row gap-2">
          {[
            {
              type: "static",
              component: <IoImageOutline color="white" size={12} />,
            },
            {
              type: "audio",
              component: <IoMusicalNotesOutline color="white" size={12} />,
            },
            {
              type: "video",
              component: <IoVideocamOutline color="white" size={12} />,
            },
          ]?.map(
            (
              value: {
                type: string;
                component: JSX.Element;
              },
              indexTwo: number
            ) => {
              return (
                <div
                  key={indexTwo}
                  className={`relative bg-black rounded-full w-5 p-1 flex items-center justify-center h-5 border border-acei cursor-pointer active:scale-95 ${
                    item?.media != value?.type && "opacity-50"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const milestones = [...questInfo?.milestones];
                    const rewards = [
                      ...milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.rewards?.rewards721,
                    ];
                    rewards[index] = {
                      ...milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.rewards?.rewards721?.[index],
                      details: {
                        ...milestones[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards?.rewards721?.[index]?.details,
                        media: value.type,
                      },
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
                      rewards: {
                        ...milestones[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards,
                        rewards721: rewards,
                      },
                    };

                    dispatch(
                      setQuestInfo({
                        actionDetails: questInfo?.details,
                        actionMilestones: milestones,
                      })
                    );
                  }}
                >
                  <div className="relative w-fit h-fit flex items-center justify-center">
                    {value.component}
                  </div>
                </div>
              );
            }
          )}
        </div>
        {(item?.audio?.trim() !== "" ||
          item?.media === "video" ||
          item?.media === "audio") &&
          item?.media !== "static" && (
            <Waveform
              loaderEnd={() => {}}
              loaderStart={() => {}}
              internalFunction={(e) => {
                const milestones = [...questInfo?.milestones];
                const rewards = [
                  ...milestones[
                    milestonesOpen.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        )
                      : 0
                  ]?.rewards?.rewards721,
                ];
                rewards[index] = {
                  ...milestones[
                    milestonesOpen.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        )
                      : 0
                  ]?.rewards?.rewards721?.[index],
                  details: {
                    ...milestones[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.rewards?.rewards721?.[index]?.details,
                    audio:
                      milestones[
                        milestonesOpen.findIndex(
                          (item: boolean) => item == true
                        ) !== -1
                          ? milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            )
                          : 0
                      ]?.rewards?.rewards721?.[index]?.details?.media == "audio"
                        ? e
                        : "",
                  },
                };
                milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
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
                  rewards: {
                    ...milestones[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.rewards,
                    rewards721: rewards,
                  },
                };

                dispatch(
                  setQuestInfo({
                    actionDetails: questInfo?.details,
                    actionMilestones: milestones,
                  })
                );
              }}
              type={item?.media}
              video={item?.video}
              audio={item?.audio}
              upload
              keyValue={item?.audio || item?.video}
            />
          )}
      </div>
      <div className="relative w-full h-fit flex items-center justify-center gap-2 flex-col">
        <input
          className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
          placeholder="Title."
          value={item?.title}
          onChange={(e) => {
            const milestones = [...questInfo?.milestones];
            const rewards = [
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.rewards?.rewards721,
            ];
            rewards[index] = {
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.rewards?.rewards721?.[index],
              details: {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.rewards?.rewards721?.[index]?.details,
                title: e.target.value,
              },
            };
            milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ] = {
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ],
              rewards: {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.rewards,
                rewards721: rewards,
              },
            };

            dispatch(
              setQuestInfo({
                actionDetails: questInfo?.details,
                actionMilestones: milestones,
              })
            );
          }}
        />
        <textarea
          className="h-40 w-full bg-black border border-acei rounded-md p-2 text-xs"
          style={{
            resize: "none",
          }}
          placeholder="Description."
          value={item?.description}
          onChange={(e) => {
            const milestones = [...questInfo?.milestones];
            const rewards = [
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.rewards?.rewards721,
            ];
            rewards[index] = {
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.rewards?.rewards721?.[index],
              details: {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.rewards?.rewards721?.[index]?.details,
                description: e.target.value,
              },
            };
            milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ] = {
              ...milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ],
              rewards: {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.rewards,
                rewards721: rewards,
              },
            };

            dispatch(
              setQuestInfo({
                actionDetails: questInfo?.details,
                actionMilestones: milestones,
              })
            );
          }}
        ></textarea>
      </div>
    </div>
  ) : (
    <div
      className="relative w-full h-fit flex flex-row items-center justify-start gap-6 cursor-pointer hover:opacity-80 font-bit text-white text-sm"
      onClick={() => {
        const milestones = [...questInfo?.milestones];

        const rewards = [
          ...milestones[
            milestonesOpen.findIndex((item: boolean) => item == true) !== -1
              ? milestonesOpen.findIndex((item: boolean) => item == true)
              : 0
          ]?.rewards?.rewards721,
        ];
        let newRewards = rewards?.map((item) => {
          return {
            ...item,
            details: {
              ...item?.details,
              open: false,
            },
          };
        });
        newRewards[index] = {
          ...milestones[
            milestonesOpen.findIndex((item: boolean) => item == true) !== -1
              ? milestonesOpen.findIndex((item: boolean) => item == true)
              : 0
          ]?.rewards?.rewards721?.[index],
          details: {
            ...milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.rewards?.rewards721?.[index]?.details,
            open: true,
          },
        };
        milestones[
          milestonesOpen.findIndex((item: boolean) => item == true) !== -1
            ? milestonesOpen.findIndex((item: boolean) => item == true)
            : 0
        ] = {
          ...milestones[
            milestonesOpen.findIndex((item: boolean) => item == true) !== -1
              ? milestonesOpen.findIndex((item: boolean) => item == true)
              : 0
          ],
          rewards: {
            ...milestones[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.rewards,
            rewards721: newRewards,
          },
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
        className="relative w-8 h-8 flex items-center justify-center rounded-sm p-px"
        id="northern"
      >
        <MediaSwitch
          classNameImage="rounded-sm"
          classNameVideo={{
            borderRadius: "0.125rem",
            objectFit: "cover",
            width: "100%",
            height: "100%",
            position: "relative",
            display: "flex",
          }}
          postId={""}
          classNameAudio="rounded-sm"
          hidden
          type={item?.media}
          srcUrl={
            item?.media == "video"
              ? item?.video
              : item?.media == "audio"
              ? item?.audio
              : item?.images?.[0]
          }
          srcCover={item?.mediaCover}
        />
      </div>
      <div className="relative w-fit h-fit flex items-center justify-center">
        {item?.title}
      </div>
    </div>
  );
};

export default Mint;

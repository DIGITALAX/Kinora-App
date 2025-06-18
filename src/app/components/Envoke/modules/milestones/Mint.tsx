import Image from "next/legacy/image";
import {
  IoMusicalNotesOutline,
  IoVideocamOutline,
  IoImageOutline,
} from "react-icons/io5";
import { Player } from "@livepeer/react";
import { ImCross } from "react-icons/im";
import { KinoraPlayerWrapper } from "kinora-sdk";
import { FunctionComponent, useContext } from "react";
import { ModalContext } from "@/app/providers";
import { MintProps } from "../../types/envoke.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import MediaSwitch from "@/app/components/Common/modules/MediaSwitch";
import Waveform from "@/app/components/Common/modules/Waveform";
import handleMediaUpload from "@/app/lib/helpers/handleMediaUpload";

const Mint: FunctionComponent<MintProps> = ({
  dict,
  item,
  milestonesOpen,
  index,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return item?.open ? (
    <div className="relative w-full h-fit flex items-start justify-start flex-col sm:flex-row md:flex-col xl:flex-row gap-6 font-bit text-white">
      <div className="relative w-full sm:w-fit h-fit flex items-center justify-center">
        <label
          className="relative w-full sm:w-52 h-52 rounded-sm cursor-pointer p-px"
          id="northern"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-sm">
            <div className="absolute top-2 right-2 flex items-center justify-center w-fit h-fit">
              <div
                className="relative w-5 h-5 border border-acei flex items-center justify-center rounded-full p-1 bg-black cursor-pointer active:scale-95 z-20"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  let milestones = [...(context?.questInfo?.milestones || [])];

                  const rewards721 = [
                    ...milestones?.[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.rewards?.rewards721
                      ?.filter((_, i) => i !== index)
                      ?.filter(Boolean),
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
                    rewards: {
                      rewards721,
                      rewards20:
                        milestones[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.rewards?.rewards20,
                    },
                  };

                  context?.setQuestInfo((prev) => ({
                    ...prev,
                    milestones,
                  }));
                }}
              >
                <ImCross color={"white"} size={8} />
              </div>
            </div>
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
                          // autoUrlUpload={{
                          //   fallback: true,
                          //   ipfsGateway: INFURA_GATEWAY,
                          // }}
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
                    const milestones = [
                      ...(context?.questInfo?.milestones || []),
                    ];
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

                    context?.setQuestInfo((prev) => ({
                      ...prev,
                      milestones,
                    }));
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
                    const milestones = [
                      ...(context?.questInfo?.milestones || []),
                    ];
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

                    context?.setQuestInfo((prev) => ({
                      ...prev,
                      milestones,
                    }));
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
                const milestones = [...(context?.questInfo?.milestones || [])];
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

                context?.setQuestInfo((prev) => ({
                  ...prev,
                  milestones,
                }));
              }}
              type={item?.media}
              video={item?.video}
              audio={item?.audio}
              upload
              keyValue={item?.audio || item?.video}
            />
          )}
      </div>
      <div className="relative w-full h-full flex items-center justify-between gap-2 flex-col">
        <input
          className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
          placeholder={dict?.titi}
          value={item?.title}
          onChange={(e) => {
            const milestones = [...(context?.questInfo?.milestones || [])];
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

            context?.setQuestInfo((prev) => ({
              ...prev,
              milestones,
            }));
          }}
        />
        <textarea
          className="h-20 w-full bg-black border border-acei rounded-md p-2 text-xs"
          style={{
            resize: "none",
          }}
          placeholder={dict?.desc}
          value={item?.description}
          onChange={(e) => {
            const milestones = [...(context?.questInfo?.milestones || [])];
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

            context?.setQuestInfo((prev) => ({
              ...prev,
              milestones,
            }));
          }}
        ></textarea>
        <textarea
          className="h-16 w-full bg-black border border-acei rounded-md p-2 text-xs"
          style={{
            resize: "none",
          }}
          placeholder="Prompt."
          value={item?.prompt}
          onChange={(e) => {
            const milestones = [...(context?.questInfo?.milestones || [])];
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
                prompt: e.target.value,
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

            context?.setQuestInfo((prev) => ({
              ...prev,
              milestones,
            }));
          }}
        ></textarea>
      </div>
    </div>
  ) : (
    <div
      className="relative w-full h-fit flex flex-row items-center justify-start gap-6 cursor-pointer hover:opacity-80 font-bit text-white text-sm"
      onClick={() => {
        const milestones = [...(context?.questInfo?.milestones || [])];

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

        context?.setQuestInfo((prev) => ({
          ...prev,
          milestones,
        }));
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

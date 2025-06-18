import { FunctionComponent, JSX, useContext } from "react";
import { GatedLogicProps } from "../../types/envoke.types";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { ImCross } from "react-icons/im";
import { ModalContext } from "@/app/providers";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";

const GatedLogic: FunctionComponent<GatedLogicProps> = ({
  dict,
  milestonesOpen,
  collections,
  collectionsInfo,
  collectionsSearch,
  getMoreCollectionsSample,
  getCollectionsSearch,
  getMoreCollectionsSearch,
  setCollectionsInfo,
  setCollectionsSearch,
  join,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      {!join && (
        <div className="relative w-fit h-fit items-start justify-start opacity-70">
          {dict?.gatJ}
        </div>
      )}
      <div className="relative w-fit h-fit items-start justify-start flex flex-col gap-1">
        <div
          className={`relative w-fit h-fit flex items-center justify-center ${
            join ? "text-xxs" : "text-sm"
          }`}
        >
          {dict?.hold}
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center rounded-md border border-acei flex-row gap-1 text-xxs">
          <div
            className={`relative w-16 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
              (
                join
                  ? context?.questInfo?.details?.gated?.oneOf
                  : context?.questInfo?.milestones?.[
                      milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen!?.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.gated?.oneOf
              )
                ? "bg-verde text-black"
                : "text-white"
            }`}
            onClick={() => {
              if (join) {
                context?.setQuestInfo((prev) => ({
                  ...prev,
                  details: {
                    ...prev?.details,
                    gated: {
                      ...prev?.details?.gated,
                      oneOf: true,
                    },
                  },
                }));
              } else {
                const milestones = [...(context?.questInfo?.milestones || [])];
                milestones[
                  milestonesOpen!?.findIndex(
                    (item: boolean) => item == true
                  ) !== -1
                    ? milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      )
                    : 0
                ] = {
                  ...milestones[
                    milestonesOpen!?.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen!?.findIndex(
                          (item: boolean) => item == true
                        )
                      : 0
                  ],
                  gated: {
                    ...milestones[
                      milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen!?.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.gated,
                    oneOf: true,
                  },
                };

                context?.setQuestInfo((prev) => ({
                  ...prev,
                  actionMilestones: milestones,
                }));
              }
            }}
          >
            {dict?.one}
          </div>
          <div
            className={`relative w-16 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
              (
                join
                  ? !context?.questInfo?.details?.gated?.oneOf
                  : !context?.questInfo?.milestones?.[
                      milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen!?.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.gated?.oneOf
              )
                ? "bg-verde text-black"
                : "text-white"
            }`}
            onClick={() => {
              if (join) {
                context?.setQuestInfo((prev) => ({
                  ...prev,
                  details: {
                    ...prev?.details,
                    gated: {
                      ...prev?.details?.gated,
                      oneOf: false,
                    },
                  },
                }));
              } else {
                const milestones = [...(context?.questInfo?.milestones || [])];
                milestones[
                  milestonesOpen!?.findIndex(
                    (item: boolean) => item == true
                  ) !== -1
                    ? milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      )
                    : 0
                ] = {
                  ...milestones[
                    milestonesOpen!?.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen!?.findIndex(
                          (item: boolean) => item == true
                        )
                      : 0
                  ],
                  gated: {
                    ...milestones[
                      milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen!?.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.gated,
                    oneOf: false,
                  },
                };

                context?.setQuestInfo((prev) => ({
                  ...prev,
                  actionMilestones: milestones,
                }));
              }
            }}
          >
            {dict?.all}
          </div>
        </div>
      </div>
      <div
        className={`relative w-full h-fit flex gap-10 justify-start items-start flex-col xl:flex-row`}
      >
        <div className="relative w-fit w-full sm:min-w-[20rem] h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            {dict?.cons}
          </div>
          <div className="relative flex flex-col w-full h-fit gap-4 items-start justify-start">
            {ACCEPTED_TOKENS.map((item: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex flex-col sm:flex-row items-center justify-center gap-3 ${
                    (
                      join
                        ? context?.questInfo?.details?.gated?.erc20Addresses?.includes(
                            item?.[2] as `0x${string}`
                          )
                        : context?.questInfo?.milestones?.[
                            milestonesOpen!?.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.gated?.erc20Addresses?.includes(
                            item?.[2] as `0x${string}`
                          )
                    )
                      ? "opacity-100"
                      : "opacity-50"
                  }`}
                >
                  <div
                    className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95`}
                    key={index}
                    onClick={() => {
                      if (join) {
                        context?.setQuestInfo((prev) => ({
                          ...prev,
                          details: {
                            ...prev?.details,
                            gated: {
                              ...prev?.details?.gated,
                              erc20Addresses:
                                prev?.details?.gated?.erc20Addresses?.includes(
                                  item?.[2] as `0x${string}`
                                )
                                  ? prev?.details?.gated?.erc20Addresses?.filter(
                                      (address: string) =>
                                        address?.toLowerCase() !==
                                        item?.[2]?.toLowerCase()
                                    )
                                  : [
                                      ...(prev?.details?.gated
                                        ?.erc20Addresses || []),
                                      item?.[2] as `0x${string}`,
                                    ],
                            },
                          },
                        }));
                      } else {
                        const milestones = [
                          ...(context?.questInfo?.milestones || []),
                        ];

                        milestones[
                          milestonesOpen!?.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ] = {
                          ...milestones[
                            milestonesOpen!?.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ],
                          gated: {
                            ...milestones[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.gated,
                            erc20Addresses: (
                              milestones[
                                milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ]?.gated?.erc20Addresses || []
                            )?.includes(item?.[2] as `0x${string}`)
                              ? milestones[
                                  milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen!?.findIndex(
                                        (item: boolean) => item == true
                                      )
                                    : 0
                                ]?.gated?.erc20Addresses?.filter(
                                  (address: string) =>
                                    address?.toLowerCase() !==
                                    item?.[2]?.toLowerCase()
                                )
                              : [
                                  ...(milestones[
                                    milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    ) !== -1
                                      ? milestonesOpen!?.findIndex(
                                          (item: boolean) => item == true
                                        )
                                      : 0
                                  ]?.gated?.erc20Addresses || []),
                                  item?.[2] as `0x${string}`,
                                ],
                          },
                        };

                        context?.setQuestInfo((prev) => ({
                          ...prev,
                          actionMilestones: milestones,
                        }));
                      }
                    }}
                  >
                    <div className="relative w-7 h-8 flex items-center justify-center rounded-full">
                      <Image
                        src={`${INFURA_GATEWAY}/ipfs/${item[0]}`}
                        className="flex rounded-full"
                        draggable={false}
                        layout="fill"
                      />
                    </div>
                  </div>
                  <div className="relative w-full sm:w-20 h-fit flex items-center justify-center">
                    {item[1]}
                  </div>
                  <div className="relative w-full h-fit flex items-center justify-center">
                    <input
                      value={
                        join
                          ? context?.questInfo?.details?.gated
                              ?.erc20Thresholds?.[
                              context?.questInfo?.details?.gated?.erc20Addresses?.indexOf(
                                item[2] as `0x${string}`
                              )
                            ] || ""
                          : context?.questInfo?.milestones?.[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.gated?.erc20Thresholds?.[
                              context?.questInfo?.milestones?.[
                                milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ]?.gated?.erc20Addresses?.indexOf(
                                item[2] as `0x${string}`
                              )
                            ] || ""
                      }
                      onChange={(e) => {
                        if (join) {
                          const thresholds = [
                            ...(context?.questInfo?.details?.gated
                              ?.erc20Thresholds || []),
                          ];

                          thresholds[
                            context?.questInfo?.details?.gated?.erc20Addresses!?.indexOf(
                              item[2] as `0x${string}`
                            )
                          ] = Number(e.target.value);

                          context?.setQuestInfo((prev) => ({
                            ...prev,
                            actionDetails: {
                              ...prev?.details,
                              gated: {
                                ...prev?.details?.gated,
                                erc20Thresholds: thresholds,
                              },
                            },
                          }));
                        } else {
                          const milestones = [
                            ...(context?.questInfo?.milestones || []),
                          ];
                          const thresholds = [
                            ...(milestones[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.gated?.erc20Thresholds || []),
                          ];

                          thresholds[
                            context?.questInfo?.milestones?.[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.gated?.erc20Addresses!?.indexOf(
                              item[2] as `0x${string}`
                            )
                          ] = Number(e.target.value);
                          milestones[
                            milestonesOpen!?.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ] = {
                            ...milestones[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ],
                            gated: {
                              ...milestones[
                                milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ]?.gated,
                              erc20Thresholds: thresholds,
                            },
                          };

                          context?.setQuestInfo((prev) => ({
                            ...prev,
                            actionMilestones: milestones,
                          }));
                        }
                      }}
                      type="number"
                      className="h-10 w-full bg-black border border-acei flex rounded-md p-1 text-xs"
                      placeholder={dict?.min}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            {dict?.consN}
          </div>
          {(join
            ? context?.questInfo?.details?.gated?.erc721TokenIds || []
            : context?.questInfo?.milestones?.[
                milestonesOpen!?.findIndex((item: boolean) => item == true) !==
                -1
                  ? milestonesOpen!?.findIndex((item: boolean) => item == true)
                  : 0
              ]?.gated?.erc721TokenIds || []
          )?.length > 0 && (
            <div className="relative w-full h-fit flex overflow-x-scroll max-w-[20rem]">
              <div className="relative w-fit h-fit flex flex-row gap-2 items-start justify-start">
                {(join
                  ? context?.questInfo?.details?.gated?.erc721TokenIds
                  : context?.questInfo?.milestones?.[
                      milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen!?.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.gated?.erc721TokenIds
                )?.map((item, index: number) => {
                  return (
                    <div
                      key={index}
                      className={`relative w-10 h-10 flex items-center cursor-pointer hover:opacity-80 justify-center p-px rounded-md`}
                      id="northern"
                    >
                      <div className="relative w-full h-full relative rounded-md">
                        <Image
                          className={"rounded-md"}
                          draggable={false}
                          src={`${INFURA_GATEWAY}/ipfs/${
                            item?.metadata?.mediaCover?.split("ipfs://")?.[1]
                              ? item?.metadata?.mediaCover?.split(
                                  "ipfs://"
                                )?.[1]
                              : item?.metadata?.images?.[0]?.split(
                                  "ipfs://"
                                )?.[1]
                          }`}
                          objectFit="cover"
                          layout="fill"
                        />
                      </div>
                      <div
                        className="absolute w-5 h-5 flex cursor-pointer bg-black rounded-full border border-acei hover:opacity-80 p-1 items-center justify-center"
                        onClick={() => {
                          if (join) {
                            const tokenIds = [
                              ...(context?.questInfo?.details?.gated
                                ?.erc721TokenIds || []),
                            ];

                            context?.setQuestInfo((prev) => ({
                              ...prev,
                              details: {
                                ...prev?.details,
                                gated: {
                                  ...prev?.details?.gated,
                                  erc721TokenIds: tokenIds?.filter(
                                    (token) =>
                                      token?.collectionId !== item?.collectionId
                                  ),
                                },
                              },
                            }));
                          } else {
                            const milestones = [
                              ...(context?.questInfo?.milestones || []),
                            ];
                            milestones[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ] = {
                              ...milestones[
                                milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ],
                              gated: {
                                ...milestones[
                                  milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen!?.findIndex(
                                        (item: boolean) => item == true
                                      )
                                    : 0
                                ]?.gated,
                                erc721TokenIds: milestones[
                                  milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen!?.findIndex(
                                        (item: boolean) => item == true
                                      )
                                    : 0
                                ]?.gated?.erc721TokenIds?.filter(
                                  (token) =>
                                    token?.collectionId !== item?.collectionId
                                ),
                              },
                            };

                            context?.setQuestInfo((prev) => ({
                              ...prev,
                              actionMilestones: milestones,
                            }));
                          }
                        }}
                      >
                        <ImCross color="white" size={15} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          <input
            className="h-10 w-full bg-black border border-acei rounded-md p-1 text-xs"
            placeholder={dict?.searG}
            value={collectionsSearch || ""}
            onChange={(e) => {
              setCollectionsSearch(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && collectionsSearch?.trim() !== "") {
                getCollectionsSearch();
                setCollectionsInfo({
                  hasMore: true,
                  cursor: 0,
                });
              }
            }}
          />
          {collections?.length > 0 && (
            <div className="relative flex w-full h-fit items-start justify-start">
              <InfiniteScroll
                dataLength={collections?.length}
                hasMore={collectionsInfo?.hasMore}
                next={
                  collectionsSearch?.trim() !== ""
                    ? getMoreCollectionsSearch
                    : getMoreCollectionsSample
                }
                loader={<></>}
                height={"20rem"}
                className="relative w-full h-fit flex overflow-y-scroll"
              >
                <div className="relative w-full grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-start justify-start h-fit max-h-[20rem]">
                  {collections?.map((item, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-40 flex items-center cursor-pointer hover:opacity-80 justify-center p-px rounded-md ${
                          (join
                            ? context?.questInfo?.details?.gated?.erc721TokenIds?.filter(
                                (value) =>
                                  value?.collectionId == item?.collectionId
                              )?.[0]
                            : context?.questInfo?.milestones?.[
                                milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ]?.gated?.erc721TokenIds?.filter(
                                (value) =>
                                  value?.collectionId == item?.collectionId
                              )?.[0]) && "border-2 border-acei"
                        }`}
                        id="northern"
                        onClick={() => {
                          if (join) {
                            context?.setQuestInfo((prev) => ({
                              ...prev,
                              details: {
                                ...prev?.details,
                                gated: {
                                  ...prev?.details?.gated,
                                  erc721TokenIds: (
                                    prev?.details?.gated?.erc721TokenIds || []
                                  )?.filter(
                                    (value) =>
                                      value?.collectionId == item?.collectionId
                                  )?.[0]
                                    ? prev?.details?.gated?.erc721TokenIds?.filter(
                                        (token) =>
                                          token?.collectionId !==
                                          item?.collectionId
                                      )
                                    : [
                                        ...(prev?.details?.gated
                                          ?.erc721TokenIds || []),
                                        item,
                                      ],
                                },
                              },
                            }));
                          } else {
                            const milestones = [
                              ...(context?.questInfo?.milestones || []),
                            ];
                            milestones[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ] = {
                              ...milestones[
                                milestonesOpen!?.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    )
                                  : 0
                              ],
                              gated: {
                                ...milestones[
                                  milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen!?.findIndex(
                                        (item: boolean) => item == true
                                      )
                                    : 0
                                ]?.gated,
                                erc721TokenIds: (
                                  milestones[
                                    milestonesOpen!?.findIndex(
                                      (item: boolean) => item == true
                                    ) !== -1
                                      ? milestonesOpen!?.findIndex(
                                          (item: boolean) => item == true
                                        )
                                      : 0
                                  ]?.gated?.erc721TokenIds || []
                                )?.filter(
                                  (value) =>
                                    value?.collectionId == item?.collectionId
                                )?.[0]
                                  ? milestones[
                                      milestonesOpen!?.findIndex(
                                        (item: boolean) => item == true
                                      ) !== -1
                                        ? milestonesOpen!?.findIndex(
                                            (item: boolean) => item == true
                                          )
                                        : 0
                                    ]?.gated?.erc721TokenIds?.filter(
                                      (token) =>
                                        token?.collectionId !==
                                        item?.collectionId
                                    )
                                  : [
                                      ...(milestones[
                                        milestonesOpen!?.findIndex(
                                          (item: boolean) => item == true
                                        ) !== -1
                                          ? milestonesOpen!?.findIndex(
                                              (item: boolean) => item == true
                                            )
                                          : 0
                                      ]?.gated?.erc721TokenIds || []),
                                      item,
                                    ],
                              },
                            };

                            context?.setQuestInfo((prev) => ({
                              ...prev,
                              actionMilestones: milestones,
                            }));
                          }
                        }}
                      >
                        <div className="relative w-full h-full relative rounded-md">
                          <Image
                            className={"rounded-md"}
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/${
                              item?.metadata?.mediaCover?.split("ipfs://")?.[1]
                                ? item?.metadata?.mediaCover?.split(
                                    "ipfs://"
                                  )?.[1]
                                : item?.metadata?.images?.[0]?.split(
                                    "ipfs://"
                                  )?.[1]
                            }`}
                            objectFit="cover"
                            layout="fill"
                          />
                        </div>
                        <div className="absolute flex flex-row gap-1 text-xxs items-center justify-center top-2 left-2">
                          <div
                            className="rounded-full w-6 h-6 p-px flex items-center justify-center"
                            id="northern"
                          >
                            <div className="relative w-full h-full flex items-center justify-center rounded-full">
                              <Image
                                src={handleProfilePicture(
                                  item?.profile?.metadata?.picture
                                )}
                                draggable={false}
                                className="rounded-full"
                                objectFit="cover"
                                layout="fill"
                              />
                            </div>
                          </div>
                          <div className="relative w-fit h-fit flex items-center justify-center">
                            {item?.profile?.username?.localName!?.length > 10
                              ? item?.profile?.username?.localName?.slice(
                                  0,
                                  10
                                ) + "..."
                              : item?.profile?.username?.localName}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </InfiniteScroll>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatedLogic;

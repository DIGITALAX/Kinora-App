import { FunctionComponent } from "react";
import { Collection, GatedLogicProps } from "../../types/envoke.types";
import { setQuestInfo } from "../../../../../redux/reducers/questInfoSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "../../../../../lib/constants";
import createProfilePicture from "../../../../../lib/helpers/createProfilePicture";
import { ImCross } from "react-icons/im";

const GatedLogic: FunctionComponent<GatedLogicProps> = ({
  dispatch,
  questInfo,
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
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      {!join && (
        <div className="relative w-fit h-fit items-start justify-start opacity-70">
          Set Gates for who can join each milestone.
        </div>
      )}
      <div className="relative w-fit h-fit items-start justify-start flex flex-col gap-1">
        <div
          className={`relative w-fit h-fit flex items-center justify-center ${
            join ? "text-xxs" : "text-sm"
          }`}
        >
          Player must hold all tokens or is just one enough?
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center rounded-md border border-acei flex-row gap-1 text-xxs">
          <div
            className={`relative w-16 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
              (
                join
                  ? questInfo?.details?.gated?.oneOf
                  : questInfo?.milestones?.[
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
                dispatch(
                  setQuestInfo({
                    actionDetails: {
                      ...questInfo?.details,
                      gated: {
                        ...questInfo?.details?.gated,
                        oneOf: true,
                      },
                    },
                    actionMilestones: questInfo?.milestones,
                  })
                );
              } else {
                const milestones = [...questInfo?.milestones];
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

                dispatch(
                  setQuestInfo({
                    actionDetails: questInfo?.details,
                    actionMilestones: milestones,
                  })
                );
              }
            }}
          >
            just one
          </div>
          <div
            className={`relative w-16 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
              (
                join
                  ? !questInfo?.details?.gated?.oneOf
                  : !questInfo?.milestones?.[
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
                dispatch(
                  setQuestInfo({
                    actionDetails: {
                      ...questInfo?.details,
                      gated: {
                        ...questInfo?.details?.gated,
                        oneOf: false,
                      },
                    },
                    actionMilestones: questInfo?.milestones,
                  })
                );
              } else {
                const milestones = [...questInfo?.milestones];
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

                dispatch(
                  setQuestInfo({
                    actionDetails: questInfo?.details,
                    actionMilestones: milestones,
                  })
                );
              }
            }}
          >
            all
          </div>
        </div>
      </div>
      <div
        className={`relative w-full h-fit flex gap-10 justify-start items-start flex-col xl:flex-row`}
      >
        <div className="relative w-fit w-full sm:min-w-[20rem] h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            Token Conditions
          </div>
          <div className="relative flex flex-col w-full h-fit gap-4 items-start justify-start">
            {ACCEPTED_TOKENS.map((item: string[], index: number) => {
              return (
                <div
                  key={index}
                  className={`relative w-full h-fit flex flex-col sm:flex-row items-center justify-center gap-3 ${
                    (
                      join
                        ? questInfo?.details?.gated?.erc20Addresses?.includes(
                            item?.[2] as `0x${string}`
                          )
                        : questInfo?.milestones?.[
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
                        dispatch(
                          setQuestInfo({
                            actionDetails: {
                              ...questInfo?.details,
                              gated: {
                                ...questInfo?.details?.gated,
                                erc20Addresses:
                                  questInfo?.details?.gated?.erc20Addresses?.includes(
                                    item?.[2] as `0x${string}`
                                  )
                                    ? questInfo?.details?.gated?.erc20Addresses?.filter(
                                        (address: string) =>
                                          address?.toLowerCase() !==
                                          item?.[2]?.toLowerCase()
                                      )
                                    : [
                                        ...(questInfo?.details?.gated
                                          ?.erc20Addresses || []),
                                        item?.[2] as `0x${string}`,
                                      ],
                              },
                            },
                            actionMilestones: questInfo?.milestones,
                          })
                        );
                      } else {
                        const milestones = [...questInfo?.milestones];

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

                        dispatch(
                          setQuestInfo({
                            actionDetails: questInfo?.details,
                            actionMilestones: milestones,
                          })
                        );
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
                          ? questInfo?.details?.gated?.erc20Thresholds?.[
                              questInfo?.details?.gated?.erc20Addresses?.indexOf(
                                item[2] as `0x${string}`
                              )
                            ] || ""
                          : questInfo?.milestones?.[
                              milestonesOpen!?.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen!?.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.gated?.erc20Thresholds?.[
                              questInfo?.milestones?.[
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
                            ...(questInfo?.details?.gated?.erc20Thresholds ||
                              []),
                          ];

                          thresholds[
                            questInfo?.details?.gated?.erc20Addresses?.indexOf(
                              item[2] as `0x${string}`
                            )
                          ] = Number(e.target.value);

                          dispatch(
                            setQuestInfo({
                              actionDetails: {
                                ...questInfo?.details,
                                gated: {
                                  ...questInfo?.details?.gated,
                                  erc20Thresholds: thresholds,
                                },
                              },
                              actionMilestones: questInfo?.milestones,
                            })
                          );
                        } else {
                          const milestones = [...questInfo?.milestones];
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
                            questInfo?.milestones?.[
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

                          dispatch(
                            setQuestInfo({
                              actionDetails: questInfo?.details,
                              actionMilestones: milestones,
                            })
                          );
                        }
                      }}
                      type="number"
                      className="h-10 w-full bg-black border border-acei flex rounded-md p-1 text-xs"
                      placeholder="Enter min amount of token to hold."
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            NFT Conditions
          </div>
          {(join
            ? questInfo?.details?.gated?.erc721TokenIds || []
            : questInfo?.milestones?.[
                milestonesOpen!?.findIndex((item: boolean) => item == true) !==
                -1
                  ? milestonesOpen!?.findIndex((item: boolean) => item == true)
                  : 0
              ]?.gated?.erc721TokenIds || []
          )?.length > 0 && (
            <div className="relative w-full h-fit flex overflow-x-scroll max-w-[20rem]">
              <div className="relative w-fit h-fit flex flex-row gap-2 items-start justify-start">
                {(join
                  ? questInfo?.details?.gated?.erc721TokenIds
                  : questInfo?.milestones?.[
                      milestonesOpen!?.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen!?.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.gated?.erc721TokenIds
                )?.map((item: Collection, index: number) => {
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
                            item?.collectionMetadata?.mediaCover?.split(
                              "ipfs://"
                            )?.[1]
                              ? item?.collectionMetadata?.mediaCover?.split(
                                  "ipfs://"
                                )?.[1]
                              : item?.collectionMetadata?.images?.[0]?.split(
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
                              ...questInfo?.details?.gated?.erc721TokenIds,
                            ];

                            dispatch(
                              setQuestInfo({
                                actionDetails: {
                                  ...questInfo?.details,
                                  gated: {
                                    ...questInfo?.details?.gated,
                                    erc721TokenIds: tokenIds?.filter(
                                      (token: Collection) =>
                                        token?.collectionId !==
                                        item?.collectionId
                                    ),
                                  },
                                },
                                actionMilestones: questInfo?.milestones,
                              })
                            );
                          } else {
                            const milestones = [...questInfo?.milestones];
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
                                  (token: Collection) =>
                                    token?.collectionId !== item?.collectionId
                                ),
                              },
                            };

                            dispatch(
                              setQuestInfo({
                                actionDetails: questInfo?.details,
                                actionMilestones: milestones,
                              })
                            );
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
            placeholder="Search tokens to use as gates."
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
                  {collections?.map((item: Collection, index: number) => {
                    const pfp = createProfilePicture(
                      item?.profile?.metadata?.picture
                    );
                    return (
                      <div
                        key={index}
                        className={`relative w-full h-40 flex items-center cursor-pointer hover:opacity-80 justify-center p-px rounded-md ${
                          (join
                            ? questInfo?.details?.gated?.erc721TokenIds?.filter(
                                (value) =>
                                  value?.collectionId == item?.collectionId
                              )?.[0]
                            : questInfo?.milestones?.[
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
                            dispatch(
                              setQuestInfo({
                                actionDetails: {
                                  ...questInfo?.details,
                                  gated: {
                                    ...questInfo?.details?.gated,
                                    erc721TokenIds: (
                                      questInfo?.details?.gated
                                        ?.erc721TokenIds || []
                                    )?.filter(
                                      (value) =>
                                        value?.collectionId ==
                                        item?.collectionId
                                    )?.[0]
                                      ? questInfo?.details?.gated?.erc721TokenIds?.filter(
                                          (token: Collection) =>
                                            token?.collectionId !==
                                            item?.collectionId
                                        )
                                      : [
                                          ...(questInfo?.details?.gated
                                            ?.erc721TokenIds || []),
                                          item,
                                        ],
                                  },
                                },
                                actionMilestones: questInfo?.milestones,
                              })
                            );
                          } else {
                            const milestones = [...questInfo?.milestones];
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
                                      (token: Collection) =>
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

                            dispatch(
                              setQuestInfo({
                                actionDetails: questInfo?.details,
                                actionMilestones: milestones,
                              })
                            );
                          }
                        }}
                      >
                        <div className="relative w-full h-full relative rounded-md">
                          <Image
                            className={"rounded-md"}
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/${
                              item?.collectionMetadata?.mediaCover?.split(
                                "ipfs://"
                              )?.[1]
                                ? item?.collectionMetadata?.mediaCover?.split(
                                    "ipfs://"
                                  )?.[1]
                                : item?.collectionMetadata?.images?.[0]?.split(
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
                            {item?.profile?.handle?.suggestedFormatted
                              ?.localName!?.length > 10
                              ? item?.profile?.handle?.suggestedFormatted?.localName?.slice(
                                  0,
                                  10
                                ) + "..."
                              : item?.profile?.handle?.suggestedFormatted
                                  ?.localName}
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

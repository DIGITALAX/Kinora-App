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
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex items-start justify-start flex-col font-bit text-white gap-10">
      <div className="relative w-fit h-fit items-start justify-start opacity-70">
        Set Gates for who can join each milestone.
      </div>
      <div className="relative w-fit h-fit items-start justify-start flex flex-col gap-1">
        <div className="relative w-fit h-fit flex items-center justify-center text-sm">
          Player must hold all tokens or is just one enough?
        </div>
        <div className="relative w-fit h-fit flex items-center justify-center rounded-md border border-white flex-row gap-1 text-xxs">
          <div
            className={`relative w-16 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
              questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.gated?.oneOf
                ? "bg-verde text-black"
                : "text-white"
            }`}
            onClick={() => {
              const milestones = [...questInfo?.milestones];
              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                gated: {
                  ...milestones[
                    milestonesOpen.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen.findIndex(
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
                  actionDeveloperKey: questInfo?.developerKey,
                })
              );
            }}
          >
            just one
          </div>
          <div
            className={`relative w-16 h-fit flex p-2 items-center justify-center rounded-md cursor-pointer ${
              !questInfo?.milestones?.[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ]?.gated?.oneOf
                ? "bg-verde text-black"
                : "text-white"
            }`}
            onClick={() => {
              const milestones = [...questInfo?.milestones];
              milestones[
                milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                  ? milestonesOpen.findIndex((item: boolean) => item == true)
                  : 0
              ] = {
                ...milestones[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ],
                gated: {
                  ...milestones[
                    milestonesOpen.findIndex(
                      (item: boolean) => item == true
                    ) !== -1
                      ? milestonesOpen.findIndex(
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
                  actionDeveloperKey: questInfo?.developerKey,
                })
              );
            }}
          >
            all
          </div>
        </div>
      </div>
      <div className="relative w-full h-fit flex flex-col lg:flex-row gap-6 justify-start items-start">
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            NFT Conditions
          </div>
          {(
            questInfo?.milestones?.[
              milestonesOpen.findIndex((item: boolean) => item == true) !== -1
                ? milestonesOpen.findIndex((item: boolean) => item == true)
                : 0
            ]?.gated?.erc721TokenIds || []
          )?.length > 0 && (
            <div className="relative w-full h-fit flex overflow-x-scroll max-w-[20rem]">
              <div className="relative w-fit h-fit flex flex-row gap-2 items-start justify-start">
                {questInfo?.milestones?.[
                  milestonesOpen.findIndex((item: boolean) => item == true) !==
                  -1
                    ? milestonesOpen.findIndex((item: boolean) => item == true)
                    : 0
                ]?.gated?.erc721TokenIds?.map(
                  (item: Collection, index: number) => {
                    return (
                      <div
                        key={index}
                        className={`relative w-10 h-10 flex items-center cursor-pointer hover:opacity-80 justify-center p-px rounded-md`}
                        id="rainbow"
                      >
                        <div className="relative w-full h-full relative rounded-md">
                          {(item?.collectionMetadata?.mediaCover ||
                            item?.collectionMetadata?.images?.[0]) && (
                            <Image
                              className={"rounded-md"}
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${
                                item?.collectionMetadata?.mediaCover
                                  ? item?.collectionMetadata?.mediaCover?.split(
                                      "ipfs://"
                                    )?.[1]
                                  : item?.collectionMetadata?.images?.[0]?.split(
                                      "ipfs://"
                                    )?.[1]
                              }`}
                              objectFit="cover"
                            />
                          )}
                        </div>
                        <div
                          className="absolute w-5 h-5 flex cursor-pointer bg-black rounded-full border border-white hover:opacity-80 p-1 items-center justify-center"
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
                              gated: {
                                ...milestones[
                                  milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen.findIndex(
                                        (item: boolean) => item == true
                                      )
                                    : 0
                                ]?.gated,
                                erc721TokenIds: milestones[
                                  milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen.findIndex(
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
                                actionDeveloperKey: questInfo?.developerKey,
                              })
                            );
                          }}
                        >
                          <ImCross color="white" size={15} />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}
          <input
            className="h-10 w-full bg-black border border-white rounded-md p-1 text-xs"
            placeholder="Search tokens to use as gates."
            value={collectionsSearch}
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
              className="relative w-full h-fit flex overflow-y-scroll"
            >
              <div className="relative w-full flex flex-wrap gap-3 items-start justify-start h-fit max-h-[20rem]">
                {
                  // collections
                  Array.from({ length: 10 })?.map(
                    (item: Collection, index: number) => {
                      const pfp = createProfilePicture(
                        item?.profile?.metadata?.picture
                      );
                      return (
                        <div
                          key={index}
                          className={`relative w-40 md:w-full lg:w-40 h-40 flex items-center cursor-pointer hover:opacity-80 justify-center p-px rounded-md ${
                            questInfo?.milestones?.[
                              milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.gated?.erc721TokenIds?.filter(
                              (value) =>
                                value?.collectionId == item?.collectionId
                            )?.[0] && "border-2 border-white"
                          }`}
                          id="rainbow"
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
                              gated: {
                                ...milestones[
                                  milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen.findIndex(
                                        (item: boolean) => item == true
                                      )
                                    : 0
                                ]?.gated,
                                erc721TokenIds: (
                                  milestones[
                                    milestonesOpen.findIndex(
                                      (item: boolean) => item == true
                                    ) !== -1
                                      ? milestonesOpen.findIndex(
                                          (item: boolean) => item == true
                                        )
                                      : 0
                                  ]?.gated?.erc721TokenIds || []
                                )?.filter(
                                  (value) =>
                                    value?.collectionId == item?.collectionId
                                )?.[0]
                                  ? milestones[
                                      milestonesOpen.findIndex(
                                        (item: boolean) => item == true
                                      ) !== -1
                                        ? milestonesOpen.findIndex(
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
                                        milestonesOpen.findIndex(
                                          (item: boolean) => item == true
                                        ) !== -1
                                          ? milestonesOpen.findIndex(
                                              (item: boolean) => item == true
                                            )
                                          : 0
                                      ]?.gated?.erc721TokenIds || []),
                                      Number(item?.collectionId),
                                    ],
                              },
                            };

                            dispatch(
                              setQuestInfo({
                                actionDetails: questInfo?.details,
                                actionMilestones: milestones,
                                actionDeveloperKey: questInfo?.developerKey,
                              })
                            );
                          }}
                        >
                          <div className="relative w-full h-full relative rounded-md">
                            {(item?.collectionMetadata?.mediaCover ||
                              item?.collectionMetadata?.images?.[0]) && (
                              <Image
                                className={"rounded-md"}
                                draggable={false}
                                src={`${INFURA_GATEWAY}/ipfs/${
                                  item?.collectionMetadata?.mediaCover
                                    ? item?.collectionMetadata?.mediaCover?.split(
                                        "ipfs://"
                                      )?.[1]
                                    : item?.collectionMetadata?.images?.[0]?.split(
                                        "ipfs://"
                                      )?.[1]
                                }`}
                                objectFit="cover"
                              />
                            )}
                          </div>
                          <div className="absolute flex flex-row gap-1 text-xxs items-center justify-center bottom-2 right-2">
                            <div
                              className="rounded-full w-6 h-6 p-px flex items-center justify-center"
                              id="rainbow"
                            >
                              <div className="relative w-full h-full flex items-center justify-center">
                                {pfp && (
                                  <Image
                                    src={pfp}
                                    draggable={false}
                                    className="rounded-full"
                                    objectFit="cover"
                                  />
                                )}
                              </div>
                            </div>
                            <div className="relative w-fit h-fit flex items-center justify-center">
                              {
                                item?.profile?.handle?.suggestedFormatted
                                  ?.localName
                              }
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )
                }
              </div>
            </InfiniteScroll>
          </div>
        </div>
        <div className="relative w-full h-fit flex flex-col items-start justify-start gap-4">
          <div className="relative w-fit h-fit flex items-center justify-center text-sm">
            Token Conditions
          </div>
          <div className="relative flex flex-col w-full h-fit gap-4 items-start justify-start">
            {ACCEPTED_TOKENS.map((item: string[], index: number) => {
              return (
                <div
                  className={`relative w-full h-fit flex flex-row  items-center justify-center gap-3 ${
                    questInfo?.milestones?.[
                      milestonesOpen.findIndex(
                        (item: boolean) => item == true
                      ) !== -1
                        ? milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          )
                        : 0
                    ]?.gated?.erc20Addresses?.includes(
                      item?.[2] as `0x${string}`
                    )
                      ? "opacity-100"
                      : "opacity-50"
                  }`}
                >
                  <div
                    className={`relative w-fit h-fit rounded-full flex items-center cursor-pointer active:scale-95`}
                    key={index}
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
                        gated: {
                          ...milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.gated,
                          erc20Addresses: (
                            milestones[
                              milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  )
                                : 0
                            ]?.gated?.erc20Addresses || []
                          )?.includes(item?.[2] as `0x${string}`)
                            ? milestones[
                                milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                ) !== -1
                                  ? milestonesOpen.findIndex(
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
                                  milestonesOpen.findIndex(
                                    (item: boolean) => item == true
                                  ) !== -1
                                    ? milestonesOpen.findIndex(
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
                          actionDeveloperKey: questInfo?.developerKey,
                        })
                      );
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
                  <div className="relative w-20 h-fit flex items-center justify-center">
                    {item[1]}
                  </div>
                  <div className="relative w-full h-fit flex items-center justify-center">
                    <input
                      value={
                        questInfo?.milestones?.[
                          milestonesOpen.findIndex(
                            (item: boolean) => item == true
                          ) !== -1
                            ? milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              )
                            : 0
                        ]?.gated?.erc20Thresholds?.[index]
                      }
                      onChange={(e) => {
                        const milestones = [...questInfo?.milestones];
                        const thresholds = [
                          ...(milestones[
                            milestonesOpen.findIndex(
                              (item: boolean) => item == true
                            ) !== -1
                              ? milestonesOpen.findIndex(
                                  (item: boolean) => item == true
                                )
                              : 0
                          ]?.gated?.erc20Thresholds || []),
                        ];

                        thresholds[index] = Number(e.target.value);
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
                          gated: {
                            ...milestones[
                              milestonesOpen.findIndex(
                                (item: boolean) => item == true
                              ) !== -1
                                ? milestonesOpen.findIndex(
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
                            actionDeveloperKey: questInfo?.developerKey,
                          })
                        );
                      }}
                      type="number"
                      className="h-10 w-full bg-black border border-white rounded-md p-1 text-xs"
                      placeholder="Enter min amount of token to hold."
                    />
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

export default GatedLogic;

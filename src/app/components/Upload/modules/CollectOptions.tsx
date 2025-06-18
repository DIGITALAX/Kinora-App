import { FunctionComponent, JSX, useContext, useState } from "react";
import Image from "next/legacy/image";
import { CollectOptionsProps } from "../types/upload.types";
import { ModalContext } from "@/app/providers";
import { ACCEPTED_TOKENS, INFURA_GATEWAY } from "@/app/lib/constants";
import { evmAddress } from "@lens-protocol/client";
import { SimpleCollect } from "../../Common/types/common.types";

const CollectOptions: FunctionComponent<CollectOptionsProps> = ({
  postDetails,
  setPostDetails,
  collect,
  border,
  dict,
}): JSX.Element => {
  const contexto = useContext(ModalContext);
  const [openMeasure, setOpenMeasure] = useState<{
    award: string;
    whoCollectsOpen: boolean;
    creatorAwardOpen: boolean;
    currencyOpen: boolean;
    editionOpen: boolean;
    edition: string;
    timeOpen: boolean;
    time: string;
  }>({
    award: "No",
    whoCollectsOpen: false,
    creatorAwardOpen: false,
    currencyOpen: false,
    editionOpen: false,
    edition: "",
    timeOpen: false,
    time: "",
  });
  return (
    <div
      className={`relative max-w-full w-full md:w-fit h-fit flex flex-col md:flex-row gap-8 items-start justify-between p-2 ${
        border && "border border-suave"
      }`}
    >
      <div className="relative h-fit w-full md:w-fit flex flex-col gap-6 items-end justify-between">
        {[
          {
            type: "drop",
            title: dict?.who,
            dropValues: [dict?.ev, dict?.fol],
            dropOpen: openMeasure.whoCollectsOpen,
            chosenValue: (
              collect
                ? contexto?.postInfo?.collectTypes?.[
                    contexto?.collectOptions?.id!
                  ]?.followerOnGraph
                : postDetails?.collectDetails?.followerOnGraph
            )
              ? dict?.fol
              : dict?.ev,
            showObject: dict?.yes ? true : false,
            openDropdown: () =>
              setOpenMeasure((prev) => ({
                ...prev,
                whoCollectsOpen: !prev.whoCollectsOpen,
              })),
            setValue: (item: string) => {
              if (collect) {
                contexto?.setPostInfo((prev) => {
                  let colls = { ...prev?.collectTypes };
                  let col = colls?.[contexto?.collectOptions?.id!]
                    ? colls?.[contexto?.collectOptions?.id!]
                    : {};

                  let followerOnGraph =
                    item === dict?.fol
                      ? {
                          followerOnGraph: {
                            globalGraph: true as true,
                          },
                        }
                      : {};

                  if (!followerOnGraph?.followerOnGraph) {
                    const { followerOnGraph, ...all } = col!;
                    col = all;
                  }

                  col =
                    openMeasure?.award == dict?.no
                      ? {
                          ...col,
                          ...followerOnGraph,
                          payToCollect: null,
                        }
                      : {
                          ...col,
                          ...followerOnGraph,
                        };

                  colls[contexto?.collectOptions?.id!] = col;

                  return {
                    ...prev,
                    collectTypes: colls,
                  };
                });
              } else {
                setPostDetails!((prev) => ({
                  ...prev,
                  collectDetails:
                    openMeasure?.award == dict?.no
                      ? {
                          followerOnGraph:
                            item === dict?.fol
                              ? {
                                  globalGraph: true,
                                }
                              : undefined,
                        }
                      : {
                          ...prev.collectDetails,
                          followerOnGraph:
                            item === dict?.fol
                              ? {
                                  globalGraph: true,
                                }
                              : undefined,
                        },
                }));
              }

              setOpenMeasure((prev) => ({
                ...prev,
                whoCollectsOpen: !prev.whoCollectsOpen,
              }));
            },
          },
          {
            type: "drop",
            title: dict?.caw,
            dropValues: [dict?.yes, dict?.no],
            dropOpen: openMeasure.creatorAwardOpen,
            chosenValue: openMeasure.award || dict?.no,
            showObject: dict?.yes ? true : false,
            openDropdown: () =>
              setOpenMeasure((prev) => ({
                ...prev,
                creatorAwardOpen: !prev.creatorAwardOpen,
              })),
            setValue: (item: string) => {
              setOpenMeasure((prev) => ({
                ...prev,
                award: item,
              }));

              if (collect) {
                contexto?.setPostInfo((prev) => {
                  let colls = { ...prev?.collectTypes };
                  let col = colls?.[contexto?.collectOptions?.id!]
                    ? colls?.[contexto?.collectOptions?.id!]
                    : {};

                  let followerOnGraph =
                    contexto?.postInfo?.collectTypes?.[
                      contexto?.collectOptions?.id!
                    ]?.followerOnGraph === dict?.fol
                      ? {
                          followerOnGraph: {
                            globalGraph: true as true,
                          },
                        }
                      : {};

                  if (!followerOnGraph?.followerOnGraph) {
                    const { followerOnGraph, ...all } = col!;
                    col = all;
                  }

                  col =
                    item == "No"
                      ? {
                          ...col,
                          ...followerOnGraph,
                          payToCollect: null,
                        }
                      : ({
                          ...col,
                          payToCollect: {
                            ...col?.payToCollect,
                            referralShare: 0,
                            amount: {
                              value: "10",
                              currency: evmAddress(
                                ACCEPTED_TOKENS[0][2]?.toLowerCase()
                              ),
                            },
                          },
                        } as any);

                  colls[contexto?.collectOptions?.id!] = col;

                  return {
                    ...prev,
                    collectTypes: colls,
                  };
                });

                setOpenMeasure((prev) => ({
                  ...prev,
                  creatorAwardOpen: false,
                  award: item,
                }));
              } else {
                setPostDetails!((prev) => ({
                  ...prev,
                  collectDetails:
                    openMeasure?.award == dict?.no
                      ? {
                          followerOnGraph: undefined,
                        }
                      : ({
                          ...prev.collectDetails,
                        } as any),
                }));

                setOpenMeasure((prev) => ({
                  ...prev,
                  creatorAwardOpen: false,
                  award: item,
                }));
              }
            },
          },
        ].map(
          (
            item: {
              type: string;
              title: string;
              showObject: boolean;
              dropOpen?: boolean;
              chosenValue: string;
              dropValues?: string[];
              openDropdown?: () => void;
              setValue: (item: string) => void;
            },
            indexTwo: number
          ) => {
            return (
              item.showObject && (
                <div
                  className="relative flex items-center justify-center flex-row w-full h-fit pb-1.5 gap-2"
                  key={indexTwo}
                >
                  <div className="relative w-full h-fit flex items-start justify-start font-bit text-white text-xs">
                    {item?.title}
                  </div>
                  <div className="relative w-fit h-fit p-px rounded-sm flex flex-row items-center justify-center font-bit text-white text-center border border-suave">
                    <div
                      className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center px-3 py-1 gap-2 cursor-pointer"
                      onClick={() => item.openDropdown!()}
                    >
                      <div className="relative w-fit h-full bg-offBlack flex items-center justify-center text-xs  whitespace-nowrap break-words">
                        {item.chosenValue}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        <div
                          className={`relative flex items-center justify-center  w-3 h-1.5 ${
                            item.dropOpen && "-rotate-90"
                          }`}
                        >
                          <Image
                            draggable={false}
                            layout="fill"
                            src={`${INFURA_GATEWAY}/ipfs/QmevWsPP9a7teJEcq91cRWPBC4m7VZudYLMArBBgHaxkX9`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {item.dropOpen && (
                    <div className="absolute flex items-start justify-center w-fit h-fit max-h-[4rem] overflow-y-scroll z-50 top-8 right-0 border bg-nave rounded-sm border-suave min-w-[10rem]">
                      <div className="relative flex flex-col items-center justify-start w-full h-fit gap-px">
                        {item.dropValues?.map(
                          (value: string, indexThree: number) => {
                            return (
                              <div
                                key={indexThree}
                                className={`relative px-2 py-1 w-full h-8 items-center justify-center flex text-white text-xs uppercase font-bit hover:text-ligera cursor-pointer ${
                                  indexThree !==
                                    Number(item?.dropValues?.length) - 1 &&
                                  "border-b border-suave"
                                }`}
                                onClick={() => {
                                  item.setValue(
                                    indexTwo === 4
                                      ? ACCEPTED_TOKENS[indexThree][1]
                                      : value
                                  );
                                }}
                              >
                                {value}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            );
          }
        )}
      </div>
      {openMeasure.award === dict?.yes && (
        <div className="relative h-fit w-full md:w-fit flex flex-col gap-6 items-end justify-between">
          {[
            {
              type: "input",
              title: dict?.amm,
              chosenValue: collect
                ? contexto?.postInfo?.collectTypes?.[
                    contexto?.collectOptions?.id!
                  ]?.payToCollect?.amount?.value.toString() || "0"
                : postDetails?.collectDetails?.payToCollect?.amount?.value ||
                  "0",
              showObject: openMeasure.award === dict?.yes ? true : false,
              setValue: collect
                ? (item: string) => {
                    if (isNaN(Number(item))) return;
                    contexto?.setPostInfo((prev) => {
                      let colls = { ...prev?.collectTypes };
                      let col = colls?.[contexto?.collectOptions?.id!]
                        ? colls?.[contexto?.collectOptions?.id!]
                        : {
                            payToCollect: {
                              amount: {
                                value: "10",
                                currency: evmAddress(
                                  ACCEPTED_TOKENS[0][2]?.toLowerCase()
                                ),
                              },
                            },
                          };

                      col = {
                        ...col,
                        payToCollect: {
                          ...col?.payToCollect,
                          amount: {
                            currency: evmAddress(
                              ACCEPTED_TOKENS?.find(
                                (at) =>
                                  at?.[1]?.toLowerCase() ==
                                  contexto?.postInfo?.collectTypes?.[
                                    contexto?.collectOptions?.id!
                                  ]?.payToCollect?.amount?.currency?.toLowerCase()
                              )?.[2] ?? ACCEPTED_TOKENS[0][2]?.toLowerCase()
                            ),
                            value: item,
                          },
                        },
                      } as SimpleCollect;

                      colls[contexto?.collectOptions?.id!] = col;

                      return {
                        ...prev,
                        collectTypes: colls,
                      };
                    });
                  }
                : (item: string) => {
                    setPostDetails!((prev) => ({
                      ...prev,
                      collectDetails: {
                        ...prev?.collectDetails,
                        payToCollect: {
                          ...prev?.collectDetails?.payToCollect!,
                          amount: {
                            currency: evmAddress(
                              ACCEPTED_TOKENS?.find(
                                (at) =>
                                  at?.[1]?.toLowerCase() ==
                                  contexto?.postInfo?.collectTypes?.[
                                    contexto?.collectOptions?.id!
                                  ]?.payToCollect?.amount?.currency?.toLowerCase()
                              )?.[2] ?? ACCEPTED_TOKENS[0][2]?.toLowerCase()
                            ),
                            value: item,
                          },
                        },
                      } as SimpleCollect,
                    }));
                  },
            },
            {
              type: "drop",
              title: dict?.curr,
              dropValues: ACCEPTED_TOKENS?.map((item) => item[1]),
              chosenValue:
                ACCEPTED_TOKENS?.find((item) => {
                  if (
                    item[2]?.toLowerCase() ==
                    (collect
                      ? contexto?.postInfo?.collectTypes?.[
                          contexto?.collectOptions?.id!
                        ]?.payToCollect?.amount?.currency?.toLowerCase()
                      : postDetails?.collectDetails?.payToCollect?.amount?.currency?.toLowerCase())
                  ) {
                    return item;
                  }
                })?.[1] ?? ACCEPTED_TOKENS?.[0]?.[1],

              dropOpen: openMeasure.currencyOpen,
              showObject: openMeasure.award === dict?.yes ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  currencyOpen: !prev.currencyOpen,
                })),
              setValue: (item: string) => {
                if (collect) {
                  contexto?.setPostInfo((prev) => {
                    let colls = { ...prev?.collectTypes };
                    let col = colls?.[contexto?.collectOptions?.id!]
                      ? colls?.[contexto?.collectOptions?.id!]
                      : {
                          payToCollect: {
                            amount: {
                              value: "10",
                              currency: evmAddress(
                                ACCEPTED_TOKENS[0][2]?.toLowerCase()
                              ),
                            },
                          },
                        };

                    col = {
                      ...col,
                      payToCollect: {
                        ...col?.payToCollect,
                        amount: {
                          ...col?.payToCollect?.amount,
                          currency: evmAddress(
                            ACCEPTED_TOKENS?.find(
                              (val) => item == val?.[1]
                            )?.[2]!
                          ),
                        },
                      },
                    } as SimpleCollect;

                    colls[contexto?.collectOptions?.id!] = col;

                    return {
                      ...prev,
                      collectTypes: colls,
                    };
                  });
                } else {
                  setPostDetails!((prev) => ({
                    ...prev,
                    collectDetails: {
                      ...prev?.collectDetails,
                      payToCollect: {
                        ...prev?.collectDetails?.payToCollect,
                        amount: {
                          ...prev?.collectDetails?.payToCollect?.amount,
                          currency: evmAddress(
                            ACCEPTED_TOKENS?.find(
                              (val) => item == val?.[1]
                            )?.[2]!
                          ),
                        },
                      },
                    } as SimpleCollect,
                  }));
                }
                setOpenMeasure((prev) => ({
                  ...prev,
                  currencyOpen: false,
                }));
              },
            },
            {
              type: "input",
              title: dict?.reff,
              chosenValue: collect
                ? String(
                    contexto?.postInfo?.collectTypes?.[
                      contexto?.collectOptions?.id!
                    ]?.payToCollect?.referralShare || "0"
                  )
                : String(
                    postDetails?.collectDetails?.payToCollect?.referralShare ||
                      "0"
                  ),
              showObject: openMeasure.award === dict?.yes ? true : false,
              setValue: collect
                ? (item: string) => {
                    if (isNaN(Number(item))) return;
                    contexto?.setPostInfo((prev) => {
                      let colls = { ...prev?.collectTypes };
                      let col = colls?.[contexto?.collectOptions?.id!]
                        ? colls?.[contexto?.collectOptions?.id!]
                        : {
                            payToCollect: {
                              amount: {
                                value: "10",
                                curency: evmAddress(
                                  ACCEPTED_TOKENS[0][2]?.toLowerCase()
                                ),
                              },
                            },
                          };

                      col = {
                        ...col,
                        payToCollect: {
                          ...col?.payToCollect,
                          referralShare: Number(item),
                        },
                      } as SimpleCollect;

                      colls[contexto?.collectOptions?.id!] = col;

                      return {
                        ...prev,
                        collectTypes: colls,
                      };
                    });
                  }
                : (item: string) => {
                    setPostDetails!((prev) => ({
                      ...prev,

                      collectDetails: {
                        ...prev?.collectDetails,
                        payToCollect: prev?.collectDetails?.payToCollect
                          ? {
                              ...prev?.collectDetails?.payToCollect,
                              referralShare: Number(item),
                            }
                          : {
                              amount: {
                                value: "10",
                                curency: evmAddress(
                                  ACCEPTED_TOKENS[0][2]?.toLowerCase()
                                ),
                              },
                              referralShare: Number(item),
                            },
                      } as SimpleCollect,
                    }));
                  },
            },
          ].map(
            (
              item: {
                type: string;
                title: string;
                showObject: boolean;
                dropOpen?: boolean;
                chosenValue: string;
                dropValues?: string[];
                openDropdown?: () => void;
                setValue: (item: string) => void;
              },
              indexTwo: number
            ) => {
              return (
                item.showObject &&
                (item.type === "drop" ? (
                  <div
                    className="relative flex items-center justify-center flex-row w-full h-fit pb-1.5 gap-2"
                    key={indexTwo}
                  >
                    <div className="relative w-full h-fit flex items-start justify-start font-bit text-white text-xs">
                      {item?.title}
                    </div>
                    <div className="relative w-fit h-fit p-px rounded-sm flex flex-row items-center justify-center font-bit text-white text-center border border-suave">
                      <div
                        className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center px-3 py-1 gap-2 cursor-pointer"
                        onClick={() => item.openDropdown!()}
                      >
                        <div className="relative w-fit h-full bg-offBlack flex items-center justify-center text-xs  whitespace-nowrap break-words">
                          {item.chosenValue}
                        </div>
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          <div
                            className={`relative flex items-center justify-center  w-3 h-1.5 ${
                              item.dropOpen && "-rotate-90"
                            }`}
                          >
                            <Image
                              draggable={false}
                              layout="fill"
                              src={`${INFURA_GATEWAY}/ipfs/QmevWsPP9a7teJEcq91cRWPBC4m7VZudYLMArBBgHaxkX9`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {item.dropOpen && (
                      <div className="absolute flex items-start justify-center w-fit h-fit max-h-[4rem] overflow-y-scroll z-50 top-8 right-0 border bg-nave rounded-sm border-suave min-w-[10rem]">
                        <div className="relative flex flex-col items-center justify-start w-full h-fit gap-px">
                          {item.dropValues?.map(
                            (value: string, indexThree: number) => {
                              return (
                                <div
                                  key={indexThree}
                                  className={`relative px-2 py-1 w-full h-8 items-center justify-center flex text-white text-xs uppercase font-bit hover:text-ligera cursor-pointer ${
                                    indexThree !==
                                      Number(item?.dropValues?.length) - 1 &&
                                    "border-b border-suave"
                                  }`}
                                  onClick={() => {
                                    item.setValue(
                                      indexTwo === 4
                                        ? ACCEPTED_TOKENS[indexThree][1]
                                        : value
                                    );
                                  }}
                                >
                                  {value}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="relative flex items-center justify-center flex-col w-fit h-fit pb-1.5 gap-2"
                    key={indexTwo}
                  >
                    <div className="relative w-full h-fit flex items-start justify-start font-bit text-white text-xs">
                      {item?.title}
                    </div>
                    <div className="relative w-full h-fit p-px flex flex-row items-center justify-center font-bit text-white text-center border border-suave rounded-sm">
                      <input
                        type="number"
                        className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center p-2 gap-2 text-xs"
                        onChange={(e) => item.setValue(e.target.value)}
                        value={item.chosenValue || ""}
                      />
                    </div>
                  </div>
                ))
              );
            }
          )}
        </div>
      )}
      {openMeasure.award === dict?.yes && (
        <div className="relative h-fit w-full md:w-fit flex flex-col gap-6 items-end justify-between">
          {[
            {
              type: "drop",
              title: dict?.ed,
              dropValues: [dict?.yes, dict?.no],
              dropOpen: openMeasure.editionOpen,
              chosenValue: openMeasure.edition || dict?.no,
              showObject: openMeasure.award === dict?.yes ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  editionOpen: !prev.editionOpen,
                })),
              setValue: (item: string) => {
                setOpenMeasure((prev) => ({
                  ...prev,
                  edition: item,
                }));

                if (collect) {
                  setOpenMeasure((prev) => ({
                    ...prev,
                    edition: item,
                  }));

                  contexto?.setPostInfo((prev) => {
                    let colls = { ...prev?.collectTypes };
                    let col = colls?.[contexto?.collectOptions?.id!]
                      ? colls?.[contexto?.collectOptions?.id!]
                      : {};

                    col =
                      item == "No"
                        ? ({
                            ...col,
                            collectLimit: null,
                          } as SimpleCollect)
                        : ({
                            ...col,
                          } as SimpleCollect);

                    colls[contexto?.collectOptions?.id!] = col;

                    return {
                      ...prev,
                      collectTypes: colls,
                    };
                  });
                } else {
                  setPostDetails!((prev) => ({
                    ...prev,
                    collectDetails:
                      item == "No"
                        ? ({
                            ...prev?.collectDetails,
                            collectLimit: null,
                          } as SimpleCollect)
                        : ({
                            ...prev?.collectDetails,
                          } as SimpleCollect),
                  }));
                }

                setOpenMeasure((prev) => ({
                  ...prev,
                  editionOpen: false,
                }));
              },
            },
            {
              type: "input",
              title: dict?.edA,
              chosenValue: collect
                ? String(
                    contexto?.postInfo?.collectTypes?.[
                      contexto?.collectOptions?.id!
                    ]?.collectLimit || "1"
                  )
                : postDetails?.collectDetails?.collectLimit || "1",
              showObject: openMeasure.edition === dict?.yes ? true : false,
              setValue: collect
                ? (item: string) => {
                    if (isNaN(Number(item))) return;
                    contexto?.setPostInfo((prev) => {
                      let colls = { ...prev?.collectTypes };
                      let col = colls?.[contexto?.collectOptions?.id!]
                        ? colls?.[contexto?.collectOptions?.id!]
                        : {};

                      col =
                        openMeasure?.edition == "No"
                          ? ({
                              ...col,
                              collectLimit: null,
                            } as SimpleCollect)
                          : ({
                              ...col,
                              collectLimit: Number(item),
                            } as SimpleCollect);

                      colls[contexto?.collectOptions?.id!] = col;

                      return {
                        ...prev,
                        collectTypes: colls,
                      };
                    });
                  }
                : (item: string) => {
                    setPostDetails!((prev) => ({
                      ...prev,

                      collectDetails:
                        openMeasure?.edition == "No"
                          ? ({
                              ...prev?.collectDetails,
                              collectLimit: null,
                            } as SimpleCollect)
                          : ({
                              ...prev?.collectDetails,
                              collectLimit: Number(item),
                            } as SimpleCollect),
                    }));
                  },
            },
            {
              type: "drop",
              title: dict?.["24"],
              dropValues: [dict?.yes, dict?.no],
              dropOpen: openMeasure.timeOpen,
              chosenValue: openMeasure.time || dict?.no,
              showObject: openMeasure.award === dict?.yes ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  timeOpen: !prev.timeOpen,
                })),
              setValue: (item: string) => {
                setOpenMeasure((prev) => ({
                  ...prev,
                  time: item,
                }));

                if (collect) {
                  contexto?.setPostInfo((prev) => {
                    let colls = { ...prev?.collectTypes };
                    let col = colls?.[contexto?.collectOptions?.id!]
                      ? colls?.[contexto?.collectOptions?.id!]
                      : {};

                    if (item === dict?.yes) {
                      col = {
                        ...col,

                        endsAt: new Date(
                          new Date().getTime() + 24 * 60 * 60 * 1000
                        ) as any,
                      } as SimpleCollect;
                    } else {
                      col = {
                        ...col,
                        endsAt: null,
                      } as SimpleCollect;
                    }

                    colls[contexto?.collectOptions?.id!] = col;

                    return {
                      ...prev,
                      collectTypes: colls,
                    };
                  });
                } else {
                  let col = postDetails?.collectDetails
                    ? postDetails?.collectDetails
                    : {};

                  if (item === dict?.yes) {
                    col = {
                      ...col,

                      endsAt: new Date(
                        new Date().getTime() + 24 * 60 * 60 * 1000
                      ) as any,
                    } as SimpleCollect;
                  } else {
                    col = {
                      ...col,
                      endsAt: null,
                    } as SimpleCollect;
                  }

                  setPostDetails!((prev) => ({
                    ...prev,

                    collectDetails: col,
                  }));
                }

                setOpenMeasure((prev) => ({
                  ...prev,
                  timeOpen: false,
                }));
              },
            },
          ].map((item, indexTwo: number) => {
            return (
              item.showObject &&
              (item.type === "drop" ? (
                <div
                  className="relative flex items-center justify-center flex-row w-full h-fit pb-1.5 gap-2"
                  key={indexTwo}
                >
                  <div className="relative w-full h-fit flex items-start justify-start font-bit text-white text-xs">
                    {item?.title}
                  </div>
                  <div className="relative w-fit h-fit p-px rounded-sm flex flex-row items-center justify-center font-bit text-white text-center border border-suave">
                    <div
                      className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center px-3 py-1 gap-2 cursor-pointer"
                      onClick={() => item.openDropdown!()}
                    >
                      <div className="relative w-fit h-full bg-offBlack flex items-center justify-center text-xs  whitespace-nowrap break-words">
                        {item.chosenValue}
                      </div>
                      <div className="relative w-fit h-fit flex items-center justify-center">
                        <div
                          className={`relative flex items-center justify-center  w-3 h-1.5 ${
                            item.dropOpen && "-rotate-90"
                          }`}
                        >
                          <Image
                            draggable={false}
                            layout="fill"
                            src={`${INFURA_GATEWAY}/ipfs/QmevWsPP9a7teJEcq91cRWPBC4m7VZudYLMArBBgHaxkX9`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  {item.dropOpen && (
                    <div className="absolute flex items-start justify-center w-fit h-fit max-h-[4rem] overflow-y-scroll z-50 top-8 right-0 border bg-nave rounded-sm border-suave min-w-[10rem]">
                      <div className="relative flex flex-col items-center justify-start w-full h-fit gap-px">
                        {item.dropValues?.map(
                          (value: string, indexThree: number) => {
                            return (
                              <div
                                key={indexThree}
                                className={`relative px-2 py-1 w-full h-8 items-center justify-center flex text-white text-xs uppercase font-bit hover:text-ligera cursor-pointer ${
                                  indexThree !==
                                    Number(item?.dropValues?.length) - 1 &&
                                  "border-b border-suave"
                                }`}
                                onClick={() => {
                                  item.setValue(
                                    indexTwo === 4
                                      ? ACCEPTED_TOKENS[indexThree][1]
                                      : value
                                  );
                                }}
                              >
                                {value}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  className="relative flex items-center justify-center flex-col w-fit h-fit pb-1.5 gap-2"
                  key={indexTwo}
                >
                  <div className="relative w-full h-fit flex items-start justify-start font-bit text-white text-xs">
                    {item?.title}
                  </div>
                  <div className="relative w-full h-fit p-px flex flex-row items-center justify-center font-bit text-white text-center border border-suave rounded-sm">
                    <input
                      className="relative bg-offBlack flex flex-row w-full h-full justify-start items-center p-2 gap-2 text-xs"
                      onChange={(e) => item.setValue(e.target.value)}
                      value={item.chosenValue || ""}
                    />
                  </div>
                </div>
              ))
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CollectOptions;

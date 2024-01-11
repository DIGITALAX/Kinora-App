import { FunctionComponent } from "react";
import { CollectOptionsProps } from "../types/upload.types";
import { setPostCollectGif } from "../../../../redux/reducers/postCollectGifSlice";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const CollectOptions: FunctionComponent<CollectOptionsProps> = ({
  openMeasure,
  setOpenMeasure,
  availableCurrencies,
  postDetails,
  setPostDetails,
  dispatch,
  collect,
  collectTypes,
  id,
  type,
  gifs,
  border,
}): JSX.Element => {
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
            title: "Collectible?",
            dropValues: ["Yes", "No"],
            dropOpen: openMeasure.collectibleOpen,
            chosenValue: openMeasure.collectible,
            showObject: true,
            openDropdown: () =>
              setOpenMeasure((prev) => ({
                ...prev,
                collectibleOpen: !prev.collectibleOpen,
              })),
            setValue: (item: string) =>
              setOpenMeasure((prev) => ({
                ...prev,
                collectible: item,
              })),
          },
          {
            type: "drop",
            title: "Who can collect?",
            dropValues: ["Everyone", "Only Followers"],
            dropOpen: openMeasure.whoCollectsOpen,
            chosenValue: (
              collect
                ? collectTypes?.[id!]?.followerOnly
                : postDetails?.collectDetails?.followerOnly
            )
              ? "Only Followers"
              : "Everyone",
            showObject: openMeasure.collectible === "Yes" ? true : false,
            openDropdown: () =>
              setOpenMeasure((prev) => ({
                ...prev,
                whoCollectsOpen: !prev.whoCollectsOpen,
              })),
            setValue: collect
              ? (item: string) => {
                  const newCTs =
                    typeof collectTypes === "object" ? { ...collectTypes } : {};

                  newCTs[id!] = {
                    ...(newCTs[id!] || {}),
                    followerOnly: item === "Only Followers" ? true : false,
                  };

                  dispatch!(
                    setPostCollectGif({
                      actionType: type,
                      actionId: id,
                      actionCollectTypes: newCTs,
                      actionGifs: gifs,
                    })
                  );
                }
              : (item: string) => {
                  setPostDetails!((prev) => ({
                    ...prev,
                    collectDetails: {
                      ...prev.collectDetails,
                      followerOnly: item === "Only Followers" ? true : false,
                    },
                  }));
                },
          },
          {
            type: "drop",
            title: "Creator award?",
            dropValues: ["Yes", "No"],
            dropOpen: openMeasure.creatorAwardOpen,
            chosenValue: openMeasure.award || "No",
            showObject: openMeasure.collectible === "Yes" ? true : false,
            openDropdown: () =>
              setOpenMeasure((prev) => ({
                ...prev,
                creatorAwardOpen: !prev.creatorAwardOpen,
              })),
            setValue: (item: string) =>
              setOpenMeasure((prev) => ({
                ...prev,
                award: item,
              })),
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
                                      ? availableCurrencies[indexThree].contract
                                          .address
                                      : value
                                  );
                                  item.openDropdown!();
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
      {openMeasure.award === "Yes" && (
        <div className="relative h-fit w-full md:w-fit flex flex-col gap-6 items-end justify-between">
          {[
            {
              type: "input",
              title: "Award amount",
              chosenValue: collect
                ? collectTypes?.[id!]?.amount?.value || "0"
                : postDetails?.collectDetails?.amount?.value || "0",
              showObject: openMeasure.award === "Yes" ? true : false,
              setValue: collect
                ? (item: string) => {
                    const newCTs =
                      typeof collectTypes === "object"
                        ? { ...collectTypes }
                        : {};

                    newCTs[id!] = {
                      ...(newCTs[id!] || {}),
                      amount: {
                        ...(newCTs[id!]?.amount || {}),
                        value: item,
                        currency:
                          availableCurrencies?.find((value) => {
                            if (
                              value.contract.address ===
                              (collect
                                ? collectTypes?.[id!]?.amount?.currency
                                : postDetails?.collectDetails?.amount?.currency)
                            ) {
                              return value;
                            }
                          })?.contract?.address! ||
                          availableCurrencies?.[0]?.contract?.address,
                      },
                    } as any;

                    dispatch!(
                      setPostCollectGif({
                        actionType: type,
                        actionId: id,
                        actionCollectTypes: newCTs,
                        actionGifs: gifs,
                      })
                    );
                  }
                : (item: string) => {
                    setPostDetails!((prev) => ({
                      ...prev,
                      collectDetails: {
                        ...prev?.collectDetails,
                        amount: {
                          currency:
                            availableCurrencies?.find((value) => {
                              if (
                                value.contract.address ===
                                prev?.collectDetails?.amount?.currency
                              ) {
                                return value;
                              }
                            })?.contract?.address! ||
                            availableCurrencies?.[0]?.contract?.address,
                          value: item,
                        },
                      },
                    }));
                  },
            },
            {
              type: "drop",
              title: "Award currency",
              dropValues: availableCurrencies?.map((item) => item.symbol),
              chosenValue:
                availableCurrencies?.find((item) => {
                  if (
                    item.contract.address ===
                    (collect
                      ? collectTypes?.[id!]?.amount?.currency
                      : postDetails?.collectDetails?.amount?.currency)
                  ) {
                    return item;
                  }
                })?.symbol! || availableCurrencies?.[0]?.symbol,
              dropOpen: openMeasure.currencyOpen,
              showObject: openMeasure.award === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  currencyOpen: !prev.currencyOpen,
                })),
              setValue: collect
                ? (item: string) => {
                    const newCTs =
                      typeof collectTypes === "object"
                        ? { ...collectTypes }
                        : {};
                    newCTs[id!] = newCTs[id!] || {
                      followerOnly: false,
                    };

                    newCTs[id!] = {
                      ...(newCTs[id!] || {}),
                      amount: {
                        ...(newCTs[id!]?.amount || {}),
                        currency: availableCurrencies?.find((value) => {
                          if (value.symbol === item) {
                            return item;
                          }
                        })?.contract?.address,
                      },
                    } as any;

                    dispatch!(
                      setPostCollectGif({
                        actionType: type,
                        actionId: id,
                        actionCollectTypes: newCTs,
                        actionGifs: gifs,
                      })
                    );
                  }
                : (item: string) => {
                    setPostDetails!((prev) => ({
                      ...prev,

                      collectDetails: {
                        ...prev?.collectDetails,
                        amount: {
                          value: prev?.collectDetails?.amount?.value as string,
                          currency: availableCurrencies?.find((value) => {
                            if (value.symbol === item) {
                              return item;
                            }
                          })?.contract?.address,
                        },
                      },
                    }));
                  },
            },
            {
              type: "input",
              title: "Referral?",
              chosenValue: collect
                ? String(collectTypes?.[id!]?.referralFee || "0")
                : String(postDetails?.collectDetails?.referralFee || "0"),
              showObject: openMeasure.award === "Yes" ? true : false,

              setValue: collect
                ? (item: string) => {
                    const newCTs =
                      typeof collectTypes === "object"
                        ? { ...collectTypes }
                        : {};

                    newCTs[id!] = {
                      ...(newCTs[id!] || {}),
                      referralFee: Number(item),
                    } as any;

                    dispatch!(
                      setPostCollectGif({
                        actionType: type,
                        actionId: id,
                        actionCollectTypes: newCTs,
                        actionGifs: gifs,
                      })
                    );
                  }
                : (item: string) => {
                    setPostDetails!((prev) => ({
                      ...prev,

                      collectDetails: {
                        ...prev?.collectDetails,
                        referralFee: Number(item),
                      },
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
                                        ? availableCurrencies[indexThree]
                                            .contract.address
                                        : value
                                    );
                                    item.openDropdown!();
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
            }
          )}
        </div>
      )}
      {openMeasure.award === "Yes" && (
        <div className="relative h-fit w-full md:w-fit flex flex-col gap-6 items-end justify-between">
          {[
            {
              type: "drop",
              title: "Limited Edition?",
              dropValues: ["Yes", "No"],
              dropOpen: openMeasure.editionOpen,
              chosenValue: openMeasure.edition || "No",
              showObject: openMeasure.award === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  editionOpen: !prev.editionOpen,
                })),
              setValue: (item: string) =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  edition: item,
                })),
            },
            {
              type: "input",
              title: "Edition amount",
              chosenValue: collect
                ? collectTypes?.[id!]?.collectLimit || "0"
                : postDetails?.collectDetails?.collectLimit || "0",
              showObject: openMeasure.edition === "Yes" ? true : false,
              setValue: collect
                ? (item: string) => {
                    const newCTs =
                      typeof collectTypes === "object"
                        ? { ...collectTypes }
                        : {};

                    newCTs[id!] = {
                      ...(newCTs[id!] || {}),
                      collectLimit: item,
                    } as any;

                    dispatch!(
                      setPostCollectGif({
                        actionType: type,
                        actionId: id,
                        actionCollectTypes: newCTs,
                        actionGifs: gifs,
                      })
                    );
                  }
                : (item: string) => {
                    setPostDetails!((prev) => ({
                      ...prev,

                      collectDetails: {
                        ...prev?.collectDetails,
                        collectLimit: item,
                      },
                    }));
                  },
            },
            {
              type: "drop",
              title: "24hr time limit?",
              dropValues: ["Yes", "No"],
              dropOpen: openMeasure.timeOpen,
              chosenValue: openMeasure.time || "No",
              showObject: openMeasure.award === "Yes" ? true : false,
              openDropdown: () =>
                setOpenMeasure((prev) => ({
                  ...prev,
                  timeOpen: !prev.timeOpen,
                })),
              setValue: collect
                ? (item: string) => {
                    setOpenMeasure((prev) => ({
                      ...prev,
                      time: item,
                    }));

                    const newCTs =
                      typeof collectTypes === "object"
                        ? { ...collectTypes }
                        : {};

                    if (item === "Yes") {
                      newCTs[id!] = {
                        ...(newCTs[id!] || {}),
                        endsAt: new Date(
                          new Date().getTime() + 24 * 60 * 60 * 1000
                        ),
                      } as any;
                    } else {
                      newCTs[id!] = {
                        ...(newCTs[id!] || {}),
                        endsAt: undefined,
                      } as any;
                    }
                    dispatch!(
                      setPostCollectGif({
                        actionType: type,
                        actionId: id,
                        actionCollectTypes: newCTs,
                        actionGifs: gifs,
                      })
                    );
                  }
                : (item: string) => {
                    setOpenMeasure((prev) => ({
                      ...prev,
                      time: item,
                    }));

                    let endsAt: undefined | Date;

                    if (item === "Yes") {
                      endsAt = new Date(
                        new Date().getTime() + 24 * 60 * 60 * 1000
                      );
                    } else {
                      endsAt = undefined;
                    }

                    setPostDetails!((prev) => ({
                      ...prev,

                      collectDetails: {
                        ...prev?.collectDetails,
                        endsAt,
                      },
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
                                        ? availableCurrencies[indexThree]
                                            .contract.address
                                        : value
                                    );
                                    item.openDropdown!();
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
            }
          )}
        </div>
      )}
    </div>
  );
};

export default CollectOptions;

import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import { AiOutlineLoading } from "react-icons/ai";
import numeral from "numeral";
import { ModalContext } from "@/app/providers";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { CartItem, PrintProps } from "../types/storefront.types";
import useInteractions from "../../Common/hooks/useInteractions";

const Prints: FunctionComponent<PrintProps> = ({
  storeItems,
  storeLoading,
  chosenCartItem,
  setChosenCartItem,
  setStoreItems,
  dict,
}): JSX.Element => {
  const context = useContext(ModalContext);
  return (
    <div
      className="relative w-full h-full flex overflow-x-scroll items-start justify-start"
      id="xScroll"
    >
      <div className="relative w-fit h-full flex items-start justify-start flex-row gap-5">
        {storeLoading
          ? Array.from({ length: 10 })?.map((_, index: number) => {
              return (
                <div
                  key={index}
                  className="relative w-72 h-96 md:h-full flex flex-col gap-3 animate-pulse"
                >
                  <div
                    className="relative w-full h-full flex items-center justify-center p-px rounded-sm"
                    id="northern"
                  >
                    <div className="relative w-full h-full flex items-center justify-center rounded-sm"></div>
                  </div>
                  <div className="relative w-full h-10 flex flex-row px-2 py-1 items-center justify-center bg-black border border-cost rounded-sm"></div>
                </div>
              );
            })
          : storeItems?.map((item, index: number) => {
              const {
                like,
                mirror,
                openMirrorChoice,
                interactionsLoading,
                setOpenMirrorChoice,
                interactions,
              } = useInteractions(dict, item?.post!);
              return (
                <div
                  key={index}
                  className="relative w-72 h-96 md:h-full flex flex-col gap-3"
                >
                  <div
                    className="relative w-full h-full flex items-center justify-center p-px rounded-sm"
                    id="northern"
                  >
                    <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                      <Image
                        objectFit={"cover"}
                        draggable={false}
                        layout="fill"
                        className="rounded-sm"
                        src={`${INFURA_GATEWAY}/ipfs/${
                          item?.metadata?.images?.[0]?.split("ipfs://")?.[1]
                        }`}
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 h-24 bg-black/70 w-full flex flex-col rounded-b-sm p-2 justify-between items-center border border-cost">
                      <div className="relative w-full h-fit flex flex-col cursor-pointer text-xs text-white font-bit">
                        {item?.metadata?.title}
                      </div>
                      <div className="relative flex flex-row gap-2 w-full h-fit items-center">
                        <div className="relative flex flex-row gap-2 w-full h-fit">
                          {item?.metadata?.sizes?.map(
                            (size: string, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className={`relative rounded-sm text-xxs w-5 h-5 font-bit flex items-center justify-center cursor-pointer active:scale-95 ${
                                    chosenCartItem?.chosenSize === size &&
                                    chosenCartItem?.item?.metadata?.title ==
                                      item?.metadata?.title
                                      ? "border border-ballena bg-white text-black"
                                      : "border border-moda bg-black text-white"
                                  }`}
                                  onClick={() => {
                                    const updated = storeItems.map((obj) =>
                                      obj?.metadata?.title ===
                                      item?.metadata?.title
                                        ? { ...obj, chosenSize: size }
                                        : obj
                                    );

                                    setChosenCartItem((prev) => {
                                      let current = { ...prev };

                                      if (
                                        prev?.item?.metadata?.title ==
                                        item?.metadata?.title
                                      ) {
                                        current = {
                                          ...prev,
                                          chosenSize: size,
                                        };
                                      } else {
                                        current = {
                                          item,
                                          chosenAmount: 1,
                                          chosenSize: size,
                                          chosenCurrency:
                                            item?.acceptedTokens?.[0],
                                        };
                                      }

                                      return current as CartItem;
                                    });

                                    setStoreItems(updated);
                                  }}
                                >
                                  {size}
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                      <div className="relative flex flex-row gap-2 w-full h-fit items-center">
                        <div className="relative font-bit flex justify-start items-start w-fit h-fit text-ballena">
                          ${Number(item?.price)}
                        </div>
                        <div className="relative font-bit flex justify-start items-start w-fit h-fit text-ballena text-xs ml-auto">
                          {item?.tokenIdsMinted?.length || 0} / {item?.amount}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-10 flex flex-row px-2 py-1 items-center justify-center bg-black border border-cost rounded-sm">
                    <div className="relative flex w-full h-fit">
                      <div className="relative w-full h-fit flex items-start justify-between flex-row flex-wrap gap-4">
                        {[
                          {
                            image:
                              "QmbRSySsuGtwTvxmNtpEm2poV8FbQ46vPWBNYTd2eewCdj",
                            amount: interactions?.collects || 0,
                            title: dict?.cart,
                            reacted: interactions?.hasSimpleCollected || false,
                            function: () => {},
                            loader: false,
                            disabled: true,
                          },
                          {
                            image:
                              "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                            amount: interactions?.upvotes || 0,
                            title: dict?.like,
                            reacted: interactions?.hasUpVoted || false,
                            function: () => like(),
                            loader: interactionsLoading?.like,
                          },
                          {
                            image:
                              "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                            amount:
                              (interactions?.reposts || 0) +
                              (interactions?.quotes || 0),
                            title: dict?.mir,
                            reacted:
                              interactions?.hasReposted ||
                              interactions?.hasQuoted ||
                              false,
                            function: () =>
                              setOpenMirrorChoice((prev) => !prev),
                            loader: false,
                          },
                        ]?.map(
                          (
                            item: {
                              image: string;
                              amount: number;
                              title: string;
                              reacted: boolean;
                              function: () => void;
                              loader: boolean;
                              disabled?: boolean;
                            },
                            index: number
                          ) => {
                            return (
                              <div
                                key={index}
                                className="relative w-fit h-fit flex items-center justify-center flex-row gap-2 font-bit text-white text-xs"
                              >
                                <div
                                  key={item?.title}
                                  className={`relative w-4 h-4 flex items-center justify-center ${
                                    item?.reacted && "hue-rotate-60"
                                  } ${
                                    !context?.lensConectado?.profile ||
                                    item?.disabled
                                      ? "opacity-80"
                                      : "cursor-pointer active:scale-95"
                                  } ${item?.loader && "animate-spin"}`}
                                  onClick={() =>
                                    !item?.disabled &&
                                    !item?.loader &&
                                    item.function()
                                  }
                                >
                                  {item?.loader ? (
                                    <AiOutlineLoading
                                      color={"white"}
                                      size={15}
                                    />
                                  ) : (
                                    <Image
                                      layout="fill"
                                      draggable={false}
                                      src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                                    />
                                  )}
                                </div>
                                <div className="relative flex w-fit h-fit items-center justify-center">
                                  {numeral(item?.amount).format("0a")}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                      {openMirrorChoice && (
                        <div
                          className="absolute w-fit h-fit rounded-md bottom-7 right-2 flex bg-nave p-px"
                          id="northern"
                        >
                          <div className="relative w-fit h-fit flex flex-row gap-1.5 p-1 bg-nave rounded-md">
                            {[
                              {
                                icon: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                                function: () => mirror(),
                                title: dict?.mirQ,
                                reacted: interactions?.hasReposted || false,
                                loader: interactionsLoading?.mirror || false,
                                width: "1rem",
                                height: "0.8rem",
                              },
                              {
                                icon: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                                function: () =>
                                  context?.setQuote({
                                    open: true,
                                    post: item?.post,
                                  }),
                                title: dict?.quQ,
                                reacted:
                                  item?.post?.operations?.hasQuoted ||
                                  false,
                                loader: false,
                                width: "0.8rem",
                                height: "0.8rem",
                              },
                            ]?.map((item, index: number) => {
                              return (
                                <div
                                  key={index}
                                  className={`relative hover:opacity-80 w-7 p-1 h-6 rounded-full flex cursor-pointer active:scale-95 items-center justify-center ${
                                    item?.reacted && "hue-rotate-60"
                                  } ${
                                    !context?.lensConectado?.profile
                                      ? "opacity-80"
                                      : "cursor-pointer active:scale-95"
                                  }`}
                                  title={item.title}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    item.function();
                                  }}
                                >
                                  {item?.loader ? (
                                    <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                                      <AiOutlineLoading
                                        size={15}
                                        color={"white"}
                                      />
                                    </div>
                                  ) : (
                                    <div
                                      className="relative flex items-center justify-center"
                                      style={{
                                        width: item.width,
                                        height: item.height,
                                      }}
                                    >
                                      <Image
                                        draggable={false}
                                        layout="fill"
                                        objectFit="contain"
                                        src={`${INFURA_GATEWAY}/ipfs/${item.icon}`}
                                      />
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default Prints;

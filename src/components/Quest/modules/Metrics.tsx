import { FunctionComponent } from "react";
import { MetricsProps } from "../types/quest.types";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";

const Metrics: FunctionComponent<MetricsProps> = ({
  milestoneMetrics,
  playerMetricsOnChain,
  playerMetricsLive,
}) => {
  return (
    <div className="relative w-full h-full flex items-start justify-start flex-wrap gap-5 overflow-y-scroll">
      <div className="relative w-full h-fit flex items-center justify-center flex-col gap-1.5">
        <div className="relative w-full h-fit flex items-center justify-center text-girasol font-bit text-xs">
          Milestone Min. Thresholds
        </div>
        <div className="relative w-full h-px bg-gray-700"></div>
        <div className="relative w-full h-fit flex flex-wrap gap-4 items-start justify-start">
          {Object.entries(milestoneMetrics)
            ?.filter(
              ([key]) =>
                ![
                  "publication",
                  "__typename",
                  "playerId",
                  "pubId",
                  "profileId",
                  "videoBytes",
                ]?.includes(key)
            )
            ?.filter(([_, value]) => value !== false && Number(value) !== 0)
            ?.map(([key, value]) => {
              if (value === true) {
                return {
                  key,
                  value,
                  image:
                    key?.toLowerCase() == "react"
                      ? "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ"
                      : key?.toLowerCase() == "mirror"
                      ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
                      : key?.toLowerCase() == "quote"
                      ? "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
                      : key?.toLowerCase() == "bookmark"
                      ? "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433"
                      : "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                };
              } else {
                return { key: key?.split("min")?.[1], value };
              }
            })
            ?.map(
              (
                item: {
                  key: string;
                  value: number | boolean;
                  image?: string;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className="relative w-fit h-fit items-start justify-start gap-1 font-vcr text-white text-xxs flex flex-col"
                  >
                    <div className="flex items-start justify-start w-fit h-fit">
                      {item?.key}
                    </div>
                    <div className="relative w-fit h-fit flex items-center justify-center">
                      {item?.value !== true ? (
                        <div className="px-1.5 py-1 relative flex h-5 w-14 break-words  items-center justify-center rounded-sm bg-nave border border-girasol text-xs text-white font-vcr">
                          <div className="relative w-fit h-fit flex items-center justify-center">
                            {item?.value}
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`relative w-5 h-5 flex items-center justify-center`}
                        >
                          <Image
                            src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                            draggable={false}
                            layout="fill"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
            )}
        </div>
      </div>
      <div className="relative w-full h-fit flex items-center justify-center flex-col gap-2">
        <div className="relative w-full h-fit flex items-center justify-center text-white font-bit text-xs">
          Your On-Chain Video Metris
        </div>
        <div className="relative w-full h-px bg-gray-700"></div>
        {
          <div className="relative w-full h-fit flex flex-wrap gap-4 items-start justify-start">
            {playerMetricsOnChain ? (
              Object.entries(playerMetricsOnChain)
                ?.filter(([key]) => !["pubId", "profileId"]?.includes(key))
                ?.filter(([_, value]) => value !== false && Number(value) !== 0)
                ?.map(([key, value]) => {
                  if (value === true) {
                    key = key?.split("has")?.[1];
                    return {
                      key,
                      value,
                      image:
                        key?.toLowerCase() == "reacted"
                          ? "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ"
                          : key?.toLowerCase() == "mirrored"
                          ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
                          : key?.toLowerCase() == "quoted"
                          ? "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
                          : key?.toLowerCase() == "bookmarked"
                          ? "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433"
                          : "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                    };
                  } else {
                    return {
                      key: key
                        ?.replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim(),
                      value,
                    };
                  }
                })
                ?.map(
                  (
                    item: {
                      key: string;
                      value: number | boolean;
                      image?: string;
                    },
                    index: number
                  ) => {
                    return (
                      <div
                        key={index}
                        className="relative w-fit h-fit items-start justify-start gap-1 font-vcr text-white text-xxs flex flex-col"
                      >
                        <div className="flex items-start justify-start w-fit h-fit">
                          {item?.key}
                        </div>
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          {item?.value !== true ? (
                            <div className="px-1.5 py-1 relative flex h-5 w-14 break-words  items-center justify-center rounded-sm bg-nave border border-girasol text-xs text-white font-vcr">
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                {item?.value}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`relative w-5 h-5 flex items-center justify-center`}
                            >
                              <Image
                                src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                                draggable={false}
                                layout="fill"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )
            ) : (
              <div className="relative w-full h-fit flex items-center justify-center text-center text-gray-500 font-bit text-xxs">
                Nothing Logged On Chain Yet for this Video. Start watching!
              </div>
            )}
          </div>
        }
      </div>
      <div className="relative w-full h-fit flex items-center justify-center flex-col gap-2">
        <div className="relative w-full h-fit flex items-center justify-center text-white font-bit text-xs">
          Current Session Metrics
        </div>
        <div className="relative w-full h-px bg-gray-700"></div>
        {
          <div className="relative w-full h-fit flex flex-wrap gap-4 items-start justify-start">
            {playerMetricsLive ? (
              Object.entries(playerMetricsLive)
                ?.filter(([key]) => !["pubId", "profileId"]?.includes(key))
                ?.filter(([_, value]) => value !== false && Number(value) !== 0)
                ?.map(([key, value]) => {
                  if (value === true) {
                    key = key?.split("has")?.[1];
                    return {
                      key,
                      value,
                      image:
                        key?.toLowerCase() == "reacted"
                          ? "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ"
                          : key?.toLowerCase() == "mirrored"
                          ? "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3"
                          : key?.toLowerCase() == "quoted"
                          ? "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM"
                          : key?.toLowerCase() == "bookmarked"
                          ? "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433"
                          : "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                    };
                  } else {
                    return {
                      key: key
                        ?.replace(/([A-Z])/g, " $1")
                        .replace(/^./, (str) => str.toUpperCase())
                        .trim(),
                      value,
                    };
                  }
                })
                ?.map(
                  (
                    item: {
                      key: string;
                      value: number | boolean;
                      image?: string;
                    },
                    index: number
                  ) => {
                    return (
                      <div
                        key={index}
                        className="relative w-fit h-fit items-start justify-start gap-1 font-vcr text-white text-xxs flex flex-col"
                      >
                        <div className="flex items-start justify-start w-fit h-fit">
                          {item?.key}
                        </div>
                        <div className="relative w-fit h-fit flex items-center justify-center">
                          {item?.value !== true ? (
                            <div className="px-1.5 py-1 relative flex h-5 w-14 break-words  items-center justify-center rounded-sm bg-nave border border-girasol text-xs text-white font-vcr">
                              <div className="relative w-fit h-fit flex items-center justify-center">
                                {item?.value}
                              </div>
                            </div>
                          ) : (
                            <div
                              className={`relative w-5 h-5 flex items-center justify-center`}
                            >
                              <Image
                                src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                                draggable={false}
                                layout="fill"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                )
            ) : (
              <div className="relative w-full h-fit flex items-center justify-center text-center text-gray-500 font-bit text-xxs">
                No Session Active Yet for this Video. Start watching!
              </div>
            )}
          </div>
        }
      </div>
    </div>
  );
};

export default Metrics;

import { FunctionComponent } from "react";
import Image from "next/legacy/image";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { InteractBarProps } from "../types/common.types";
import { AiOutlineLoading } from "react-icons/ai";
import { setQuote } from "../../../../redux/reducers/quoteSlice";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import ProfileHover from "./ProfileHover";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  publication,
  lensConnected,
  mirror,
  bookmark,
  like,
  setMirrorChoiceOpen,
  mirrorChoiceOpen,
  index,
  interactionsLoading,
  dispatch,
  profileHovers,
  setProfileHovers,
  unfollowProfile,
  followProfile,
  router,
  mainFeed,
  simpleCollect,
  setCommentsOpen,
  main,
}): JSX.Element => {
  const pfp = createProfilePicture(publication?.by?.metadata?.picture);
  return (
    <div
      className="relative w-full h-fit flex cursor-default p-px rounded-sm"
      onClick={(e) => e.stopPropagation()}
      id="rainbow"
    >
      <div className="relative w-full h-fit flex flex-row gap-4 justify-between items-center px-1 py-1.5 bg-nave rounded-sm">
        <div className="relative w-full h-fit flex flex-row gap-2">
          {[
            mainFeed || router.asPath.includes("/envoker/")
              ? {
                  icon: "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
                  function: () => bookmark!(publication?.id),
                  title: "Save Quest",
                  amount: publication?.stats?.bookmarks || 0,
                  reacted: publication?.operations?.hasBookmarked,
                  loader: false,
                  width: "0.8rem",
                  height: "1rem",
                }
              : {
                  icon: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                  function: () =>
                    setCommentsOpen!((prev) => {
                      const current = [...prev];
                      current[index] = !current[index];
                      return current;
                    }),
                  title: "Comment",
                  amount: publication?.stats?.comments || 0,
                  reacted: false,
                  loader: false,
                  width: "0.8rem",
                  height: "0.8rem",
                },
            {
              icon: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
              function: () =>
                setMirrorChoiceOpen!((prev) => {
                  const arr = [...prev];
                  arr[index] = !arr[index];
                  return arr;
                }),
              title: mainFeed ? "Mirror or Quote Quest" : "Mirror",
              amount:
                (publication?.stats?.mirrors || 0) +
                (publication?.stats?.quotes || 0),
              reacted:
                publication?.operations?.hasMirrored ||
                publication?.operations?.hasQuoted,
              loader: false,
              width: "1rem",
              height: "0.8rem",
            },
            {
              icon: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
              function: () =>
                like!(
                  publication?.id,
                  publication?.operations?.hasReacted,

                  main!
                ),
              title: mainFeed ? "Like Quest" : "Like",
              amount: publication?.stats?.reactions || 0,
              reacted: publication?.operations?.hasReacted,
              loader: interactionsLoading?.[index]?.like!,
              width: "0.9rem",
              height: "0.9rem",
            },
            mainFeed || router.asPath.includes("/envoker/")
              ? {
                  title: "Players",
                  icon: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
                  function: () => router.push(`/quest/${publication?.id}`),
                  amount: publication?.stats?.countOpenActions || 0,
                  reacted:
                    publication?.operations?.hasActed?.isFinalisedOnchain,
                  loader: false,
                  width: "0.9rem",
                  height: "0.9rem",
                }
              : {
                  title: "Collect",
                  icon: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
                  function: () =>
                    publication?.openActionModules &&
                    publication?.openActionModules?.length > 0 &&
                    simpleCollect!(publication!),
                  amount: publication?.stats?.countOpenActions || 0,
                  reacted:
                    publication?.operations?.hasActed?.isFinalisedOnchain,
                  loader: false,
                  width: "0.9rem",
                  height: "0.9rem",
                },
          ]?.map(
            (
              item: {
                icon: string;
                function: () => void;
                title: string;
                reacted: boolean;
                loader: boolean;
                width: string;
                height: string;
                amount: number;
              },
              index: number
            ) => {
              return (
                <div
                  key={index}
                  className="relative w-fit h-fit flex items-center justify-center gap-1"
                >
                  <div
                    className={`relative hover:opacity-80 w-7 h-6 rounded-full flex items-center justify-center ${
                      item?.reacted && "hue-rotate-60"
                    } ${
                      !lensConnected?.id ||
                      (item?.title === "Collect" &&
                        (!publication?.openActionModules ||
                          publication?.openActionModules?.length == 0))
                        ? "opacity-50"
                        : "cursor-pointer active:scale-95"
                    }`}
                    title={item?.title}
                    onClick={(e) => {
                      e.stopPropagation();
                      item.function();
                    }}
                  >
                    {item?.loader ? (
                      <div className="relative w-fit h-fit flex items-center justify-center animate-spin">
                        <AiOutlineLoading size={15} color={"white"} />
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
                          src={`${INFURA_GATEWAY}/ipfs/${item.icon}`}
                        />
                      </div>
                    )}
                  </div>
                  <div className="relative w-fit h-fit flex items-center justify-center font-bit text-white text-xs">
                    {item?.amount}
                  </div>
                </div>
              );
            }
          )}
        </div>
        <div
          className="relative w-fit h-fit flex items-center justify-center ml-auto p-px rounded-full"
          id="rainbow"
        >
          <div
            className="relative flex items-center justify-center rounded-full  w-6 h-6 cursor-pointer"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setProfileHovers!((prev) => {
                const arr = [...(prev || [])];
                arr[index] = true;
                return arr;
              });
            }}
          >
            {pfp && (
              <Image
                layout="fill"
                src={pfp}
                draggable={false}
                objectFit="cover"
                className="rounded-full"
              />
            )}
          </div>
        </div>
      </div>
      {mirrorChoiceOpen?.[index] && (
        <div
          className="absolute w-fit h-fit rounded-md bottom-10 flex bg-nave p-px"
          id="rainbow"
        >
          <div className="relative w-fit h-fit flex flex-row gap-1.5 p-1 bg-nave rounded-md">
            {[
              {
                icon: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                function: () => mirror!(publication?.id, main)!,
                title: "Mirror Quest",
                reacted: publication?.operations?.hasMirrored,
                loader: interactionsLoading?.[index]?.mirror!,
                width: "1rem",
                height: "0.8rem",
              },
              {
                icon: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                function: () =>
                  dispatch(
                    setQuote({
                      actionOpen: true,
                      actionPublication: publication,
                    })
                  ),
                title: "Quote Quest",
                reacted: publication?.operations?.hasQuoted,
                loader: false,
                width: "0.8rem",
                height: "0.8rem",
              },
            ]?.map(
              (
                item: {
                  icon: string;
                  function: () => void;
                  title: string;
                  reacted: boolean;
                  loader: boolean;
                  width: string;
                  height: string;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className={`relative hover:opacity-80 w-7 p-1 h-6 rounded-full flex cursor-pointer active:scale-95 items-center justify-center ${
                      item?.reacted && "hue-rotate-60"
                    } ${
                      !lensConnected?.id
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
                        <AiOutlineLoading size={15} color={"white"} />
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
              }
            )}
          </div>
        </div>
      )}
      {profileHovers?.[index] && (
        <ProfileHover
          followProfile={followProfile!}
          unfollowProfile={unfollowProfile!}
          profile={publication?.by}
          index={index}
          followLoading={interactionsLoading?.[index]?.follow!}
          unfollowLoading={interactionsLoading?.[index]?.unfollow!}
          pfp={pfp}
          setProfileHovers={setProfileHovers!}
          dispatch={dispatch}
          router={router}
        />
      )}
    </div>
  );
};

export default InteractBar;

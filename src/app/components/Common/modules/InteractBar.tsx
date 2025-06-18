import { FunctionComponent, JSX, useContext, useState } from "react";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { usePathname, useRouter } from "next/navigation";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { InteractBarProps } from "../types/common.types";
import { INFURA_GATEWAY } from "@/app/lib/constants";
import { AiOutlineLoading } from "react-icons/ai";
import useInteractions from "../hooks/useInteractions";
import ProfileHover from "./ProfileHover";

const InteractBar: FunctionComponent<InteractBarProps> = ({
  post,
  mainFeed,
  border,
  dict,
  setCommentsOpen,
}): JSX.Element => {
  const context = useContext(ModalContext);
  const path = usePathname();
  const router = useRouter();
  const [profileHover, setProfileHover] = useState<boolean>(false);
  const {
    openMirrorChoice,
    setOpenMirrorChoice,
    interactionsLoading,
    like,
    collect,
    handleBookmark,
    mirror,
    interactions,
  } = useInteractions(dict, post);

  return (
    <div
      className="relative w-full h-fit flex cursor-default p-px rounded-sm"
      onClick={(e) => e.stopPropagation()}
      id={!border ? "northern" : ""}
    >
      <div
        className={`relative w-full h-fit flex md:flex-row flex-col  gap-2 md:gap-4 justify-between items-center py-1.5 rounded-sm ${
          !border && "bg-nave px-1"
        }`}
      >
        <div className="relative w-full h-fit flex flex-row sm:flex-nowrap flex-wrap gap-2">
          {[
            mainFeed || path.includes("/envoker/")
              ? {
                  icon: "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
                  function: () => handleBookmark(),
                  title: dict?.save,
                  amount: interactions?.bookmarks || 0,
                  reacted: interactions?.hasBookmarked,
                  loader: false,
                  width: "0.8rem",
                  height: "1rem",
                }
              : {
                  icon: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                  function: () => {
                    if (path.includes("/activity")) {
                      context?.setRouterChangeLoading(true);
                      router.push(`/video/${post?.id}`);
                    } else {
                      setCommentsOpen?.((prev) => !prev);
                    }
                  },
                  title: dict?.como,
                  amount: post?.stats?.comments || 0,
                  reacted: false,
                  loader: false,
                  width: "0.8rem",
                  height: "0.8rem",
                },
            {
              icon: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
              function: () => setOpenMirrorChoice((prev) => !prev),
              title: mainFeed ? "Mirror or Quote Quest" : "Mirror",
              amount:
                (interactions?.reposts || 0) + (interactions?.quotes || 0),
              reacted: interactions?.hasReposted || interactions?.hasQuoted,
              loader: false,
              width: "1rem",
              height: "0.8rem",
            },
            {
              icon: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
              function: () => like(),
              title: mainFeed ? "Like Quest" : "Like",
              amount: interactions?.upvotes || 0,
              reacted: interactions?.hasUpVoted,
              loader: interactionsLoading?.like,
              width: "0.9rem",
              height: "0.9rem",
            },
            mainFeed || path.includes("/envoker/")
              ? {
                  title: dict?.plas,
                  icon: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
                  function: () => {
                    context?.setRouterChangeLoading(true);
                    router.push(`/quest/${post?.id}`);
                  },
                  amount: interactions?.collects || 0,
                  reacted: interactions?.hasSimpleCollected,
                  loader: false,
                  width: "0.9rem",
                  height: "0.9rem",
                }
              : {
                  title: dict?.cols,
                  icon: "QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF",
                  function: () =>
                    post?.actions?.[0]?.__typename == "SimpleCollectAction" &&
                    collect(),
                  amount: interactions?.collects || 0,
                  reacted: interactions?.hasSimpleCollected,
                  loader: interactionsLoading?.collect,
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
                      (!context?.lensConectado?.profile ||
                        (item?.title === dict?.cols &&
                          post?.actions?.length < 1)) &&
                      item?.title !== dict?.plas
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
          id="northern"
        >
          <div
            className="relative flex items-center justify-center rounded-full  w-6 h-6 cursor-pointer"
            onMouseEnter={(e) => {
              e.stopPropagation();
              setProfileHover(true);
            }}
          >
            <Image
              layout="fill"
              src={handleProfilePicture(post?.author?.metadata?.picture)}
              draggable={false}
              objectFit="cover"
              className="rounded-full"
            />
          </div>
        </div>
      </div>
      {openMirrorChoice && (
        <div
          className="absolute w-fit h-fit rounded-md bottom-10 flex bg-nave p-px"
          id="northern"
        >
          <div className="relative w-fit h-fit flex flex-row gap-1.5 p-1 bg-nave rounded-md">
            {[
              {
                icon: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                function: () => mirror(),
                title: dict?.mirQ,
                reacted: interactions?.hasReposted,
                loader: interactionsLoading?.mirror!,
                width: "1rem",
                height: "0.8rem",
              },
              {
                icon: "QmfDNH347Vph4b1tEuegydufjMU2QwKzYnMZCjygGvvUMM",
                function: () =>
                  context?.setQuote({
                    open: true,
                    post: post,
                  }),
                title: dict?.quQ,
                reacted: post?.operations?.hasQuoted,
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
                    if (!context?.lensConectado?.sessionClient) return;
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
            })}
          </div>
        </div>
      )}
      {profileHover && (
        <ProfileHover
          profile={post?.author}
          dict={dict}
          setProfileHover={setProfileHover!}
        />
      )}
    </div>
  );
};

export default InteractBar;

import { FunctionComponent, JSX, useContext } from "react";
import Image from "next/legacy/image";
import moment from "moment";
import { AiOutlineLoading } from "react-icons/ai";
import numeral from "numeral";
import { useRouter } from "next/navigation";
import { ModalContext } from "@/app/providers";
import {
  ACCEPTED_TOKENS,
  INFURA_GATEWAY,
  numberToItemTypeMap,
} from "@/app/lib/constants";
import { SocialType } from "../../Video/types/video.types";
import useInteractions from "../../Common/hooks/useInteractions";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { QuestBoxDetailsProps } from "../types/quest.types";
import useHover from "../../Common/hooks/useHover";

const QuestBoxDetails: FunctionComponent<QuestBoxDetailsProps> = ({
  questInfo,
  dict,
  setSocialType,
  joinLoading,
  handlePlayerJoin,
  questInfoLoading,
}): JSX.Element => {
  const router = useRouter();
  const { handleFollow, handleUnfollow, followLoading } = useHover(
    dict,
    questInfo?.post?.author!
  );
  const context = useContext(ModalContext);
  const {
    openMirrorChoice,
    setOpenMirrorChoice,
    interactionsLoading,
    like,
    handleBookmark,
    mirror,
    interactions,
  } = useInteractions(dict, questInfo?.post!);
  return (
    <div className="relative bg-black rounded-sm border border-cost w-full h-fit xl:h-full flex flex-col gap-3 p-2 items-start xl:justify-between">
      {!questInfoLoading ? (
        <>
          <div className="relative w-full flex items-start justify-start flex-row gap-3 h-fit">
            <div className="relative w-full h-fit flex items-center justify-start flex-row gap-2">
              <div
                className="relative w-7 h-7 flex items-center justify-center rounded-full p-px cursor-pointer"
                id="northern"
                onClick={() => {
                  context?.setRouterChangeLoading(true);

                  router.push(
                    `/envoker/${questInfo?.post?.author?.username?.localName}`
                  );
                }}
              >
                <div className="relative rounded-full flex items-center justify-center w-full h-full">
                  <Image
                    src={handleProfilePicture(
                      questInfo?.post?.author?.metadata?.picture
                    )}
                    layout="fill"
                    className="rounded-full"
                    draggable={false}
                  />
                </div>
              </div>
              <div className="relative flex flex-col justify-center items-start gap-px">
                <div className="relative text-white font-bit text-xxs flex items-center justify-center">{`Posted by ${
                  Number(questInfo?.post?.author?.username?.localName?.length) >
                  7
                    ? questInfo?.post?.author?.username?.localName?.slice(
                        0,
                        5
                      ) + "..."
                    : questInfo?.post?.author?.username?.localName
                }`}</div>
                <div className="relative flex font-bit text-gray-600 items-center justify-center text-xxs">
                  {questInfo?.post?.timestamp &&
                    moment(questInfo?.post?.timestamp).fromNow()}
                </div>
              </div>
            </div>
            <div className="relative flex items-center justify-center">
              <div
                className={`relative w-16 h-7 flex items-center justify-center font-bit text-azul text-xxs border border-azul rounded-md px-1.5 py-1 ${
                  !context?.lensConectado?.profile && !followLoading
                    ? "opacity-70"
                    : "cursor-pointer active:scale-95 hover:opacity-70"
                }`}
                onClick={() =>
                  !followLoading &&
                  context?.lensConectado?.profile &&
                  (questInfo?.post?.author?.operations?.isFollowedByMe
                    ? handleUnfollow()
                    : handleFollow(),
                  0)
                }
              >
                {questInfo?.post?.author?.operations?.isFollowedByMe
                  ? dict?.u
                  : dict?.f}
              </div>
            </div>
          </div>
          {((questInfo?.gate?.erc20Logic &&
            questInfo?.gate?.erc20Logic?.length > 0) ||
            (questInfo?.gate?.erc721Logic &&
              questInfo?.gate?.erc721Logic?.length > 0)) && (
            <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xs">
              <div className="relative w-fit h-fit flex items-center justify-center text-xxs">
                {dict?.rep}
              </div>
              {questInfo?.gate?.erc20Logic &&
                questInfo?.gate?.erc20Logic?.length > 0 && (
                  <div className="relative w-full h-fit flex flex-col items-start justify-center gap-2 break-words">
                    <div className="relative w-fit h-fit flex items-center justify-center text-xxs">
                      {dict?.erc20}
                    </div>
                    <div className="relative w-fit h-fit justify-start items-center gap-4 flex flex-row flex-wrap">
                      {questInfo?.gate?.erc20Logic?.map(
                        (
                          erc20: {
                            address: string;
                            amount: string;
                          },
                          index: number
                        ) => {
                          return (
                            <div
                              key={index}
                              className="relative w-fit h-fit flex items-center justify-center gap-1"
                            >
                              <div className="relative w-5 h-6 flex items-center justify-center">
                                <Image
                                  draggable={false}
                                  layout="fill"
                                  src={`${INFURA_GATEWAY}/ipfs/${
                                    ACCEPTED_TOKENS?.filter(
                                      (token) =>
                                        erc20?.address?.toLowerCase() ==
                                        token[2]?.toLowerCase()
                                    )?.[0]?.[0]
                                  }`}
                                />
                              </div>
                              <div className="relative w-fit h-fit flex items-center justify-center font-vcr text-acei text-xxs">
                                {`${Number(erc20?.amount) / 10 ** 18} ${
                                  ACCEPTED_TOKENS?.filter(
                                    (token) =>
                                      erc20?.address?.toLowerCase() ==
                                      token[2]?.toLowerCase()
                                  )?.[0]?.[1]
                                }`}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              {questInfo?.gate?.erc721Logic &&
                questInfo?.gate?.erc721Logic?.length > 0 && (
                  <div className="relative w-full h-fit flex flex-col items-start justify-center gap-2 break-words">
                    <div className="relative w-fit h-fit flex items-center justify-center text-xxs">
                      {dict?.erc721}
                    </div>
                    <div className="relative w-full h-fit justify-start items-center flex overflow-x-scroll">
                      <div className="relative w-fit h-fit justify-start items-center gap-2 flex flex-row">
                        {questInfo?.gate?.erc721Logic?.map(
                          (erc721, index: number) => {
                            return (
                              <div
                                key={index}
                                className="relative w-12 h-12 flex items-center justify-center gap-1 cursor-pointer active:scale-95 p-px rounded-sm"
                                onClick={() =>
                                  window.open(
                                    `https://cypher.digitalax.xyz/item/${
                                      numberToItemTypeMap[
                                        Number(erc721?.origin)
                                      ]
                                    }/${erc721?.metadata?.title?.replaceAll(
                                      " ",
                                      "_"
                                    )}`
                                  )
                                }
                                id="northern"
                              >
                                <div className="relative w-full h-full flex items-center justify-center rounded-sm">
                                  <Image
                                    draggable={false}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-sm"
                                    src={`${INFURA_GATEWAY}/ipfs/${
                                      erc721?.metadata?.mediaCover
                                        ? erc721?.metadata?.mediaCover?.split(
                                            "ipfs://"
                                          )?.[1]
                                        : erc721?.metadata?.images?.[0].split(
                                            "ipfs://"
                                          )?.[1]
                                    }`}
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                )}
            </div>
          )}
          <div className="relative w-full h-fit flex flex-col items-start justify-start gap-2 font-vcr text-white text-xxs">
            <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
              <div className="relative w-fit h-fit flex items-center justify-center">
                {dict?.conM}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                {questInfo?.milestoneCount}
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-row items-center justify-start gap-1 break-words">
              <div className="relative w-fit h-fit flex items-center justify-center">
                {dict?.vidC}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                {questInfo?.milestones?.reduce(
                  (acumulador, valorActual) =>
                    acumulador + Number(valorActual.videoLength),
                  0
                )}
              </div>
              <div
                className="relative w-3.5 h-3.5 flex items-center justify-center cursor-pointer active:scale-95"
                onClick={() => window.open("https://livepeer.studio/")}
              >
                <Image
                  draggable={false}
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/QmVa8AWMYyAfcQAEpbqdUoRSxSkntpH1DEMpdyajZWz4AR`}
                />
              </div>
            </div>
            <div className="relative w-full h-fit flex flex-row items-center justify-start gap-px break-words">
              <div className="relative w-fit h-fit flex items-center justify-center">
                {dict?.mix}
              </div>
              <div className="relative w-fit h-fit flex items-center justify-center text-girasol break-words">
                {(questInfo?.milestones
                  ?.map(
                    (item) =>
                      item?.rewards?.filter((rew) => rew?.type == "0")?.length
                  )
                  ?.filter(Boolean)?.length! > 0
                  ? questInfo?.milestones?.reduce(
                      (acumulador, valorActual) =>
                        acumulador +
                        Number(
                          valorActual?.rewards?.filter(
                            (rew) => rew?.type == "0"
                          )?.length
                        ),
                      0
                    ) + " x ERC20 + "
                  : "") +
                  (questInfo?.milestones
                    ?.map(
                      (item) =>
                        item?.rewards?.filter((rew) => rew?.type == "1")?.length
                    )
                    ?.filter(Boolean)?.length! > 0
                    ? questInfo?.milestones?.reduce(
                        (acumulador, valorActual) =>
                          acumulador +
                          Number(
                            valorActual?.rewards?.filter(
                              (rew) => rew?.type == "1"
                            )?.length
                          ),
                        0
                      ) + " x ERC721"
                    : "")}
              </div>
            </div>
          </div>
          <div className="relative w-full h-fit flex flex-col gap-3 mb-0">
            <div className="relative flex w-full h-fit">
              <div className="relative w-full h-fit flex items-start justify-between flex-row flex-wrap gap-4">
                {[
                  {
                    image: "QmbRSySsuGtwTvxmNtpEm2poV8FbQ46vPWBNYTd2eewCdj",
                    amount: questInfo?.players?.length || 0,
                    title: dict?.plas,
                    reacted: interactions?.collects || false,
                    function: () => setSocialType(SocialType.Players),
                    loader: false,
                    otherFunction: () => setSocialType(SocialType.Players),
                  },
                  {
                    image: "QmT1aZypVcoAWc6ffvrudV3JQtgkL8XBMjYpJEfdFwkRMZ",
                    amount: interactions?.upvotes || 0,
                    title: dict?.lis,
                    reacted: interactions?.hasUpVoted || false,
                    function: () => like(),
                    loader: interactionsLoading?.like,
                    otherFunction: () => setSocialType(SocialType.Reacts),
                  },
                  {
                    image: "QmPRRRX1S3kxpgJdLC4G425pa7pMS1AGNnyeSedngWmfK3",
                    amount:
                      (interactions?.reposts || 0) +
                      (interactions?.quotes || 0),
                    title: dict?.mir,
                    reacted:
                      interactions?.hasReposted ||
                      interactions?.hasQuoted ||
                      false,
                    function: () => setOpenMirrorChoice((prev) => !prev),
                    loader: false,
                    otherFunction: () => setSocialType(SocialType.Mirrors),
                  },
                  {
                    image: "QmXD3LnHiiLSqG2TzaNd1Pmhk2nVqDHDqn8k7RtwVspE6n",
                    amount: questInfo?.post?.stats?.comments || 0,
                    title: dict?.como,
                    reacted: false,
                    function: () => setSocialType(SocialType.Comments),
                    loader: false,
                    otherFunction: () => setSocialType(SocialType.Comments),
                  },
                  {
                    image: "QmVXkRB4HCd6gkXmj1cweEh4nVV6oBuKCAWfsKUEJae433",
                    amount: interactions?.bookmarks || 0,
                    title: dict?.book,
                    reacted: interactions?.hasBookmarked || false,
                    function: () => handleBookmark(),
                    loader: interactionsLoading?.bookmark,
                    otherFunction: () => {},
                  },
                ]?.map((item, index: number) => {
                  return (
                    <>
                      <div
                        key={index}
                        className="relative w-fit h-fit flex items-center justify-center flex-row gap-2 font-bit text-white text-xs"
                      >
                        <div
                          key={item?.title}
                          className={`relative w-4 h-4 flex items-center justify-center ${
                            item?.reacted && "hue-rotate-60"
                          } ${
                            !context?.lensConectado?.profile
                              ? "opacity-80"
                              : "cursor-pointer active:scale-95"
                          } ${item?.loader && "animate-spin"}`}
                          onClick={() => item.function()}
                        >
                          {item?.loader ? (
                            <AiOutlineLoading color={"white"} size={15} />
                          ) : (
                            <Image
                              layout="fill"
                              draggable={false}
                              src={`${INFURA_GATEWAY}/ipfs/${item?.image}`}
                            />
                          )}
                        </div>
                        <div
                          className="relative flex w-fit h-fit items-center justify-center cursor-pointer active:scale-95"
                          onClick={() => item.otherFunction()}
                        >
                          {numeral(item?.amount).format("0a")}
                        </div>
                      </div>
                      {openMirrorChoice && item.title == "Mirror" && (
                        <div
                          key={index * Math.random()}
                          className="absolute w-fit h-fit rounded-md bottom-7 right-[40vw] xl:left-24 flex bg-nave p-px"
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
                                    post: questInfo?.post,
                                  }),
                                title: dict?.quQ,
                                reacted: interactions?.hasQuoted || false,
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
                              }
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>
            <div
              className={`relative w-full h-8 px-1.5 py-1 flex flex-row items-center gap-3 justify-center border border-gray-300 rounded-md ${
                joinLoading ||
                questInfo?.players?.some(
                  (item) =>
                    item?.profile?.address ==
                    context?.lensConectado?.profile?.address
                ) ||
                !questInfo?.status
                  ? "opacity-70"
                  : "cursor-pointer active:scale-95"
              }`}
              onClick={() =>
                !joinLoading &&
                !questInfo?.players?.some(
                  (item) =>
                    item?.profile?.address ==
                    context?.lensConectado?.profile?.address
                ) &&
                questInfo?.status &&
                handlePlayerJoin()
              }
            >
              <div
                className={`relative w-4 h-4 flex items-center justify-center ${
                  joinLoading && "animate-spin"
                }`}
              >
                {joinLoading ? (
                  <AiOutlineLoading color={"FBD201"} size={15} />
                ) : (
                  <Image
                    layout="fill"
                    src={`${INFURA_GATEWAY}/ipfs/QmNomDrWUNrcy2SAVzsKoqd5dPMogeohB8PSuHCg57nyzF`}
                    draggable={false}
                  />
                )}
              </div>
              <div className="relative w-fit h-fit text-sm font-vcr text-gray-300">
                {questInfo?.players
                  ?.find(
                    (item) =>
                      item?.profile?.address ==
                      context?.lensConectado?.profile?.address
                  )
                  ?.questsCompleted?.includes(questInfo?.questId)
                  ? dict?.compQ
                  : questInfo?.players?.some(
                      (item) =>
                        item?.profile?.address ==
                        context?.lensConectado?.profile?.address
                    )
                  ? dict?.quJ
                  : !questInfo?.status
                  ? dict?.cloQ
                  : dict?.join}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="relative w-full h-full flex animate-pulse"></div>
      )}
    </div>
  );
};

export default QuestBoxDetails;

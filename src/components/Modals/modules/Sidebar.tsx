import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { SidebarProps } from "../types/modals.types";
import { setSideBarOpen } from "../../../../redux/reducers/sideBarOpenSlice";
import { setAccountSwitch } from "../../../../redux/reducers/accountSwitchSlice";
import { AccountType } from "@/components/Envoker/types/envoker.types";
import { Quest } from "@/components/Quest/types/quest.types";
import toHexWithLeadingZero from "../../../../lib/helpers/toHexWithLeadingZero";

const Sidebar: FunctionComponent<SidebarProps> = ({
  openSidebar,
  router,
  lensConnected,
  dispatch,
  openConnectModal,
  handleLogIn,
  walletConnected,
  newQuests,
}) => {
  return (
    <div
      className={`absolute flex items-start justify-start flex-col p-1.5 border-r border-white/20 z-20 bg-nave ${
        openSidebar ? "w-40" : "w-10"
      }`}
      style={{
        height: "calc(100vh - 2.5rem)",
      }}
      id={openSidebar ? "openSide" : "closeSide"}
    >
      <div className="relative w-full h-full flex items-start justify-start flex-col gap-20">
        <div className="relative w-full h-fit flex items-end justify-end ml-0">
          <div
            className="relative flex items-end justify-end w-5 h-5 cursor-pointer active:scale-95"
            onClick={() => dispatch(setSideBarOpen(!openSidebar))}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmdfBrnpSwd8y5opxT8eTx5v7QLEAMAdm13cm5t6DGmTL8`}
              draggable={false}
            />
          </div>
        </div>
        <div
          className={`relative flex flex-col gap-20 w-full h-full ${
            openSidebar
              ? "items-start justify-start"
              : "items-center justify-center"
          }`}
        >
          <div
            className={`relative flex flex-col justify-center gap-7 w-fit h-fit ${
              openSidebar ? "items-start" : "items-center"
            }`}
          >
            {[
              {
                title: "Feed",
                image: "QmRs3h5EmfHLKGNLUPKiUdhw5i25UKtFRYQ7frGiYmxE4K",
                link: () => {
                  router.push(`/`);
                },
              },
              {
                title: "Account",
                image: "QmbRjUquntNwVuSn1GpUpVi7hMygvhShZrA7rHgmFYtzSf",
                link:
                  !walletConnected && !lensConnected
                    ? openConnectModal
                    : walletConnected && !lensConnected
                    ? () => handleLogIn()
                    : () => {
                        if (!router.asPath?.includes("envoker")) {
                          router.push(
                            `/envoker/${
                              lensConnected?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )?.[1]
                            }`
                          );
                        }
                        dispatch(setAccountSwitch(AccountType.Home));
                      },
              },
              {
                title: "Envoke",
                image: "QmSdwhzPmXp3GJCNKoNEwXPaVZVpyHSSCuDxNPDuxGP2yk",
                link: () => router.push(`/envoke`),
              },
              {
                title: "Upload",
                image: "QmbzfW75UVB7VQ9K7gFQecs8dzhbcXb6TdgfzsCtikkdUQ",
                link: () => router.push(`/upload`),
              },
              {
                title: "Saves",
                image: "QmS5LARM6UvSAhzGmGGSQiWYfvNguwsfeiXJ62s3KGZ6Z3",
                link:
                  !walletConnected && !lensConnected
                    ? openConnectModal
                    : walletConnected && !lensConnected
                    ? () => handleLogIn()
                    : () => {
                        if (!router.asPath?.includes("envoker")) {
                          router.push(
                            `/envoker/${
                              lensConnected?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )?.[1]
                            }`
                          );
                        }
                        dispatch(setAccountSwitch(AccountType.Save));
                      },
              },
              {
                title: "Activity",
                image: "QmZ3mrF2YgwPkoeFpR54mpDKznTg9oFo5Mqk7uGFW8PgY2",
                link: () => router.push("/activity"),
              },
              {
                title: "Dashboard",
                image: "QmZ1PSKctNt2REihxUmJBK9ZrcbU2pTACE1XSUY4YprK1x",
                link:
                  !walletConnected && !lensConnected
                    ? openConnectModal
                    : walletConnected && !lensConnected
                    ? () => handleLogIn()
                    : () => {
                        if (!router.asPath?.includes("envoker")) {
                          router.push(
                            `/envoker/${
                              lensConnected?.handle?.suggestedFormatted?.localName?.split(
                                "@"
                              )?.[1]
                            }`
                          );
                        }
                        dispatch(setAccountSwitch(AccountType.Dashboard));
                      },
              },
            ].map(
              (
                item: {
                  title: string;
                  image: string;
                  link: (() => void) | (() => void) | undefined;
                },
                index: number
              ) => {
                return (
                  <div
                    key={index}
                    className="relative w-fit h-fit flex items-center justify-center flex flex-row gap-2 hover:opacity-80 cursor-pointer active:scale-95"
                    onClick={() => item.link!()}
                  >
                    <div
                      className={`relative flex items-center justify-center w-5 h-5`}
                      title={item?.title}
                    >
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                        draggable={false}
                      />
                    </div>
                    {openSidebar && (
                      <div
                        className={`relative w-fit h-fit flex items-center justify-center text-white font-bit text-xs top-px`}
                      >
                        {item.title}
                      </div>
                    )}
                  </div>
                );
              }
            )}
          </div>
          <div className="relative w-fit h-full flex items-center justify-start">
            <div className="relative w-1.5 h-9 flex items-center justify-center font-bit text-sm text-white">
              <Image
                layout="fill"
                src={`${INFURA_GATEWAY}/ipfs/Qmey3xzXCCRvxrwYUY99R55SAYGugYnQgPmANrZjXorkkL`}
                draggable={false}
              />
            </div>
          </div>
          <div className="relative w-fit h-fit flex items-start justify-center flex-col gap-2">
            {openSidebar && (
              <>
                <div className="relative font-bit text-white text-xs flex items-center justify-center w-fit h-fit">
                  New Quests
                </div>
                <div className="relative w-full h-px flex items-center justify-center bg-white"></div>
                <div
                  className="relative font-bit text-white opacity-50 text-xs flex items-center justify-center cursor-pointer active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    router.push(`/`);
                  }}
                >{`See More >`}</div>
              </>
            )}
            <div className="relative w-full h-fit flex flex-row gap-2 flex-wrap overflow-hidden">
              {(openSidebar
                ? newQuests
                  ? newQuests
                  : Array.from({ length: 4 })
                : newQuests
                ? newQuests?.slice(0, 2)
                : Array.from({ length: 2 })
              ).map((item: Quest | unknown, index: number) => {
                return (
                  <div
                    key={index}
                    id="rainbow"
                    className={`relative rounded-sm p-px flex items-center justify-center cursor-pointer active:scale-95 ${
                      openSidebar ? "w-14 h-14" : "w-7 h-7"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (item) {
                        router.push(
                          `/quest/${toHexWithLeadingZero(
                            Number((item as Quest)?.profileId)
                          )}-${toHexWithLeadingZero(
                            Number((item as Quest)?.pubId)
                          )}`
                        );
                      }
                    }}
                  >
                    <div className="relative w-full h-full rounded-sm flex">
                      {item &&
                        (item as Quest)?.questMetadata?.cover &&
                        ((
                          <Image
                            layout="fill"
                            draggable={false}
                            src={`${INFURA_GATEWAY}/ipfs/${
                              (item as Quest)?.questMetadata?.cover?.split(
                                "ipfs://"
                              )?.[1]
                            }`}
                            objectFit="cover"
                            className="rounded-sm"
                          />
                        ) as any)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

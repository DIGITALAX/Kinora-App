import { INFURA_GATEWAY } from "@/app/lib/constants";
import { ModalContext } from "@/app/providers";
import Image from "next/legacy/image";
import { usePathname, useRouter } from "next/navigation";
import { FunctionComponent, useContext } from "react";
import { AccountType, Quest } from "../types/common.types";
import useLens from "../hooks/useLens";
import { useAccount } from "wagmi";
import { useModal } from "connectkit";
import useNewQuests from "../../Modals/hooks/useNewQuests";

const Sidebar: FunctionComponent<{ dict: any }> = ({ dict }) => {
  const context = useContext(ModalContext);
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const path = usePathname();
  const { openOnboarding } = useModal();
  const { newQuests } = useNewQuests();
  const { handleConectarse } = useLens(isConnected, address, dict);

  return (
    <div
      className={`absolute flex items-start justify-start flex-col p-1.5 border-r border-white/20 z-20 bg-nave overflow-y-scroll ${
        context?.openSidebar ? "w-40" : "w-10"
      }`}
      style={{
        height: "calc(100vh - 2.5rem)",
      }}
      id={context?.openSidebar ? "openSide" : "closeSide"}
    >
      <div className="relative w-full h-full flex items-start justify-start flex-col gap-8 sm:gap-14">
        <div className="relative w-full h-fit flex items-end justify-end ml-0">
          <div
            className="relative flex items-end justify-end w-5 h-5 cursor-pointer active:scale-95"
            onClick={() => context?.setOpenSidebar((prev) => !prev)}
          >
            <Image
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmdfBrnpSwd8y5opxT8eTx5v7QLEAMAdm13cm5t6DGmTL8`}
              draggable={false}
            />
          </div>
        </div>
        <div
          className={`relative flex flex-col gap-8 sm:gap-16 w-full h-full ${
            context?.openSidebar
              ? "items-start justify-start"
              : "items-center justify-center"
          }`}
        >
          <div
            className={`relative flex flex-col justify-center gap-2 sm:gap-7 w-fit h-fit ${
              context?.openSidebar ? "items-start" : "items-center"
            }`}
          >
            {[
              {
                title: dict?.fed,
                image: "QmRs3h5EmfHLKGNLUPKiUdhw5i25UKtFRYQ7frGiYmxE4K",
                link: () => router.push(`/`),
              },
              {
                title: dict?.acc,
                image: "QmbRjUquntNwVuSn1GpUpVi7hMygvhShZrA7rHgmFYtzSf",
                link: !isConnected
                  ? () => openOnboarding()
                  : isConnected && !context?.lensConectado?.sessionClient
                  ? () => handleConectarse()
                  : () => {
                      context?.setAccountType(AccountType.Home);
                      if (!path?.includes("envoker")) {
                        context?.setRouterChangeLoading(true);

                        router.push(
                          `/envoker/${context?.lensConectado?.profile?.username?.localName}`
                        );
                      }
                    },
              },
              {
                title: dict?.en,
                image: "QmSdwhzPmXp3GJCNKoNEwXPaVZVpyHSSCuDxNPDuxGP2yk",
                link: () => {
                  context?.setRouterChangeLoading(true);
                  router.push(`/envoke`);
                },
              },
              {
                title: dict?.upd,
                image: "QmbzfW75UVB7VQ9K7gFQecs8dzhbcXb6TdgfzsCtikkdUQ",
                link: () => {
                  context?.setRouterChangeLoading(true);
                  router.push(`/upload`);
                },
              },
              {
                title: dict?.sa,
                image: "QmS5LARM6UvSAhzGmGGSQiWYfvNguwsfeiXJ62s3KGZ6Z3",
                link: !isConnected
                  ? () => openOnboarding()
                  : isConnected && !context?.lensConectado?.sessionClient
                  ? () => handleConectarse()
                  : () => {
                      context?.setAccountType(AccountType.Save);

                      if (!path?.includes("envoker")) {
                        context?.setRouterChangeLoading(true);

                        router.push(
                          `/envoker/${context?.lensConectado?.profile?.username?.localName}`
                        );
                      }
                    },
              },
              {
                title: dict?.ac,
                image: "QmZ3mrF2YgwPkoeFpR54mpDKznTg9oFo5Mqk7uGFW8PgY2",
                link: () => {
                  context?.setRouterChangeLoading(true);
                  router.push("/activity");
                },
              },
              {
                title: dict?.awa,
                image: "QmUcWZDv5pFbxkvM995yAQAcPQHpy1G1faTbAk7UvDbTyd",
                link: () => {
                  context?.setRouterChangeLoading(true);
                  router.push("/awards");
                },
              },
              {
                title: dict?.dash,
                image: "QmZ1PSKctNt2REihxUmJBK9ZrcbU2pTACE1XSUY4YprK1x",
                link: !isConnected
                  ? () => openOnboarding()
                  : isConnected && !context?.lensConectado?.sessionClient
                  ? () => handleConectarse()
                  : () => {
                      context?.setAccountType(AccountType.Dashboard);
                      if (!path?.includes("envoker")) {
                        context?.setRouterChangeLoading(true);

                        router.push(
                          `/envoker/${context?.lensConectado?.profile?.username?.localName}`
                        );
                      }
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
                      className={`relative flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5`}
                      title={item?.title}
                    >
                      <Image
                        layout="fill"
                        src={`${INFURA_GATEWAY}/ipfs/${item.image}`}
                        draggable={false}
                      />
                    </div>
                    {context?.openSidebar && (
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
            {context?.openSidebar && (
              <>
                <div className="relative font-bit text-white text-xs flex items-center justify-center w-fit h-fit">
                  {dict?.news}
                </div>
                <div className="relative w-full h-px flex items-center justify-center bg-white"></div>
                <div
                  className="relative font-bit text-white opacity-50 text-xs flex items-center justify-center cursor-pointer active:scale-95"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    context?.setRouterChangeLoading(true);

                    router.push(`/`);
                  }}
                >
                  {dict?.more}
                </div>
              </>
            )}
            <div className="relative w-full h-fit flex flex-row gap-2 flex-wrap overflow-hidden">
              {(context?.openSidebar
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
                      context?.openSidebar ? "w-12 h-12" : "w-7 h-7"
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (item) {
                        context?.setRouterChangeLoading(true);

                        router.push(`/quest/${(item as Quest)?.postId}`);
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

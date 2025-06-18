import { FunctionComponent, JSX, useContext } from "react";
import { ImCross } from "react-icons/im";
import { AiOutlineLoading } from "react-icons/ai";
import InfiniteScroll from "react-infinite-scroll-component";
import Image from "next/legacy/image";
import { ModalContext } from "@/app/providers";
import { handleProfilePicture } from "@/app/lib/helpers/handleProfilePicture";
import { useRouter } from "next/navigation";
import useFollowers from "../hooks/useFollowers";

const Followers: FunctionComponent = (): JSX.Element => {
  const context = useContext(ModalContext);
  const router = useRouter();
  const { followData, hasMore, showMore, dataLoading } = useFollowers();
  return (
    <div className="inset-0 justify-center fixed z-20 bg-opacity-50 backdrop-blur-sm overflow-y-hidden grid grid-flow-col auto-cols-auto w-full h-auto">
      <div className="relative w-full w-[90vw] sm:w-[70vw] tablet:w-[60vw] min-w-fit px-2 md:w-[40vw] lg:w-[25vw] h-fit col-start-1 place-self-center bg-offBlack border border-white">
        <div className="relative w-full row-start-2 h-fit grid grid-flow-col auto-cols-auto">
          <div className="relative w-full h-full col-start-1 place-self-center">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-4 pb-8">
              <div className="relative w-fit h-fit items-end justify-end ml-auto pr-3 pt-3 cursor-pointer flex">
                <ImCross
                  color="white"
                  size={10}
                  onClick={() => context?.setFollowBox(undefined)}
                />
              </div>
              {!dataLoading ? (
                <div className="relative w-full h-40 flex flex-col overflow-y-scroll">
                  <InfiniteScroll
                    hasMore={hasMore}
                    dataLength={followData?.length}
                    next={showMore}
                    loader={""}
                    height={"10rem"}
                    className="relative w-full h-40 flex flex-col px-4 gap-2 overflow-y-scroll"
                  >
                    {followData?.map((account, index: number) => {
                      return (
                        <div
                          key={index}
                          className="relative w-full h-14 p-2 flex flex-row items-center justify-start font-bit text-white cursor-pointer border border-gray-600"
                          onClick={() => {
                            context?.setFollowBox(undefined);
                            router.push(
                              `/envoker/${account?.username?.localName}`
                            );
                          }}
                        >
                          <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                            <div
                              className="relative w-8 h-8 rounded-full items-center justify-center p-px"
                              id="northern"
                            >
                              <div className="relative w-full h-full rounded-full items-center justify-center">
                                <Image
                                  src={handleProfilePicture(
                                    account?.metadata?.picture
                                  )}
                                  objectFit="cover"
                                  layout="fill"
                                  alt="pfp"
                                  className="relative w-fit h-fit rounded-full self-center flex"
                                  draggable={false}
                                />
                              </div>
                            </div>
                            <div
                              id="handle"
                              className="relative w-fit h-fit justify-center items-center flex top-px text-sm"
                            >
                              {account?.username?.localName}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </InfiniteScroll>
                </div>
              ) : (
                <div className="relative w-[40vw] md:w-full h-60 grid grid-flow-col auto-cols-auto">
                  <div className="relative w-fit h-fit col-start-1 place-self-center animate-spin">
                    <AiOutlineLoading color="white" size={20} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Followers;

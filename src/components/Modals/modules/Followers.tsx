import { FunctionComponent } from "react";
import { ImCross } from "react-icons/im";
import { AiOutlineLoading } from "react-icons/ai";
import { FollowersProps } from "../types/modals.types";
import { setFollowBox } from "../../../../redux/reducers/followBoxSlice";
import InfiniteScroll from "react-infinite-scroll-component";
import { Profile } from "../../../../graphql/generated";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import Image from "next/legacy/image";

const Followers: FunctionComponent<FollowersProps> = ({
  dataLoading,
  followers,
  hasMore,
  showMore,
  router,
  dispatch,
}): JSX.Element => {
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
                  onClick={() =>
                    dispatch(
                      setFollowBox({
                        actionOpen: false,
                      })
                    )
                  }
                />
              </div>
              {!dataLoading ? (
                <div className="relative w-full h-40 flex flex-col overflow-y-scroll">
                  <InfiniteScroll
                    hasMore={hasMore}
                    dataLength={followers?.length}
                    next={showMore}
                    loader={""}
                    height={"10rem"}
                    className="relative w-full h-40 flex flex-col px-4 gap-2 overflow-y-scroll"
                  >
                    {followers?.map((account: Profile, index: number) => {
                      const profileImage = createProfilePicture(
                        account?.metadata?.picture
                      );

                      return (
                        <div
                          key={index}
                          className="relative w-full h-14 p-2 flex flex-row items-center justify-start font-bit text-white cursor-pointer border border-gray-600"
                          onClick={() => {
                            dispatch(
                              setFollowBox({
                                actionOpen: false,
                              })
                            );
                            router.push(
                              `/envoker/${
                                account?.handle?.suggestedFormatted?.localName?.split(
                                  "@"
                                )[1]
                              }`
                            );
                          }}
                        >
                          <div className="relative w-fit h-fit flex flex-row gap-3 items-center justify-center">
                            <div
                              className="relative w-8 h-8 rounded-full items-center justify-center p-px"
                              id="rainbow"
                            >
                              <div className="relative w-full h-full rounded-full items-center justify-center">
                                {profileImage && (
                                  <Image
                                    src={profileImage}
                                    objectFit="cover"
                                    layout="fill"
                                    alt="pfp"
                                    className="relative w-fit h-fit rounded-full self-center flex"
                                    draggable={false}
                                  />
                                )}
                              </div>
                            </div>
                            <div
                              id="handle"
                              className="relative w-fit h-fit justify-center items-center flex top-px text-sm"
                            >
                              {account?.handle?.suggestedFormatted?.localName}
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

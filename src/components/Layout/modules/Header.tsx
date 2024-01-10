import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { INFURA_GATEWAY } from "../../../../lib/constants";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../../redux/store";
import createProfilePicture from "../../../../lib/helpers/createProfilePicture";
import toHexWithLeadingZero from "./../../../../lib/helpers/toHexWithLeadingZero";
import { useAccountModal, useConnectModal } from "@rainbow-me/rainbowkit";
import useSignIn from "../hooks/useSignIn";
import { useAccount } from "wagmi";
import { NextRouter } from "next/router";
import useSearch from "../hooks/useSearch";
import { AiOutlineLoading } from "react-icons/ai";
import { Profile } from "../../../../graphql/generated";
import InfiniteScroll from "react-infinite-scroll-component";
import { Quest } from "@/components/Quest/types/quest.types";
import useActivity from "@/components/Activity/hooks/useActivity";
import Activity from "@/components/Activity/modules/Activity";

const Header: FunctionComponent<{ router: NextRouter }> = ({ router }) => {
  const { openConnectModal } = useConnectModal();
  const { openAccountModal } = useAccountModal();
  const { isConnected, address } = useAccount();
  const dispatch = useDispatch();
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const activityFeed = useSelector(
    (state: RootState) => state.app.activityFeedReducer.feed
  );
  const allUploaded = useSelector(
    (state: RootState) => state.app.allUploadedReducer.videos
  );
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const walletConnected = useSelector(
    (state: RootState) => state.app.walletConnectedReducer.value
  );
  const profilePicture = createProfilePicture(lensConnected?.metadata?.picture);
  const {
    handleLogIn,
    handleLogOut,
    setAccountOpen,
    signLoading,
    accountOpen,
    setOpenActivitySample,
    openActivitySample,
  } = useSignIn(
    lensConnected,
    openAccountModal,
    dispatch,
    isConnected,
    address,
    allUploaded
  );
  const {
    searchLoading,
    handleMoreSearchQuests,
    searchInfo,
    searchTarget,
    setSearchTarget,
    searchResults,
    handleSearchQuests,
    setSearchOpen,
    searchOpen,
  } = useSearch(lensConnected);
  const { activityInfo, activityLoading, getMoreActivityFeed } = useActivity(
    lensConnected,
    activityFeed,
    dispatch
  );
  return (
    <div className="relative h-fit flex items-center justify-end flex-row w-full z-10">
      <div
        className="relative flex flex-row justify-between flex items-center p-2"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div className="relative w-3/4 h-fit flex items-center justify-center">
          <input
            className={`relative w-full h-8 rounded-full px-2 py-1 text-white font-bit text-xs bg-nave border border-white/80 ${
              searchLoading && "opacity-50"
            }`}
            placeholder="SEARCH"
            onChange={(e) => {
              setSearchTarget(e.target.value);
            }}
            value={searchTarget}
            onKeyDown={(e) => {
              e.key === "Enter" &&
                searchTarget?.trim() !== "" &&
                handleSearchQuests();
              setSearchOpen(false);
            }}
          />
          {searchLoading && (
            <div className="absolute ml-auto right-2 flex items-center justify-center animate-spin">
              <AiOutlineLoading color={"white"} size={15} />
            </div>
          )}
          {searchResults?.length > 0 && searchOpen && (
            <div className="absolute z-10 w-full h-fit max-h-[10rem] overflow-y-scroll flex rounded-md border border-white top-10 bg-nave">
              <InfiniteScroll
                hasMore={
                  searchInfo?.hasMoreProfiles || searchInfo?.hasMoreQuests
                    ? true
                    : false
                }
                dataLength={searchResults?.length}
                loader={<></>}
                next={handleMoreSearchQuests}
                className="relative w-full h-fit flex flex-col items-center justify-start"
              >
                {searchResults?.map((item: Quest | Profile, index: number) => {
                  const image = (item as Quest)?.questId
                    ? `${INFURA_GATEWAY}/ipfs/${
                        (item as Quest)?.questMetadata?.cover?.split(
                          "ipfs://"
                        )?.[1]
                      }`
                    : createProfilePicture(
                        (item as Profile)?.metadata?.picture
                      );
                  return (
                    <div
                      key={index}
                      className={`relative w-full h-20 cursor-pointer hover:opacity-80 flex flex-row justify-between items-center p-2 gap-6 ${
                        index !== searchResults?.length - 1 &&
                        "border-b border-white"
                      }`}
                      onClick={() => {
                        router.push(
                          `/${
                            (item as Quest)?.questId
                              ? `quest/${toHexWithLeadingZero(
                                  Number((item as Quest)?.profileId)
                                )}-${toHexWithLeadingZero(
                                  Number((item as Quest)?.pubId)
                                )}`
                              : `envoker/${
                                  (
                                    item as Profile
                                  )?.handle?.suggestedFormatted?.localName?.split(
                                    "@"
                                  )?.[1]
                                }`
                          }`
                        );
                        setSearchOpen(false);
                      }}
                    >
                      <div
                        className="relative w-14 h-14 border border-white rounded-md flex items-center justify-center p-px"
                        id="northern"
                      >
                        {(image as string) && (
                          <Image
                            draggable={false}
                            layout="fill"
                            src={image as string}
                            className="rounded-md"
                            objectFit="cover"
                          />
                        )}
                      </div>
                      <div className="relative w-full h-fit flex flex-col gap-1 items-start justify-center">
                        <div className="relative text-base font-bit text-white uppercase text-left flex items-center justify-start">
                          {(item as Quest)?.questId
                            ? (item as Quest)?.questMetadata?.title?.length > 40
                              ? (item as Quest)?.questMetadata?.title?.slice(
                                  0,
                                  40
                                ) + "..."
                              : (item as Quest)?.questMetadata?.title
                            : (item as Profile)?.handle?.suggestedFormatted
                                ?.localName}
                        </div>
                        <div className="relative text-xs font-bit text-white/80 text-left flex items-center justify-start">
                          {(item as Quest)?.questId
                            ? (item as Quest)?.questMetadata?.description
                                ?.length > 40
                              ? (
                                  item as Quest
                                )?.questMetadata?.description?.slice(0, 40) +
                                "..."
                              : (item as Quest)?.questMetadata?.description
                            : (item as Profile)?.metadata?.bio?.length > 40
                            ? (item as Profile)?.metadata?.bio?.slice(0, 40) +
                              "..."
                            : (item as Profile)?.metadata?.bio}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </InfiniteScroll>
            </div>
          )}
        </div>
        <div className="relative flex items-center justify-center gap-5 w-fit h-fit">
          <div
            className="relative w-4 h-6 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => setOpenActivitySample(!openActivitySample)}
          >
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmUhHCKqhK31MYdo8aMAFcZZn1CCFfe4Z5ywTWzVfhuTDX`}
            />
          </div>
          <div
            className="relative w-4 h-6 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => window.open("https://codex.irrevocable.dev/")}
          >
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmcvuX3d75RQC8zxFbmuaJJjhB6ZYiKfoXR7f74n6Ro2EJ`}
            />
          </div>
          <div
            className="relative w-8 h-5 flex items-center justify-center cursor-pointer active:scale-95"
            onClick={() => router.push("/storefront")}
          >
            <Image
              draggable={false}
              layout="fill"
              src={`${INFURA_GATEWAY}/ipfs/QmXXiuiSjoUsaVy8Xr9aWjeQPYsmkpnMtazeULcvzhvZPv`}
            />
          </div>
          <div
            className={`relative w-7 h-7 flex items-center justify-center rounded-full p-px cursor-pointer ${
              signLoading && "animate-spin"
            }`}
            id="northern"
            onClick={
              !walletConnected && !lensConnected?.id
                ? openConnectModal
                : walletConnected && !lensConnected?.id
                ? () => handleLogIn()
                : () => setAccountOpen(!accountOpen)
            }
          >
            <div className="relative w-full h-full rounded-full flex items-center justify-center">
              {!walletConnected || !lensConnected?.id ? (
                <Image
                  draggable={false}
                  layout="fill"
                  src={`${INFURA_GATEWAY}/ipfs/${
                    !walletConnected && !lensConnected?.id
                      ? "QmZ3oW66aBj5KChnBy91trqmdXpL4D23TGa8Ft1yr599R9"
                      : walletConnected &&
                        !lensConnected?.id &&
                        "QmUwS9EKroeRNPPpiXj6FQcaWdsBHXZmBs7b43mzqoFHRs"
                  }`}
                  className="rounded-full"
                  objectFit="cover"
                />
              ) : (
                profilePicture && (
                  <Image
                    draggable={false}
                    layout="fill"
                    src={profilePicture}
                    className="rounded-full"
                    objectFit="cover"
                  />
                )
              )}
            </div>
          </div>
        </div>
        {accountOpen && (
          <div className="absolute top-12 right-3 border border-white bg-offBlack flex flex-col items-center justify-center font-bit text-white text-xs h-fit w-28">
            <div
              className="relative w-full h-full flex items-center justify-center cursor-pointer hover:opacity-80 py-1.5 px-2.5"
              onClick={() => {
                handleLogOut();
                setAccountOpen(false);
              }}
            >
              Logout
            </div>
          </div>
        )}
        {openActivitySample && (
          <div className="absolute top-12 right-3 border border-white bg-offBlack flex flex-col p-2 items-start justify-start font-bit text-white text-xs w-60 h-[20rem] overflow-y-scroll">
            {activityLoading ? (
              <div className="relative w-full h-fit flex flex-col gap-3">
                {Array.from({ length: 10 }).map((_, index: number) => {
                  return (
                    <div
                      key={index}
                      className="relative w-full h-60 flex rounded-sm animate-pulse"
                      id="northern"
                    ></div>
                  );
                })}
              </div>
            ) : (
              <Activity
                disabled
                activityFeed={activityFeed}
                getMoreActivityFeed={getMoreActivityFeed}
                activityInfo={activityInfo}
                lensConnected={lensConnected}
                dispatch={dispatch}
                router={router}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default Header;

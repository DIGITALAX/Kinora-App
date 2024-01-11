import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Image from "next/legacy/image";
import createProfilePicture from "../../../lib/helpers/createProfilePicture";
import { NextRouter } from "next/router";
import AccountSwitch from "@/components/Envoker/modules/AccountSwitch";
import usePageProfile from "@/components/Envoker/hooks/usePageProfile";
import useSaves from "@/components/Envoker/hooks/useSaves";
import useInteractions from "@/components/Common/hooks/useInteractions";
import { createPublicClient, http } from "viem";
import { polygonMumbai } from "viem/chains";
import { AccountType } from "@/components/Envoker/types/envoker.types";
import { useAccount } from "wagmi";
import RouterChange from "@/components/Common/modules/RouterChange";
import useDashboard from "@/components/Envoker/hooks/useDashboard";
import Bio from "@/components/Envoker/modules/Bio";
import { AiOutlineLoading } from "react-icons/ai";
import { useEffect, useState } from "react";
import Head from "next/head";

export default function Handle({ router }: { router: NextRouter }) {
  const { handle } = router.query;
  const { address } = useAccount();
  const [globalLoading, setGlobalLoading] = useState<boolean>(true);
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    ),
  });
  const dispatch = useDispatch();
  const openSidebar = useSelector(
    (state: RootState) => state.app.sideBarOpenReducer.value
  );
  const lensConnected = useSelector(
    (state: RootState) => state.app.lensConnectedReducer.profile
  );
  const accountType = useSelector(
    (state: RootState) => state.app.accountSwitchReducer.value
  );
  const {
    profileLoading,
    pageProfile,
    questsLoading,
    quests,
    info,
    getMore,
    setQuests,
  } = usePageProfile(handle as string, lensConnected);
  const {
    terminateQuest,
    approvePlayerMilestone,
    openQuest,
    setOpenQuest,
    approvalLoading,
    terminateLoading,
    playerClaimMilestoneReward,
    claimRewardLoading,
    openPlayerDetails,
    setOpenPlayerDetails,
    playerEligible,
  } = useDashboard(quests, dispatch);
  const { savesInfo, savesLoading, getMoreSaves, allSaves, setAllSaves } =
    useSaves(lensConnected, handle as string, accountType);
  const cover = createProfilePicture(pageProfile?.metadata?.coverPicture);
  const pfp = createProfilePicture(pageProfile?.metadata?.picture);
  const {
    mirror,
    mirrorChoiceOpen,
    setMirrorChoiceOpen,
    like,
    bookmark,
    interactionsLoading,
    unfollowProfile,
    followProfile,
    setProfileHovers,
    profileHovers,
    mainInteractionsLoading,
  } = useInteractions(
    lensConnected,
    dispatch,
    accountType == AccountType.Save ? allSaves : quests,
    address,
    publicClient,
    (newItems: any) =>
      (accountType == AccountType.Save ? setAllSaves : setQuests)(
        newItems as any
      )
  );

  useEffect(() => {
    if (!questsLoading && !savesLoading) {
      setGlobalLoading(false);
    }
  }, [questsLoading, savesLoading]);

  if (
    ((AccountType.Save !== accountType && questsLoading) ||
      (AccountType.Save === accountType && savesLoading)) &&
    globalLoading
  ) {
    return <RouterChange />;
  }

  return (
    <div
      className="relative flex overflow-y-scroll min-h-full w-full items-start justify-end pb-5"
      style={{
        height: "calc(100vh - 5.5rem)",
      }}
    >
      <Head>
        <title>
          {pageProfile?.handle?.suggestedFormatted?.localName
            ? pageProfile?.handle?.suggestedFormatted?.localName
            : "Envoker"}
        </title>
        <meta
          name="og:url"
          content={`https://kinora.irrevocable.dev/envoker/${
            pageProfile?.handle?.suggestedFormatted?.localName?.split("@")?.[1]
          }`}
        />
        <meta
          name="og:title"
          content={
            pageProfile?.handle?.suggestedFormatted?.localName
              ? pageProfile?.handle?.suggestedFormatted?.localName
              : "Envoker"
          }
        />
        <meta name="og:description" content={"On-Chain Video Social Quests."} />
        <meta
          name="og:image"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@digitalax" />
        <meta name="twitter:creator" content="@digitalax" />
        <meta
          name="twitter:image"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <meta
          name="twitter:url"
          content={`https://kinora.irrevocable.dev/envoker/${
            pageProfile?.handle?.suggestedFormatted?.localName?.split("@")?.[1]
          }`}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="canonical"
          content={"https://kinora.irrevocable.dev/card.png/"}
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="https://kinora.irrevocable.dev/fonts/Bitblox.otf"
          as="font"
          crossOrigin="anonymous"
          type="font/otf"
        />
        <link
          rel="preload"
          href="https://kinora.irrevocable.dev/fonts/Vcr.ttf"
          as="font"
          crossOrigin="anonymous"
          type="font/ttf"
        />
      </Head>
      <div
        className="md:h-full h-fit w-full items-start justify-start px-6 pb-2 pt-6 relative flex flex-col gap-10"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div className="w-full h-fit flex flex-col gap-3 relative">
          <div
            className={`relative w-full h-fit rounded-sm flex p-px ${
              profileLoading && "animate-pulse"
            }`}
            id="northern"
          >
            <div className="relative w-full h-40 flex items-center justify-center rounded-sm">
              {cover && (
                <Image
                  draggable={false}
                  src={cover}
                  className="rounded-sm"
                  objectFit="cover"
                  layout="fill"
                />
              )}
              <div
                className="absolute w-full h-full rounded-sm"
                id="negro"
              ></div>
            </div>
            <div
              className="absolute w-20 h-20 right-4 bottom-4 rounded-full p-px"
              id="northern"
            >
              <div className="relative w-full h-full flex items-center justify-center rounded-full">
                {pfp && (
                  <Image
                    draggable={false}
                    src={pfp}
                    objectFit="cover"
                    layout="fill"
                    className="rounded-full"
                  />
                )}
              </div>
            </div>
            {lensConnected?.id !== pageProfile?.id && (
              <div
                className={`absolute left-2 top-2 flex rounded-sm bg-nave/70 border border-white flex items-center justify-center ${
                  !mainInteractionsLoading?.follow &&
                  !mainInteractionsLoading?.unfollow &&
                  "cursor-pointer active:scale-95"
                }`}
                onClick={
                  !pageProfile?.operations?.isFollowedByMe
                    ? () =>
                        !mainInteractionsLoading?.follow &&
                        !mainInteractionsLoading?.unfollow &&
                        followProfile(pageProfile?.id, 0, true)
                    : () =>
                        !mainInteractionsLoading?.follow &&
                        !mainInteractionsLoading?.unfollow &&
                        unfollowProfile(pageProfile?.id, 0, true)
                }
              >
                <div
                  className={`"relative w-16 h-5 text-xxs font-bit text-white flex items-center justify-center px-1.5 py-1 ${
                    mainInteractionsLoading?.follow ||
                    (mainInteractionsLoading?.unfollow
                      ? "animate-spin"
                      : "top-px")
                  }`}
                >
                  {mainInteractionsLoading?.follow ||
                  mainInteractionsLoading?.unfollow ? (
                    <AiOutlineLoading color="white" size={12} />
                  ) : pageProfile?.operations?.isFollowedByMe ? (
                    "Unfollow"
                  ) : (
                    "Follow"
                  )}
                </div>
              </div>
            )}
          </div>
          {accountType !== AccountType.Dashboard &&
            accountType !== AccountType.Save && (
              <Bio dispatch={dispatch} profile={pageProfile!} />
            )}
        </div>
        <div
          className="relative w-full h-fit flex flex-col gap
        -3 justify-start items-start"
        >
          <AccountSwitch
            setOpenPlayerDetails={setOpenPlayerDetails}
            openPlayerDetails={openPlayerDetails}
            playerClaimMilestoneReward={playerClaimMilestoneReward}
            claimRewardLoading={claimRewardLoading}
            approvalLoading={approvalLoading}
            terminateLoading={terminateLoading}
            approvePlayerMilestone={approvePlayerMilestone}
            terminateQuest={terminateQuest}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            lensConnected={lensConnected}
            pageProfile={pageProfile}
            savesInfo={savesInfo}
            router={router}
            openQuest={openQuest}
            setOpenQuest={setOpenQuest}
            savesLoading={savesLoading}
            getMoreSaves={getMoreSaves}
            accountType={accountType}
            dispatch={dispatch}
            globalLoading={globalLoading}
            questsLoading={questsLoading}
            allSaves={allSaves}
            mirror={mirror}
            bookmark={bookmark}
            like={like}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            mirrorChoiceOpen={mirrorChoiceOpen}
            interactionsLoading={interactionsLoading}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            info={info}
            getMore={getMore}
            quests={quests}
            playerEligible={playerEligible}
          />
        </div>
      </div>
    </div>
  );
}

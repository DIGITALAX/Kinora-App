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

export default function Handle({ router }: { router: NextRouter }) {
  const { handle } = router.query;
  const { address } = useAccount();
  const publicClient = createPublicClient({
    chain: polygonMumbai,
    transport: http(
      `https://polygon-mumbai.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_MUMBAI}`
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
  const cover = createProfilePicture(lensConnected?.metadata?.coverPicture);
  const pfp = createProfilePicture(lensConnected?.metadata?.picture);
  const {
    profileLoading,
    pageProfile,
    questsLoading,
    completedQuests,
    liveQuests,
    envokedQuests,
    info,
    getMorePlayer,
    getMoreEnvoked,
    setCompletedQuests,
    setLiveQuests,
    setEnvokedQuests,
  } = usePageProfile(handle as string, lensConnected);
  const { savesInfo, savesLoading, getMoreSaves, allSaves, setAllSaves } =
    useSaves(lensConnected, handle as string, accountType);
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
    setMirrorChoiceOpenEnvoked,
    mirrorChoiceOpenEnvoked,
    interactionsLoadingEnvoked,
    setMirrorChoiceOpenCompleted,
    mirrorChoiceOpenCompleted,
    interactionsLoadingCompleted,
    setProfileHoversCompleted,
    setProfileHoversEnvoked,
    profileHoversCompleted,
    profileHoversEnvoked,
  } = useInteractions(
    lensConnected,
    dispatch,
    accountType == AccountType.Save ? allSaves : liveQuests,
    address,
    publicClient,
    router,
    completedQuests,
    envokedQuests
  );
  return (
    <div
      className="relative overflow-y-scroll flex min-h-full w-full justify-end"
      style={{
        height: "calc(100vh - 5.5rem) pb-5",
      }}
    >
      <div
        className="h-fit p-2 relative flex flex-col gap-10"
        style={{
          width: openSidebar ? "calc(100vw - 10rem)" : "calc(100vw - 2.5rem)",
        }}
        id={!openSidebar ? "closeSide" : ""}
      >
        <div
          className={`relative w-full h-40 rounded-sm flex p-px ${
            profileLoading && "animate-pulse"
          }`}
          id="rainbow"
        >
          <div className="relative w-full h-full flex items-center justify-center rounded-sm">
            {cover && (
              <Image
                draggable={false}
                src={cover}
                className="rounded-sm"
                objectFit="cover"
                layout="fill"
              />
            )}
            <div className="absolute w-full h-full rounded-sm" id="negro"></div>
          </div>
          <div
            className="absolute w-20 h-20 right-4 bottom-4 rounded-full p-px"
            id="rainbow"
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
        </div>
        <div className="relative w-full h-fit flex flex-col gap-3 justify-start items-start">
          <AccountSwitch
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            lensConnected={lensConnected}
            pageProfile={pageProfile}
            savesInfo={savesInfo}
            router={router}
            envokedQuests={envokedQuests}
            savesLoading={savesLoading}
            getMoreSaves={getMoreSaves}
            accountType={accountType}
            dispatch={dispatch}
            liveQuests={liveQuests}
            completedQuests={completedQuests}
            questsLoading={questsLoading}
            allSaves={allSaves}
            mirror={mirror}
            bookmark={bookmark}
            like={like}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            mirrorChoiceOpen={mirrorChoiceOpen}
            interactionsLoading={interactionsLoading}
            setMirrorChoiceOpenEnvoked={setMirrorChoiceOpenEnvoked}
            mirrorChoiceOpenEnvoked={mirrorChoiceOpenEnvoked}
            interactionsLoadingEnvoked={interactionsLoadingEnvoked}
            setMirrorChoiceOpenCompleted={setMirrorChoiceOpenCompleted}
            mirrorChoiceOpenCompleted={mirrorChoiceOpenCompleted}
            interactionsLoadingCompleted={interactionsLoadingCompleted}
            setProfileHovers={setProfileHovers}
            setProfileHoversCompleted={setProfileHoversCompleted}
            setProfileHoversEnvoked={setProfileHoversEnvoked}
            profileHovers={profileHovers}
            profileHoversCompleted={profileHoversCompleted}
            profileHoversEnvoked={profileHoversEnvoked}
            info={info}
            getMorePlayer={getMorePlayer}
            getMoreEnvoked={getMoreEnvoked}
            setAllSaves={setAllSaves}
            setCompletedQuests={setCompletedQuests}
            setEnvokedQuests={setEnvokedQuests}
            setLiveQuests={setLiveQuests}
          />
        </div>
      </div>
    </div>
  );
}

import { FunctionComponent } from "react";
import { AccountSwitchProps, AccountType } from "../types/envoker.types";
import Stats from "./Stats";
import Saves from "./Saves";
import Home from "./Home";

const AccountSwitch: FunctionComponent<AccountSwitchProps> = ({
  pageProfile,
  accountType,
  getMoreSaves,
  savesInfo,
  savesLoading,
  envokedQuests,
  lensConnected,
  dispatch,
  questsLoading,
  allSaves,
  liveQuests,
  completedQuests,
  router,
  mirror,
  like,
  bookmark,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  interactionsLoading,
  followProfile,
  unfollowProfile,
  profileHovers,
  setProfileHovers,
  setMirrorChoiceOpenCompleted,
  mirrorChoiceOpenCompleted,
  interactionsLoadingCompleted,
  setProfileHoversCompleted,
  profileHoversCompleted,
  profileHoversEnvoked,
  setMirrorChoiceOpenEnvoked,
  setProfileHoversEnvoked,
  mirrorChoiceOpenEnvoked,
  interactionsLoadingEnvoked,
  info,
  getMorePlayer,
  getMoreEnvoked,
  setAllSaves,
  setCompletedQuests,
  setEnvokedQuests,
  setLiveQuests,
}): JSX.Element => {
  if (pageProfile?.handle?.fullHandle === lensConnected?.handle?.fullHandle) {
    switch (accountType) {
      case AccountType.Home:
        return (
          <Home
            onlyHistory={false}
            dispatch={dispatch}
            lensConnected={lensConnected}
            liveQuests={liveQuests}
            completedQuests={completedQuests}
            questsLoading={questsLoading}
            envokedQuests={envokedQuests}
            router={router}
            mirrorChoiceOpen={mirrorChoiceOpen}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            interactionsLoading={interactionsLoading}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            setMirrorChoiceOpenCompleted={setMirrorChoiceOpenCompleted}
            mirrorChoiceOpenCompleted={mirrorChoiceOpenCompleted}
            interactionsLoadingCompleted={interactionsLoadingCompleted}
            setProfileHoversCompleted={setProfileHoversCompleted}
            profileHoversCompleted={profileHoversCompleted}
            setProfileHoversEnvoked={setProfileHoversEnvoked}
            profileHoversEnvoked={profileHoversEnvoked}
            setMirrorChoiceOpenEnvoked={setMirrorChoiceOpenEnvoked}
            interactionsLoadingEnvoked={interactionsLoadingEnvoked}
            mirrorChoiceOpenEnvoked={mirrorChoiceOpenEnvoked}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            bookmark={bookmark}
            like={like}
            mirror={mirror}
            getMorePlayer={getMorePlayer}
            getMoreEnvoked={getMoreEnvoked}
            info={info}
            setCompletedQuests={setCompletedQuests}
            setEnvokedQuests={setEnvokedQuests}
            setLiveQuests={setLiveQuests}
          />
        );

      case AccountType.Save:
        return (
          <Saves
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            getMoreSaves={getMoreSaves}
            savesInfo={savesInfo}
            savesLoading={savesLoading}
            allSaves={allSaves}
            dispatch={dispatch}
            lensConnected={lensConnected}
            router={router}
            mirror={mirror}
            mirrorChoiceOpen={mirrorChoiceOpen}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            bookmark={bookmark}
            like={like}
            interactionsLoading={interactionsLoading}
            setAllSaves={setAllSaves}
          />
        );

      case AccountType.History:
        return (
          <Home
            getMorePlayer={getMorePlayer}
            getMoreEnvoked={getMoreEnvoked}
            info={info}
            onlyHistory={true}
            dispatch={dispatch}
            lensConnected={lensConnected}
            liveQuests={liveQuests}
            completedQuests={completedQuests}
            questsLoading={questsLoading}
            envokedQuests={envokedQuests}
            router={router}
            mirrorChoiceOpen={mirrorChoiceOpen}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            interactionsLoading={interactionsLoading}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            bookmark={bookmark}
            like={like}
            mirror={mirror}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            setProfileHoversEnvoked={setProfileHoversEnvoked}
            profileHoversEnvoked={profileHoversEnvoked}
            setMirrorChoiceOpenEnvoked={setMirrorChoiceOpenEnvoked}
            interactionsLoadingEnvoked={interactionsLoadingEnvoked}
            mirrorChoiceOpenEnvoked={mirrorChoiceOpenEnvoked}
            setCompletedQuests={setCompletedQuests}
            setEnvokedQuests={setEnvokedQuests}
            setLiveQuests={setLiveQuests}
          />
        );

      case AccountType.Stats:
        return <Stats />;
    }
  } else {
    return (
      <Home
        onlyHistory={false}
        dispatch={dispatch}
        getMoreEnvoked={getMoreEnvoked}
        getMorePlayer={getMorePlayer}
        info={info}
        lensConnected={lensConnected}
        liveQuests={liveQuests}
        completedQuests={completedQuests}
        questsLoading={questsLoading}
        envokedQuests={envokedQuests}
        router={router}
        mirrorChoiceOpen={mirrorChoiceOpen}
        setMirrorChoiceOpen={setMirrorChoiceOpen}
        interactionsLoading={interactionsLoading}
        setProfileHovers={setProfileHovers}
        profileHovers={profileHovers}
        setMirrorChoiceOpenCompleted={setMirrorChoiceOpenCompleted}
        mirrorChoiceOpenCompleted={mirrorChoiceOpenCompleted}
        interactionsLoadingCompleted={interactionsLoadingCompleted}
        setProfileHoversCompleted={setProfileHoversCompleted}
        profileHoversCompleted={profileHoversCompleted}
        setProfileHoversEnvoked={setProfileHoversEnvoked}
        profileHoversEnvoked={profileHoversEnvoked}
        setMirrorChoiceOpenEnvoked={setMirrorChoiceOpenEnvoked}
        interactionsLoadingEnvoked={interactionsLoadingEnvoked}
        mirrorChoiceOpenEnvoked={mirrorChoiceOpenEnvoked}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        bookmark={bookmark}
        like={like}
        mirror={mirror}
        setCompletedQuests={setCompletedQuests}
        setEnvokedQuests={setEnvokedQuests}
        setLiveQuests={setLiveQuests}
      />
    );
  }
};

export default AccountSwitch;

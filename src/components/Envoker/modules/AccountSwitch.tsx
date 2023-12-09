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
  setEnvokedQuests,
  lensConnected,
  dispatch,
  questsLoading,
  allSaves,
  liveQuests,
  completedQuests,
  setAllSaves,
  setCompletedQuests,
  setLiveQuests,
  router,
}): JSX.Element => {
  if (pageProfile?.handle?.fullHandle === lensConnected?.handle?.fullHandle) {
    switch (accountType) {
      case AccountType.Home:
        return (
          <Home
            onlyHistory={false}
            dispatch={dispatch}
            lensConnected={lensConnected}
            setLiveQuests={setLiveQuests}
            liveQuests={liveQuests}
            completedQuests={completedQuests}
            setCompletedQuests={setCompletedQuests}
            questsLoading={questsLoading}
            envokedQuests={envokedQuests}
            setEnvokedQuests={setEnvokedQuests}
            router={router}
          />
        );

      case AccountType.Save:
        return (
          <Saves
            getMoreSaves={getMoreSaves}
            savesInfo={savesInfo}
            savesLoading={savesLoading}
            allSaves={allSaves}
            setAllSaves={setAllSaves}
            dispatch={dispatch}
            lensConnected={lensConnected}
            router={router}
          />
        );

      case AccountType.History:
        return (
          <Home
            onlyHistory={true}
            dispatch={dispatch}
            lensConnected={lensConnected}
            setLiveQuests={setLiveQuests}
            liveQuests={liveQuests}
            completedQuests={completedQuests}
            setCompletedQuests={setCompletedQuests}
            questsLoading={questsLoading}
            envokedQuests={envokedQuests}
            setEnvokedQuests={setEnvokedQuests}
            router={router}
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
        lensConnected={lensConnected}
        setLiveQuests={setLiveQuests}
        liveQuests={liveQuests}
        completedQuests={completedQuests}
        setCompletedQuests={setCompletedQuests}
        questsLoading={questsLoading}
        envokedQuests={envokedQuests}
        setEnvokedQuests={setEnvokedQuests}
        router={router}
      />
    );
  }
};

export default AccountSwitch;

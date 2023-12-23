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
  mirrorChoiceOpenSave,
  mirrorSave,
  likeSave,
  setMirrorChoiceOpenSave,
  simpleCollectSave,
  interactionsLoadingSave,
  bookmarkSave,
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
          />
        );

      case AccountType.Save:
        return (
          <Saves
            getMoreSaves={getMoreSaves}
            savesInfo={savesInfo}
            savesLoading={savesLoading}
            allSaves={allSaves}
            dispatch={dispatch}
            lensConnected={lensConnected}
            router={router}
            mirror={mirrorSave}
            mirrorChoiceOpen={mirrorChoiceOpenSave}
            setMirrorChoiceOpen={setMirrorChoiceOpenSave}
            simpleCollect={simpleCollectSave}
            bookmark={bookmarkSave}
            like={likeSave}
            interactionsLoading={interactionsLoadingSave}
          />
        );

      case AccountType.History:
        return (
          <Home
            onlyHistory={true}
            dispatch={dispatch}
            lensConnected={lensConnected}
            liveQuests={liveQuests}
            completedQuests={completedQuests}
            questsLoading={questsLoading}
            envokedQuests={envokedQuests}
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
        liveQuests={liveQuests}
        completedQuests={completedQuests}
        questsLoading={questsLoading}
        envokedQuests={envokedQuests}
        router={router}
      />
    );
  }
};

export default AccountSwitch;

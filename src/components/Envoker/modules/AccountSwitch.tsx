import { FunctionComponent } from "react";
import { AccountSwitchProps, AccountType } from "../types/envoker.types";
import Dashboard from "./Dashboard";
import Saves from "./Saves";
import Home from "./Home";

const AccountSwitch: FunctionComponent<AccountSwitchProps> = ({
  pageProfile,
  accountType,
  getMoreSaves,
  savesInfo,
  savesLoading,
  lensConnected,
  dispatch,
  questsLoading,
  allSaves,
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
  quests,
  getMore,
  info,
  setAllSaves,
  approvePlayerMilestone,
  terminateQuest,
  openQuest,
  setOpenQuest,
  terminateLoading,
  approvalLoading,
}): JSX.Element => {
  if (pageProfile?.handle?.fullHandle === lensConnected?.handle?.fullHandle) {
    switch (accountType) {
      case AccountType.Home:
        return (
          <Home
            dispatch={dispatch}
            lensConnected={lensConnected}
            questsLoading={questsLoading}
            router={router}
            mirrorChoiceOpen={mirrorChoiceOpen}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            interactionsLoading={interactionsLoading}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            bookmark={bookmark}
            like={like}
            mirror={mirror}
            getMore={getMore}
            quests={quests}
            info={info}
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
         <div></div>
        );

      case AccountType.Dashboard:
        return (
          <Dashboard
            openQuest={openQuest}
            setOpenQuest={setOpenQuest}
            terminateLoading={terminateLoading}
            approvalLoading={approvalLoading}
            envokedQuests={quests?.filter((item) => item?.type == "envoked")}
            terminateQuest={terminateQuest}
            approvePlayerMilestone={approvePlayerMilestone}
          />
        );
    }
  } else {
    return (
      <Home
        dispatch={dispatch}
        getMore={getMore}
        quests={quests}
        info={info}
        lensConnected={lensConnected}
        questsLoading={questsLoading}
        router={router}
        mirrorChoiceOpen={mirrorChoiceOpen}
        setMirrorChoiceOpen={setMirrorChoiceOpen}
        interactionsLoading={interactionsLoading}
        setProfileHovers={setProfileHovers}
        profileHovers={profileHovers}
        followProfile={followProfile}
        unfollowProfile={unfollowProfile}
        bookmark={bookmark}
        like={like}
        mirror={mirror}
      />
    );
  }
};

export default AccountSwitch;

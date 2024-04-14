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
  t,
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
  approvePlayerMilestone,
  terminateQuest,
  openQuest,
  setOpenQuest,
  terminateLoading,
  approvalLoading,
  playerClaimMilestoneReward,
  claimRewardLoading,
  setOpenPlayerDetails,
  openPlayerDetails,
  playerEligible,
  globalLoading,
}): JSX.Element => {
  if (pageProfile?.handle?.fullHandle === lensConnected?.handle?.fullHandle) {
    switch (accountType) {
      case AccountType.Home:
        return (
          <Home
            t={t}
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
            globalLoading={globalLoading}
          />
        );

      case AccountType.Save:
        return (
          <Saves
            t={t}
            followProfile={followProfile}
            unfollowProfile={unfollowProfile}
            setProfileHovers={setProfileHovers}
            profileHovers={profileHovers}
            getMoreSaves={getMoreSaves}
            savesInfo={savesInfo}
            savesLoading={savesLoading}
            allSaves={allSaves}
            dispatch={dispatch}
            globalLoading={globalLoading}
            lensConnected={lensConnected}
            router={router}
            mirror={mirror}
            mirrorChoiceOpen={mirrorChoiceOpen}
            setMirrorChoiceOpen={setMirrorChoiceOpen}
            bookmark={bookmark}
            like={like}
            interactionsLoading={interactionsLoading}
          />
        );

      case AccountType.Dashboard:
        return (
          <Dashboard
            t={t}
            dispatch={dispatch}
            router={router}
            lensConnected={lensConnected}
            setOpenPlayerDetails={setOpenPlayerDetails}
            openPlayerDetails={openPlayerDetails}
            openQuest={openQuest}
            setOpenQuest={setOpenQuest}
            terminateLoading={terminateLoading}
            approvalLoading={approvalLoading}
            allQuests={quests}
            playerClaimMilestoneReward={playerClaimMilestoneReward}
            terminateQuest={terminateQuest}
            approvePlayerMilestone={approvePlayerMilestone}
            claimRewardLoading={claimRewardLoading}
            info={info}
            getMore={getMore}
            playerEligible={playerEligible}
          />
        );
    }
  } else {
    return (
      <Home
        dispatch={dispatch}
        getMore={getMore}
        quests={quests}
        t={t}
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
        globalLoading={globalLoading}
      />
    );
  }
};

export default AccountSwitch;

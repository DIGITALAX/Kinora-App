import { FunctionComponent } from "react";
import QuestBoxDetails from "./QuestBoxDetails";
import { QuestBoardSwitchProps } from "../types/quest.types";
import MilestoneInfo from "./MilestoneInfo";

const QuestBoardSwitch: FunctionComponent<QuestBoardSwitchProps> = ({
  questInfo,
  router,
  followProfile,
  unfollowProfile,
  setSocialType,
  lensConnected,
  like,
  mirror,
  bookmark,
  mirrorChoiceOpen,
  setMirrorChoiceOpen,
  dispatch,
  joinLoading,
  handlePlayerJoin,
  mainInteractionsLoading,
  questInfoLoading,
  mainViewer,
  handleCompleteMilestone,
  completeLoading,
}): JSX.Element => {
  switch (mainViewer) {
    case 0:
      return (
        <QuestBoxDetails
          lensConnected={lensConnected}
          questInfo={questInfo}
          questInfoLoading={questInfoLoading}
          router={router}
          dispatch={dispatch}
          joinLoading={joinLoading}
          handlePlayerJoin={handlePlayerJoin}
          followProfile={followProfile}
          unfollowProfile={unfollowProfile}
          mainInteractionsLoading={mainInteractionsLoading}
          mirror={mirror}
          like={like}
          bookmark={bookmark}
          mirrorChoiceOpen={mirrorChoiceOpen}
          setMirrorChoiceOpen={setMirrorChoiceOpen}
          setSocialType={setSocialType}
        />
      );

    default:
      return (
        <>
          <MilestoneInfo
            player={
              questInfo?.players?.find(
                (item) => item?.profile?.id == lensConnected?.id
              )!
            }
            completeLoading={completeLoading}
            milestone={questInfo?.milestones?.[mainViewer - 1]!}
            handleCompleteMilestone={handleCompleteMilestone}
          />
        </>
      );
  }
};

export default QuestBoardSwitch;

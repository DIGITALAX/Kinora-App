import { FunctionComponent, JSX, useContext } from "react";
import QuestBoxDetails from "./QuestBoxDetails";
import MilestoneInfo from "./MilestoneInfo";
import { ModalContext } from "@/app/providers";
import { QuestBoardSwitchProps } from "../types/quest.types";

const QuestBoardSwitch: FunctionComponent<QuestBoardSwitchProps> = ({
  joinLoading,
  handlePlayerJoin,
  questInfoLoading,
  questInfo,
  mainViewer,
  dict,
  handleCompleteMilestone,
  completeLoading,
  milestoneEligible,
  setSocialType,
}): JSX.Element => {
  const context = useContext(ModalContext);
  switch (mainViewer) {
    case 0:
      return (
        <QuestBoxDetails
          dict={dict}
          questInfo={questInfo}
          questInfoLoading={questInfoLoading}
          joinLoading={joinLoading}
          handlePlayerJoin={handlePlayerJoin}
          setSocialType={setSocialType}
        />
      );

    default:
      return (
        <MilestoneInfo
          player={
            questInfo?.players?.find(
              (item) =>
                item?.profile?.address ==
                context?.lensConectado?.profile?.address
            )!
          }
          milestoneEligible={milestoneEligible}
          questInfo={questInfo!}
          completeLoading={completeLoading}
          milestone={questInfo?.milestones?.[mainViewer - 1]!}
          handleCompleteMilestone={handleCompleteMilestone}
          dict={dict}
        />
      );
  }
};

export default QuestBoardSwitch;

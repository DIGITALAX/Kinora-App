import { Milestone, QuestStage } from "@/components/Envoke/types/envoke.types";
import { QuestInfoState } from "../../redux/reducers/questInfoSlice";

const getStageArray = (
  questStage: QuestStage,
  milestones: Milestone[],
  questInfo: QuestInfoState
): any[] => {
  switch (questStage) {
    case QuestStage.Details:
      return ["Title", "Description", "Cover", "Tags"];

    case QuestStage.Milestones:
      return milestones?.length < 3 ? Array.from({ length: 3 }) : milestones;

    case QuestStage.Storyboard:
      return [
        "Details",
        ...Array.from(
          { length: questInfo?.milestones?.length },
          (_, index) => `Milestone ${index + 1}`
        ),
      ].filter(Boolean);

    case QuestStage.Post:
      return [];
  }
};

export default getStageArray;

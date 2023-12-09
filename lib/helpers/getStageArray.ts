import { Milestone, QuestStage } from "@/components/Envoke/types/envoke.types";

const getStageArray = (
  questStage: QuestStage,
  milestones: Milestone[]
): any[] => {
  switch (questStage) {
    case QuestStage.Details:
      return ["Title", "Description", "Cover", "Tags"];

    case QuestStage.Milestones:
      return milestones?.length < 3 ? Array.from({ length: 3 }) : milestones;

    case QuestStage.Encrypt:
      return [];

    case QuestStage.Post:
      return [];
  }
};

export default getStageArray;

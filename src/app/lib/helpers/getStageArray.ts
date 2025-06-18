import {
  MilestoneEnvoke,
  QuestDetails,
  QuestStage,
} from "@/app/components/Envoke/types/envoke.types";

const getStageArray = (
  questStage: QuestStage,
  milestones: MilestoneEnvoke[],
  questInfo: {
    details: QuestDetails;
    milestones: MilestoneEnvoke[];
  }
): any[] => {
  switch (questStage) {
    case QuestStage.Details:
      return ["Title", "Description", "Cover", "Tags", "Gates"];

    case QuestStage.Milestones:
      return milestones?.length < 3 ? Array.from({ length: 3 }) : milestones;

    case QuestStage.Storyboard:
      return [
        "Details",
        ...Array.from(
          {
            length: questInfo?.milestones?.filter(
              (item) =>
                item?.details?.title?.trim() !== "" && item?.details?.title
            )?.length,
          },
          (_, index) => `Milestone ${index + 1}`
        ),
      ].filter(Boolean);

    case QuestStage.Post:
      return [];
  }
};

export default getStageArray;

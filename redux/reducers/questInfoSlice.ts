import {
  Milestone,
  QuestDetails,
} from "@/components/Envoke/types/envoke.types";
import { createSlice } from "@reduxjs/toolkit";

export interface QuestInfoState {
  details: QuestDetails;
  milestones: Milestone[];
  developerKey: string | undefined;
}

const initialQuestInfoState: QuestInfoState = {
  details: {
    title: "",
    description: "",
    cover: "",
    tags: ""
  },
  milestones: [],
  developerKey: undefined,
};

export const questInfoSlice = createSlice({
  name: "questInfo",
  initialState: initialQuestInfoState,
  reducers: {
    setQuestInfo: (
      state: QuestInfoState,
      { payload: { actionDetails, actionMilestones, actionDeveloperKey } }
    ) => {
      state.details = actionDetails;
      state.milestones = actionMilestones;
      state.developerKey = actionDeveloperKey;
    },
  },
});

export const { setQuestInfo } = questInfoSlice.actions;

export default questInfoSlice.reducer;

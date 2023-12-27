import {
  Milestone,
  QuestDetails,
} from "@/components/Envoke/types/envoke.types";
import { createSlice } from "@reduxjs/toolkit";

export interface QuestInfoState {
  details: QuestDetails;
  milestones: Milestone[];
}

const initialQuestInfoState: QuestInfoState = {
  details: {
    title: "",
    description: "",
    cover: "",
    tags: "",
    maxPlayerCount: 100,
    gated: {
      erc721Addresses: [],
      erc721TokenIds: [],
      erc20Addresses: [],
      erc20Thresholds: [],
      oneOf: true,
    },
  },
  milestones: [],
};

export const questInfoSlice = createSlice({
  name: "questInfo",
  initialState: initialQuestInfoState,
  reducers: {
    setQuestInfo: (
      state: QuestInfoState,
      { payload: { actionDetails, actionMilestones } }
    ) => {
      state.details = actionDetails;
      state.milestones = actionMilestones;
    },
  },
});

export const { setQuestInfo } = questInfoSlice.actions;

export default questInfoSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { QuestStage } from "@/components/Envoke/types/envoke.types";

export interface QuestStageState {
  value: QuestStage;
}

const initialQuestStageState: QuestStageState = {
  value: QuestStage.Details,
};

export const questStageSlice = createSlice({
  name: "questStage",
  initialState: initialQuestStageState,
  reducers: {
    setQuestStage: (
      state: QuestStageState,
      action: PayloadAction<QuestStage>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setQuestStage } = questStageSlice.actions;

export default questStageSlice.reducer;

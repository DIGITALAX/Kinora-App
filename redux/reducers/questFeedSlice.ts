import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Quest } from "@/components/Quest/types/quest.types";

export interface QuestFeedState {
  feed: Quest[];
}

const initialQuestFeedState: QuestFeedState = {
  feed: [],
};

export const questFeedSlice = createSlice({
  name: "questFeed",
  initialState: initialQuestFeedState,
  reducers: {
    setQuestFeed: (state: QuestFeedState, action: PayloadAction<Quest[]>) => {
      state.feed = action.payload;
    },
  },
});

export const { setQuestFeed } = questFeedSlice.actions;

export default questFeedSlice.reducer;

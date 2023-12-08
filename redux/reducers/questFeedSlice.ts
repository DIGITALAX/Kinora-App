import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post } from "../../graphql/generated";

export interface QuestFeedState {
  feed: Post[];
}

const initialQuestFeedState: QuestFeedState = {
  feed: [],
};

export const questFeedSlice = createSlice({
  name: "questFeed",
  initialState: initialQuestFeedState,
  reducers: {
    setQuestFeed: (state: QuestFeedState, action: PayloadAction<Post[]>) => {
      state.feed = action.payload;
    },
  },
});

export const { setQuestFeed } = questFeedSlice.actions;

export default questFeedSlice.reducer;

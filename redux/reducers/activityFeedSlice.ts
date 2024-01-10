import { Quest } from "@/components/Quest/types/quest.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Profile } from "../../graphql/generated";

export interface ActivityFeedState {
  feed: (Quest & {
    type: string;
    profile: Profile | undefined;
  })[];
}

const initialActivityFeedState: ActivityFeedState = {
  feed: [],
};

export const activityFeedSlice = createSlice({
  name: "activityFeed",
  initialState: initialActivityFeedState,
  reducers: {
    setActivityFeed: (
      state: ActivityFeedState,
      action: PayloadAction<
        (Quest & {
          type: string;
          profile: Profile | undefined;
        })[]
      >
    ) => {
      state.feed = action.payload;
    },
  },
});

export const { setActivityFeed } = activityFeedSlice.actions;

export default activityFeedSlice.reducer;

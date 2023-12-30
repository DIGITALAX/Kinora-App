import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Asset } from "@livepeer/react";

export interface AllUploadedState {
  videos: Asset[];
}

const initialAllUploadedState: AllUploadedState = {
  videos: [],
};

export const allUploadedSlice = createSlice({
  name: "allUploaded",
  initialState: initialAllUploadedState,
  reducers: {
    setAllUploaded: (
      state: AllUploadedState,
      action: PayloadAction<Asset[]>
    ) => {
      state.videos = action.payload;
    },
  },
});

export const { setAllUploaded } = allUploadedSlice.actions;

export default allUploadedSlice.reducer;

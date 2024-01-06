import { createSlice } from "@reduxjs/toolkit";

export interface FollowBoxState {
  value: boolean;
  id: string;
  type: string;
}

const initialFollowBoxState: FollowBoxState = {
  value: false,
  id: "",
  type: "",
};

export const followBoxSlice = createSlice({
  name: "followBox",
  initialState: initialFollowBoxState,
  reducers: {
    setFollowBox: (
      state: FollowBoxState,
      { payload: { actionValue, actionImage, actionType } }
    ) => {
      state.value = actionValue;
      state.id = actionImage;
      state.type = actionType;
    },
  },
});

export const { setFollowBox } = followBoxSlice.actions;

export default followBoxSlice.reducer;

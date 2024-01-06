import { createSlice } from "@reduxjs/toolkit";

export interface FollowBoxState {
  open: boolean;
  id: string;
  type: string;
}

const initialFollowBoxState: FollowBoxState = {
  open: false,
  id: "",
  type: "",
};

export const followBoxSlice = createSlice({
  name: "followBox",
  initialState: initialFollowBoxState,
  reducers: {
    setFollowBox: (
      state: FollowBoxState,
      { payload: { actionOpen, actionId, actionType } }
    ) => {
      state.open = actionOpen;
      state.id = actionId;
      state.type = actionType;
    },
  },
});

export const { setFollowBox } = followBoxSlice.actions;

export default followBoxSlice.reducer;

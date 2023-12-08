import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SideBarOpenState {
  value: boolean;
}

const initialSideBarOpenState: SideBarOpenState = {
  value: false,
};

export const sideBarOpenSlice = createSlice({
  name: "sideBarOpen",
  initialState: initialSideBarOpenState,
  reducers: {
    setSideBarOpen: (
      state: SideBarOpenState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSideBarOpen } = sideBarOpenSlice.actions;

export default sideBarOpenSlice.reducer;

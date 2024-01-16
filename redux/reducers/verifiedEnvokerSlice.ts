import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface verifiedEnvokerState {
  value: boolean;
}

const initialVerifiedEnvokerState: verifiedEnvokerState = {
  value: false,
};

export const verifiedEnvokerSlice = createSlice({
  name: "verifiedEnvoker",
  initialState: initialVerifiedEnvokerState,
  reducers: {
    setVerifiedEnvoker: (
      state: verifiedEnvokerState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setVerifiedEnvoker } = verifiedEnvokerSlice.actions;

export default verifiedEnvokerSlice.reducer;

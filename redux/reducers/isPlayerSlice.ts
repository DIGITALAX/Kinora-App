import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface isPlayerState {
    value: boolean;
}

const initialIsPlayerState: isPlayerState = {
  value: false,
};

export const isPlayerSlice = createSlice({
  name: "isPlayer",
  initialState: initialIsPlayerState,
  reducers: {
    setisPlayer: (state: isPlayerState, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

export const { setisPlayer } = isPlayerSlice.actions;

export default isPlayerSlice.reducer;

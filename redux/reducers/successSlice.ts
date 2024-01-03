import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SuccessState {
  value: {
    open: boolean;
    image?: string;
    text?: string;
  };
}

const initialSuccessState: SuccessState = {
  value: { open: false },
};

export const successSlice = createSlice({
  name: "success",
  initialState: initialSuccessState,
  reducers: {
    setSuccess: (
      state: SuccessState,
      action: PayloadAction<{
        open: boolean;
        image?: string;
        text?: string;
      }>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSuccess } = successSlice.actions;

export default successSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SuccessState {
  value: boolean;
}

const initialSuccessState: SuccessState = {
  value: false,
};

export const successSlice = createSlice({
  name: "success",
  initialState: initialSuccessState,
  reducers: {
    setSuccess: (
      state: SuccessState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setSuccess } = successSlice.actions;

export default successSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MissingValuesState {
  value: boolean;
}

const initialMissingValuesState: MissingValuesState = {
  value: false,
};

export const missingValuesSlice = createSlice({
  name: "missingValues",
  initialState: initialMissingValuesState,
  reducers: {
    setMissingValues: (
      state: MissingValuesState,
      action: PayloadAction<boolean>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setMissingValues } = missingValuesSlice.actions;

export default missingValuesSlice.reducer;

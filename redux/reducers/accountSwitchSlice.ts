import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AccountType } from "@/components/Envoker/types/envoker.types";

export interface AccountSwitchState {
  value: AccountType;
}

const initialAccountSwitchState: AccountSwitchState = {
  value: AccountType.Home,
};

export const accountSwitchSlice = createSlice({
  name: "accountSwitch",
  initialState: initialAccountSwitchState,
  reducers: {
    setAccountSwitch: (
      state: AccountSwitchState,
      action: PayloadAction<AccountType>
    ) => {
      state.value = action.payload;
    },
  },
});

export const { setAccountSwitch } = accountSwitchSlice.actions;

export default accountSwitchSlice.reducer;

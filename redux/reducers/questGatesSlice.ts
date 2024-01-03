import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Collection } from "@/components/Envoke/types/envoke.types";

export interface QuestGatesState {
  gates:
    | {
        erc20?: {
          address: string;
          amount: string;
        }[];
        erc721?: Collection[];
        oneOf?: boolean;
      }
    | undefined;
}

const initialQuestGatesState: QuestGatesState = {
  gates: undefined,
};

export const questGatesSlice = createSlice({
  name: "questGates",
  initialState: initialQuestGatesState,
  reducers: {
    setQuestGates: (
      state: QuestGatesState,
      action: PayloadAction<
        | {
            erc20?: {
              address: string;
              amount: string;
            }[];
            erc721?: Collection[];
            oneOf?: boolean;
          }
        | undefined
      >
    ) => {
      state.gates = action.payload;
    },
  },
});

export const { setQuestGates } = questGatesSlice.actions;

export default questGatesSlice.reducer;

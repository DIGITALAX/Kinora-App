import { createSlice } from "@reduxjs/toolkit";
import { Post } from "../../graphql/generated";

export interface QuoteState {
  open: boolean;
  publication: Post | undefined;
}

const initialQuoteState: QuoteState = {
  open: false,
  publication: undefined,
};

export const quoteSlice = createSlice({
  name: "quote",
  initialState: initialQuoteState,
  reducers: {
    setQuote: (
      state: QuoteState,
      { payload: { actionOpen, actionPublication } }
    ) => {
      state.open = actionOpen;
      state.publication = actionPublication;
    },
  },
});

export const { setQuote } = quoteSlice.actions;

export default quoteSlice.reducer;

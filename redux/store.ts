import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import walletConnectedReducer from "./reducers/walletConnectedSlice";
import lensConnectedReducer from "./reducers/lensConnectedSlice";
import questFeedReducer from "./reducers/questFeedSlice";
import sideBarOpenReducer from "./reducers/sideBarOpenSlice";
import accountSwitchReducer from "./reducers/accountSwitchSlice";
import interactErrorReducer from "./reducers/interactErrorSlice";
import indexerReducer from "./reducers/indexerSlice";
import questStageReducer from "./reducers/questStageSlice";
import questInfoReducer from "./reducers/questInfoSlice";
import availableCurrenciesReducer from "./reducers/availableCurrenciesSlice";
import questGatesReducer from "./reducers/questGatesSlice";
import successReducer from "./reducers/successSlice";
import postCollectGifReducer from "./reducers/postCollectGifSlice";
import quoteReducer from "./reducers/quoteSlice";
import followCollectReducer from "./reducers/followCollectSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import allUploadedReducer from "./reducers/allUploadedSlice";

const reducer = combineReducers({
  walletConnectedReducer,
  lensConnectedReducer,
  questFeedReducer,
  sideBarOpenReducer,
  accountSwitchReducer,
  interactErrorReducer,
  indexerReducer,
  questStageReducer,
  questInfoReducer,
  availableCurrenciesReducer,
  postCollectGifReducer,
  quoteReducer,
  followCollectReducer,
  imageViewerReducer,
  successReducer,
  allUploadedReducer,
  questGatesReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

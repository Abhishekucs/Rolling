"use client";
import { connectionSlice } from "@/redux/reducers/connection-slice";
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [connectionSlice.name]: connectionSlice.reducer,
  },
  devTools: true,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

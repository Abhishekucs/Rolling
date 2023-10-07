"use client";
import { connectionSlice } from "@/redux/slices/connection-slice";
import { configureStore } from "@reduxjs/toolkit";
import { productByIdSlice } from "./slices/productById";
import { productSlice } from "./slices/product";
import AuthSlice from "./slices/auth";

export const store = configureStore({
  reducer: {
    [connectionSlice.name]: connectionSlice.reducer,
    [productSlice.name]: productSlice.reducer,
    [productByIdSlice.name]: productByIdSlice.reducer,
    [AuthSlice.name]: AuthSlice.reducer,
  },
  devTools: true,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

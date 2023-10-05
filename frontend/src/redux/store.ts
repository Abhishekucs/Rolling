"use client";
import { connectionSlice } from "@/redux/slices/connection-slice";
import { configureStore } from "@reduxjs/toolkit";
import { productByIdSlice } from "./slices/productById";
import { productSlice } from "./slices/product";

export const store = configureStore({
  reducer: {
    [connectionSlice.name]: connectionSlice.reducer,
    [productSlice.name]: productSlice.reducer,
    [productByIdSlice.name]: productByIdSlice.reducer,
  },
  devTools: true,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

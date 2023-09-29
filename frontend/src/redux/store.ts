"use client";
import { connectionSlice } from "@/redux/slices/connection-slice";
import { LoadingSlice } from "@/redux/slices/loading";
import { productSlice } from "@/redux/slices/product";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    [connectionSlice.name]: connectionSlice.reducer,
    [LoadingSlice.name]: LoadingSlice.reducer,
    [productSlice.name]: productSlice.reducer,
  },
  devTools: true,
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// export const createAppAsyncThunk = createAsyncThunk.withTypes<{
//   state: AppState;
//   dispatch: AppDispatch;
//   rejectValue: string;
//   extra: { s: string; n: number };
// }>();

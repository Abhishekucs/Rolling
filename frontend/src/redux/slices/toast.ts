import { createSlice } from "@reduxjs/toolkit";
import { addToast, removeToast } from "../actions/toast";

export interface IToast {
  error?: boolean;
  message: string;
  createdAt?: number;
}

const initialState: IToast[] = [];

export const ToastSlice = createSlice({
  name: "toast",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addToast, (state, action) => {
        return [...state, action.payload];
      })
      .addCase(removeToast, (state, action) => {
        return [...state.filter((st) => st.createdAt !== action.payload)];
      });
  },
});

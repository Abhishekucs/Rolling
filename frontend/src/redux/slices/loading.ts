import { createSlice } from "@reduxjs/toolkit";

export interface LoadingState {
  isLoading: boolean;
}

const initialState: LoadingState = {
  isLoading: false,
};

export const LoadingSlice = createSlice({
  name: "Loading",
  initialState,
  reducers: {
    setLoadingStatus(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const { setLoadingStatus } = LoadingSlice.actions;
export default LoadingSlice.reducer;

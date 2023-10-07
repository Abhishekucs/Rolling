import { createSlice } from "@reduxjs/toolkit";
import { clearUser, setUser, signUp } from "../actions/auth";

export interface UserState {
  user: RollingTypes.User | null;
  loading: "idle" | "succeeded" | "failed" | "pending";
  errorMessage: string | null | undefined;
}

const initialState: UserState = {
  user: null,
  loading: "idle",
  errorMessage: null,
};

const AuthSlice = createSlice({
  name: "Auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.fulfilled, (state, _) => {
        state.loading = "succeeded";
      })
      .addCase(signUp.pending, (state, _) => {
        state.loading = "pending";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = "failed";
        if (action.payload) {
          state.errorMessage = action.payload;
        } else {
          state.errorMessage = action.error.message;
        }
      })
      .addCase(setUser, (state, action) => {
        state.user = action.payload;
      })
      .addCase(clearUser, (state, _) => {
        state.user = null;
      });
  },
});

export default AuthSlice;

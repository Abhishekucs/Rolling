import { createSlice } from "@reduxjs/toolkit";
import { clearUser, setUser, signUp } from "../actions/auth";

export interface UserState {
  user: RollingTypes.User | null;
  loading: "idle" | "succeeded" | "failed" | "pending";
}

const initialState: UserState = {
  user: null,
  loading: "idle",
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
      .addCase(signUp.rejected, (state, _) => {
        state.loading = "failed";
      })
      .addCase(setUser, (state, action) => {
        state.user = action.payload;
      })
      .addCase(clearUser, () => {
        return initialState;
      });
  },
});

export default AuthSlice;

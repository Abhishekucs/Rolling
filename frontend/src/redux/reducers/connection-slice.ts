import { createSlice } from "@reduxjs/toolkit";
import { setOnlineStatus } from "../actions/connection-action";

interface ConnectionState {
  isOnline: boolean | null;
}

const initialState: ConnectionState = {
  isOnline: null,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setOnlineStatus, (state, action) => {
      state.isOnline = action.payload;
    });
  },
});

export default connectionSlice.reducer;

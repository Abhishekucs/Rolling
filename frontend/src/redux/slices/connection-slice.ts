import { createSlice } from "@reduxjs/toolkit";

interface ConnectionState {
  isOnline: boolean | null;
}

const initialState: ConnectionState = {
  isOnline: null,
};

export const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    setOnlineStatus(state, action) {
      state.isOnline = action.payload;
    },
  },
});

export const { setOnlineStatus } = connectionSlice.actions;
export default connectionSlice.reducer;

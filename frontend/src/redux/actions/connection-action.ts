import { createAction } from "@reduxjs/toolkit";

export const setOnlineStatus = createAction<boolean>(
  "connection/setOnlineStatus"
);

import { combineReducers } from "@reduxjs/toolkit";
import connectionReducer from "../reducers/connection-slice";

const rootReducer = combineReducers({
  connection: connectionReducer,
});

export default rootReducer;

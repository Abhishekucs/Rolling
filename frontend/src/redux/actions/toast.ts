import { createAction } from "@reduxjs/toolkit";
import { IToast } from "../slices/toast";

const ADD_TOAST = "toast/addToast";
const REMOVE_TOAST = "toast/removeToast";

export const addToast = createAction<IToast>(ADD_TOAST);
export const removeToast = createAction<number>(REMOVE_TOAST);

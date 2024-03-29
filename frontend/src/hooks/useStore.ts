import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { AppState, AppDispatch } from "../redux/store";

// Used throughout the app instead of normal 'useDispatch' and 'useSelector'
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

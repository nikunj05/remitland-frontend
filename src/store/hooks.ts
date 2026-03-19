// ============================================================
// Typed Redux Hooks
// Use these throughout the app instead of plain useSelector/useDispatch
// to get full TypeScript inference.
// ============================================================

import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./index";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

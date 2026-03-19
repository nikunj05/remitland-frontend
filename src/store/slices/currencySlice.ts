// ============================================================
// Currency Redux Slice
// Manages currently selected currency. Persisted via redux-persist.
// ============================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrencyCode } from "@/types";

interface CurrencyState {
  selected: CurrencyCode | null;
}

const initialState: CurrencyState = {
  // null represents "All" currencies initially
  selected: null,
};

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setSelectedCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.selected = action.payload;
    },
  },
});

export const { setSelectedCurrency } = currencySlice.actions;
export default currencySlice.reducer;

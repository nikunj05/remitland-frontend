// ============================================================
// UI Redux Slice
// Manages global UI state: modal open/close, active receiver.
// ============================================================

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Receiver } from "@/types";

interface UiState {
  isReceiverModalOpen: boolean;
  activeReceiver: Receiver | null;
}

const initialState: UiState = {
  isReceiverModalOpen: false,
  activeReceiver: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openReceiverModal(state, action: PayloadAction<Receiver>) {
      state.isReceiverModalOpen = true;
      state.activeReceiver = action.payload;
    },

    closeReceiverModal(state) {
      state.isReceiverModalOpen = false;
      // NOTE: We intentionally keep activeReceiver so the last
      // selected currency tab state is preserved when re-opened.
    },
  },
});

export const { openReceiverModal, closeReceiverModal } = uiSlice.actions;
export default uiSlice.reducer;

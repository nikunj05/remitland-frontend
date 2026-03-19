// ============================================================
// useSocketUpdates Hook
// Connects to the Socket.IO server and listens for real-time
// transaction updates. Dispatches Redux actions on events.
// Safe to call at component mount — uses the singleton socket.
// ============================================================

"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { upsertTransaction } from "@/store/slices/transactionSlice";
import { getSocket } from "@/lib/socket";
import { Transaction } from "@/types";

export function useSocketUpdates() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const socket = getSocket();

    /**
     * transaction:updated — fired by the Socket.IO server when a
     * transaction status changes or a new transaction is queued.
     */
    function onTransactionUpdated(data: Transaction) {
      dispatch(upsertTransaction(data));
    }

    socket.on("transaction:updated", onTransactionUpdated);

    // Cleanup listener on unmount
    return () => {
      socket.off("transaction:updated", onTransactionUpdated);
    };
  }, [dispatch]);
}

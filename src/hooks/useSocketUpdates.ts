// ============================================================
// useSocketUpdates Hook
// Connects to the Socket.IO server and listens for real-time
// transaction updates. Dispatches Redux actions on events.
// Safe to call at component mount — uses the singleton socket.
// ============================================================

"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTransactions, fetchModalTransactions } from "@/store/slices/transactionSlice";
import { getSocket } from "@/lib/socket";

export function useSocketUpdates() {
  const dispatch = useAppDispatch();
  const activeReceiver = useAppSelector((state) => state.ui.activeReceiver);

  useEffect(() => {
    const socket = getSocket();

    const refreshData = (eventName: string, data: any) => {
      console.log(`[useSocketUpdates] Real-time EVENT: "${eventName}" RECEIVED! Data:`, JSON.stringify(data, null, 2));

      // Update global dashboard list
      dispatch(fetchTransactions());

      // If a modal is open for a receiver, refresh its specific transaction list too
      if (activeReceiver) {
        console.log(`[useSocketUpdates] Refreshing modal for active receiver: ${activeReceiver.name}`);
        dispatch(fetchModalTransactions());
      }
    };

    // Generic "transactions" event
    const handleGeneric = (data: any) => refreshData("transactions", data);
    // Specific "created" event found in backend logs
    const handleCreated = (data: any) => refreshData("transactions.created", data);

    const onConnect = () => {
      console.log("[useSocketUpdates] Connected/Reconnected! Joining 'transactions' room...");
      socket.emit("join", "transactions");
    };

    // Initialize listeners
    socket.on("connect", onConnect);
    socket.on("transactions", handleGeneric);
    socket.on("transactions.created", handleCreated);

    // Initial join if already connected
    if (socket.connected) {
      onConnect();
    }

    return () => {
      console.log("[useSocketUpdates] Cleaning up global socket listeners...");
      socket.off("connect", onConnect);
      socket.off("transactions", handleGeneric);
      socket.off("transactions.created", handleCreated);
    };
  }, [dispatch, activeReceiver]);
}
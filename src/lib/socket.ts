// ============================================================
// Socket.IO Client Singleton
// Connects to the real-time server. Will be integrated with
// backend Socket.IO server once APIs are provided.
// ============================================================

import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3000";



let socket: Socket | null = null;

/**
 * getSocket — returns a singleton Socket.IO instance.
 * Safe to call multiple times; only one connection is created.
 */
export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true, // Enabled for real-time updates
    });

    socket.on("connect", () => {
      console.log("[Socket.IO] Connected successfully! ID:", socket?.id);
    });

    socket.on("reconnect", (attempt) => {
      console.log("[Socket.IO] Reconnected after", attempt, "attempts");
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("[Socket.IO] Reconnection attempt #", attempt);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket.IO] Disconnected. Reason:", reason);
    });

    socket.on("connect_error", (err) => {
      console.error("[Socket.IO] Connection error:", err.message);
      console.dir(err);
    });
  }

  return socket;
}

export { socket };

/**
 * disconnectSocket — cleanly disconnects and clears the singleton.
 */
export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
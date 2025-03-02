import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000";

// Ensure only one instance is created
export const socket = io(SOCKET_URL, {
  transports: ["websocket", "polling"], // Ensure WebSockets work
  reconnectionAttempts: 5, // Retry connecting 5 times before failing
  reconnectionDelay: 1000,
});


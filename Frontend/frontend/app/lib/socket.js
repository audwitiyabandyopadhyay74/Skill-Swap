import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (typeof window === 'undefined') return null;
  if (!socket) {
    socket = io('https://skill-swap-iz63.onrender.com', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

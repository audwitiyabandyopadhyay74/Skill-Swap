import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (typeof window === 'undefined') return null;
  if (!socket) {
    socket = io('https://skill-swap-iz63.onrender.com', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      secure: true,
    });
  }
  return socket;
};

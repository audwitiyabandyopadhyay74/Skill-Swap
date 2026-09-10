import { io } from 'socket.io-client';

let socket;

export const getSocket = () => {
  if (typeof window === 'undefined') return null;
  if (!socket) {
    socket = io('http://localhost:5000', {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

import { io } from 'socket.io-client';

let socket;

const getSocketUrl = () => {
  if (process.env.NEXT_PUBLIC_SOCKET_URL) return process.env.NEXT_PUBLIC_SOCKET_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:6000';
  }
  return 'https://skill-swap-iz63.onrender.com';
};

export const getSocket = () => {
  if (typeof window === 'undefined') return null;
  if (!socket) {
    socket = io(getSocketUrl(), {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 20,
      reconnectionDelay: 1000,
      secure: typeof window !== 'undefined' && window.location.protocol === 'https:',
    });
  }
  return socket;
};

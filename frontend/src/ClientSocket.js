import { io } from "socket.io-client";

let socket = null;

export const connectSocket = (userId) => {
  if (!socket && userId) {
    socket = io('http://localhost:8000', {
      query: { userId },
      transports: ['websocket']
    });

    // Handle connection errors
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });

    // Handle disconnection
    socket.on('disconnect', (reason) => {
      console.warn('Socket disconnected:', reason);
    });
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

















































// import { io } from "socket.io-client";

// let socket = null;

// export const connectSocket = (userId) => {
//   if (!socket && userId) {
//     socket = io('http://localhost:8000', {
//       query: { userId },
//       transports: ['websocket']
//     });
//   }
//   return socket;
// };

// export const getSocket = () => socket;

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };
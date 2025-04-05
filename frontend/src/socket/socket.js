import { io } from 'socket.io-client';

let socket;

export const initializeSocket = (userId) => {
  if (!socket) {
    socket = io('http://localhost:5000', {
      query: { userId }
    });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      // Emit user online status
      socket.emit('user_online', userId);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
      // Emit user offline status
      socket.emit('user_offline', userId);
    });

    // Handle connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  }
  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error('Socket not initialized');
  }
  return socket;
};

// Helper functions for common socket operations
export const joinConversation = (conversationId) => {
  const socket = getSocket();
  socket.emit('join_conversation', conversationId);
};

export const leaveConversation = (conversationId) => {
  const socket = getSocket();
  socket.emit('leave_conversation', conversationId);
};

export const sendMessage = (data) => {
  const socket = getSocket();
  socket.emit('send_message', data);
};

export const sendTypingStatus = (data) => {
  const socket = getSocket();
  socket.emit('typing', data);
};

// Event listeners
export const onReceiveMessage = (callback) => {
  const socket = getSocket();
  socket.on('receive_message', callback);
};

export const onUserTyping = (callback) => {
  const socket = getSocket();
  socket.on('user_typing', callback);
};

export const onUserStatus = (callback) => {
  const socket = getSocket();
  socket.on('user_status', callback);
}; 
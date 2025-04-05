import { Server } from 'socket.io';

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // Your frontend URL
      methods: ["GET", "POST"]
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    //Add user to conversation
    
    // Join a conversation
    socket.on('join_conversation', (conversationId) => {
      socket.join(conversationId);
      console.log(`User ${socket.id} joined conversation: ${conversationId}`);
    });

    // Leave a conversation
    socket.on('leave_conversation', (conversationId) => {
      socket.leave(conversationId);
      console.log(`User ${socket.id} left conversation: ${conversationId}`);
    });

    // Send a message
    socket.on('send_message', (data) => {
      io.to(data.conversationId).emit('receive_message', data);
      console.log(`Message sent in conversation ${data.conversationId}:`, data);
    });

    // User typing
    socket.on('typing', (data) => {
      socket.to(data.conversationId).emit('user_typing', {
        userId: data.userId,
        isTyping: data.isTyping
      });
    });

    // User online status
    socket.on('user_online', (userId) => {
      socket.broadcast.emit('user_status', { userId, status: 'online' });
    });

    // User offline status
    socket.on('user_offline', (userId) => {
      socket.broadcast.emit('user_status', { userId, status: 'offline' });
    });

    // Disconnect
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
}; 
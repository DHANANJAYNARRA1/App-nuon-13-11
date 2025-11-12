const io = require('socket.io');

let socketServer = null;

function initializeSocket(server) {
  socketServer = io(server);
  console.log('[Socket] Socket.IO server initialized');

  socketServer.on('connection', (socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
}

function emitToUser(userId, event, data) {
  if (!socketServer) {
    console.error('[Socket] Socket.IO server not initialized');
    return;
  }

  socketServer.to(userId).emit(event, data);
  console.log(`[Socket] Event emitted to user ${userId}: ${event}`);
}

function emitToRole(role, event, data) {
  if (!socketServer) {
    console.error('[Socket] Socket.IO server not initialized');
    return;
  }

  socketServer.to(role).emit(event, data);
  console.log(`[Socket] Event emitted to role ${role}: ${event}`);
}

module.exports = {
  initializeSocket,
  emitToUser,
  emitToRole,
};
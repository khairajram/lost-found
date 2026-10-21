import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { AuthenticatedUser } from '../types/index.js';

export class SocketManager {
  private io: SocketIOServer | null = null;

  initialize(httpServer: HttpServer): SocketIOServer {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: ENV.CLIENT_URL,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.io.use((socket: Socket, next) => {
      const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
      if (!token) {
        // Allow unauthenticated connection or guest socket
        return next();
      }
      try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as AuthenticatedUser;
        socket.data.user = decoded;
        next();
      } catch (err) {
        next();
      }
    });

    this.io.on('connection', (socket: Socket) => {
      const userId = socket.data.user?._id;
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`[Socket] User connected and joined room: user_${userId}`);
      }

      // Join a chat conversation room
      socket.on('join_chat', (chatId: string) => {
        socket.join(`chat_${chatId}`);
        console.log(`[Socket] Socket ${socket.id} joined chat: chat_${chatId}`);
      });

      // Leave a chat conversation room
      socket.on('leave_chat', (chatId: string) => {
        socket.leave(`chat_${chatId}`);
      });

      // Typing indicators
      socket.on('typing_start', (data: { chatId: string; userName: string }) => {
        socket.to(`chat_${data.chatId}`).emit('user_typing', {
          chatId: data.chatId,
          userName: data.userName,
          isTyping: true,
        });
      });

      socket.on('typing_stop', (data: { chatId: string; userName: string }) => {
        socket.to(`chat_${data.chatId}`).emit('user_typing', {
          chatId: data.chatId,
          userName: data.userName,
          isTyping: false,
        });
      });

      socket.on('disconnect', () => {
        console.log(`[Socket] Disconnected: ${socket.id}`);
      });
    });

    return this.io;
  }

  sendNotificationToUser(userId: string, notification: any): void {
    if (this.io) {
      this.io.to(`user_${userId}`).emit('new_notification', notification);
    }
  }

  broadcastChatMessage(chatId: string, message: any): void {
    if (this.io) {
      this.io.to(`chat_${chatId}`).emit('new_message', message);
    }
  }
}

export const socketManager = new SocketManager();

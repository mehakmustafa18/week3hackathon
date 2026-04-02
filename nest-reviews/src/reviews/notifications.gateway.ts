import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // Broadcast a new review to all connected users
  broadcastNewReview(review: any) {
    this.server.emit('new_review', {
      message: `New review added for product: ${review.productId}`,
      review,
    });
  }

  // Send a direct notification to a specific user (e.g., review author)
  sendDirectNotification(userId: string, event: string, data: any) {
    // In a real app, we would map userId to socketId.
    // For this hackathon, we can broadcast to a room named after the userId.
    this.server.to(userId).emit(event, data);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, userId: string) {
    client.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  }
}

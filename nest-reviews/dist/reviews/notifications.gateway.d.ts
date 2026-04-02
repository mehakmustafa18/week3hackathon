import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    broadcastNewReview(review: any): void;
    sendDirectNotification(userId: string, event: string, data: any): void;
    handleJoinRoom(client: Socket, userId: string): void;
}

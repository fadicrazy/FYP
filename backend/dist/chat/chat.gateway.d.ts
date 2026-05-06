import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private activeUsers;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
        userId: string;
        userName: string;
    }): void;
    handleMessage(client: Socket, data: {
        roomId: string;
        message: string;
        userId: string;
        userName: string;
    }): void;
    handleTyping(client: Socket, data: {
        roomId: string;
        userName: string;
    }): void;
    handleLeaveRoom(client: Socket, data: {
        roomId: string;
        userName: string;
    }): void;
}

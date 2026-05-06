import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private rooms;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, data: {
        roomId: string;
        userId: string;
        userName: string;
    }): void;
    handleOffer(client: Socket, data: {
        to: string;
        offer: any;
    }): void;
    handleAnswer(client: Socket, data: {
        to: string;
        answer: any;
    }): void;
    handleIceCandidate(client: Socket, data: {
        to: string;
        candidate: any;
    }): void;
    handleEndCall(client: Socket, data: {
        roomId: string;
    }): void;
}

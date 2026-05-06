import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: '/video',
})
export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private rooms = new Map<string, Set<string>>(); // roomId -> Set of socketIds

  handleConnection(client: Socket) {
    console.log(`Video client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    // Remove from all rooms
    this.rooms.forEach((sockets, roomId) => {
      if (sockets.has(client.id)) {
        sockets.delete(client.id);
        this.server.to(roomId).emit('userDisconnected', { socketId: client.id });
      }
    });
    console.log(`Video client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinVideoRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string; userId: string; userName: string },
  ) {
    client.join(data.roomId);

    if (!this.rooms.has(data.roomId)) {
      this.rooms.set(data.roomId, new Set());
    }
    this.rooms.get(data.roomId)?.add(client.id);

    // Notify others in the room
    client.to(data.roomId).emit('userJoinedVideo', {
      socketId: client.id,
      userId: data.userId,
      userName: data.userName,
    });

    // Send list of existing users to the new participant
    const existingUsers = Array.from(this.rooms.get(data.roomId) || []).filter(
      (id) => id !== client.id,
    );
    client.emit('existingUsers', existingUsers);
  }

  @SubscribeMessage('offer')
  handleOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; offer: any },
  ) {
    this.server.to(data.to).emit('offer', {
      from: client.id,
      offer: data.offer,
    });
  }

  @SubscribeMessage('answer')
  handleAnswer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; answer: any },
  ) {
    this.server.to(data.to).emit('answer', {
      from: client.id,
      answer: data.answer,
    });
  }

  @SubscribeMessage('iceCandidate')
  handleIceCandidate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { to: string; candidate: any },
  ) {
    this.server.to(data.to).emit('iceCandidate', {
      from: client.id,
      candidate: data.candidate,
    });
  }

  @SubscribeMessage('endCall')
  handleEndCall(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    this.server.to(data.roomId).emit('callEnded', { socketId: client.id });
    client.leave(data.roomId);
    this.rooms.get(data.roomId)?.delete(client.id);
  }
}

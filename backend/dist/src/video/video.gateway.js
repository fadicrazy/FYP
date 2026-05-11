"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
let VideoGateway = class VideoGateway {
    server;
    rooms = new Map();
    handleConnection(client) {
        console.log(`Video client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.rooms.forEach((sockets, roomId) => {
            if (sockets.has(client.id)) {
                sockets.delete(client.id);
                this.server.to(roomId).emit('userDisconnected', { socketId: client.id });
            }
        });
        console.log(`Video client disconnected: ${client.id}`);
    }
    handleJoinRoom(client, data) {
        client.join(data.roomId);
        if (!this.rooms.has(data.roomId)) {
            this.rooms.set(data.roomId, new Set());
        }
        this.rooms.get(data.roomId)?.add(client.id);
        client.to(data.roomId).emit('userJoinedVideo', {
            socketId: client.id,
            userId: data.userId,
            userName: data.userName,
        });
        const existingUsers = Array.from(this.rooms.get(data.roomId) || []).filter((id) => id !== client.id);
        client.emit('existingUsers', existingUsers);
    }
    handleOffer(client, data) {
        this.server.to(data.to).emit('offer', {
            from: client.id,
            offer: data.offer,
        });
    }
    handleAnswer(client, data) {
        this.server.to(data.to).emit('answer', {
            from: client.id,
            answer: data.answer,
        });
    }
    handleIceCandidate(client, data) {
        this.server.to(data.to).emit('iceCandidate', {
            from: client.id,
            candidate: data.candidate,
        });
    }
    handleEndCall(client, data) {
        this.server.to(data.roomId).emit('callEnded', { socketId: client.id });
        client.leave(data.roomId);
        this.rooms.get(data.roomId)?.delete(client.id);
    }
};
exports.VideoGateway = VideoGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], VideoGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('joinVideoRoom'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], VideoGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('offer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], VideoGateway.prototype, "handleOffer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('answer'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], VideoGateway.prototype, "handleAnswer", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('iceCandidate'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], VideoGateway.prototype, "handleIceCandidate", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('endCall'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], VideoGateway.prototype, "handleEndCall", null);
exports.VideoGateway = VideoGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/video',
    })
], VideoGateway);
//# sourceMappingURL=video.gateway.js.map
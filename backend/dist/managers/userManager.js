"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
const RoomManager_1 = require("./RoomManager");
class UserManager {
    constructor() {
        this.rooms = [];
        this.users = [];
        this.pendingUser = null;
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            var _a;
            const message = JSON.parse(data.toString());
            if (message.type === "init_conn") {
                if (this.pendingUser) {
                    const room = new RoomManager_1.RoomManager(this.pendingUser, socket);
                    room.user2Name = message.name;
                    room.user1Name = this.pendingUser.name;
                    this.rooms.push(room);
                    room.gotConnected(this.pendingUser.socket, socket);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = {
                        socket: socket,
                        name: message.name
                    };
                    socket.send(JSON.stringify({ type: "waiting" }));
                }
            }
            const room = this.rooms.find(room => room.user1.socket === socket || room.user2 === socket);
            if (message.type === "createOffer") {
                if (room) {
                    room.sendOffer(socket, message);
                }
            }
            if (message.type === "createAnswer") {
                if (room) {
                    room.sendAnswer(socket, message);
                }
            }
            if (message.type === "iceCandidate") {
                if (room) {
                    room.sendIceCandidate(socket, message);
                }
            }
            if (message.type === "close_conn") {
                if (room) {
                    this.rooms = this.rooms.filter((EmptyRoom) => {
                        return EmptyRoom !== room;
                    });
                    room.closeConn(socket, message);
                }
                if (((_a = this.pendingUser) === null || _a === void 0 ? void 0 : _a.socket) === socket) {
                    this.pendingUser = null;
                }
            }
        });
        socket.on("close", () => {
            const room = this.rooms.find(room => room.user1.socket === socket || room.user2 === socket);
            if (room) {
                this.rooms = this.rooms.filter((EmptyRoom) => {
                    return EmptyRoom !== room;
                });
            }
        });
    }
}
exports.UserManager = UserManager;

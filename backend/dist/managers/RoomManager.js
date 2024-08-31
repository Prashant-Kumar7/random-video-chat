"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoomManager = void 0;
class RoomManager {
    constructor(user1, user2) {
        this.user1 = user1;
        this.user2 = user2;
        // this.msgArray = []
        this.user1Name = user1.name;
        this.user2Name = "";
    }
    sendOffer(socket, data) {
        if (socket === this.user1.socket) {
            // send data from user1 to user2
            console.log("user1 sent an offer");
            this.user2.send(JSON.stringify(data));
        }
        else if (socket === this.user2) {
            // send data from user2 to user1
            console.log("user2 sent an offer");
            this.user1.socket.send(JSON.stringify(data));
        }
    }
    sendAnswer(socket, data) {
        if (socket === this.user1.socket) {
            // send data from user1 to user2
            this.user2.send(JSON.stringify(data));
        }
        else if (socket === this.user2) {
            // send data from user2 to user1
            this.user1.socket.send(JSON.stringify(data));
        }
    }
    sendIceCandidate(socket, data) {
        if (socket === this.user1.socket) {
            // send data from user1 to user2
            // console.log("user1 candidates")
            // console.log(data.candidates)
            // console.log(data.candidate)
            this.user2.send(JSON.stringify(data));
        }
        else if (socket === this.user2) {
            // send data from user2 to user1
            // console.log("user2 candidates" )
            // console.log(data.candidate)
            this.user1.socket.send(JSON.stringify(data));
        }
    }
    gotConnected(socket1, sokcet2) {
        const data = {
            type: "gotConnected"
        };
        socket1.send(JSON.stringify(data));
        sokcet2.send(JSON.stringify(data));
    }
    closeConn(socket, message) {
        if (socket === this.user1.socket) {
            this.user2.send(JSON.stringify(message));
        }
        if (socket === this.user2) {
            this.user1.socket.send(JSON.stringify(message));
        }
    }
}
exports.RoomManager = RoomManager;

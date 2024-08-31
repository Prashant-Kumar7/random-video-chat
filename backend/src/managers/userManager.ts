import { WebSocket } from "ws";
import { RoomManager } from "./RoomManager";

export interface PendingUser {
    socket : WebSocket,
    name : string
}


export class UserManager {
    // private rooms : 
    private rooms : RoomManager[]
    private users : WebSocket[];
    private pendingUser : null | PendingUser

    constructor(){
        this.rooms = []
        this.users = [];
        this.pendingUser = null
    }


    addUser(socket : WebSocket){
        this.users.push(socket);
        this.addHandler(socket)
    }


    addHandler(socket : WebSocket){
        socket.on("message" , (data)=>{

            const message = JSON.parse(data.toString())

            if(message.type === "init_conn"){

                if(this.pendingUser){
                    const room = new RoomManager(this.pendingUser, socket)
                    room.user2Name = message.name
                    room.user1Name = this.pendingUser.name
                    this.rooms.push(room)
                    room.gotConnected(this.pendingUser.socket , socket)
                    this.pendingUser = null
                } else {
                    this.pendingUser = {
                        socket : socket,
                        name : message.name
                    }
                    socket.send(JSON.stringify({type : "waiting"}))
                }
            
            }

            const room = this.rooms.find(room=> room.user1.socket === socket || room.user2 === socket);
            
            if(message.type === "createOffer"){
                if(room){
                    room.sendOffer(socket , message)
                }
            }


            if(message.type === "createAnswer"){
                if(room){
                    room.sendAnswer(socket , message)
                }
            }

            if(message.type === "iceCandidate"){
                if(room){
                    room.sendIceCandidate(socket , message)
                }
            }

            if(message.type === "close_conn"){
                
                if(room){
                    this.rooms = this.rooms.filter((EmptyRoom)=>{
                        return EmptyRoom !== room
                    })
                    room.closeConn(socket , message)
                }

                if(this.pendingUser?.socket === socket){
                    this.pendingUser = null
                }
            }
        })

        socket.on("close" , ()=>{
            const room = this.rooms.find(room=> room.user1.socket === socket || room.user2 === socket);
            if(room){
                this.rooms = this.rooms.filter((EmptyRoom)=>{
                    return EmptyRoom !== room
                })
            }
        })


    }
}
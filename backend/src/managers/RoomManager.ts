import { WebSocket } from "ws";
import { PendingUser } from "./userManager";


export class RoomManager {
    public user1 : PendingUser;
    public user2 : WebSocket;
    // private msgArray : MsgObj[];
    public user1Name : string
    public user2Name : string


    constructor (user1: PendingUser, user2:WebSocket){
        this.user1 = user1
        this.user2 = user2
        // this.msgArray = []
        this.user1Name = user1.name
        this.user2Name = "";
    }


    sendOffer(socket: WebSocket , data : any){
        if(socket === this.user1.socket){
            // send data from user1 to user2
            console.log("user1 sent an offer")
            this.user2.send(JSON.stringify(data))

        } else if(socket === this.user2){
            // send data from user2 to user1
            console.log("user2 sent an offer")
            this.user1.socket.send(JSON.stringify(data))

        }
    }


    sendAnswer(socket: WebSocket , data : any){
        if(socket === this.user1.socket){
            // send data from user1 to user2
            this.user2.send(JSON.stringify(data))
            
        } else if(socket === this.user2){
            // send data from user2 to user1
            this.user1.socket.send(JSON.stringify(data))
            
        }
    }

    sendIceCandidate(socket: WebSocket , data : any){
        if(socket === this.user1.socket){
            // send data from user1 to user2
            // console.log("user1 candidates")
            // console.log(data.candidates)
            // console.log(data.candidate)

            
            this.user2.send(JSON.stringify(data))

        } else if(socket === this.user2){
            // send data from user2 to user1
            // console.log("user2 candidates" )
            // console.log(data.candidate)
            this.user1.socket.send(JSON.stringify(data))
        }
    }


    gotConnected(socket1 : WebSocket , sokcet2 : WebSocket){

        const data = {
            type : "gotConnected"
        }
        socket1.send(JSON.stringify(data))
        sokcet2.send(JSON.stringify(data))
    }

    closeConn(socket : WebSocket , message : any){
        if(socket === this.user1.socket){   
            this.user2.send(JSON.stringify(message))
        }

        if(socket === this.user2){
            this.user1.socket.send(JSON.stringify(message))
        }
    }
}
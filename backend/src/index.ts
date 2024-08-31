import { WebSocketServer } from 'ws';
import { UserManager } from './managers/userManager';

const wss = new WebSocketServer({ port: 8080 });
const userManger = new UserManager()


wss.on('connection', function connection(ws) {
  
    userManger.addUser(ws)

});
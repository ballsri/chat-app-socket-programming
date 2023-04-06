import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('send_message')
  handleMessage(client: any, payload: any): void {
    console.log('Received message:', payload, 'from', client.id, 'to group : ', payload.group);
    this.server.to(payload.group).emit('broadcast_message', payload);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: any, group: string): void {
    console.log(client.id, 'joinRoom', group)
    client.join(group);
    client.emit('joinedRoom', group);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: any, group: string): void {
    console.log(client.id, 'leaveRoom', group)
    client.leave(group);
    client.emit('leftRoom', group);
  }
}

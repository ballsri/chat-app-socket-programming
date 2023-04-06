import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('send_message')
  handleMessage(client: any, payload: any): void {
    console.log('Received message:', payload);
    this.server.to(payload.group).emit('broadcast_message', payload);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: any, group: string): void {
    console.log('joinRoom', group)
    client.join(group);
    client.emit('joinedRoom', group);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: any, group: string): void {
    console.log('leaveRoom', group)
    client.leave(group);
    client.emit('leftRoom', group);
  }
}

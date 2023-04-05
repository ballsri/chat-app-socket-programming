import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class MessageGateway {
  @WebSocketServer() server: Server;

  @SubscribeMessage('send_message')
  handleMessage(client: any, payload: any): void {
    console.log('Received message:', payload);
    this.server.emit('broadcast_message', payload);
  }
}

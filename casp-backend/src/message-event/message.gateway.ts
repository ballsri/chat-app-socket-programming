import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { OnModuleInit } from '@nestjs/common';
import { Server } from 'socket.io';
import { MessageDto } from 'src/dtos/entities/message.dto';
import { NumberUserDto } from 'src/dtos/number.users.dto';
import { MessageService } from 'src/message-event/message.service';
import { v4 as uuidv4 } from 'uuid';
import { GroupService } from 'src/groups/group.service';
@WebSocketGateway()
export class MessageGateway implements OnModuleInit {
  constructor(
    private readonly messageService: MessageService,
    private readonly groupService: GroupService,
  ) {}

  public numberOfUsers = 0;
  public numberOfUsersPerGroup = {};

  // initiate number of user per group
  async onModuleInit() : Promise<void> {
    const groups = await this.groupService.getAllGroups();
    groups.forEach((group) => {
      this.numberOfUsersPerGroup[group.id] = 0;
    });
  }

  @WebSocketServer() server: Server;

  @SubscribeMessage('send_message')
  async handleMessage(client: any, payload: any): Promise<void> {
    console.log(
      'Received message:',
      payload,
      'from',
      client.id,
      'to group : ',
      payload.group,
    );

    const message = new MessageDto(
      uuidv4(),
      payload.message.text,
      payload.message.sent_at,
      payload.message.user_id,
      payload.message.name,
    );

    // store message in redis
    try {
      await this.messageService.storeMessage(
        payload.group + ':' + message.id,
        JSON.stringify(message),
      );
    } catch (error) {
      console.log(error);
    }

    this.server.to(payload.group).emit('broadcast_message', payload);
  }

  @SubscribeMessage('joinRoom')
  public joinRoom(client: any, group: string): void {
    // console.log(client.id, 'joinRoom', group);

    if (this.numberOfUsersPerGroup[group]) {
      this.numberOfUsersPerGroup[group]++;
    } else {
      this.numberOfUsersPerGroup[group] = 1;
    }

    // create schema for numberOfUser
    const numberOfUser = new NumberUserDto(
      this.numberOfUsers,
      this.numberOfUsersPerGroup,
    );

    client.join(group);
    client.emit('joinedRoom', group);
    client.emit('numberOfUsers', numberOfUser);
  }

  @SubscribeMessage('leaveRoom')
  public leaveRoom(client: any, group: string): void {
    // console.log(client.id, 'leaveRoom', group);
    if (this.numberOfUsersPerGroup[group]) {
      this.numberOfUsersPerGroup[group]--;
    }

    // create schema for numberOfUser
    const numberOfUser = new NumberUserDto(
      this.numberOfUsers,
      this.numberOfUsersPerGroup,
    );

    client.leave(group);
    client.emit('leftRoom', group);
    client.emit('numberOfUsers', numberOfUser);
  }

  @SubscribeMessage('numberOfUsers')
  public sendNumberOfUsers(client: any): void {
    // create schema for numberOfUser
    const numberOfUser = new NumberUserDto(
      this.numberOfUsers,
      this.numberOfUsersPerGroup,
    );

    client.emit('numberOfUsers', numberOfUser);
  }

  public handleConnection(client: any, ...args: any[]): any {
    console.log('Client connected:', client.id);
    this.numberOfUsers++;
    // create schema for numberOfUser
    const numberOfUser = new NumberUserDto(
      this.numberOfUsers,
      this.numberOfUsersPerGroup,
    );
    this.server.emit('numberOfUsers', numberOfUser);
  }

  public handleDisconnect(client: any): any {
    console.log('Client disconnected:', client.id);
    this.numberOfUsers--;
    // create schema for numberOfUser
    const numberOfUser = new NumberUserDto(
      this.numberOfUsers,
      this.numberOfUsersPerGroup,
    );
    this.server.emit('numberOfUsers', numberOfUser);
  }
}

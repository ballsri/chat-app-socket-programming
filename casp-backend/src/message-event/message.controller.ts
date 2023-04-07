import { Controller, Post, Get, Body, Param } from '@nestjs/common';

import { ResponseDto } from '../dtos/response.dto';
import { MessageService } from './message.service';

@Controller('api/v1/messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @Get('/:id')
  async getAllMessageFromGroupId(@Param() params) {
    try {
      // console.log(params.id)
      let messages = await this.messageService.getAllMessagesByGroupId(
        params.id,
      );

      messages = messages.map((message) => {
        return JSON.parse(message);
      });

      return new ResponseDto(true, 'Get all messages Successful', messages);
    } catch (error) {
      return new ResponseDto(false, error.message, null);
    }
  }
}

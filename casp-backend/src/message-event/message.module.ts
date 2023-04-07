import { Module } from '@nestjs/common';
import { GroupModule } from 'src/groups/group.module';
import { MessageController } from './message.controller';
import { MessageGateway } from './message.gateway';
import { MessageService } from './message.service';

@Module({
  imports: [GroupModule],
  controllers: [MessageController],
  providers: [MessageGateway, MessageService],
})
export class MessageModule {}

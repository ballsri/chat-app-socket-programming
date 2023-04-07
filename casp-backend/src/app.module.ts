import { Module } from '@nestjs/common';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './groups/group.module';
import { MessageService } from './message-event/message.service';
import { MessageModule } from './message-event/message.module';

@Module({
  imports: [DatabaseModule, AuthModule, GroupModule, MessageModule],
  controllers: [],
  providers: [ MessageService],
  
})
export class AppModule {}

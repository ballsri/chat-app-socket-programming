import { Module } from '@nestjs/common';
import { MessageGateway } from './message-event/message.gateway';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';
import { GroupModule } from './groups/group.module';

@Module({
  imports: [DatabaseModule, AuthModule, GroupModule],
  controllers: [],
  providers: [MessageGateway],
  
})
export class AppModule {}

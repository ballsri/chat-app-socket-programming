import { Module } from '@nestjs/common';
import { MessageGateway } from './message-event/message.gateway';
import { DatabaseModule } from './database.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: '.env',
    isGlobal: true,
  }),DatabaseModule, AuthModule],
  controllers: [],
  providers: [MessageGateway],
  
})
export class AppModule {}

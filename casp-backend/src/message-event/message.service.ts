import { Injectable } from '@nestjs/common';
import {createClient} from 'redis';

@Injectable()
export class MessageService {
  private readonly redisClient = createClient({
    url: "redis://localhost:6379",
  });
  async connect() {
    await this.redisClient.connect();
    }

    async disconnect() {
        await this.redisClient.disconnect();
    }
    
  

    async storeMessage(key: string, message: string): Promise<string> {
        await this.connect();
        let status = await this.redisClient.set(key, message)
        await this.disconnect();
        return status;
  }

    async getMessageByKey(key: string): Promise<string> {
        await this.connect();
        let message = await this.redisClient.get(key);
        await this.disconnect();
        return message;

    }

    async getAllMessagesByGroupId(gId: string): Promise<string[]> {
        await this.connect();
        const key = await this.redisClient.keys(gId + ':*');
        const messages = await Promise.all(
            key.map(async (k) => {
                return await this.redisClient.get(k);
            }),
        );
        await this.disconnect();

        return messages;
    }
  
}

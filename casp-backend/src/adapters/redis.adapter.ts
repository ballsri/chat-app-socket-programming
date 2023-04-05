import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { Server } from 'socket.io';

const httpServer = require('http').createServer();
const io = new Server(httpServer, { cors: { origin: process.env.FRONTEND_URL, credentials: true, allowedHeaders: ['Content-Type', 'Authorization'] } });

const pubClient = createClient({ url: process.env.REDIS_URL });
const subClient = pubClient.duplicate();

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    io.listen(3004);
})
  


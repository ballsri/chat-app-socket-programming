import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected to server');
});

socket.on('message', (message: string) => {
  console.log('Received message:', message);
});

socket.emit('message', 'Hello server');

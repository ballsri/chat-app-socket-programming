import io from 'socket.io-client';
export default defineNuxtPlugin( () => {
  // now available on `nuxtApp.$injected`
  const socket = io('http://localhost:3004', {
    withCredentials: true,
    extraHeaders: {
      "Content-Type": "application/json"
    },
    transports: ['websocket']
  });
  return {
    provide: {
      io: socket,
      hello: (msg:string) => 'Hello ' + msg + '!'
    }
  }
})

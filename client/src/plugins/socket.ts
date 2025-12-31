import { io, Socket } from "socket.io-client";

const socket: Socket = io(`http://10.0.2.147` as string, {
  path: "/igeam/socket.io",
  transports: ["websocket"],
});

export default socket;

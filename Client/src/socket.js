import { io } from "socket.io-client";

const socket = io("https://ecoswap-e24p.onrender.com"); // Or your server URL

export default socket;

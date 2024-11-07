import { io } from "socket.io-client";
import { SERVER_URL } from "./constants";

// export const socket = io(SERVER_URL, { withCredentials: true });
export const socket = io(SERVER_URL);

import { Server, Socket } from "socket.io";
import logger from "../utils/logger";

const socketHandler = (io: Server): void => {
    io.on("connection", (socket: Socket) => {
        logger(`Client connected: ${socket.id}`);

        socket.on("join-room", ({ roomId, userName }) => {
            socket.join(roomId);

            socket.data.userName = userName;

            socket.to(roomId).emit("user-joined", {
                socketId: socket.id,
                userName,
            });

            logger(`${userName} joined room: ${roomId}`);
        });

        socket.on("offer", ({ offer, roomId }) => {
            logger(`Forwarding offer to room: ${roomId}`);

            socket.to(roomId).emit("receive-offer", {
                offer,
                socketId: socket.id,
            });
        });

        socket.on("answer", ({ answer, roomId }) => {
            logger(`Forwarding answer to room: ${roomId}`);

            socket.to(roomId).emit("receive-answer", {
                answer,
                socketId: socket.id,
            });
        });

        socket.on("disconnect", () => {
            logger(`Client disconnected: ${socket.id}`);
        });
    });
};

export default socketHandler;
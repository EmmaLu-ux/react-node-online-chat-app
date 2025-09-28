import { Server } from "socket.io"

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.ORIGIN_HTTPS,
            methods: ['GET', 'POST'],
            credentials: true
        }
    })

    const userSocketMap = new Map()

    const disconnect = (socket) => {
        console.log('客户端已断开连接：', socket.id)
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId)
                break
            }
        }
    }

    io.on("connection", (socket) => {
        console.log('Socket.js --- ', socket)
        const userId = socket.handshake.query.userId

        if (userId) {
            userSocketMap.set(userId, socket.id)
            console.log(`userId: ${userId}, socket.id: ${socket.id}`)
        } else {
            console.log('用户ID没有提供！')
        }

        socket.on("disconnect", () => disconnect(socket))
    })
}

export default setupSocket
import { Server } from "socket.io"
import Message from "./models/MessagesModel.js"
import Group from "./models/GroupModel.js"

const setupSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: [process.env.ORIGIN_HTTP, process.env.ORIGIN_HTTPS],
            methods: ['GET', 'POST'],
            credentials: true
        },
        // transports: ["websocket"]
    })

    const userSocketMap = new Map()

    /**
     * @param {*} socket 
     * @param {*} reason transport close：刷新/关闭页面；或 client namespace disconnect：客户端主动断开
     */
    const disconnect = (socket, reason) => {
        console.log('客户端已断开连接：', socket.id, reason)
        for (const [userId, socketId] of userSocketMap.entries()) {
            if (socketId === socket.id) {
                userSocketMap.delete(userId)
                break
            }
        }
    }

    const sendMessage = async (message) => {
        const senderSocketId = userSocketMap.get(message.sender)
        const recipientSocketId = userSocketMap.get(message.recipient)
        // console.log('Ids=sendMessage', senderSocketId, recipientSocketId)

        const createMessage = await Message.create(message)
        // populate: 填充关联字段 sender/recipient 的数据
        const messageData = await Message.findById(createMessage._id)
            .populate("sender", "id email username image color")
            .populate("recipient", "id email username image color")
        // console.log('messageData: ', messageData)

        if (recipientSocketId) { // 用户在线
            // .to: 指定消息要发送给哪个客户端
            io.to(recipientSocketId).emit("receiveMessage", messageData)
        }
        if (senderSocketId) { // 给自己发一份
            io.to(senderSocketId).emit("receiveMessage", messageData)
        }
    }
    const sendGroupMessage = async (message) => {
        const { sender, groupId, content, messageType, fileUrl } = message

        // 不设置 recipient 字段，避免将空字符串写入 ObjectId 字段导致 Cast 错误
        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            fileUrl,
            timestamp: new Date(),
        })
        // populate: 填充关联字段 sender/recipient 的数据
        const messageData = await Message.findById(createdMessage._id)
            .populate("sender", "id email username image color")
            .exec()
        console.log('sendGroupMessage-messageData', messageData)

        await Group.findByIdAndUpdate(groupId, {
            $push: {
                messages: createdMessage._id
            },
        })

        const group = await Group.findById(groupId).populate("members")
        console.log('sendGroupMessage-group', group)

        const finalData = { ...messageData._doc, groupId: group._id.toString() }

        console.log('sendGroupMessage-finalData', finalData)

        if (group) {
            const memberIds = (group.members || []).map(m =>
                m && m._id ? m._id.toString() : (m ? m.toString() : undefined)
            ).filter(Boolean)
            const adminIds = (group.admin || []).map(a =>
                a && a._id ? a._id.toString() : (a ? a.toString() : undefined)
            ).filter(Boolean)

            const targetIds = Array.from(new Set([...memberIds, ...adminIds]))

            targetIds.forEach(id => {
                const socketId = userSocketMap.get(id)
                if (socketId) {
                    io.to(socketId).emit("receiveGroupMessage", finalData)
                }
            })
        }
    }

    // NOTE: 向客户端建立连接
    io.on("connection", (socket) => {
        // console.log('Socket.js --- ', socket.rooms)
        const userId = socket.handshake.query.userId

        if (userId) {
            userSocketMap.set(userId, socket.id)
            console.log(`userId: ${userId}, socket.id: ${socket.id}`)
        } else {
            console.log('在建立连接过程中，用户ID没有提供！')
        }

        socket.on("sendMessage", sendMessage)
        socket.on("sendGroupMessage", sendGroupMessage)

        socket.on("disconnect", (reason) => disconnect(socket, reason))
    })
}

export default setupSocket

import mongoose, { mongo } from "mongoose";

const messageSchema = new mongoose.Schema({
    // 发送方
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    // 接收方
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: false,
    },
    // 消息类型：文本/文件
    messageType: {
        type: String,
        enum: ['text', 'file'],
        required: true
    },
    // 消息内容
    content: {
        type: String,
        required: function () {
            return this.messageType === 'text'
        }
    },
    // 文件 URL
    fileUrl: {
        type: String,
        required: function () {
            return this.messageType === 'file'
        }
    },
    // 发送时间
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model('Messages', messageSchema)

export default Message
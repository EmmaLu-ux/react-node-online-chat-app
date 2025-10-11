import mongoose, { mongo } from "mongoose";

const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        }
    ],
    admin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages",
            required: false,
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

const Message = mongoose.model('Messages', messageSchema)

export default Message
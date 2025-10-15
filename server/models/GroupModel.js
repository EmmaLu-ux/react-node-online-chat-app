import mongoose, { mongo } from "mongoose";

const groupSchema = new mongoose.Schema({
    // 群聊名称
    name: {
        type: String,
        required: true,
    },
    // 成员
    members: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        }
    ],
    // 管理员
    admin: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        }
    ],
    // 消息
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages",
            required: false,
        }
    ],
    // 群聊创建时间
    createdAt: {
        type: Date,
        default: Date.now,
    },
    // 群聊更新时间
    updatedAt: {
        type: Date,
        default: Date.now,
    }
})

groupSchema.pre("save", function (next) {
    this.updatedAt = Date.now()
    next()
})
groupSchema.pre("findOneAndUpdate", function (next) {
    this.set({
        updatedAt: Date.now()
    })
    next()
})

groupSchema.set('toJSON', {
    virtuals: true,
    transform: (_doc, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
    },
});

const Group = mongoose.model('Group', groupSchema)

export default Group
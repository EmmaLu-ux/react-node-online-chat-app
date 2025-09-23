import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt"

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required."]
    },
    username: {
        type: String,
        required: false,
        trim: true,
        default: undefined,
    },
    image: {
        type: String,
        required: false
    },
    color: {
        type: Number,
        required: false
    },
    // 在首次登陆后需要修改个人资料，否则无法使用聊天功能
    profileSetup: {
        type: Boolean,
        required: false
    },
})

userSchema.index({ username: 1 }, { unique: true, sparse: true }) // 只有确实存在该字段、且值不为 null 的文档才写入索引。缺字段或值为 null 的文档会被跳过。两者组合成“稀疏唯一索引”后，就只对真实有值的记录做唯一性校验；允许多条记录缺字段或为 null，但一旦填入非空值就必须保持唯一。可以避免多个用户还没设置 username 时因为默认 null 冲突，同时在有人填写用户名时仍然保证不会重复。

userSchema.pre("save", async function (next) {
    // if (!this.isModified("password")) return next()

    const salt = await genSalt()
    this.password = await hash(this.password, salt)
    next()
})

const User = mongoose.model("Users", userSchema)

export default User

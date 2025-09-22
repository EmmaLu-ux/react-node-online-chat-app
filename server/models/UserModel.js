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
        unique: true
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

userSchema.pre('save', async function (next) {
    // 加密数据
    const salt = genSalt()
    this.password = await hash(this.password, salt)
    next()
})

const User = mongoose.model("Users", userSchema)

export default User
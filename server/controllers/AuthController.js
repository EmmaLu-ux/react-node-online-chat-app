import { compare } from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"
// import multer from "multer" // 引入文件上传的包 Node.js中间件，用于处理 multipart/form-data 类型的数据。它无法处理任何非 multipart/form-data 类型的表单数据，就是没办法处理base64位的数据
import { existsSync, renameSync, unlinkSync } from "fs"


const maxAge = 3 * 24 * 60 * 60 * 1000 // 3天
// 根据环境动态设置 Cookie 属性：
// - 开发环境（HTTP、本地）：secure=false, sameSite=lax（Safari/Chrome 都会在 XHR 中携带）
// - 生产环境（HTTPS、可能跨站）：secure=true, sameSite=none（允许跨站携带）
const isProd = process.env.NODE_ENV === "production"
const cookieOptions = {
    maxAge,
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
}
const createToken = (email, userId) => {
    return jwt.sign(
        { email, userId },
        process.env.JWT_KEY,
        { expiresIn: Math.floor(maxAge / 1000) }
    )
}

export const signup = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send("Email and Password is required.")
        }
        const user = await User.create({ email, password })

        res.cookie("token", createToken(email, user.id), cookieOptions)
        return res.status(201).json({
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                image: user.image,
                color: user.color,
                profileSetup: user.profileSetup,
            }
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

/**
 * 用户登录
 *
 * 行为：
 * - 校验请求体中是否包含 `email` 与 `password`。
 * - 按 `email` 查找用户，不存在则返回 404。
 * - 使用 bcrypt 对比明文密码与已加密密码，不匹配返回 401。
 * - 成功后签发 JWT，并通过 `res.cookie` 设置到 httpOnly Cookie `token`（有效期 3 天，`secure`/`sameSite` 随环境调整）。
 * - 返回已脱敏的用户信息（不包含密码）。
 *
 * 前置条件：
 * - 已正确配置 `process.env.JWT_KEY`、`NODE_ENV` 与跨域相关设置。
 *
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 * @param {import('express').NextFunction} next Express next 函数
 * @returns {Promise<void>} 登录成功时以 201 返回 `{ user: { id, email, username, image, color, profileSetup } }`
 *
 * @example
 * // POST /api/auth/login
 * // body: { "email": "alice@example.com", "password": "secret" }
 * // 201 响应: { user: { id, email, username, image, color, profileSetup } }
 *
 * @status 400 缺少 email 或 password
 * @status 404 邮箱不存在
 * @status 401 密码错误
 * @status 201 登录成功并设置 Cookie
 * @status 500 服务器内部错误
 */
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).send("Email and Password is required.")
        }
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).send("User with the given email not found.")
        }
        const auth = await compare(password, user.password)
        if (!auth) {
            return res.status(401).send("密码错误")
        }

        res.cookie("token", createToken(email, user.id), cookieOptions)
        return res.status(201).json({
            user
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

export const getUserInfo = async (req, res, next) => {
    try {
        // console.log('getUserInfo-userid', req.userId)
        const userData = await User.findById(req.userId)
        if (!userData) return res.status(404).send("该用户的相关数据不存在！")
        return res.status(201).json({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            image: userData.image,
            color: userData.color,
            profileSetup: userData.profileSetup,

        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

export const updateProfile = async (req, res, next) => {
    try {
        console.log('updateProfile-userid', req.userId)
        const { userId } = req
        const { username, color } = req.body
        const allowedColors = [0, 1, 2, 3]
        if (
            !username?.trim() ||
            typeof color !== "number" ||
            !allowedColors.includes(color)
        ) {
            return res.status(400).send("用户名/颜色是必填的！")
        }
        // new: true 意味着返回的数据是更新后的，否则会返回更新前的旧数据
        // runValidators: true 意味着会校验客户端传过来的数据是否符合 schema 定义的格式
        const userData = await User.findByIdAndUpdate(userId, { username, color, profileSetup: true }, { new: true, runValidators: true })
        return res.status(201).json({
            id: userData.id,
            email: userData.email,
            username: userData.username,
            image: userData.image,
            color: userData.color,
            profileSetup: userData.profileSetup,
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

export const addProfileImage = async (req, res, next) => {
    try {
        console.log("server-req", req.file)
        if (!req.file) return res.status(400).send("请上传图像！")
        const date = Date.now()
        const originalFileName = Buffer.from(req.file.originalname, "latin1").toString("utf8")
        const fileName = "uploads/profiles/" + date + originalFileName
        renameSync(req.file.path, fileName) // renameSync(原路径, 新路径) 会把临时文件移动并重命名到 fileName 位置，相当于 mv old new。
        const { userId } = req
        const updatedUser = await User.findByIdAndUpdate(userId, { image: fileName }, { new: true, runValidators: true })
        // console.log('updatedUser', updatedUser)
        return res.status(201).json({
            image: updatedUser.image,
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

export const removeProfileImage = async (req, res, next) => {
    try {
        const { userId } = req
        const user = await User.findById(userId)

        if (!user) return res.status(404).send("用户不存在！")
        if (user.image && existsSync(user.image)) {
            unlinkSync(user.image) // 它会立即把指定路径上的文件从文件系统里移除，不返回任何值
        }
        user.image = null
        await user.save()

        return res.status(200).json({
            message: "用户头像删除成功！"
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

export const logout = async (req, res, next) => {
    try {
        // 清除 cookie：设置为空值并立即过期，属性需与设置时保持兼容
        res.cookie("token", "", { ...cookieOptions, maxAge: 1 })

        return res.status(200).json({
            message: "退出登录成功！"
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

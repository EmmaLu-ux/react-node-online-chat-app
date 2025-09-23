import { compare } from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"
// import { verifyToken } from "../middlewares/AuthMiddleware.js"


const maxAge = 3 * 24 * 60 * 60 * 1000 // 3天
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

        res.cookie("token",
            createToken(email, user.id),
            {
                maxAge,
                // httpOnly: true, // TODO:
                secure: false, // 表示 cookie 只能通过 HTTPS 传输，防止明文泄露；如果本地开发还没走 HTTPS，浏览器不会保存这个 cookie，需要在开发环境改成 false。
                sameSite: "none", // 允许跨站请求携带这个 cookie（方便前端跨域访问），此时必须配合 secure: true 才被现代浏览器接受。
            }
        )
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

        res.cookie("token",
            createToken(email, user.id),
            {
                maxAge,
                // httpOnly: true, // TODO:
                secure: true, // 表示 cookie 只能通过 HTTPS 传输，防止明文泄露；如果本地开发还没走 HTTPS，浏览器不会保存这个 cookie，需要在开发环境改成 false。
                sameSite: "none", // 允许跨站请求携带这个 cookie（方便前端跨域访问），此时必须配合 secure: true 才被现代浏览器接受。
            }
        )
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

export const getUserInfo = async (req, res, next) => {
    try {
        // console.log('userid', req.userId)
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
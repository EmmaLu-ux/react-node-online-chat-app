import User from "../models/UserModel.js"
import jwt from "jsonwebtoken"

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
                // httpOnly: true,
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

import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import https from "https"
import fs from "fs"
import authRoutes from "./routes/AuthRoutes.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 3001
const databaseURL = process.env.DATABASE_URL
// const sslOptions = {
//     key: fs.readFileSync(process.env.SSL_KEY_PATH),
//     cert: fs.readFileSync(process.env.SSL_CERT_PATH)
// }

app.use(cors({
    origin: [process.env.ORIGIN_HTTP, process.env.ORIGIN_HTTPS], // 允许的来源，可以有多个
    credentials: true, // 开启凭证支持
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}))

/**
 * 当客户端请求 /uploads/profiles 地址时，会去 uploads/profiles 静态资源目录中去寻找资源
 * 静态资源目录：uploads/profiles，里面的资源可以直接用 HTTP GET 访问
 */
app.use("/uploads/profiles", express.static("uploads/profiles"))

/**
 * 加载 cookie-parser 中间件，把请求头里的 Cookie 字符串解析成对象挂到 req.cookies，方便读取或校验用户的 cookie。
 */
app.use(cookieParser())
/**
 * 启用内置 JSON 解析中间件，自动把 Content-Type: application/json 的请求体解析成对象挂到 req.body，便于后续处理提交的数据。
 */
app.use(express.json())

app.use("/api/auth", authRoutes)

// HTTP 连接
const server = app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
// HTTPS 连接
// const server = https.createServer(sslOptions, app).listen(port, () => {
//     console.log(`Server is running on https://localhost:${port}`)
// })

mongoose.connect(databaseURL).then(() => {
    console.log(`DB connection successfully.`)
}).catch(error => {
    console.log(error.message)
})

import Message from "../models/MessagesModel.js"
import { mkdirSync, renameSync } from "fs"

export const getMessages = async (req, res, next) => {
    try {
        const user1 = req.userId
        const user2 = req.body.id

        console.log('user1: ', user1, 'user2: ', user2)

        if (!user1 || !user2) {
            return res.status(400).send('Bad Request: Missing user ID')
        }

        const messages = await Message.find({
            $or: [
                {
                    sender: user1,
                    recipient: user2
                },
                {
                    sender: user2,
                    recipient: user1
                }
            ]
        }).sort({ timestamp: 1 }) // 按时间升序排列
        return res.status(200).json({
            messages
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

export const uploadFile = async (req, res, next) => {
    try {
        if (!req.file) return res.status(400).send('请上传文件')

        const date = Date.now()
        const originalFileName = Buffer.from(req.file.originalname, "latin1").toString("utf8")
        const fileName = "uploads/files/" + date + "-" + originalFileName

        // 确保目标目录存在
        mkdirSync('uploads/files', { recursive: true })
        // 将临时文件移动到目标目录
        renameSync(req.file.path, fileName)

        return res.status(200).json({
            filePath: fileName
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

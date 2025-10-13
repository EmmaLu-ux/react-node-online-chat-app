import mongoose from "mongoose"
import User from "../models/UserModel.js"
import Message from "../models/MessagesModel.js"

/**
 * 搜索联系人（用户名或邮箱，大小写不敏感）。
 *
 * 行为：
 * - 对 `searchTerm` 做正则转义，避免正则注入。
 * - 使用不区分大小写的正则在 `username` 与 `email` 字段上进行模糊匹配。
 * - 过滤掉当前登录用户自身（根据 `req.userId`）。
 *
 * 前置条件：`verifyToken` 中间件已验证并将 `userId` 挂载到 `req.userId`。
 *
 * @param {import('express').Request} req Express 请求对象
 * @param {import('express').Response} res Express 响应对象
 * @param {import('express').NextFunction} next Express next 函数
 * @returns {Promise<void>} 成功时返回形如 `{ contacts: ContactResult[] }`
 *
 * @typedef {Object} ContactResult
 * @property {string} id 用户ID（字符串）
 * @property {string} email 邮箱
 * @property {string=} username 用户名
 * @property {string=} image 头像路径（相对路径，可与静态前缀拼接访问）
 * @property {number=} color 头像占位颜色索引
 *
 * @example
 * // POST /api/contacts/search
 * // body: { "searchTerm": "alice" }
 * // response: { contacts: [ { id, email, username, image, color }, ... ] }
 */
export const searchContacts = async (req, res, next) => {
    try {
        const { searchTerm } = req.body
        console.log('searchTerm', searchTerm)

        if (searchTerm === undefined || searchTerm === null) { }
        const senitizedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        const regex = new RegExp(senitizedSearchTerm, "i")

        const contacts = await User.find({
            $and: [
                {
                    _id: { $ne: new mongoose.Types.ObjectId(req.userId) }
                },
                {
                    $or:
                        [{ username: regex }, { email: regex }]
                }
            ]
        })
        // console.log('contacts', contacts)

        return res.status(200).json({
            contacts
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}


/**
 * 获取与当前用户有过私聊往来的联系人列表（按最近消息时间倒序）。
 *
 * 聚合逻辑概述：
 * 1) 在 Messages 集合中匹配出 sender 或 recipient 为当前用户(req.userId)的消息。
 * 2) 按时间倒序排序，保证后续 $first 能拿到每个会话的最新时间。
 * 3) 使用 $group 以“对方用户”为 key 分组（若当前用户是 sender，则 key 取 recipient，反之取 sender），
 *    聚合出每个联系人的 lastMessageTime。
 * 4) 通过 $lookup 关联 users 集合，补齐联系人基础信息（email/username/image/color）。
 * 5) 组装返回字段，并按 lastMessageTime 再次倒序排序。
 *
 * 前置条件：需要 AuthMiddleware.verifyToken 将 userId 挂到 req 上。
 *
 * @param {import('express').Request} req Express 请求对象（需包含 req.userId）
 * @param {import('express').Response} res Express 响应对象
 * @param {import('express').NextFunction} next Express next 函数
 * @returns {Promise<void>} 返回形如 { contacts: Array<ContactSummary> }
 *
 * @typedef {Object} ContactSummary
 * @property {string} id 联系人用户ID（字符串）
 * @property {string} email 联系人邮箱
 * @property {string=} username 联系人昵称
 * @property {string=} image 头像文件路径（相对路径，可拼接静态前缀访问）
 * @property {number=} color 头像占位颜色索引
 * @property {Date} lastMessageTime 最近一条双向消息时间
 *
 * @example
 * // GET /api/contacts/get-contacts-for-dm
 * // 响应: { contacts: [ { id, email, username, image, color, lastMessageTime }, ... ] }
 */
export const getContactsForDMList = async (req, res, next) => {
    try {
        let { userId } = req
        userId = new mongoose.Types.ObjectId(userId)

        const contacts = await Message.aggregate([
            {
                $match:
                {
                    $or:
                        [{ sender: userId }, { recipient: userId }]
                },
            },
            {
                $sort: { timestamp: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$sender", userId] },
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessageTime: { $first: "$timestamp" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id: 0,
                    id: { $toString: "$_id" },
                    lastMessageTime: 1,
                    email: "$contactInfo.email",
                    username: "$contactInfo.username",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color",
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ])

        return res.status(200).json({
            contacts
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

/**
 * 获取所有可选联系人（用于前端下拉/多选控件）。
 *
 * 行为：
 * - 从 `users` 集合读取除当前登录用户之外的所有用户。
 * - 仅投影必要字段（`username`, `id`, `email`）。
 * - 将用户映射为前端组件友好的选项结构：`{ label, value }`，
 *   其中 `label` 优先使用 `username`，若无则回退到 `email`，`value` 为用户 `id`。
 *
 * 前置条件：上游认证中间件已将当前用户 ID 挂载到 `req.userId`。
 *
 * @param {import('express').Request} req Express 请求对象（需包含 `req.userId`）
 * @param {import('express').Response} res Express 响应对象
 * @param {import('express').NextFunction} next Express next 函数
 * @returns {Promise<void>} 成功返回 `{ contacts: Array<{ label: string, value: string }> }`
 *
 * @example
 * // GET /api/contacts/all
 * // 响应: { contacts: [ { label: "Alice", value: "<userId>" }, ... ] }
 */
export const getAllContacts = async (req, res, next) => {
    try {
        const users = await User.find({ id: { $ne: req.userId } },
            "username id email"
        )
        const contacts = users.map(user => ({
            label: user.username ?? user.email,
            value: user.id
        }))
        console.log('contacts', contacts)

        return res.status(200).json({
            contacts
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

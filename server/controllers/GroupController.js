import User from "../models/UserModel.js"
import Group from "../models/GroupModel.js"
import mongoose from "mongoose"

export const createGroup = async (req, res, next) => {
    try {
        const { name, members } = req.body

        const admin = await User.findById(req.userId)
        if (!admin) {
            return res.status(400).json({ message: "管理员用户没找到" })
        }

        const validMembers = await User.find({ _id: { $in: members } })
        // console.log('validMembers', validMembers)
        if (validMembers.length !== members.length) {
            return res.status(400).json({ message: "部分成员用户没找到" })
        }

        const newGroup = new Group({
            name,
            members,
            admin
        })

        await newGroup.save()

        // 统一返回结构，显式提供 `id`
        const group = {
            id: newGroup._id.toString(),
            name: newGroup.name,
            admin: newGroup.admin,
            members: newGroup.members,
            messages: newGroup.messages ?? [],
            createdAt: newGroup.createdAt,
            updatedAt: newGroup.updatedAt,
        }

        return res.status(201).json({ group })
    } catch (error) {
        next(error)
    }
}

/**
 * 获取当前用户相关的群组列表。
 *
 * 从数据库中查询当前登录用户作为群主（admin）或成员（members）参与的所有群组，
 * 按 `updatedAt` 倒序返回，并对结果做一次轻量映射，统一提供字符串类型的 `id` 字段，
 * 以便前端消费。
 *
 * 认证要求：
 * - 依赖上游认证中间件将 `req.userId` 注入到请求对象中。
 *
 * @param {import('express').Request} req Express 请求对象（需包含 `userId`）
 * @param {import('express').Response} res Express 响应对象
 * @param {import('express').NextFunction} next 错误处理中间件回调
 * @returns {Promise<void>} 通过 `res.status(201).json({ groups })` 返回结果
 *
 * 成功响应示例（status 201）：
 * {
 *   "groups": [
 *     {
 *       "id": "68eccd955e24979324b2e69a",
 *       "name": "前端交流群",
 *       "admin": "68e74c2e979a81018c099c4f",
 *       "members": ["..."],
 *       "messages": [],
 *       "createdAt": "2025-10-13T12:00:00.000Z",
 *       "updatedAt": "2025-10-14T08:20:00.000Z"
 *     }
 *   ]
 * }
 */
export const getUserGroups = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)
        const groups = await Group.find({
            $or: [{ admin: userId }, { members: userId }]
        })
            .sort({ updatedAt: -1 })

        return res.status(201).json({ groups })
    } catch (error) {
        next(error)
    }
}

export const getGroupMessages = async (req, res, next) => {
    try {
        const { groupId } = req.params
        console.log("🚀 ~ GroupController.js:92 ~ getGroupMessages ~ groupId:", groupId)
        const group = await Group.findById(groupId)
            .populate({
                path: "messages",
                populate: {
                    path: "sender",
                    select: "username email id image color"
                }
            })
        console.log("🚀 ~ GroupController.js:94 ~ getGroupMessages ~ group:", group)
        if (!group) return res.status(404).json({ message: "群组不存在" })

        const messages = group.messages

        return res.status(200).json({ messages })
    } catch (error) {
        next(error)
    }
}

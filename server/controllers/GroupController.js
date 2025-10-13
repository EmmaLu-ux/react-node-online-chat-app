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

export const getUserGroups = async (req, res, next) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.userId)
        const groups = await Group.find({
            $or: [{ admin: userId }, { members: userId }]
        })
            .sort({ updatedAt: -1 })
            .lean()

        // 统一返回结构，显式提供 `id`
        const mapped = groups.map(g => ({
            id: g._id.toString(),
            name: g.name,
            admin: g.admin,
            members: g.members,
            messages: g.messages ?? [],
            createdAt: g.createdAt,
            updatedAt: g.updatedAt,
        }))

        return res.status(201).json({ groups: mapped })
    } catch (error) {
        next(error)
    }
}

import mongoose from "mongoose"
import User from "../models/UserModel.js"
import Message from "../models/MessagesModel.js"

/**
 * 搜索联系人
 * @param {Object} req.body - 请求体
 * @param {string} req.body.searchTerm - 搜索关键词
 * @returns {Promise<Object>} - 搜索结果
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
        console.log('contacts', contacts)

        return res.status(200).json({
            contacts
        })
    } catch (error) {
        console.log({ error })
        return res.status(500).send('Internal Server Error')
    }
}

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

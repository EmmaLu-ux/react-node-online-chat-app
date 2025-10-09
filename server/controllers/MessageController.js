import Message from "../models/MessagesModel.js"

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
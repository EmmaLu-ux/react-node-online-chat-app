import User from "../models/UserModel.js"

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
                    id: { $ne: req.userId }
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
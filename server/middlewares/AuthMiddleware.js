import jwt from "jsonwebtoken"

export const verifyToken = (req, res, next) => {
    console.log(req.cookies)
    const token = req.cookies.token
    if (!token) return res.status(401).send("用户未授权")
    jwt.verify(token, process.env.JWT_KEY, async (err, playload) => {
        if (err) return res.status(403).send("Token无效")
        console.log('verifyToken-playload', playload)
        req.userId = playload.userId
        next()
    })
}
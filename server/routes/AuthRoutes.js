import { Router } from "express";
import { login, signup, getUserInfo, updateProfile, addProfileImage, removeProfileImage } from "../controllers/AuthController.js";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import multer from "multer";


const authRoutes = Router()
const upload = multer({ dest: "uploads/profiles" })

authRoutes.post("/signup", signup)
authRoutes.post("/login", login)
authRoutes.get("/user-info", verifyToken, getUserInfo)
authRoutes.post("/update-profile", verifyToken, updateProfile)
authRoutes.post(
    "/add-profile-image",
    verifyToken,
    upload.single("profile-image"), // 处理上传的单个文件。`profile-image` 是表单字段 name 的名称，用于指定要处理的文件。
    addProfileImage
)
authRoutes.delete("/remove-profile-image", verifyToken, removeProfileImage)

export default authRoutes
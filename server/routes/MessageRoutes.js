import { Router } from "express";
import multer from "multer";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { getMessages, uploadFile } from "../controllers/MessageController.js";

const messageRoutes = Router()
const upload = multer({ dest: 'uploads/files' });

messageRoutes.post("/get-messages", verifyToken, getMessages)
messageRoutes.post("/upload-file", verifyToken, upload.single('chat-file'), uploadFile)

export default messageRoutes
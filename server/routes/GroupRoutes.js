import { Router } from "express";
import { verifyToken } from "../middlewares/AuthMiddleware.js";
import { createGroup, getUserGroups } from "../controllers/GroupController.js";

const groupRoutes = Router()

groupRoutes.post("/create-group", verifyToken, createGroup)
groupRoutes.get("/get-user-groups", verifyToken, getUserGroups)

export default groupRoutes
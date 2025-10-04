
import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { uploadDocuments, getUserData } from "../controllers/userController.js";
import { getDocumentChatHistory } from "../controllers/userController.js";
import { getUpcomingEvents } from "../controllers/userController.js";
const userRouter = express.Router();

userRouter.post("/upload", userAuth, uploadDocuments);
userRouter.get("/data", userAuth, getUserData);
userRouter.get("/chat-history", userAuth, getDocumentChatHistory);
userRouter.get("/events", userAuth, getUpcomingEvents);

export default userRouter;
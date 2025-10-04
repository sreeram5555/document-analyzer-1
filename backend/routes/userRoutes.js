

import express from "express";
import userAuth from "../middleware/authMiddleware.js";
import { getuserdata } from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getuserdata);

export default userRouter;

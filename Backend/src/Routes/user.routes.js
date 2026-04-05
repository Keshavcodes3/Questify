import {registerUser,loginUser,getMe, updateProfileController, getUserStats} from "../Controllers/user.controller.js"
import express from 'express'
import { authUser } from "../Middlewares/user.middleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", authUser, getMe);
userRouter.patch('/:id',authUser,updateProfileController)
userRouter.get('/:id/badges',authUser,getUserStats)

export default userRouter
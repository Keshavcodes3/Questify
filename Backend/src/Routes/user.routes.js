import {registerUser,loginUser,getMe} from "../Controllers/user.controller.js"
import express from 'express'
import { authUser } from "../Middlewares/user.middleware.js";
const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me", authUser, getMe);



export default userRouter
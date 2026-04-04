import { createHabit,deleteHabit, completeHabit} from "../Controllers/habit.controller";
import express from 'express'
import { authUser } from "../Middlewares/user.middleware";
const habitRouter = express.Router();

habitRouter.post("/create",authUser, createHabit);
habitRouter.delete("/delete/:id", authUser,deleteHabit);
habitRouter.post("/complete/:id",authUser, completeHabit);


export default habitRouter
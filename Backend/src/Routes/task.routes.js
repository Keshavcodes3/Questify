import { authUser } from "../Middlewares/user.middleware";
import taskModel from "../Models/task.model";
import { completeOrIncompleteTask, createTask, deleteTask, getAllTaskOfToday, GetTaskStats, getWeeklyStats, updateTask } from "../Controllers/tasks.controller";

import express from 'express'

const taskRoutes=express.Router()


taskRoutes.post('/',authUser,createTask)

taskRoutes.post("/:id/toggle",authUser,completeOrIncompleteTask)

taskRoutes.patch('/:id',authUser,updateTask)

taskRoutes.delete('/:id',authUser,deleteTask)

taskRoutes.get('/stats',authUser,GetTaskStats)


taskRoutes.get('/weeklyStats',authUser,getWeeklyStats)

taskRoutes.get('/',authUser,getAllTaskOfToday)

export default taskRoutes


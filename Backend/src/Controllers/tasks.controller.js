import taskModel from "../Models/task.model";
import userModel from "../Models/user.model";
export const createTask = async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        const userId = req.user.id;
        const user = await userModel.findById(userId).select("+xp +badges +coins +level ")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        if (!title) {
            return res.status(400).json({
                message: "Title must provide",
                error: "Title is empty",
                error: null,
                success: false
            })
        }
        const Task = await taskModel.create({
            title, description, user: userId, priority, dueDate
        })
        const newTask = await Task.populate("user", "name")
        return res.status(200).json({
            message: "new Tasks created successfully",
            task: newTask

        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}


export const completeOrIncompleteTask = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId).select("+xp +badges +coins +level ")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const taskId = req.params.id;
        const Task = await taskModel.findById(taskId).select('+xpReward +coinReward +status')
        if (!Task) {
            return res.status(404).json({
                message: "Task not defined ",
                error: "Task not found",
                success: false
            })
        }
        //?Task completed -> set Not completed
        if (Task.completed) {
            Task.completed = false
            Task.status = "pending"
            user.xp -= Task.xpReward || 0
            user.coins -= Task.coinReward || 0
        } else {
            Task.completed = true
            Task.status = "completed"
            user.xp += Task.xpReward
            user.coins += Task.coinReward
            const today = new Date().toDateString()
            if (today - user.lastActiveDay === 1) {
                user.streak++;
            }
            else if (today - user.lastActiveDay > 1) {
                user.streak = 1
            }
            user.lastActiveDay = today
        }
        await Task.save()
        await user.save()
        return res.status(200).json({
            message: Task.completed ? "Task Completed successfully" : "Task undone marked",
            error: null,
            Task,
            success: false
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}


export const updateTask = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId).select("+xp +badges +coins +level ")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const taskId = req.params.id;
        if (!taskId) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        const Task = await taskModel.findById(taskId)
        if (!Task) {
            return res.status(404).json({
                message: "No task found",
                error: "Task is undefined",
                success: false
            })
        }
        const { title, description } = req.body
        if (title == "") {
            return res.status(400).json({
                message: "Title can't be empty"
            })
        }
        if (!title) {
            return res.status(400).json({
                message: "Title must provide",
                error: "Title is empty",
                error: null,
                success: false
            })
        }
        if (title) {
            Task.title = title
        }
        if (description) {
            Task.description = description
        }
        return res.status(200).json({
            message: "Task updated successfully",
            error: null,
            Task: Task,
            success: false
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}


export const deleteTask = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId).select("+xp +badges +coins +level ")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const taskId = req.params.id;
        if (!taskId) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }
        const Task = await taskModel.findById(taskId)
        if (!Task) {
            return res.status(404).json({
                message: "No task found",
                error: "Task is undefined",
                success: false
            })
        }
        if (Task.user.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this task"
            });
        }
        await taskModel.findByIdAndDelete(taskId)
        user.xp -= Task.xpReward || 0
        user.coins -= Task.coinReward || 0
        await user.save()

        return res.status(200).json({
            message: "Task deleted successfully",
            error: null,
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}


export const getAllTaskOfToday = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await userModel.findById(userId).select("+xp +badges +coins +level ")
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const pendingTasks = await taskModel.find({ user: userId, status: "pending" })
        const completedTasks = await taskModel.find({ user: userId, status: "completed" })
        return res.status(200).json({
            message: "All tasks of today",
            error: null,
            pendingTasks: pendingTasks,
            completedTasks:completedTasks,
            success: true
        })

    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}

export const GetTaskStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const TaskStats = await taskModel.countDocuments({ user: userId })
        const completedTask = await taskModel.countDocuments({
            completed: true,
            user: userId,

        })
        const pendingTask = await taskModel.countDocuments({
            status: "pending",
            user: userId
        })
        const completionRate = TaskStats === 0
            ? 0
            : Math.round((completedTask / TaskStats) * 100);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const todayCompleted = await taskModel.countDocuments({
            user: userId,
            completed: true, updatedAt: { $gte: startOfDay }
        })
        return res.status(200).json({
            message: "Task Stats fethced sucessfully",
            error: null,
            TotalTask: TaskStats,
            CompletedTask: completedTask,
            completionRate: completionRate,
            todayCompleted: todayCompleted,
            pendingTask: pendingTask
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}



export const getWeeklyStats = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId)
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const now = new Date();
        const weekStart = new Date();
        weekStart.setDate(now.getDate() - 7);
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const tasks = await taskModel.find({
            user: userId,
            updatedAt: { $gte: weekStart }
        })
        const weekTaskDaysMap = [
            {
                day: 'Sun',
                completedTask: 0,
                inCompletedTask: 0,
                completionRate: 0
            },
            {
                day: 'Mon',
                completedTask: 0,
                inCompletedTask: 0,
                completionRate: 0
            },
            {
                day: 'Tue',
                completedTask: 0,
                inCompletedTask: 0,
                completionRate: 0
            },
            {
                day: 'Wed',
                completedTask: 0,
                inCompletedTask: 0,
                completionRate: 0
            },
            {
                day: 'Thu',
                completedTask: 0,
                inCompletedTask: 0,
                completionRate: 0
            },
            {
                day: 'Fri',
                completedTask: 0,
                inCompletedTask: 0,
                completionRate: 0
            },
            {
                day: 'Sat',
                completedTask: 0,
                inCompletedTask: 0,
                completionRate: 0
            }
        ]
        tasks.forEach((task) => {
            const date = new Date(task.updatedAt).getDay();
            if (task.completed) {
                weekTaskDaysMap[date].completedTask++;
            } else {
                weekTaskDaysMap[date].inCompletedTask++;
            }
        })
        weekTaskDaysMap.forEach((taskObj) => {
            const totalTask = taskObj.completedTask + taskObj.inCompletedTask
            const completionRate = totalTask === 0 ? 0 : Math.round((taskObj.completedTask / totalTask) * 100)
            taskObj.completionRate = completionRate
        })


        //?Finding max Streak
        let maxStreak = 0;
        weekTaskDaysMap.forEach((task) => {
            let currrentStreak = 0;
            if (task.completionRate == 0) {
                currrentStreak = 0;
            } else {
                currrentStreak++;
                maxStreak = Math.max(maxStreak, currrentStreak)
            }
        })
        user.streak = maxStreak;
        await user.save()
        return res.status(200).json({
            message: "Weekly stats fetched",
            error: null,
            weekTaskDaysMap,
            maxStreak: maxStreak
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}





import taskModel from "../Models/task.model";
import userModel from "../Models/user.model";
export const createTask = async (req, res) => {
    try {
        const { title, description } = req.body;
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
            title, description, user: userId
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
        const Task = await taskModel.findById(taskId).select('+xpReward +coinReward +status' )
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
            user.coins -= Task.coinReward|| 0
        } else {
            Task.completed = true
            Task.status = "completed"
            user.xp += Task.xpReward
            user.coins += Task.coinReward
            const today=new Date().toDateString()
            if(today-user.lastActiveDay===1){
                user.streak++;
            }
            else if(today - user.lastActiveDay > 1){
                user.streak=1
            }
            user.lastActiveDay=today
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
        user.coins-=Task.coinReward || 0
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
import habitModel from "../Models/habit.model";
import userModel from "../Models/user.model";



export const createHabit = async (req, res) => {
    try {
        const userId = req.user.id;
        const { title, type, frequency } = req.body;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "No user found",
                error: "User does not exist",
                success: false
            })
        }
        const newHabit = await habitModel.create({ user: userId, title, type, frequency });
        return res.status(201).json({
            message: "Habit created successfully",
            success: true,
            data: newHabit
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message
        })
    }
}


export const completeHabit = async (req, res) => {
    try {
        const userId = req.user.id;
        const habitId = req.params.id;
        const user = await userModel.findById(userId)
        const habit = await habitModel.findById(habitId)
        if (!user) {
            return res.status(404).json({
                message: "No user found",
                error: "User does not exist",
                success: false
            })
        }
        if (!habit) {
            return res.status(404).json({
                message: "No habits found",
                error: "Habit does not exist",
                success: false
            })
        }
        if (habit.completed) {
            return res.status(400).json({
                message: "Habit already completed",
                error: "Habit already completed",
                success: false
            })
        }
        const habitXp = habit.xpReward
        const habitCoin = habit.coinReward
        user.xp += habitXp
        user.coins = habitCoin
        habit.streak += 1;
        const threshold = 100 * user.level + (Math.random() + 20) + (Math.random() + 2 - 1);
        if (threshold <= user.xp) {
            user.level += 1
            user.xp -= threshold
        }
        await user.save()
        await habit.save()
        const today = new Date().toDateString()
        if (habit.lastCompletedAt?.toDateString() === today) {
            return res.json({
                message: "Already completed today",
                error: null,
                success: true
            });
        }
        return res.status(201).json({
            message: "Habit Completed successfully",
            error: null,
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


export const deleteHabit = async (req, res) => {
    try {
        const userId = req.user.id;
        const habitId = req.params.id;
        const user = await userModel.findById(userId)
        const habit = await habitModel.findById(habitId)
        if (!user) {
            return res.status(404).json({
                message: "No user found",
                error: "User does not exist",
                success: false
            })
        }
        if (!habit) {
            return res.status(404).json({
                message: "No habits found",
                error: "Habit does not exist",
                success: false
            })
        }
        delete habit._id
        return res.status(201).json({
            message: "Habit deleted successfully",
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
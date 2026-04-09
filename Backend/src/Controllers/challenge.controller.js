import challengeModel from "../Models/challenge.model";
import userModel from "../Models/user.model";
import habitModel from "../Models/habit.model";



/**
 * 
 * Create a challenge
 */
export const createChallenge = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const NumberOfChallengesByUser = await challengeModel.countDocuments({ creator: userId });
        if (NumberOfChallengesByUser >= 3) {
            return res.status(400).json({
                message: "You have already completed 3 challenges",
                success: false,
                error: "You have already completed 3 challenges"
            })
        }
        let { title, description, startDate, duration, reward } = req.body
        if (!startDate) {
            startDate = new Date()
        }
        if (!title & !description & !duration & !reward) {
            return res.status(400).json({
                message: "Fields can't be empty",
                success: false,
                error: "Title / description / duration or reward cant be empty"
            })
        }
        const challenge = await challengeModel.create({
            title, description, startDate, duration, reward, creator: userId,
        })
        const today = new Date().toDateString()
        const habit = await habitModel.create({
            user: userId, title: title, type: "daily",

            duration: duration
        })
        user.challenges.push(challenge._id)
        challenge.participants.push({ user: userId })
        user.activeChallenges.push(challenge._id)
        await user.save()
        await challenge.save()
        return res.status(201).json({
            message: "Challenge created successfully",
            success: true,
            data: challenge,
            habit
        })
    }
    catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}



export const markHabitComplete = async (req, res) => {
    try {
        const userId = req.user.id;
        const habitId = req.params.id;

        const habit = await habitModel.findById(habitId);
        if (!habit) return res.status(404).json({ message: "Habit not found", success: false });

        if (habit.user.toString() !== userId) return res.status(403).json({ message: "Unauthorized", success: false });

        const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"

        if (habit.completed.days.includes(today)) {
            return res.status(400).json({ message: "Already marked today", success: false });
        }

        habit.completed.days.push(today);
        habit.lastCompletedAt = new Date();

        habit.streak += 1;

        await habit.save();
        return res.status(200).json({ message: "Habit marked completed for today", habit, success: true });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message, success: false });
    }
};





/**
 * Get All public challenges
 */

export const getAllActiveChallenges = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }

        const allActiveChallenges = await challengeModel.find()
        return res.status(200).json({
            message: "All challenges fetched successfully",
            error: null,
            success: true,
            challenges: allActiveChallenges
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}



/**
 * get challenges based on id (Get single challenge)
 */


export const getSingleChallange = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const challengeId = req.params.id;
        const challenge = await challengeModel.findById(challengeId)
            .populate("participants.user", "name email avatar");

        if (!challenge) {
            return res.status(401).json({
                message: "Challenge not found",
                success: false,
                error: "Challenges might be expired or deleted"
            })
        }
        return res.status(200).json({
            message: "Challenge details fetched successfully",
            error: null,
            challenge: challenge
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}


export const getMyJoinedChallenges = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const myActiveChallenges = await challengeModel.find({ "participants.user": userId }).select('title description duration')
        if (!myActiveChallenges || myActiveChallenges.length == 0) {
            return res.status(404).json({
                message: "No active challenges found",
                error: "you've not participated in any challenges"
            })
        }
        return res.status(200).json({
            message: "All active challenges fetched successfully",
            activeChallenges: myActiveChallenges,
            error: null,
            success: true
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}


export const joinAChallenge = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const doUserAlreadyJoined = user.activeChallenges.includes(req.params.id);
        if (doUserAlreadyJoined) {
            return res.status(400).json({
                message: "You have already joined this challenge",
                success: false,
                error: "You have already joined this challenge"
            })
        }
        const existingHabit = await habitModel.findOne({ user: userId, challenge: challengeId });
        if (existingHabit) return res.status(400).json({ message: "Challenge already joined", success: false });

        // Create a new habit for this challenge
        const habit = new habitModel({
            user: userId,
            title: challenge.title,
            type: 'daily', // or 'positive'
            duration: challenge.duration,
            xpReward: challenge.points,
            coinReward: challenge.coins || 0,
            challenge: challenge._id
        });

        await habit.save();
        const challengeId = req.paramd.id;
        const challenge = await challengeModel.findById(challengeId)

        if (!challenge) {
            return res.status(401).json({
                message: "Challenge not found",
                success: false,
                error: "Challenges might be expired or deleted"
            })
        }

        challenge.participants.push(userId)
        user.activeChallenges.push(challenge._id)
        await challenge.save();
        await user.save()
        return res.status(200).json({
            message: "Joined on the challenge successfully",
            success: true,
            error: null
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}

export const getMyCreatedChallenges = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const myCreatedChallenges = await challengeModel.find({ "creator": userId }).select('title description duration')
        if (!myCreatedChallenges || myCreatedChallenges.length == 0) {
            return res.status(404).json({
                message: "No active challenges found",
                error: "you've not created any challenges"
            })
        }
        return res.status(200).json({
            message: "All active challenges fetched successfully",
            challenges: myCreatedChallenges,
            error: null,
            success: false
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}

export const leaveAChallenge = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const challengeId = req.params.id;
        if (user.challenges.includes(challengeId)) {
            return res.status(400).json({
                message: "You can't leave a challenge you created",
                success: false,
                error: "Try to delete challenge instead"
            })
        }
        const challenge = await challengeModel.findById(challengeId)
        if (!challenge) {
            return res.status(401).json({
                message: "Challenge not found",
                success: false,
                error: "Challenges might be expired or deleted"
            })
        }

        const doUserJoined = await challengeModel.findOne({
            "participants.user": userId
        })
        if (!doUserJoined) {
            return res.status(404).json({
                message: "You must join a challenge to leave buddy",
                error: "You've not joined or challenge might have deleted",
                success: false
            })
        }
        await challengeModel.findByIdAndDelete(user._id)
        await userModel.findByIdAndUpdate(user._id, {
            $pull: {
                challenges: challengeId,
                activeChallenges: challengeId
            }
        })
        await challengeModel.findByIdAndUpdate(challengeId, {
            $pull: {
                participants: { user: user._id }
            }
        })
        return res.status(200).json({
            message: "Challenge Left Successfully",
            error: null,
            success: false
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}



export const deleteChallenge = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const challengeId = req.params.id;
        const challenge = await challengeModel.findById(challengeId)
        if (!challenge) {
            return res.status(401).json({
                message: "Challenge not found",
                success: false,
                error: "Challenges might be expired or deleted"
            })
        }
        if (user.challenges.includes(challengeId)) {
            return res.status(400).json({
                message: "You can't leave a challenge you created",
                success: false,
                error: "Try to delete challenge instead"
            })
        }
        if (challenge.creator !== userId) {
            return res.status(400).json({
                message: "You can't delete a challenge , you havenot created",
                error: "Ownership mismatched",
                success: false
            })
        }
        await challengeModel.findByIdAndDelete(challengeId)

        challenge.forEach(async (participant) => {
            challengeModel.findByIdAndUpdate(participant._id, {
                $pull: {
                    participants: { user: user._id }
                }
            })
        })
        return res.status(200).json({
            message: "Challenge Deleted Successfully",
            error: null,
            success: false
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}

export const checkChallengeCompletion = async () => {
    try {
        const habits = await habitModel.find({ type: 'daily', completed: { $exists: true } });

        for (let habit of habits) {
            if (habit.completed.days.length >= habit.duration) continue;

            const joinDate = habit.createdAt;
            const endDate = new Date(joinDate);
            endDate.setDate(endDate.getDate() + habit.duration);

            if (new Date() >= endDate) {
                const user = await userModel.findById(habit.user);

                if (habit.completed.days.length >= habit.duration) {
                    user.points = (user.points || 0) + habit.xpReward;
                    user.coins = (user.coins || 0) + habit.coinReward;
                }
                await user.save();
            }
        }
        return res.status(200).json({
            message: "challenge completed successfully waaaoooooh",
            error: null,
            success: true,
            habits
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
};

export const completeChallenge = async (req, res) => {
    try {
        const userId = req.user.id;
        const challengeId = req.params.id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found", success: false });

        const habit = await habitModel.findOne({ user: userId, challenge: challengeId });
        if (!habit) return res.status(404).json({ message: "Habit for this challenge not found", success: false });

        const totalDays = habit.duration;
        const completedDays = habit.completed.days.length;
        const today = new Date();
        const endDate = new Date(habit.createdAt);
        endDate.setDate(endDate.getDate() + totalDays);

        let status = "in-progress";
        if (completedDays >= totalDays) status = "completed";
        else if (today > endDate) status = "expired";

        return res.status(200).json({
            message: "Challenge progress fetched",
            success: true,
            data: {
                habitId: habit._id,
                title: habit.title,
                completedDays,
                totalDays,
                streak: habit.streak,
                status,
                endDate,
            },
        });
    } catch (err) {
        return res.status(500).json({ message: "Internal Server Error", error: err.message, success: false });
    }
};


export const getLeaderBoard = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not authorized",
                success: false,
                error: "User does not exist"
            })
        }
        const challengeId = req.params.id;
        const challenge = await challengeModel.findById(challengeId)
        if (!challenge) {
            return res.status(401).json({
                message: "Challenge not found",
                success: false,
                error: "Challenges might be expired or deleted"
            })
        }
        const participants = await challengeModel.findById(challengeId).select('+participants.user')
        const leaderBoard = challenge.participants.sort((a, b) => a.progress - b.progress)
        return res.status(200).json({
            message: "Leaderboard fetched successfully",
            error: null,
            leaderBoard
        })
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: err.message,
            success: false
        })
    }
}
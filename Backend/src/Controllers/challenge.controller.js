import challengeModel from "../Models/challenge.model";
import userModel from "../Models/user.model";




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
        user.challenges.push(challenge._id)
        challenge.participants.push({ user: userId })
        user.activeChallenges.push(challenge._id)
        await user.save()
        await challenge.save()
        return res.status(201).json({
            message: "Challenge created successfully",
            success: true,
            data: challenge
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
        if(challenge.creator!==userId){
            return res.status(400).json({
                message:"You can't delete a challenge , you havenot created",
                error:"Ownership mismatched",
                success:false
            })
        }
        await challengeModel.findByIdAndDelete(challengeId)
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
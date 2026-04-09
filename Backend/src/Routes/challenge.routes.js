import challengeModel from "../Models/challenge.model";
import express from 'express'
import mongoose from "mongoose";
import { authUser } from "../Middlewares/user.middleware";
import { createChallenge, getAllActiveChallenges, getSingleChallange, joinAChallenge, getMyJoinedChallenges, getMyCreatedChallenges, leaveAChallenge, getLeaderBoard, markHabitComplete, completeChallenge } from "../Controllers/challenge.controller";


const challengeRoutes = express.Router()


challengeRoutes.post('/create', authUser, createChallenge)


challengeRoutes.get('/', authUser, getAllActiveChallenges)

challengeRoutes.get('/my-active', authUser, getMyJoinedChallenges)


challengeRoutes.get('/my-created', authUser, getMyCreatedChallenges)


challengeRoutes.post('/leave/:id', authUser, leaveAChallenge)

challengeRoutes.post('/complete/:id', authUser, completeChallenge)

challengeRoutes.post('/complete/challenge/:id', authUser, markHabitComplete)

challengeRoutes.get('/:id', authUser, getSingleChallange)

challengeRoutes.post('/join/:id', authUser, joinAChallenge)

challengeRoutes.get('/leaderboard/:id', authUser, getLeaderBoard)

export default challengeRoutes
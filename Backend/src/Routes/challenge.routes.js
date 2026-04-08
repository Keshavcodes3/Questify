import challengeModel from "../Models/challenge.model";
import express from 'express'
import mongoose from "mongoose";
import { authUser } from "../Middlewares/user.middleware";
import { createChallenge, getAllActiveChallenges, getSingleChallange, joinAChallenge, getMyJoinedChallenges, getMyCreatedChallenges,leaveAChallenge } from "../Controllers/challenge.controller";


const challengeRoutes = express.Router()


challengeRoutes.post('/create', authUser, createChallenge)


challengeRoutes.get('/', authUser, getAllActiveChallenges)

challengeRoutes.get('/my-active', authUser, getMyJoinedChallenges)


challengeRoutes.get('/my-created', authUser, getMyCreatedChallenges)


challengeRoutes.post('/leave/:id', authUser, leaveAChallenge)



challengeRoutes.get('/:id', authUser, getSingleChallange)

challengeRoutes.post('/join/:id', authUser, joinAChallenge)

export default challengeRoutes
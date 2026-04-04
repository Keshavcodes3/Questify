import 'dotenv/config'

import express from 'express'
import cors from 'cors'
import cookie from 'cookie-parser'
const app=express()
app.use(express.json())
app.use(cookie())

import userRouter from './Routes/user.routes'
import habitRouter from './Routes/habit.routes'



app.use('/api/v1/user',userRouter)
app.use('/api/v1/habit',habitRouter)

export default app
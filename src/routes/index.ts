import express from 'express'
import authrouter from './auth.route'

import userRouter from './user.route'
const routers = express.Router()

routers.use("/auth",authrouter )
routers.use("/user",userRouter )


export default routers
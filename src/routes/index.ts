import express from 'express'
import authrouter from './auth.route'

import userRouter from './user.route'
import azureRouter from './azure.route'
const routers = express.Router()

routers.use("/auth",authrouter )
routers.use("/user",userRouter )
routers.use("/azure",azureRouter )

export default routers
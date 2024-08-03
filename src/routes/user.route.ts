import express from 'express'
import authMiddleware from '../middlewares/auth.mddleware'
import { getAllUser } from '../services/user.service'
const  {all} = require('trim-request')
const userRouter = express.Router()

userRouter.route("/").get(all , getAllUser)
// userRouter.route("/addwallet").post(all , authMiddleware,addWalletToAccount)
export default userRouter

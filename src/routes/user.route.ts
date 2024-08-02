import express from 'express'
import {  addWalletToAccount, searchUsers} from '../controllers/user.controller'
import authMiddleware from '../middlewares/auth.mddleware'
const  {all} = require('trim-request')
const userRouter = express.Router()

userRouter.route("/").get(all , authMiddleware,searchUsers)
userRouter.route("/addwallet").post(all , authMiddleware,addWalletToAccount)
export default userRouter

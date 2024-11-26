import express from 'express'
import { assignSupervisor, editProfile, getProfile, login, logout, refresh_token, register } from '../controllers/auth.controller'
import authMiddleware from '../middlewares/auth.mddleware'
import { deleteUserProfile } from '../services/auth.service'
const  {all} = require('trim-request')
const authrouter = express.Router()

authrouter.route("/register").post(all ,register)

authrouter.route("/profile").delete(all ,deleteUserProfile)
authrouter.route("/login").post(all,login)
authrouter.route("/profile").get(all,authMiddleware,getProfile)
authrouter.route("/profile").post(all,authMiddleware,editProfile)
authrouter.route("/supervisor").post(all,assignSupervisor)
authrouter.route("/logout").post(all,logout)
authrouter.route("/refresh_token").post(all,refresh_token)
authrouter.route("/test").get(all,authMiddleware,(req:any,res)=>{
    res.send(req.user)
})
export default authrouter

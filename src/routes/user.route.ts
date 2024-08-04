import express from 'express'
import authMiddleware from '../middlewares/auth.mddleware'
import { addComment, addSession, addStudentProject, deleteProject, deleteSession, getAllUser, getCommect, getDocument, getSession, getStudentProject } from '../services/user.service'
import { editProfile } from '../controllers/auth.controller'
const  {all} = require('trim-request')
const userRouter = express.Router()

userRouter.route("/").get(all , getAllUser)
userRouter.route("/section").post(all , addSession)
userRouter.route("/section").get(all , getSession)
userRouter.route("/section/:id").delete(all , deleteSession)

userRouter.route("/project/:id").delete(all , deleteProject)
userRouter.route("/project/:id").put(all , editProfile)
userRouter.route("/project").post(all , addStudentProject)
userRouter.route("/project").get(all , getStudentProject)

userRouter.route("/document/:id").get(all , getDocument)

userRouter.route("/comment").post(all , addComment)
userRouter.route("/comment/:id").get(all , getCommect)

// userRouter.route("/addwallet").post(all , authMiddleware,addWalletToAccount)
export default userRouter

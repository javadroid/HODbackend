import express from 'express'
import authMiddleware from '../middlewares/auth.mddleware'
import { addComment, addDocument, addSession, addStudentProject, deleteProject, deleteSession, editProject, getAllUser, getCommect, getDocument, getsession, getStsupervisorProjectStudentudentProject, getStudentProject, session } from '../services/user.service'
import { editProfile } from '../controllers/auth.controller'
const  {all} = require('trim-request')
const userRouter = express.Router()

userRouter.route("/").get(all , getAllUser)
// userRouter.route("/section").post(all , addSession)
// userRouter.route("/section").get(all , getSession)
// userRouter.route("/section/:id").delete(all , deleteSession)

userRouter.route("/project/:id").delete(all , deleteProject)
userRouter.route("/project/:id").put(all , editProject)

userRouter.route("/project").post(all , addStudentProject)
userRouter.route("/project").get(all , getStudentProject)

userRouter.route("/supervisor-project-student").get(all , getStsupervisorProjectStudentudentProject)

userRouter.route("/document/:id").get(all , getDocument)
userRouter.route("/document/:id").post(all , addDocument)

userRouter.route("/session").post(all , session)
userRouter.route("/session").get(all , getsession )

userRouter.route("/comment").post(all , addComment)
userRouter.route("/comment/:id").get(all , getCommect)

// userRouter.route("/addwallet").post(all , authMiddleware,addWalletToAccount)
export default userRouter

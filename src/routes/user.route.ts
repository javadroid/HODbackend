import express from 'express'
import authMiddleware from '../middlewares/auth.mddleware'
import { addComment, addDocument, addSession, addStudentProject, createSessionName, deleteProject, deletescore, deleteSession, DeleteSessionName, editProject, getAllUser, getCommect, getDocument, getNotification, getscoreSheet, getsession, getsessionMain, getSessionName, getStsupervisorProjectStudentudentProject, getStudentProject, getvoteSheet, scoreSheet, assign, setDate, VoteSheet } from '../services/user.service'
import { editProfile } from '../controllers/auth.controller'
import { askGoogleAi, getlogin, Tomarket } from '../controllers/user.controller'
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

userRouter.route("/assign").post(all , assign)
userRouter.route("/setDate").post(all , setDate)
userRouter.route("/session").get(all , getsession )
userRouter.route("/sessionMain").get(all , getsessionMain )
userRouter.route("/getSessionName").post(all , getSessionName )
userRouter.route("/createSessionName").post(all , createSessionName )
userRouter.route("/DeleteSessionName").post(all , DeleteSessionName )

userRouter.route("/vote").post(all , VoteSheet)
userRouter.route("/getvote").post(all , getvoteSheet )

userRouter.route("/score").post(all , scoreSheet)
userRouter.route("/getscore").post(all , getscoreSheet)
userRouter.route("/deletescore/:id").post(all , deletescore)

userRouter.route("/notification/:id").get(all , getNotification  )
userRouter.route("/comment").post(all , addComment)
userRouter.route("/comment/:id").get(all , getCommect)

userRouter.route("/blum").get(all , getlogin)
userRouter.route("/tomarket").get(all , Tomarket)
userRouter.route("/askGoogleAi").get(all , askGoogleAi)
// userRouter.route("/addwallet").post(all , authMiddleware,addWalletToAccount)
export default userRouter

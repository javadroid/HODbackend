import express from 'express'
import authMiddleware from '../middlewares/auth.mddleware'
import { addComment, addDocument, addSession, addStudentProject, createSessionName, deleteProject, deletescore, deleteSession, DeleteSessionName, editProject, getAllUser, getCommect, getDocument, getNotification, getscoreSheet, getsession, getsessionMain, getSessionName, getStsupervisorProjectStudentudentProject, getStudentProject, getvoteSheet, scoreSheet, assign, setDate, VoteSheet } from '../services/user.service'
import { editProfile } from '../controllers/auth.controller'
import { askGoogleAi, getlogin, Tomarket } from '../controllers/user.controller'
import { AddAccount, AddHistory, DeleteAccount, DeleteHistory, EditAccount, EditHistory, GetAccount, GetAccounts, GetHistory, GetHistorys } from '../controllers/azure.controller'
const  {all} = require('trim-request')
const azureRouter = express.Router()

azureRouter.route("/getAccounts").get(all , GetAccounts)
azureRouter.route("/getAccount/:id").get(all , GetAccount)

azureRouter.route("/account/:id").delete(all , DeleteAccount)
azureRouter.route("/account/:id").put(all , EditAccount)

azureRouter.route("/account").post(all , AddAccount)


azureRouter.route("/getHistorys").get(all , GetHistorys)
azureRouter.route("/getHistory/:id").get(all , GetHistory)

azureRouter.route("/history/:id").delete(all , DeleteHistory)
azureRouter.route("/history/:id").put(all , EditHistory)

azureRouter.route("/history").post(all , AddHistory)
export default azureRouter

import mongoose from 'mongoose'
import dotenv from 'dotenv'
import app from './app'
import logger from './configs/logger'
import { Server } from 'socket.io'
import SocketServer from './SocketServer'

dotenv.config()

const {MONGODB_URL,NODE_ENV}=process.env
const  PORT =process.env.PORT||3001
const DBLINK=NODE_ENV==="production"?MONGODB_URL:"mongodb://localhost:27017/HOD"

let server: any

mongoose.connect(DBLINK!).then(()=>{
    server =app.listen(PORT,()=>{
        logger.info(`Server connected to db and listening at ${PORT}`)
    }) 

    const io =new Server(server,{
        pingTimeout:60000,
        cors:{
            origin:["http://localhost:3001","http://localhost:5173","https://wa-frontend-4fcn.onrender.com"]
        }
    })
    io.on("connection",(socket)=>{
        logger.info(`socket connected`) 
        SocketServer(socket,io)
    })
})

mongoose.connection.on("error",(err:any)=>{
logger.error("Mongodb connection errot: "+err)
})

if(NODE_ENV!=="production"){
    mongoose.set("debug",true)
}

const exitHandler=()=>{
    if(server){
        logger.info("Server closed");
        // process.exit(1);
    }else{
        process.exit(1);
    }
}
const unexpectedErrorHandler=(error:any)=>{
    logger.error(error)
    exitHandler()
}

process.on("uncaughtException",unexpectedErrorHandler);
process.on("unhandledRejection",unexpectedErrorHandler);
process.on("SIGTERM",()=>{
    if(server){
        logger.info("Server closed");
        process.exit(1);
    }
});
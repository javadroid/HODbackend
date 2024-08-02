import express from 'express'
import morgan from 'morgan'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import fileupload from 'express-fileupload'
import ExpressMongoSanitize from 'express-mongo-sanitize'
import logger from './configs/logger'
import createHttpError from 'http-errors'
import routers from './routes'
const app=express()


if(process.env.NODE_ENV !=="production"){
    app.use(morgan("dev"))
}

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(ExpressMongoSanitize())
app.use(cookieParser())
app.use(compression())
app.use(fileupload({useTempFiles:true}))
app.use(cors({
    origin:["http://localhost:3001","http://localhost:5173","https://wa-frontend-4fcn.onrender.com"]
}))
app.use("/api/v1",routers)

app.post("/",(req,res,next)=>{
logger.info("hi")
logger.error("hi")
throw (createHttpError.BadRequest("This route does not exist."))
    // res.send(req.body)
})

app.use(async(req:any,res:any,next:any)=>{
    next(createHttpError.NotFound("This route does not exist."))
    
})

app.use(async(err:any,req:any,res:any,next:any)=>{
    res.status(err.status||500)
    res.send({
        error:{
            status:err.status||500,
            message:err.message
        }
    })
})

export default app

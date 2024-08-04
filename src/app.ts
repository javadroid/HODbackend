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
import path from 'path'
import multer from 'multer'
const app=express()


if(process.env.NODE_ENV !=="production"){
    app.use(morgan("dev"))
}

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(ExpressMongoSanitize())
app.use(cookieParser())
// app.use(compression())
// app.use(fileupload({useTempFiles:true}))
app.use(cors({
    origin:["http://localhost:3000","http://localhost:5173","https://wa-frontend-4fcn.onrender.com"]
}))
app.use('/uploads', express.static('uploads'));
  
const storage = multer.diskStorage({
    destination: (req, file, cb) => { 
        
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        console.log(file)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.originalname.split(".")[0] + '-' + uniqueSuffix+'.'+file.originalname.split(".")[1]);
    }
});
const upload = multer({ storage: storage });
app.post('/api/v1/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    const host = req.headers.host;
    const protocol = req.protocol;
    const url = `${protocol}://${host}`;
    res.json({msg:'File uploaded successfully.',url:url+"/api/v1/file/"+req.file.filename});
})

app.get('/api/v1/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, '../uploads', filename);

  // Check if the file exists
  if (!filename) {
    return res.status(404).send('File not found.');
  }

  // Serve the file
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Error serving the file.');
    }
  });
});


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

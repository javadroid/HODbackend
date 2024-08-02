import createHttpError from "http-errors";
import jwt from 'jsonwebtoken'
export default async function authMiddleware(req: any,res: any,next: any){
    if(!req.headers["authorization"]) return next(createHttpError.Unauthorized())
        const bearToken=req.headers["authorization"].split(" ")[1]
        jwt.verify(bearToken,process.env.JwtSecret!,(err: any,payload: any)=>{
            if(err){
                return next(createHttpError.Unauthorized())
            }

            req.user=payload
            next()

        })
    
}
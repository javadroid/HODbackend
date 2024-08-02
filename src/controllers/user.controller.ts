import UserModel from "../models/user.model";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken';

import createHttpError from "http-errors";
import { addWallet } from "../services/user.service";



export const searchUsers = async (req: any, res: any, next: any) => {
    try {
       const keyword=req.query.search
       if(!keyword)   throw createHttpError.BadGateway("Oops... Something wrong happened");

    //    const users = await searchUsersSerive(keyword)
    //    res.status(200).json(users)
    } catch (error) {
        next(error)

    }
}

export const addWalletToAccount= async (req: any, res: any, next: any) => {
   try {
  
   const data=await addWallet(req.user.userId)
   res.json(data)
   } catch (error) {
    next(error)
   }
    
}


import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import logger from "../configs/logger";
import createHttpError from "http-errors";
import Web3 from "web3";

 const web3 = new Web3();
 
export const createUser = async (req: any, res: any) => {
 
  const existingUser = await UserModel.findOne({
    email: req.body.email.toLowerCase(),
  });

  if (existingUser) {
    throw Error("Email already exists. Please use a different email.");
  }

  const userCreated = await UserModel.create({
    ...req.body
  });

  const access_token = jwt.sign(
    {
      userId: userCreated._id,
    },
    process.env.JwtSecret!
  );
  
  res.cookie("refresh_token", access_token, {
    path: "/api/v1/auth/refresh_token",
  });
  userCreated.access_token=access_token
  return res
      .status(201)
      .json({
        user_data: userCreated,
        auth: true,
        msg: "Registration Successful",
      });
  
};


export const getUserProfile = async (req: any, res: any) => {
 
  const existingUser = await UserModel.findById(req.user.userId);

  if (!existingUser) {
    throw Error("User not found.");
  }

  return res
      .status(201)
      .json({
        user_data: existingUser,
        auth: true,
        msg: "User profile",
      });
  
};
export const editUserProfile = async (req: any, res: any) => {
 
  const editedUser = await UserModel.findByIdAndUpdate(req.user.userId,req.body,{new:true});

  if (!editedUser) {
    throw Error("User not found.");
  }
  return res
      .status(201)
      .json({
        user_data: editedUser,
        auth: true,
        msg: "Profile Updated Successful",
      });
  
};
export const loginUser = async (req: any, res: any) => {
  // Check if the email already exists in the database
  const User = await UserModel.findOne({ email: req.body.email.toLowerCase() });
  if (!User) throw createHttpError.NotFound("User not found");
  const passwordMatchs = await bcrypt.compare(req.body.password, User.password);
  if (!passwordMatchs)
    throw createHttpError.Unauthorized("invalid credentials");

  const access_token = jwt.sign(
    {
      userId: User._id,
    },
    process.env.JwtSecret!
  );
 
  User.access_token=access_token
  return res
      .status(201)
      .json({
        user_data: User,
        auth: true,
        access_token,
        msg: "Login successful",
      });
};

export const logoutUser = async (req: any, res: any) => {
  // console.log(res)
  res.clearCookie("refresh_token", {
    path: "/api/v1/auth/refresh_token",
    httpOnly: true,
  });

  res.json({
    msg: "Logout successful",
  });
};

export const verifyToken = async (refreshToken: any) => {
  return new Promise((resolve, reject) => {
    jwt.verify(refreshToken, process.env.JwtSecret2!, (error: any, payload: any) => {
      if (error) {
        logger.error(error);
        resolve(null);
      } else {
        resolve(payload);
      }
    });
  });
};

export const getUser = async (user_id: any) => {
let user= await UserModel.findById(user_id)
 return user
 };
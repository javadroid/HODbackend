import UserModel from "../models/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import createHttpError from "http-errors";
import {
  createUser,
  editUserProfile,
  getUserProfile,
  loginUser,
  logoutUser,
  verifyToken,
} from "../services/auth.service";

export const register = async (req: any, res: any, next: any) => {
  try {
    await createUser(req, res);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: any, res: any, next: any) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req: any, res: any, next: any) => {
  try {
    await getUserProfile(req, res);
  } catch (error) {
    next(error);
  }
};
export const editProfile = async (req: any, res: any, next: any) => {
  try {
    await editUserProfile(req, res);
  } catch (error) {
    next(error);
  }
};
export const logout = async (req: any, res: any, next: any) => {
  try {
    await logoutUser(req, res);
  } catch (error) {
    next(error);
  }
};

export const refresh_token = async (req: any, res: any, next: any) => {
  try {
    console.log(req.cookies);
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw createHttpError.Unauthorized("Please Login");
    const check = (await verifyToken(refreshToken)) as any;

    const User = await UserModel.findOne({ _id: check.userId });

    const access_token = jwt.sign(
      {
        userId: User._id,
      },
      process.env.JwtSecret!
    );

    return res.status(201).json({ access_token, user_data: User, auth: true });
  } catch (error) {
    next(error);
  }
};

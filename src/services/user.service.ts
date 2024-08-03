

import Web3 from "web3";
import UserModel from "../models/user.model";


const web3 = new Web3();

export const getAllUser = async () => {

 const allUsers=await UserModel.find()
return allUsers
};





import Web3 from "web3";
import UserModel from "../models/user.model";


const web3 = new Web3();

export const addWallet = async (userid: string) => {
const newWallet = await web3.eth.accounts.create();
 const accounts={privateKey:newWallet.privateKey,address:newWallet.address}
 
 const updatedUserData=await UserModel.findByIdAndUpdate(userid,{accounts},{new:true})
return updatedUserData
};



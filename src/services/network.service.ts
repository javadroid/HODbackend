import  { NetworkModel, SupportedTokenModel } from "../models/network.model";

export const addNetwork = async (data: any) => {
  const existingNetwork = await NetworkModel.findOne({
    chainId: data.chainId,
  });
  if (existingNetwork) {
    throw Error("Network already exists.");
  }

  const networkCreated = await NetworkModel.create({
    ...data,
  });

  return networkCreated;
};

export const getNetworks = async () => {
  let network = await NetworkModel.find();
  return network;
};


export const addSupportedToken = async (data: any) => {
  const existingSupportedToken = await SupportedTokenModel.findOne({
    address: data.address,
  });
  if (existingSupportedToken) {
    throw Error("Token already exists.");
  }

  const supportedTokenCreated = await SupportedTokenModel.create({
    ...data,
  });

  return supportedTokenCreated;
};

export const getSupportedToken=async()=>{
  let supportedToken = await SupportedTokenModel.find();
  return supportedToken;
}

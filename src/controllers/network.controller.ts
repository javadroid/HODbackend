
import { addNetwork, addSupportedToken, getNetworks, getSupportedToken } from "../services/network.service";

export const addANetwork = async (req: any, res: any, next: any) => {
  try {
    const networkCreated = await addNetwork(req.body);
    return res.status(201).json({
      network_data: networkCreated,
      msg: "Network Added",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllNetwork = async (req: any, res: any, next: any) => {
  try {
    const networks = await getNetworks();
    return res.json(networks);
  } catch (error) {
    next(error);
  }
};


export const addNewToken = async (req: any, res: any, next: any) => {
  try {

    const tokenCreated = await addSupportedToken(req.body);
    return res.status(201).json({
      token_data: tokenCreated,
      msg: "Token Added",
    });
  } catch (error) {
    next(error);
  }
};

export const getAllToken = async (req: any, res: any, next: any) => {
  try {
    const tokens = await getSupportedToken();
    return res.json(tokens);
  } catch (error) {
    next(error);
  }
};


import { AccountsModel, HistoryZModel } from "../models/schema.model";

export const addAccount = async (req: any, res: any) => {
    const sessionCreated = await AccountsModel.create({
      ...req.body,
    });
    return res.status(201).json(sessionCreated);
  };

  export const editAccount = async (req: any, res: any) => {
    const sessionCreated = await AccountsModel.findByIdAndUpdate(req.params.id,{
      ...req.body,
    });
    return res.status(200).json(sessionCreated);
  };
  export const deleteAccount = async (req: any, res: any) => {
    const sessionCreated = await AccountsModel.findByIdAndDelete(req.params.id);
    return res.status(201).json(sessionCreated);
  };

  export const getAccount = async (req: any, res: any) => {
    const sessionCreated = await AccountsModel.find({userid:req.params.id});
    return res.status(200).json(sessionCreated);
  };

  export const getAccounts = async (req: any, res: any) => {
    const sessionCreated = await AccountsModel.find();
    return res.status(200).json(sessionCreated);
  };






  export const addHistory = async (req: any, res: any) => {
    const sessionCreated = await HistoryZModel.create({
      ...req.body,
    });
    return res.status(201).json(sessionCreated);
  };

  export const editHistory = async (req: any, res: any) => {
    const sessionCreated = await HistoryZModel.findByIdAndUpdate(req.params.id,{
      ...req.body,
    });
    return res.status(200).json(sessionCreated);
  };
  export const deleteHistory = async (req: any, res: any) => {
    const sessionCreated = await HistoryZModel.findByIdAndDelete(req.params.id);
    return res.status(201).json(sessionCreated);
  };

  export const getHistory = async (req: any, res: any) => {
    const sessionCreated = await HistoryZModel.find({userid:req.params.id});
    return res.status(200).json(sessionCreated);
  };

  export const getHistorys = async (req: any, res: any) => {
    const sessionCreated = await HistoryZModel.find();
    return res.status(200).json(sessionCreated);
  };
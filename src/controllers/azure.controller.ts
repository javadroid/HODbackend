import { addAccount, addHistory, deleteAccount, deleteHistory, editAccount, editHistory, getAccount, getAccounts, getHistory, getHistorys } from "../services/azure.service";

export const AddAccount = async (req: any, res: any, next: any) => {
    try {
      await addAccount(req, res);
    } catch (error) {
      next(error);
    }
  };


  export const EditAccount = async (req: any, res: any, next: any) => {
    try {
      await editAccount(req, res);
    } catch (error) {
      next(error);
    }
  };
  export const DeleteAccount = async (req: any, res: any, next: any) => {
    try {
      await deleteAccount(req, res);
    } catch (error) {
      next(error);
    }
  };
  export const GetAccount = async (req: any, res: any, next: any) => {
    try {
      await getAccount(req, res);
    } catch (error) {
      next(error);
    }
  };export const GetAccounts = async (req: any, res: any, next: any) => {
    try {
      await getAccounts(req, res);
    } catch (error) {
      next(error);
    }
  };
  

  export const AddHistory = async (req: any, res: any, next: any) => {
    try {
      await addHistory(req, res);
    } catch (error) {
      next(error);
    }
  };


  export const EditHistory = async (req: any, res: any, next: any) => {
    try {
      await editHistory(req, res);
    } catch (error) {
      next(error);
    }
  };
  export const DeleteHistory = async (req: any, res: any, next: any) => {
    try {
      await deleteHistory(req, res);
    } catch (error) {
      next(error);
    }
  };
  export const GetHistory = async (req: any, res: any, next: any) => {
    try {
      await getHistory(req, res);
    } catch (error) {
      next(error);
    }
  };export const GetHistorys = async (req: any, res: any, next: any) => {
    try {
      await getHistorys(req, res);
    } catch (error) {
      next(error);
    }
  };
import axios from 'axios';
import config from '../../config';
import { INewTransfer, ITransfer, ITransferGetReq } from './interface';

export const getTransfers = async (req: ITransferGetReq) => {
    return (await axios.get(`${config.service.transfersUrl}/transfers`, { params: req })).data;
};

export const createTransfer = async (transfer: INewTransfer): Promise<ITransfer> => {
    return (await axios.post(`${config.service.transfersUrl}/transfers`, transfer)).data;
};

import axios from 'axios';
import config from '../../config';
import { INewTransfer, ITransfer, ITransferGetReq } from './interface';

export const getTransfers = async (req: ITransferGetReq) => {
    return (await axios.get(`http://${config.transfers.host}:${config.transfers.port}/api/transfers`, { params: req }))
        .data;
};

export const createTransfer = async (transfer: INewTransfer): Promise<ITransfer> => {
    return (await axios.post(`http://${config.transfers.host}:${config.transfers.port}/api/transfers`, transfer)).data;
};

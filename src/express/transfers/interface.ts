import * as mongoose from 'mongoose';

export const TransfersSortByFields = [
    'requestId',
    'userId',
    'classification',
    'fileName',
    'fileSize',
    'destination',
    'createdAt',
] as const;
export const TransfersSortOrders = ['asc', 'desc'] as const;

export const destinations = ['dropbox', 'cargo'] as const;
type destination = typeof destinations[number];

// TODO: real classifications
export const classifications = ['classification1', 'classification2'] as const;
type classification = typeof classifications[number];

export interface ITransfer {
    _id: mongoose.Types.ObjectId;
    requestId: string;
    userId: string;
    recipients: string[];
    classification: classification;
    fileName: string;
    fileSize: number;
    destination: destination;
    createdAt: Date;
}

export type ITransferGetReq = Partial<ITransfer> & {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
};

export type INewTransfer = Omit<ITransfer, '_id' | 'createdAt'>;

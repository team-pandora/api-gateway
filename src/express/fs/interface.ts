import * as mongoose from 'mongoose';
import config from '../../config';

export type fsObjectType = typeof config.constants.fsObjectTypes[number];

export interface IFsObject {
    _id: mongoose.Types.ObjectId;
    name: string;
    parent: mongoose.Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
    type: fsObjectType;
}

export type IFsGetReq = Partial<IFsObject> & {
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
};

export type INewFsObject = Omit<IFsObject, '_id' | 'createdAt'>;

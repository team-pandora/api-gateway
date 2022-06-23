import { ObjectId } from 'mongoose';
import config from '../../config';

export type fsObjectType = typeof config.constants.fsObjectTypes[number];

export type IUserGetReq = {
    userId?: string;
    name?: string;
    mail?: string;
    source?: string;
};

export type INewFile = {
    name?: string;
    parent?: ObjectId;
    public?: boolean;
    size?: number;
};

export type IUpdateFsObject = {
    name: string;
    parent: ObjectId;
    public: boolean;
};

export type IGenerateLink = {
    time: string;
    permission: string;
};

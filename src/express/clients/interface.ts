import { ObjectId } from 'mongoose';
import config from '../../config';

const { permissions, fsObjectTypes, statesSortFields, fsObjectsSortFields, sortOrders } = config.constants;

type permission = typeof permissions[number];
type fsObjectType = typeof fsObjectTypes[number];
type fsObjectsSortField = typeof fsObjectsSortFields[number];
type statesSortField = typeof statesSortFields[number];
type sortOrder = typeof sortOrders[number];

export interface IAggregateStatesAndFsObjectsQuery {
    // State filters
    stateId?: ObjectId;
    userId?: string;
    fsObjectId?: ObjectId | { $in: ObjectId[] };
    favorite?: boolean;
    trash?: boolean;
    trashRoot?: boolean;
    root?: boolean;
    permission?: permission | { $in: Array<permission> } | { $nin: Array<permission> };

    // FsObject filters
    key?: string;
    bucket?: string;
    client?: string;
    size?: number | { $gt: number };
    public?: boolean;
    name?: string;
    parent?: ObjectId;
    type?: fsObjectType;
    ref?: ObjectId;

    // Sort
    sortBy?: statesSortField | fsObjectsSortField;
    sortOrder?: sortOrder;

    // Pagination
    page?: number;
    pageSize?: number;
}

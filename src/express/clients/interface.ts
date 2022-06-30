import config from '../../config';

const { permissions, fsObjectTypes, statesSortFields, fsObjectsSortFields, sortOrders } = config.constants;

export type permission = typeof permissions[number];
type fsObjectType = typeof fsObjectTypes[number];
type fsObjectsSortField = typeof fsObjectsSortFields[number];
type statesSortField = typeof statesSortFields[number];
type sortOrder = typeof sortOrders[number];

export interface INewFile {
    name: string;
    size: number;
    public?: boolean;
}

export interface IAggregateStatesAndFsObjectsQuery {
    // State filters
    stateId?: string;
    userId?: string;
    fsObjectId?: string | { $in: string[] };
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
    parent?: string;
    type?: fsObjectType;
    ref?: string;

    // Sort
    sortBy?: statesSortField | fsObjectsSortField;
    sortOrder?: sortOrder;

    // Pagination
    page?: number;
    pageSize?: number;
}

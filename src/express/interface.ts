import config from '../config';

const { permissions, fsObjectTypes, statesSortFields, fsObjectsSortFields, sortOrders } = config.constants;

export type permission = typeof permissions[number];
type fsObjectType = typeof fsObjectTypes[number];
type fsObjectsSortField = typeof fsObjectsSortFields[number];
type statesSortField = typeof statesSortFields[number];
type sortOrder = typeof sortOrders[number];

export interface IFsObject {
    _id: string;
    name: string;
    parent: string | null;
    type: fsObjectType;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFile extends IFsObject {
    bucket: string;
    size: number;
    public: boolean;
    client: string;
}

export interface IFolder extends IFsObject {}

export interface IShortcut extends IFsObject {
    ref: string;
}

export interface IUserFilters {
    query: string;
    source: string;
}

export interface INewFile {
    name?: string;
    parent?: string | null;
    public?: boolean;
    size?: number;
    client?: string;
}

export interface IDuplicateFile {
    name?: string;
    parent?: string | null;
    client?: string;
}

export interface IUpdateFsObject {
    name: string;
    parent: string | null;
    public: boolean;
}

export interface IGenerateLink {
    expirationInSec: string;
    permission: string;
}

export interface IAggregateStatesAndFsObjectsQuery {
    // State filters
    stateId?: string;
    userId?: string;
    fsObjectId?: string;
    favorite?: boolean;
    trash?: boolean;
    trashRoot?: boolean;
    root?: boolean;
    permission?: permission | permission[];

    // FsObject filters
    key?: string;
    bucket?: string;
    client?: string;
    size?: number;
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

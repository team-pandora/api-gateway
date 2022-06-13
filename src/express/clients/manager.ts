import { fsService } from '../services';
import { IAggregateStatesAndFsObjectsQuery } from './interface';

export const getFiles = async (client: string, query: IAggregateStatesAndFsObjectsQuery) => {
    return fsService.get(`/clients/${client}/files`, { params: query });
};

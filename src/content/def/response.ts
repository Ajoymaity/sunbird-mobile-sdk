import {ContentSearchCriteria, ContentSearchFilter, FilterValue} from './requests';
import {ContentData} from './content';
import {ContentImportStatus} from '../util/content-constants';

export interface ContentSearchResult {
    id: string;
    responseMessageId: string;
    filterCriteria: ContentSearchCriteria;
    request?: { [key: string]: any };
    contentDataList: ContentData[];
    collectionDataList?: ContentData[];
}

export interface SearchResponse {
    params: { resmsgid: string };
    result: {
        count: number,
        content: ContentData[],
        facets: ContentSearchFilter
    };
}

export interface ChildContent {
    identifier: string;
    name: string;
    objectType: string;
    relation: string;
    index: number;
}

export interface ContentImportResponse {
    identifier: string;
    status: ContentImportStatus;
}

export interface ContentDeleteResponse {
    identifier: string;
    status: ContentDeleteStatus;
}

export enum ContentDeleteStatus {
    NOT_FOUND = -1,
    DELETED_SUCCESSFULLY = 1
}

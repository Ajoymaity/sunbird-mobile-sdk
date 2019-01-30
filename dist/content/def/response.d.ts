import { ContentSearchCriteria, ContentSearchFilter } from './requests';
import { ContentData } from './content';
export interface ContentSearchResult {
    id: string;
    responseMessageId: string;
    filterCriteria: ContentSearchCriteria;
    request?: {
        [index: string]: any;
    };
    contentDataList: ContentData[];
}
export interface SearchResponse {
    params: {
        resmsgid: string;
    };
    result: {
        count: number;
        content: ContentData[];
        facets: ContentSearchFilter;
    };
}
export interface ChildContent {
    identifier: string;
    name: string;
    objectType: string;
    relation: string;
    index: number;
}
export interface ContentDeleteResponse {
    identifier: string;
    status: ContentDeleteStatus;
}
export declare enum ContentDeleteStatus {
    NOT_FOUND = -1,
    DELETED_SUCCESSFULLY = 1
}

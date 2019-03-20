import { ContentSearchCriteria, ContentSearchFilter } from './requests';
import { ContentData } from './content';
import { ContentImportStatus } from '../util/content-constants';
export interface ContentSearchResult {
    id: string;
    responseMessageId: string;
    filterCriteria: ContentSearchCriteria;
    request?: {
        [key: string]: any;
    };
    contentDataList: ContentData[];
    collectionDataList?: ContentData[];
}
export interface ContentsGroupedByPageSection {
    name: string;
    sections: PageSection[];
}
export interface PageSection {
    count?: number;
    name?: string;
    contents?: ContentData[];
    display?: Display;
}
export interface Display {
    name: {
        [key: string]: any;
    };
}
export interface SearchResponse {
    id: string;
    params: {
        resmsgid: string;
    };
    result: {
        count: number;
        content: ContentData[];
        collections: ContentData[];
        facets: ContentSearchFilter[];
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
export declare enum ContentDeleteStatus {
    NOT_FOUND = -1,
    DELETED_SUCCESSFULLY = 1
}
export interface ContentMarker {
    contentId: string;
    uid: string;
    extraInfoMap: {
        [key: string]: any;
    };
    marker: number;
}

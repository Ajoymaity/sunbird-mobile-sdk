import { ChildContentRequest, Content, ContentDelete, ContentDeleteRequest, ContentDeleteResponse, ContentDetailRequest, ContentDownloadRequest, ContentExportRequest, ContentExportResponse, ContentFeedbackService, ContentImportRequest, ContentImportResponse, ContentMarkerRequest, ContentRequest, ContentSearchCriteria, ContentSearchResult, ContentService, ContentsGroupedByPageSection, ContentSpaceUsageSummaryRequest, ContentSpaceUsageSummaryResponse, EcarImportRequest, HierarchyInfo, RelevantContentRequest, RelevantContentResponsePlayer } from '..';
import { Observable } from 'rxjs';
import { ApiService } from '../../api';
import { ProfileService } from '../../profile';
import { DbService } from '../../db';
import { FileService } from '../../util/file/def/file-service';
import { ZipService } from '../../util/zip/def/zip-service';
import { TelemetryService } from '../../telemetry';
import { DownloadService } from '../../util/download';
import { DownloadCompleteDelegate } from '../../util/download/def/download-complete-delegate';
import { EventsBusService } from '../../events-bus';
import { SharedPreferences } from '../../util/shared-preferences';
import { CachedItemStore } from '../../key-value-store';
import { SdkServiceOnInitDelegate } from '../../sdk-service-on-init-delegate';
import { SdkConfig } from '../../sdk-config';
import { DeviceInfo } from '../../util/device';
export declare class ContentServiceImpl implements ContentService, DownloadCompleteDelegate, SdkServiceOnInitDelegate {
    private sdkConfig;
    private apiService;
    private dbService;
    private profileService;
    private fileService;
    private zipService;
    private deviceInfo;
    private telemetryService;
    private contentFeedbackService;
    private downloadService;
    private sharedPreferences;
    private eventsBusService;
    private cachedItemStore;
    private static readonly KEY_IS_UPDATE_SIZE_ON_DEVICE_SUCCESSFUL;
    private static readonly KEY_CONTENT_DELETE_REQUEST_LIST;
    private readonly SEARCH_CONTENT_GROUPED_BY_PAGE_SECTION_KEY;
    private readonly getContentDetailsHandler;
    private readonly getContentHeirarchyHandler;
    private readonly contentServiceConfig;
    private readonly appConfig;
    private contentDeleteRequestSet;
    constructor(sdkConfig: SdkConfig, apiService: ApiService, dbService: DbService, profileService: ProfileService, fileService: FileService, zipService: ZipService, deviceInfo: DeviceInfo, telemetryService: TelemetryService, contentFeedbackService: ContentFeedbackService, downloadService: DownloadService, sharedPreferences: SharedPreferences, eventsBusService: EventsBusService, cachedItemStore: CachedItemStore);
    private static getIdForDb;
    onInit(): Observable<undefined>;
    getContentDetails(request: ContentDetailRequest): Observable<Content>;
    getContentHeirarchy(request: ContentDetailRequest): Observable<Content>;
    getContents(request: ContentRequest): Observable<Content[]>;
    cancelImport(contentId: string): Observable<any>;
    deleteContent(contentDeleteRequest: ContentDeleteRequest): Observable<ContentDeleteResponse[]>;
    enqueueContentDelete(contentDeleteRequest: ContentDeleteRequest): Observable<void>;
    clearContentDeleteQueue(): Observable<void>;
    getContentDeleteQueue(): Observable<ContentDelete[]>;
    exportContent(contentExportRequest: ContentExportRequest): Observable<ContentExportResponse>;
    getChildContents(childContentRequest: ChildContentRequest): Observable<Content>;
    getDownloadState(): Promise<any>;
    importContent(contentImportRequest: ContentImportRequest): Observable<ContentImportResponse[]>;
    importEcar(ecarImportRequest: EcarImportRequest): Observable<ContentImportResponse[]>;
    nextContent(hierarchyInfo: HierarchyInfo[], currentContentIdentifier: string, shouldConvertBasePath?: boolean): Observable<Content>;
    prevContent(hierarchyInfo: HierarchyInfo[], currentContentIdentifier: string, shouldConvertBasePath?: boolean): Observable<Content>;
    getRelevantContent(request: RelevantContentRequest): Observable<RelevantContentResponsePlayer>;
    subscribeForImportStatus(contentId: string): Observable<any>;
    searchContent(contentSearchCriteria: ContentSearchCriteria, request?: {
        [key: string]: any;
    }): Observable<ContentSearchResult>;
    cancelDownload(contentId: string): Observable<undefined>;
    setContentMarker(contentMarkerRequest: ContentMarkerRequest): Observable<boolean>;
    searchContentGroupedByPageSection(request: ContentSearchCriteria): Observable<ContentsGroupedByPageSection>;
    onDownloadCompletion(request: ContentDownloadRequest): Observable<undefined>;
    getContentSpaceUsageSummary(contentSpaceUsageSummaryRequest: ContentSpaceUsageSummaryRequest): Observable<ContentSpaceUsageSummaryResponse[]>;
    private cleanupContent;
    private getMimeType;
    private searchContentAndGroupByPageSection;
    private handleContentDeleteRequestSetChanges;
    private handleUpdateSizeOnDeviceFail;
}

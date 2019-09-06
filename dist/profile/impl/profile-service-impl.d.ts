import { AcceptTermsConditionRequest, ContentAccess, GenerateOtpRequest, GetAllProfileRequest, IsProfileAlreadyInUseRequest, LocationSearchCriteria, MergeServerProfilesRequest, Profile, ProfileExportRequest, ProfileExportResponse, ProfileService, ProfileSession, ProfileSource, ServerProfile, ServerProfileDetailsRequest, ServerProfileSearchCriteria, TenantInfoRequest, UpdateServerProfileInfoRequest, VerifyOtpRequest } from '..';
import { DbService } from '../../db';
import { Observable } from 'rxjs';
import { TenantInfo } from '../def/tenant-info';
import { ApiService } from '../../api';
import { CachedItemStore, KeyValueStore } from '../../key-value-store';
import { ContentAccessFilterCriteria } from '../def/content-access-filter-criteria';
import { ProfileExistsResponse } from '../def/profile-exists-response';
import { LocationSearchResult } from '../def/location-search-result';
import { SharedPreferences } from '../../util/shared-preferences';
import { FrameworkService } from '../../framework';
import { ProfileImportRequest } from '../def/profile-import-request';
import { ProfileImportResponse } from '../def/profile-import-response';
import { FileService } from '../../util/file/def/file-service';
import { DeviceInfo } from '../../util/device';
import { SdkConfig } from '../../sdk-config';
import { Container } from 'inversify';
import { AuthService } from '../../auth';
export declare class ProfileServiceImpl implements ProfileService {
    private container;
    private sdkConfig;
    private dbService;
    private apiService;
    private cachedItemStore;
    private keyValueStore;
    private sharedPreferences;
    private frameworkService;
    private fileService;
    private deviceInfo;
    private authService;
    private static readonly KEY_USER_SESSION;
    private static readonly MERGE_SERVER_PROFILES_PATH;
    private readonly apiConfig;
    constructor(container: Container, sdkConfig: SdkConfig, dbService: DbService, apiService: ApiService, cachedItemStore: CachedItemStore, keyValueStore: KeyValueStore, sharedPreferences: SharedPreferences, frameworkService: FrameworkService, fileService: FileService, deviceInfo: DeviceInfo, authService: AuthService);
    private readonly telemetryService;
    preInit(): Observable<undefined>;
    createProfile(profile: Profile, profileSource?: ProfileSource): Observable<Profile>;
    deleteProfile(uid: string): Observable<undefined>;
    updateProfile(profile: Profile): Observable<Profile>;
    updateServerProfile(updateUserInfoRequest: UpdateServerProfileInfoRequest): Observable<Profile>;
    getServerProfiles(searchCriteria: ServerProfileSearchCriteria): Observable<ServerProfile[]>;
    getTenantInfo(tenantInfoRequest: TenantInfoRequest): Observable<TenantInfo>;
    getAllProfiles(profileRequest?: GetAllProfileRequest): Observable<Profile[]>;
    getServerProfilesDetails(serverProfileDetailsRequest: ServerProfileDetailsRequest): Observable<ServerProfile>;
    getActiveSessionProfile({ requiredFields }: Pick<ServerProfileDetailsRequest, 'requiredFields'>): Observable<Profile>;
    setActiveSessionForProfile(profileUid: string): Observable<boolean>;
    getActiveProfileSession(): Observable<ProfileSession>;
    acceptTermsAndConditions(acceptTermsConditions: AcceptTermsConditionRequest): Observable<boolean>;
    isProfileAlreadyInUse(isProfileAlreadyInUseRequest: IsProfileAlreadyInUseRequest): Observable<ProfileExistsResponse>;
    generateOTP(generateOtpRequest: GenerateOtpRequest): Observable<boolean>;
    verifyOTP(verifyOTPRequest: VerifyOtpRequest): Observable<boolean>;
    searchLocation(locationSearchCriteria: LocationSearchCriteria): Observable<LocationSearchResult[]>;
    getAllContentAccess(criteria: ContentAccessFilterCriteria): Observable<ContentAccess[]>;
    addContentAccess(contentAccess: ContentAccess): Observable<boolean>;
    exportProfile(profileExportRequest: ProfileExportRequest): Observable<ProfileExportResponse>;
    importProfile(profileImportRequest: ProfileImportRequest): Observable<ProfileImportResponse>;
    mergeServerProfiles(mergeServerProfilesRequest: MergeServerProfilesRequest): Observable<undefined>;
    private mapDbProfileEntriesToProfiles;
    private generateSessionStartTelemetry;
    private generateSessionEndTelemetry;
}

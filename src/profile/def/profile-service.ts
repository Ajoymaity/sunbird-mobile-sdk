import {Profile} from './profile';
import {Observable} from 'rxjs';
import {TenantInfoRequest} from './tenant-info-request';
import {TenantInfo} from './tenant-info';
import {ServerProfileSearchCriteria} from './server-profile-search-criteria';
import {ServerProfile} from './server-profile';
import {UpdateServerProfileInfoRequest} from './update-server-profile-info-request';
import {GetAllProfileRequest} from './get-all-profile-request';
import {ServerProfileDetailsRequest} from './server-profile-details-request';
import {ProfileSession} from './profile-session';


export interface ProfileService {
    createProfile(profile: Profile): Observable<Profile>;

    deleteProfile(uid: string): Observable<undefined>;

    updateServerProfile(updateServerProfileRequest: UpdateServerProfileInfoRequest): Observable<Profile>;

    getTenantInfo(tenantInfoRequest: TenantInfoRequest): Observable<TenantInfo>;

    getServerProfiles(searchCriteria: ServerProfileSearchCriteria): Observable<ServerProfile[]>;

    getAllProfiles(profileRequest?: GetAllProfileRequest): Observable<Profile[]>;

    getServerProfilesDetails(serverProfileDetailsRequest: ServerProfileDetailsRequest): Observable<ServerProfile>;

    getCurrentProfile(): Observable<Profile>;

    setCurrentProfile(uid: string): Observable<boolean>;

    getCurrentProfileSession(): Observable<ProfileSession | undefined>;
}

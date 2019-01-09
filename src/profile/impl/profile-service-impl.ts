
import { Profile, ProfileService } from '..';
import { DbService, NoSqlFormatter, ObjectMapper } from '../../db';
import { Observable } from 'rxjs';
import { ProfileEntry } from '../db/schema';
import { ProfileConstant } from '../def/constant';
import {ServerProfileSearchCriteria} from '../def/server-profile-search-criteria';
import {ServerProfile} from '../def/server-profile';
import {UniqueId} from '../../db/util/unique-id';
import {TenantInfo} from '../def/tenant-info';
import {TenantInfoRequest} from '../def/tenant-info-request';
import {TenantInfoHandler} from '../handler/tenant-info-handler';
import {ApiService} from '../../api';
import {KeyValueStore} from '../../key-value-store';
import {ProfileServiceConfig} from '../config/profile-service-config';
import {SessionAuthenticator} from '../../auth';
import {UpdateServerProfileInfoRequest} from '../def/update-server-profile-info-request';
import {UpdateServerProfileInfoHandler} from '../handler/update-server-profile-info-handler';
import TABLE_NAME = ProfileEntry.TABLE_NAME;
import { ProfileRequest } from '../def/profile-request';
import { ProfileSource } from '../def/profile';
import { filter } from 'rxjs/operator/filter';

export class ProfileServiceImpl implements ProfileService {
    constructor(private dbService: DbService,
                private apiService: ApiService,
                private keyValueStore: KeyValueStore,
                private profileServiceConfig: ProfileServiceConfig,
                private sessionAuthenticator: SessionAuthenticator) {
    }

    createProfile(profile: Profile): Observable<Profile> {
        const saveToDb = NoSqlFormatter.toDb(profile);
        this.dbService.insert({
            table: TABLE_NAME,
            modelJson: ObjectMapper.map(saveToDb, {
                [ProfileConstant.BOARD]: saveToDb.board,
                [ProfileConstant.GRADE]: saveToDb.Grade,
                [ProfileConstant.HANDLE]: saveToDb.handle,
                [ProfileConstant.SYLLABUS]: saveToDb.syllabus,
                [ProfileConstant.SOURCE]: saveToDb.source,
                [ProfileConstant.MEDIUM]: saveToDb.medium,
                [ProfileConstant.PROFILE_TYPE]: saveToDb.profileType,
                [ProfileConstant.GRADE_VALUE]: saveToDb.gradeValue,
                [ProfileConstant.SUBJECT]: saveToDb.subject,
                [ProfileConstant.UID]: UniqueId.generateUniqueId(),
                [ProfileConstant.CREATED_AT]: Date.now()
            })
        });
        return Observable.of(profile);
    }

    deleteProfile(uid: string): Observable<number> {
        return this.dbService.delete(TABLE_NAME, 'uid =? ', [uid]);
    }

    updateServerProfile(updateUserInfoRequest: UpdateServerProfileInfoRequest): Observable<Profile> {
        // TODO
        return new UpdateServerProfileInfoHandler(this.keyValueStore, this.apiService,
            this.profileServiceConfig, this.sessionAuthenticator).handle(updateUserInfoRequest);
    }

    getServerProfiles(searchCriteria: ServerProfileSearchCriteria): Observable<ServerProfile[]> {
        // TODO
        return Observable.from([]);
    }

    getTenantInfo(tenantInfoRequest: TenantInfoRequest): Observable<TenantInfo> {
        // TODO
        return new TenantInfoHandler(this.keyValueStore, this.apiService,
            this.profileServiceConfig, this.sessionAuthenticator).handle(tenantInfoRequest);
        }
    getAllProfile(profileRequest?: ProfileRequest): Observable<Profile[]> {
        if (profileRequest) {
            if (profileRequest.local) {
                this.dbService.read({
                    table: TABLE_NAME,
                    columns: [ProfileConstant.UID, ProfileConstant.SOURCE],
                    selection: '? = ?',
                    selectionArgs: [ProfileConstant.SOURCE, ProfileSource.LOCAL]
                });
            } else if (profileRequest.server) {
                this.dbService.read({
                    table: TABLE_NAME,
                    columns: [ProfileConstant.UID, ProfileConstant.SOURCE],
                    selection: '? = ?',
                    selectionArgs: [ProfileConstant.SOURCE, ProfileSource.SERVER]
                });

            }


            // const localUserFilter = this.dbService.read({ table: TABLE_NAME, columns: [ProfileConstant.UID, ProfileConstant.SOURCE] });
            // // const localUserFilter = `${ProfileConstant.SOURCE} = ${ProfileSource.LOCAL}`;

            // const serverUserFilter = this.dbService.read({ table: TABLE_NAME, columns: [ProfileConstant.UID, ProfileConstant.SOURCE] });

            // const groupFilter = `${localUserFilter} OR ${serverUserFilter}`;

            // const userProfileModel = this.dbService.read({ table: TABLE_NAME, columns: [ProfileConstant.UID, groupFilter] });
        }

       
        return Observable.from([]);
    }
}

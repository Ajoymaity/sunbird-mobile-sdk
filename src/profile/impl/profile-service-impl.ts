import {Profile, ProfileService} from '..';
import {DbService, NoSqlFormatter, ObjectMapper} from '../../db';
import {Observable} from 'rxjs';
import {ProfileEntry} from '../db/schema';
import {Constant} from '../def/constant';
import {UsersSearchCriteria} from '../def/users-search-criteria';
import {User} from '../def/user';
import {UniqueId} from '../../db/util/unique-id';
import {TenantInfo} from '../def/tenant-info';
import {TenantInfoRequest} from '../def/tenant-info-request';
import {TenantInfoHandler} from '../handler/tenant-info-handler';
import {ApiService} from '../../api';
import {KeyValueStore} from '../../key-value-store';
import {TenantServiceConfig} from '../config/tenant-service-config';
import {SessionAuthenticator} from '../../auth';
import TABLE_NAME = ProfileEntry.TABLE_NAME;

export class ProfileServiceImpl implements ProfileService {
    constructor(private dbService: DbService,
                private apiService: ApiService,
                private keyValueStore: KeyValueStore,
                private tenantServiceConfig: TenantServiceConfig,
                private sessionAuthenticator: SessionAuthenticator) {
    }

    createProfile(profile: Profile): Observable<Profile> {
        const saveToDb = NoSqlFormatter.toDb(profile);
        this.dbService.insert({
            table: TABLE_NAME,
            modelJson: ObjectMapper.map(saveToDb, {
                [Constant.BOARD]: saveToDb.board,
                [Constant.GRADE]: saveToDb.Grade,
                [Constant.HANDLE]: saveToDb.handle,
                [Constant.SYLLABUS]: saveToDb.syllabus,
                [Constant.SOURCE]: saveToDb.source,
                [Constant.MEDIUM]: saveToDb.medium,
                [Constant.PROFILE_TYPE]: saveToDb.profileType,
                [Constant.GRADE_VALUE]: saveToDb.gradeValue,
                [Constant.SUBJECT]: saveToDb.subject,
                [Constant.UID]: UniqueId.generateUniqueId(),
                [Constant.CREATED_AT]: Date.now()
            })
        });
        return Observable.of(profile);
    }

    deleteProfile(uid: string): Observable<number> {
        return this.dbService.delete(TABLE_NAME, 'uid =? ', [uid]);
    }

    updateUserInfo(profile: Profile): Observable<Profile> {
        const profileId = this.dbService.read({table: TABLE_NAME, columns: [profile.uid]});
        const saveToDb = NoSqlFormatter.toDb(profile);
        if (profileId !== null) {
            return this.dbService.update({
                table: TABLE_NAME,
                selection: `${ProfileEntry._ID} = ?`,
                selectionArgs: [profile.uid],
                modelJson: ObjectMapper.map(saveToDb, {
                    [Constant.BOARD]: saveToDb.board,
                    [Constant.GRADE]: saveToDb.Grade,
                    [Constant.HANDLE]: saveToDb.handle,
                    [Constant.SYLLABUS]: saveToDb.syllabus,
                    [Constant.SOURCE]: saveToDb.source,
                    [Constant.MEDIUM]: saveToDb.medium,
                    [Constant.PROFILE_TYPE]: saveToDb.profileType,
                    [Constant.GRADE_VALUE]: saveToDb.gradeValue,
                    [Constant.SUBJECT]: saveToDb.subject
                })
            }).map(() => {
                return profile;
            });
        }
        return Observable.of(profile);
    }

    getUsers(searchCriteria: UsersSearchCriteria): Observable<User[]> {
        // TODO
        return Observable.from([]);
    }

    getTenantInfo(tenantInfoRequest: TenantInfoRequest): Observable<TenantInfo[]> {
        // TODO
        return new TenantInfoHandler(this.keyValueStore, this.apiService,
            this.tenantServiceConfig, this.sessionAuthenticator).handle(tenantInfoRequest);
    }
}

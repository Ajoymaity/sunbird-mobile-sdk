import {ApiConfig, ApiRequestHandler, ApiService, HttpRequestType, Request} from '../../api';
import {UserFeedResponse, UserFeed} from '../def/user-feed-response';
import {Observable} from 'rxjs';
import {SdkConfig} from '../../sdk-config';
import {map} from 'rxjs/operators';
import { ProfileServiceConfig } from '../config/profile-service-config';

export class GetUserFeedHandler implements ApiRequestHandler<undefined, UserFeed[]> {

    private static readonly GET_USER_FEED = '/feed';

    private readonly apiConfig: ApiConfig;
    private readonly profileServiceConfig: ProfileServiceConfig;

    constructor(
        private sdkConfig: SdkConfig,
        private apiService: ApiService
    ) {
        this.profileServiceConfig = this.sdkConfig.profileServiceConfig;
        this.apiConfig = this.sdkConfig.apiConfig;
    }

    handle(uid): Observable<UserFeed[]> {
        return this.fetchFromServer(uid);
    }

    fetchFromServer(uid): Observable<UserFeed[]> {
        console.log('URLPATH', this.profileServiceConfig.profileApiPath + GetUserFeedHandler.GET_USER_FEED
        + '/' + uid);
        return this.apiService.fetch<{result: { response: { userFeed: UserFeed[]} }}>(
            new Request.Builder()
                .withHost(this.apiConfig.host)
                .withType(HttpRequestType.GET)
                .withPath(this.profileServiceConfig.profileApiPath + GetUserFeedHandler.GET_USER_FEED
                    + '/' + uid)
                .withApiToken(true)
                .withSessionToken(true)
                .build()
        ).pipe(
            map((response) => {
                console.log('Response', response);
                return response.body.result.response.userFeed;
            })
        );
    }

}

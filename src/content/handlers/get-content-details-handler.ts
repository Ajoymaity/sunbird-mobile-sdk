import {ApiRequestHandler, ApiService, HttpRequestType, Request} from '../../api';
import {ContentDetailRequest} from '../def/requests';
import {Content, ContentData} from '../def/content';
import {Observable} from 'rxjs';
import {DbService} from '../../db';
import {ContentEntry} from '../db/schema';
import {ContentMapper} from '../def/ContentMapper';
import {ContentServiceConfig} from '../config/content-config';
import {SessionAuthenticator} from '../../auth';
import {QueryBuilder} from '../../db/util/query-builder';

export class GetContentDetailsHandler implements ApiRequestHandler<ContentDetailRequest, Content> {
    private readonly GET_CONTENT_DETAILS_ENDPOINT = 'read/';

    constructor(private dbService: DbService,
                private contentServiceConfig: ContentServiceConfig,
                private sessionAuthenticator: SessionAuthenticator,
                private apiService: ApiService) {
    }

    handle(request: ContentDetailRequest): Observable<Content> {
        return this.readContentFromDB(request.contentId)
            .mergeMap((rows: ContentEntry.SchemaMap[] | undefined) => {
                if (rows && rows[0]) {
                    return Observable.of(ContentMapper.mapContentDBEntryToContent(rows[0]));
                }

                return this.fetchFromServer(request)
                    .map((contentData: ContentData) => {
                        return ContentMapper.mapContentDBEntryToContent(ContentMapper.mapContentDataToContentDBEntry(contentData));
                    });
            });
    }

    private readContentFromDB(contentId: string): Observable<ContentEntry.SchemaMap[]> {
        return this.dbService.read({
            table: ContentEntry.TABLE_NAME,
            selection: new QueryBuilder()
                .where('? = ?')
                .args([ContentEntry.COLUMN_NAME_IDENTIFIER, contentId])
                .end()
                .build(),
            limit: '1'
        });
    }

    private fetchFromServer(request: ContentDetailRequest): Observable<ContentData> {
        return this.apiService.fetch<{ result: ContentData }>(new Request.Builder()
            .withType(HttpRequestType.GET)
            .withPath(this.contentServiceConfig.apiPath + this.GET_CONTENT_DETAILS_ENDPOINT + request.contentId)
            .withApiToken(true)
            .withInterceptors([this.sessionAuthenticator])
            .build())
            .map((response) => {
                return response.body.result;
            });
    }
}


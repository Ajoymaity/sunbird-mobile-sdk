import {ApiRequestHandler, ApiService} from '../../api';
import {PageAssemble, PageAssembleCriteria, PageName, PageServiceConfig} from '..';
import {CachedItemRequestSourceFrom, CachedItemStore, KeyValueStore} from '../../key-value-store';
import {Observable} from 'rxjs';
import {SharedPreferences} from '../../util/shared-preferences';
import {AuthService} from '../../auth';
import {FrameworkService} from '../../framework';
import {SystemSettingsService} from '../../system-settings';
import {ContentService} from '../../content';
import {DefaultRequestDelegate} from './delegates/default-request-delegate';
import {DialcodeRequestDelegate} from './delegates/dialcode-request-delegate';
import {CourseRequestDelegate} from './delegates/course-request-delegate';

export class PageAssemblerFactory implements ApiRequestHandler<PageAssembleCriteria, PageAssemble> {
    private readonly defaultRequestDelegate: DefaultRequestDelegate;
    private readonly dialcodeRequestDelegate: DialcodeRequestDelegate;
    private readonly courseRequestDelegate: CourseRequestDelegate;

    constructor(
        private apiService: ApiService,
        private pageApiServiceConfig: PageServiceConfig,
        private cachedItemStore: CachedItemStore,
        private keyValueStore: KeyValueStore,
        private sharedPreferences: SharedPreferences,
        private frameworkService: FrameworkService,
        private authService: AuthService,
        private systemSettingsService: SystemSettingsService,
        private contentService: ContentService
    ) {
        this.defaultRequestDelegate = new DefaultRequestDelegate(
            apiService,
            pageApiServiceConfig,
            sharedPreferences,
            cachedItemStore,
            keyValueStore,
        );

        this.dialcodeRequestDelegate = new DialcodeRequestDelegate(
            this.defaultRequestDelegate,
            contentService
        );

        this.courseRequestDelegate = new CourseRequestDelegate(
            this.defaultRequestDelegate,
            authService,
            frameworkService,
            systemSettingsService,
        );
    }

    handle(request: PageAssembleCriteria): Observable<PageAssemble> {
        request.from = request.from || CachedItemRequestSourceFrom.CACHE;

        switch (request.name) {
            case PageName.COURSE: {
                return this.courseRequestDelegate.handle(request);
            }
            case PageName.DIAL_CODE: {
                return this.dialcodeRequestDelegate.handle(request);
            }
            default: {
                return this.defaultRequestDelegate.handle(request);
            }
        }
    }
}

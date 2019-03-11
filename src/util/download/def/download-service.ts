import {Observable} from 'rxjs';
import {SdkServiceOnInitDelegate} from '../../../sdk-service-on-init-delegate';
import {DownloadCancelRequest, DownloadRequest} from './requests';

export interface DownloadService extends SdkServiceOnInitDelegate {
    download(downloadRequests: DownloadRequest[]): Observable<undefined>;

    cancel(cancelRequest: DownloadCancelRequest): Observable<undefined>;
}

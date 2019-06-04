import {StorageDestination} from './storage-destination';
import {Observable} from 'rxjs';
import {Content} from '../..';
import {TransferContentsRequest} from './storage-requests';

export interface StorageService {
    getStorageDestination(): Observable<StorageDestination>;

    getToTransferContents(): Observable<Content[]>;

    getTransferringContent(): Observable<Content | undefined>;

    transferContents(transferContentsRequest: TransferContentsRequest): Observable<undefined>;

    cancelTransfer(): Observable<undefined>;

    retryCurrentTransfer(): Observable<undefined>;
}

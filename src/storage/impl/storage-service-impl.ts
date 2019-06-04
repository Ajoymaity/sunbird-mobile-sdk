import {StorageDestination, StorageEventType, StorageService, StorageTransferRevertCompleted, TransferContentsRequest} from '..';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Content} from '../../content';
import {inject, injectable} from 'inversify';
import {EventNamespace, EventsBusService} from '../../events-bus';
import {InjectionTokens} from '../../injection-tokens';
import {StorageKeys} from '../../preference-keys';
import {SharedPreferences} from '../../util/shared-preferences';
import {SharedPreferencesSetCollection} from '../../util/shared-preferences/def/shared-preferences-set-collection';
import {SharedPreferencesSetCollectionImpl} from '../../util/shared-preferences/impl/shared-preferences-set-collection-impl';
import {SdkServiceOnInitDelegate} from '../../sdk-service-on-init-delegate';
import {DbService} from '../../db';
import {ContentEntry} from '../../content/db/schema';
import {ContentMapper} from '../../content/util/content-mapper';
import {TransferContentHandler} from '../handler/transfer-content-handler';

@injectable()
export class StorageServiceImpl implements StorageService, SdkServiceOnInitDelegate {
    private static readonly STORAGE_DESTINATION = StorageKeys.KEY_STORAGE_DESTINATION;
    private transferringContent$: BehaviorSubject<Content | undefined> = new BehaviorSubject<Content | undefined>(undefined);
    private contentsToTransfer: SharedPreferencesSetCollection<Content>;
    private transferContentsSubscription?: Subscription;

    constructor(@inject(InjectionTokens.EVENTS_BUS_SERVICE) private eventsBusService: EventsBusService,
                @inject(InjectionTokens.SHARED_PREFERENCES) private sharedPreferences: SharedPreferences,
                @inject(InjectionTokens.DB_SERVICE) private dbService: DbService) {
        this.contentsToTransfer = new SharedPreferencesSetCollectionImpl(
            this.sharedPreferences,
            StorageKeys.KEY_TO_TRANSFER_LIST,
            (item: Content) => item.identifier
        );
    }

    onInit(): Observable<undefined> {
        return this.cancelTransfer();
    }

    getStorageDestination(): Observable<StorageDestination> {
        return this.sharedPreferences.getString(StorageServiceImpl.STORAGE_DESTINATION)
            .map((r) => {
                if (!r) {
                    return StorageDestination.INTERNAL_STORAGE;
                }

                return r as StorageDestination;
            });
    }

    getToTransferContents(): Observable<Content[]> {
        return this.contentsToTransfer.asListChanges();
    }

    getTransferringContent(): Observable<Content | undefined> {
        return this.transferringContent$.asObservable().take(1);
    }

    transferContents(transferContentsRequest: TransferContentsRequest): Observable<undefined> {
        if (this.transferContentsSubscription) {
            this.transferContentsSubscription.unsubscribe();
            this.transferContentsSubscription = undefined;
        }

        return Observable.of(transferContentsRequest)
            .mergeMap(this.getContentsToTransfer)
            .mergeMap(this.addContentsToTransferQueue)
            .mergeMap(this.switchToNextContent)
            .do(() => {
                this.transferContentsSubscription = this.transferringContent$
                    .mergeMap((content?: Content) => {
                        if (content) {
                            return new TransferContentHandler().handle(
                                transferContentsRequest.storageDestination,
                                content
                            ).do(this.switchToNextContent().toPromise);
                        }

                        return Observable.of(undefined);
                    })
                    .catch((e) => {
                        console.error(e);
                        return this.pauseTransferContent();
                    })
                    .finally(() => {
                        if (this.transferContentsSubscription) {
                            this.transferContentsSubscription.unsubscribe();
                            this.transferContentsSubscription = undefined;
                        }
                    })
                    .subscribe();
            })
            .mapTo(undefined);
    }

    cancelTransfer(): Observable<undefined> {
        return this.pauseTransferContent()
            .mergeMap(() => Observable.zip(
                this.deleteTempDirectories(),
                this.clearTransferQueue()
            ))
            .mapTo(undefined)
            .do(() => this.eventsBusService.emit({
                namespace: EventNamespace.STORAGE,
                event: {
                    type: StorageEventType.TRANSFER_REVERT_COMPLETED,
                } as StorageTransferRevertCompleted
            }))
            .finally(this.endTransfer);
    }

    retryCurrentTransfer(): Observable<undefined> {
        return this.switchToNextContent();
    }

    private deleteTempDirectories(): Observable<undefined> {
        // TODO
        throw new Error('To be implemented');
    }

    private getContentsToTransfer(transferContentsRequest: TransferContentsRequest): Observable<Content[]> {
        if (!!transferContentsRequest.contents.length) {
            return Observable.of(transferContentsRequest.contents);
        }

        return this.dbService
            .read({table: ContentEntry.TABLE_NAME})
            .map((contentEntries) => contentEntries.map(ContentMapper.mapContentDBEntryToContent));
    }

    private addContentsToTransferQueue(contents: Content[]): Observable<undefined> {
        return this.contentsToTransfer.addAll(contents).mapTo(undefined);
    }

    private switchToNextContent(): Observable<undefined> {
        return this.contentsToTransfer.asList()
            .do((contents) => {
                if (contents.length) {
                    return this.transferringContent$.next(contents[0]);
                }

                this.getStorageDestination()
                    .mergeMap((storageDestination) =>
                        storageDestination === StorageDestination.INTERNAL_STORAGE ?
                            StorageDestination.EXTERNAL_STORAGE : StorageDestination.INTERNAL_STORAGE)
                    .mergeMap(this.endTransfer);
            }).mapTo(undefined);
    }

    private pauseTransferContent(): Observable<undefined> {
        return Observable.defer(() => this.transferringContent$.next(undefined));
    }

    private clearTransferQueue(): Observable<undefined> {
        return this.contentsToTransfer.clear().mapTo(undefined);
    }

    private endTransfer(): Observable<undefined> {
        return Observable.defer(() => this.transferringContent$.complete());
    }
}

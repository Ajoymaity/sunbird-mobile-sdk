import { Observable } from 'rxjs';
import { FileService } from '../../../util/file/def/file-service';
import { TransferContentContext } from '../transfer-content-handler';
import { DbService } from '../../../db';
import { AppConfig } from '../../../api/config/app-config';
import { DeviceInfo } from '../../../util/device';
export declare class StoreDestinationContentInDb {
    private appConfig;
    private fileService;
    private dbService;
    private deviceInfo;
    static MANIFEST_FILE_NAME: string;
    constructor(appConfig: AppConfig, fileService: FileService, dbService: DbService, deviceInfo: DeviceInfo);
    execute(context: TransferContentContext): Observable<void>;
    private getNewlyAddedContents;
    private addDestinationContentInDb;
    private extractContentFromItem;
}

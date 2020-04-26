import {DbService, Migration} from '..';
import {NetworkQueueEntry} from '../../api/network-queue/db/schema';
import {map} from 'rxjs/operators';
import {TelemetryProcessedEntry} from '../../telemetry/db/schema';
import {HttpRequestType, HttpSerializer, Request} from '../../api';
import {NetworkQueue, NetworkQueueRequest, NetworkQueueType} from '../../api/network-queue';
import {TelemetrySyncHandler} from '../../telemetry/handler/telemetry-sync-handler';
import {TelemetryConfig} from '../../telemetry/config/telemetry-config';
import {NetworkRequestHandler} from '../../api/network-queue/handlers/network-request-handler';
import {SdkConfig} from '../../sdk-config';

export class NetworkQueueMigration extends Migration {

  constructor(private sdkConfig: SdkConfig,
              private networkQueue: NetworkQueue) {
    super(14, 27);
  }

  public async apply(dbService: DbService) {
    await Promise.all(this.queries().map((query) => dbService.execute(query).toPromise()));
    await dbService.read({
      table: TelemetryProcessedEntry.TABLE_NAME,
      selection: '',
      selectionArgs: []
    }).pipe(
      map((rows: TelemetryProcessedEntry.SchemaMap[]) => {
        rows.forEach(async (processedEventsBatchEntry: TelemetryProcessedEntry.SchemaMap) => {
          if (processedEventsBatchEntry) {
            const messageId = processedEventsBatchEntry[TelemetryProcessedEntry.COLUMN_NAME_MSG_ID];
            const data = processedEventsBatchEntry[TelemetryProcessedEntry.COLUMN_NAME_DATA];
            const eventsCount = processedEventsBatchEntry[TelemetryProcessedEntry.COLUMN_NAME_NUMBER_OF_EVENTS];
            await this.networkQueue.enqueue(new NetworkRequestHandler(this.sdkConfig).generateNetworkQueueRequest(
              NetworkQueueType.TELEMETRY, data, messageId, eventsCount, false), false).toPromise();
            await dbService.execute(
              `DELETE FROM ${TelemetryProcessedEntry.TABLE_NAME} WHERE ${TelemetryProcessedEntry.COLUMN_NAME_MSG_ID}='${messageId}'`)
              .toPromise();
          }
        });
      })
    ).toPromise();
    return undefined;
  }

  queries(): Array<string> {
    return [
      NetworkQueueEntry.getCreateEntry()
    ];
  }
}

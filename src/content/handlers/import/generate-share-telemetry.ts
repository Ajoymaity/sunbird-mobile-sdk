import {ImportContentContext} from '../..';
import {Response} from '../../../api';
import {Item, ShareDirection, ShareItemType, ShareType, TelemetryService, TelemetryShareRequest} from '../../../telemetry';
import {ContentUtil} from '../../util/content-util';

export class GenerateShareTelemetry {

    constructor(private telemetryService: TelemetryService) {
    }

    execute(importContentContext: ImportContentContext): Promise<Response> {
        const response: Response = new Response();
        const metaData = importContentContext.metadata;
        const items: Item[] = [];
        for (const element of importContentContext.items!) {
            const item: Item = {
                type: ShareItemType.CONTENT,
                origin: ContentUtil.readOriginFromContentMap(element),
                identifier: element.identifier,
                pkgVersion: Number(element.pkgVersion),
                transferCount: ContentUtil.readTransferCountFromContentMap(element),
                size: ContentUtil.readSizeFromContentMap(element)
            };
        }
        const req: TelemetryShareRequest = {
            dir: ShareDirection.IN,
            type: ShareType.FILE.valueOf(),
            items: items,
            env: 'sdk'
        };
        return this.telemetryService.share(req).toPromise().then(() => {
            response.body = importContentContext;
            return Promise.resolve(response);
        }).catch(() => {
            return Promise.reject(response);
        });
    }
}

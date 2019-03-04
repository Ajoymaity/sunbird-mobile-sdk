import {
    Environment,
    ImpressionSubtype,
    ImpressionType,
    InteractSubtype,
    InteractType,
    LogLevel,
    LogType,
    PageId,
    ShareItemType
} from './telemetry-constants';
import {CorrelationData, DeviceSpecification, Rollup, Visit} from './telemetry-model';

export class TelemetryInteractRequest {
    type: InteractType;
    subType: InteractSubtype;
    id: string;
    pageId: PageId;
    pos: Array<{ [index: string]: string }> = [];
    values: Array<{ [index: string]: any }> = [];
    env: Environment;
    rollup: Rollup;
    valueMap: { [index: string]: any };
    correlationData: Array<CorrelationData>;
    objId: string;
    objType: string;
    objVer: string;
}

export class TelemetryErrorRequest {
    errorCode: string;
    errorType: string;
    stacktrace: string;
    pageId: PageId;
    env: Environment;
}

export class TelemetryImpressionRequest {
    type: ImpressionType;
    subType: ImpressionSubtype;
    pageId: PageId;
    uri: string;
    visits: Visit[];
    env: Environment;
    objId: string;
    objType: string;
    objVer: string;
    correlationData: Array<CorrelationData>;
    rollup?: Rollup;
}

export class TelemetryStartRequest {
    type: string;
    deviceSpecification: DeviceSpecification;
    loc: string;
    mode: string;
    duration: number;
    pageId: PageId;
    env: Environment;
    objId: string;
    objType: string;
    objVer: string;
    rollup: Rollup;
    correlationData: Array<CorrelationData>;
}

export class TelemetryEndRequest {
    env: Environment;
    type: string;
    mode: string;
    duration: number;
    pageId: PageId;
    objId: string;
    objType: string;
    objVer: string;
    rollup: Rollup;
    summaryList: Array<{ [index: string]: any }>;
    correlationData: Array<CorrelationData>;
}

export class TelemetryLogRequest {
    type: LogType;
    level: LogLevel;
    message: string;
    pageId: PageId;
    params: Array<{ [index: string]: any }>;
    env: Environment;
    actorType: string;
}

export class TelemetryShareRequest {
    dir: string;
    type: string;
    items: Array<Item> = [];
    env: string;

}

export interface Item {
    type: ShareItemType;
    origin: string;
    identifier: string;
    pkgVersion: number;
    transferCount: number;
    size: string;
}


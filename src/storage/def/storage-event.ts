import {EventsBusEvent} from '../../events-bus';

export interface StorageEvent extends EventsBusEvent {
    type: StorageEventType;
}

export interface StorageTransferProgress extends StorageEvent {
    type: StorageEventType.TRANSFER_PROGRESS;
    payload: {
        progress: {
            transferredCount: number,
            totalCount: number
        };
    };
}

export interface StorageTransferCompleted extends StorageEvent {
    type: StorageEventType.TRANSFER_COMPLETED;
    payload: undefined;
}

export interface StorageTransferRevertCompleted extends StorageEvent {
    type: StorageEventType.TRANSFER_REVERT_COMPLETED;
    payload: undefined;
}

export interface StorageTransferFailed extends StorageEvent {
    type: StorageEventType.TRANSFER_FAILED;
    payload: {
        error: any;
        directory: string;
    };
}

export interface StorageTransferFailedDuplicateContent extends StorageEvent {
    type: StorageEventType.TRANSFER_FAILED_DUPLICATE_CONTENT;
    payload: undefined;
}

export enum StorageEventType {
    TRANSFER_PROGRESS = 'TRANSFER_PROGRESS',
    TRANSFER_COMPLETED = 'TRANSFER_COMPLETED',
    TRANSFER_REVERT_COMPLETED = 'TRANSFER_REVERT_COMPLETED',
    TRANSFER_FAILED = 'TRANSFER_FAILED',
    TRANSFER_FAILED_DUPLICATE_CONTENT = 'TRANSFER_FAILED_DUPLICATE_CONTENT'
}

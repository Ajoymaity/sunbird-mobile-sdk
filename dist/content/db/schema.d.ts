export declare namespace ContentEntry {
    const TABLE_NAME = "content";
    const _ID = "_id";
    const COLUMN_NAME_IDENTIFIER = "identifier";
    const COLUMN_NAME_SERVER_DATA = "server_data";
    const COLUMN_NAME_LOCAL_DATA = "local_data";
    const COLUMN_NAME_MIME_TYPE = "mime_type";
    const COLUMN_NAME_PATH = "path";
    const COLUMN_NAME_INDEX = "search_index";
    const COLUMN_NAME_VISIBILITY = "visibility";
    const COLUMN_NAME_SERVER_LAST_UPDATED_ON = "server_last_updated_on";
    const COLUMN_NAME_LOCAL_LAST_UPDATED_ON = "local_last_updated_on";
    const COLUMN_NAME_MANIFEST_VERSION = "manifest_version";
    const COLUMN_NAME_REF_COUNT = "ref_count";
    const COLUMN_NAME_CONTENT_STATE = "content_state";
    const COLUMN_NAME_CONTENT_TYPE = "content_type";
    const COLUMN_NAME_AUDIENCE = "audience";
    const COLUMN_NAME_PRAGMA = "pragma";
    const COLUMN_NAME_UID = "uid";
    const COLUMN_NAME_SIZE_ON_DEVICE = "size_on_device";
    interface SchemaMap {
        [_ID]: string;
        [COLUMN_NAME_IDENTIFIER]: string;
        [COLUMN_NAME_SERVER_DATA]: string;
        [COLUMN_NAME_LOCAL_DATA]: string;
        [COLUMN_NAME_MIME_TYPE]: string;
        [COLUMN_NAME_PATH]: string;
        [COLUMN_NAME_INDEX]: string;
        [COLUMN_NAME_VISIBILITY]: string;
        [COLUMN_NAME_SERVER_LAST_UPDATED_ON]: string;
        [COLUMN_NAME_LOCAL_LAST_UPDATED_ON]: string;
        [COLUMN_NAME_MANIFEST_VERSION]: string;
    }
    const getCreateEntry: (() => string);
    const getAlterEntryForRefCount: (() => string);
    const getAlterEntryForContentState: (() => string);
    const getAlterEntryForContentType: (() => string);
    const getAlterEntryForAudience: (() => string);
    const getAlterEntryForUid: (() => string);
    const getDeleteEntry: (() => string);
    const getAlterEntryForContentSize: (() => string);
    const getAlterEntryForPragma: (() => string);
}

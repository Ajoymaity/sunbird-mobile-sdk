export declare namespace ProfileEntry {
    const _ID = "_id";
    const TABLE_NAME = "profiles";
    const COLUMN_NAME_UID = "uid";
    const COLUMN_NAME_HANDLE = "handle";
    const COLUMN_NAME_CREATED_AT = "created_at";
    const COLUMN_NAME_MEDIUM = "medium";
    const COLUMN_NAME_BOARD = "board";
    const COLUMN_NAME_SUBJECT = "subject";
    const COLUMN_NAME_PROFILE_TYPE = "profile_type";
    const COLUMN_NAME_GRADE = "grade";
    const COLUMN_NAME_SYLLABUS = "syllabus";
    const COLUMN_NAME_SOURCE = "source";
    const COLUMN_NAME_GRADE_VALUE = "grade_value";
    interface SchemaMap {
        [COLUMN_NAME_UID]: string;
        [COLUMN_NAME_HANDLE]: string;
        [COLUMN_NAME_CREATED_AT]: number;
        [COLUMN_NAME_MEDIUM]: string;
        [COLUMN_NAME_BOARD]: string;
        [COLUMN_NAME_SUBJECT]: string;
        [COLUMN_NAME_PROFILE_TYPE]: string;
        [COLUMN_NAME_GRADE]: string;
        [COLUMN_NAME_SYLLABUS]: string;
        [COLUMN_NAME_SOURCE]: string;
        [COLUMN_NAME_GRADE_VALUE]: string;
    }
    const getCreateEntry: () => string;
    const deleteTable: (() => string);
    const getAlterEntryForProfileSyllabus: (() => string);
}
export declare namespace UserEntry {
    const _ID = "_id";
    const TABLE_NAME = "users";
    const COLUMN_NAME_UID = "uid";
    const getCreateEntry: (() => string);
    const deleteTable: (() => string);
}
export declare namespace GroupProfileEntry {
    const TABLE_NAME = "group_profile";
    const _ID = "_id";
    const COLUMN_NAME_UID = "uid";
    const COLUMN_NAME_GID = "gid";
    interface SchemaMap {
        [COLUMN_NAME_UID]: string;
        [COLUMN_NAME_GID]: string;
    }
    const getCreateEntry: (() => string);
    const deleteTable: (() => string);
}
export declare namespace GroupEntry {
    const TABLE_NAME = "groups";
    const _ID = "_id";
    const COLUMN_NAME_GID = "gid";
    const COLUMN_NAME_NAME = "name";
    const COLUMN_NAME_SYLLABUS = "syllabus";
    const COLUMN_NAME_GRADE = "grade";
    const COLUMN_NAME_GRADE_VALUE = "grade_value";
    const COLUMN_NAME_CREATED_AT = "created_at";
    const COLUMN_NAME_UPDATED_AT = "updated_at";
    interface SchemaMap {
        [COLUMN_NAME_GID]: string;
        [COLUMN_NAME_NAME]: string;
        [COLUMN_NAME_SYLLABUS]: string;
        [COLUMN_NAME_GRADE]: string;
        [COLUMN_NAME_GRADE_VALUE]: string;
        [COLUMN_NAME_CREATED_AT]: number;
        [COLUMN_NAME_UPDATED_AT]: number;
    }
    const getCreateEntry: (() => string);
    const deleteTable: (() => string);
}
export declare namespace ImportedMetadataEntry {
    const _ID = "_id";
    const TABLE_NAME = "imported_metadata";
    const COLUMN_NAME_IMPORTED_ID = "imported_id";
    const COLUMN_NAME_DEVICE_ID = "device_id";
    const COLUMN_NAME_COUNT = "count";
    const getCreateEntry: (() => string);
    const getDeleteEntry: (() => string);
}
export declare namespace LearnerAssessmentsEntry {
    const _ID = "_id";
    const TABLE_NAME = "learner_assessments";
    const COLUMN_NAME_UID = "uid";
    const COLUMN_NAME_CONTENT_ID = "content_id";
    const COLUMN_NAME_QID = "qid";
    const COLUMN_NAME_Q_INDEX = "qindex";
    const COLUMN_NAME_CORRECT = "correct";
    const COLUMN_NAME_SCORE = "score";
    const COLUMN_NAME_MAX_SCORE = "max_score";
    const COLUMN_NAME_TIME_SPENT = "time_spent";
    const COLUMN_NAME_RES = "res";
    const COLUMN_NAME_TIMESTAMP = "timestamp";
    const COLUMN_NAME_Q_DESC = "qdesc";
    const COLUMN_NAME_Q_TITLE = "qtitle";
    const COLUMN_NAME_HIERARCHY_DATA = "h_data";
    const getCreateEntry: (() => string);
    const getDeleteEntry: (() => string);
}
export declare namespace LearnerSummaryEntry {
    const _ID = "_id";
    const TABLE_NAME = "learner_content_summary";
    const COLUMN_NAME_UID = "uid";
    const COLUMN_NAME_CONTENT_ID = "content_id";
    const COLUMN_NAME_AVG_TS = "avg_ts";
    const COLUMN_NAME_SESSIONS = "sessions";
    const COLUMN_NAME_TOTAL_TS = "total_ts";
    const COLUMN_NAME_LAST_UPDATED_ON = "last_updated_on";
    const COLUMN_NAME_HIERARCHY_DATA = "h_data";
    const getCreateEntry: (() => string);
    const getDeleteEntry: (() => string);
}

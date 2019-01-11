export interface BaseQuery {
    table: string;
}

export interface ReadQuery extends BaseQuery {
    distinct?: boolean;
    columns?: Array<string>;
    selection?: string;
    selectionArgs?: Array<string>;
    groupBy?: string;
    having?: string;
    orderBy?: string;
    limit?: number;
}

export interface UpdateQuery extends BaseQuery {
    selection?: string;
    selectionArgs?: Array<string>;
    modelJson: any;
}

export interface InsertQuery extends BaseQuery {
    modelJson: any;
}

export interface DeleteQuery extends BaseQuery {
    selection: string;
    selectionArgs: Array<string>;
}

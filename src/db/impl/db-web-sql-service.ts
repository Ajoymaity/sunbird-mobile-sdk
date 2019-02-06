import {DbConfig, DbService, DeleteQuery, InsertQuery, Migration, ReadQuery, UpdateQuery} from '..';
import {Observable, Subject} from 'rxjs';
import * as squel from 'squel';
import {InitialMigration} from '../migrations/initial-migration';


export class DbWebSqlService implements DbService {

    webSqlDB: any;

    constructor(private context: DbConfig,
                private dBVersion: number,
                private appMigrationList: Migration[],
    ) {
    }

    public async init(): Promise<undefined> {
        return new Promise<undefined>(((resolve) => {
            this.webSqlDB = window.openDatabase(
                this.context.dbName,
                this.dBVersion + '',
                'Genie web sql DB',
                2 * 1024 * 1024,
                async (database) => {
                    await this.onCreate();
                    resolve();
                });

            this.hasInitialized().subscribe(() => {
                resolve();
            });
        }));
    }

    read(readQuery: ReadQuery): Observable<any[]> {
        const observable = new Subject<any[]>();

        const attachFields = (mixin, fields: string[] = []) => {
            fields.forEach((field) => {
                mixin.field(field);
            });

            return mixin;
        };

        const query = squel.select({
            autoQuoteFieldNames: false
        }).from(readQuery.table);

        attachFields(query, readQuery.columns);

        if (readQuery.groupBy) {
            query.group(readQuery.groupBy);
        }

        if (readQuery.having) {
            query.having(readQuery.having);
        }
        if (readQuery.distinct) {
            query.distinct();
        }
        if (readQuery.orderBy) {
            query.order(readQuery.orderBy);
        }
        if (readQuery.limit) {
            query.limit(parseInt(readQuery.limit, 10));
        }
        if (readQuery.selection && readQuery.selectionArgs) {
            query.where(readQuery.selection, ...readQuery.selectionArgs);
        }


        this.webSqlDB.transaction((tx) => {
            tx.executeSql(query.toString(),
                [], (sqlTransaction, sqlResultSet: SQLResultSet) => {
                    observable.next(Array.from(sqlResultSet.rows));
                    observable.complete();
                }, (sqlTransaction, sqlError) => {
                    observable.error(sqlError);
                });
        });

        return observable;
    }

    insert(inserQuery: InsertQuery): Observable<number> {
        const observable = new Subject<number>();

        const query = squel.insert()
            .into(inserQuery.table)
            .setFields(inserQuery.modelJson)
            .toString();

        this.webSqlDB.transaction((tx) => {
            tx.executeSql(query,
                [], (sqlTransaction, sqlResultSet: SQLResultSet) => {
                    observable.next(sqlResultSet.rowsAffected);
                    observable.complete();
                }, (sqlTransaction, sqlError) => {
                    observable.error(sqlError);
                });
        });

        return observable;
    }

    execute(query: string): Observable<any> {
        const observable = new Subject<any>();

        this.webSqlDB.transaction((tx) => {
            tx.executeSql(query,
                [], (sqlTransaction, sqlResultSet) => {
                    observable.next(Array.from(sqlResultSet.rows));
                    observable.complete();
                }, (sqlTransaction, sqlError) => {
                    observable.error(sqlError);
                });
        });

        return observable;
    }

    update(updateQuery: UpdateQuery): Observable<boolean> {
        const observable = new Subject<boolean>();

        const query = squel.update()
            .table(updateQuery.table);

        if (updateQuery.selection && updateQuery.selectionArgs) {
            query.where(updateQuery.selection, ...updateQuery.selectionArgs);
        }

        const setFields = (mixin, fields: { [key: string]: any }) => {
            Object.keys(fields).forEach((field) => {
                query.set(field, fields[field]);
            });
        };

        setFields(query, updateQuery.modelJson);

        this.webSqlDB.transaction((tx) => {
            tx.executeSql(query.toString(),
                [], (sqlTransaction, sqlResultSet: SQLResultSet) => {
                    observable.next(!!sqlResultSet.rowsAffected);
                    observable.complete();
                }, (sqlTransaction, sqlError) => {
                    observable.error(sqlError);
                });
        });

        return observable;
    }

    delete(deleteQuery: DeleteQuery): Observable<undefined> {
        const observable = new Subject<undefined>();

        const query = squel.delete()
            .from(deleteQuery.table)
            .where(deleteQuery.selection, ...deleteQuery.selectionArgs)
            .toString();

        this.webSqlDB.transaction((tx) => {
            tx.executeSql(query,
                [], (sqlTransaction, sqlResultSet: SQLResultSet) => {
                    observable.next(undefined);
                    observable.complete();
                }, (sqlTransaction, sqlError) => {
                    observable.error(sqlError);
                });
        });

        return observable;
    }

    beginTransaction(): void {
        // TODO
    }

    endTransaction(isOperationSuccessful: boolean): void {
        // TODO
    }

    private hasInitialized(): Observable<undefined> {
        return this.execute('DROP TABLE IF EXISTS dummy_init_table');
    }

    private async onCreate() {
        return new InitialMigration().apply(this);
    }


}

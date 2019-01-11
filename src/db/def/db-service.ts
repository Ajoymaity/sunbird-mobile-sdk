import {DeleteQuery, InsertQuery, ReadQuery, UpdateQuery} from './query';
import {Observable} from 'rxjs';

export abstract class DbService {

    abstract execute(rawQuery: string): Observable<any>;

    abstract read(readQuery: ReadQuery): Observable<any[]>;

    abstract insert(insertQuery: InsertQuery): Observable<number>;

    abstract update(updateQuery: UpdateQuery): Observable<boolean>;

    abstract delete(deleteQuery: DeleteQuery): Observable<number>;

    abstract beginTransaction(): void;

    abstract endTransaction(isOperationSuccessful: boolean): void;

}

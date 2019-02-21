import {KeyValueStore} from '..';
import {Observable} from 'rxjs';
import {DbService} from '../../db';
import {KeyValueStoreEntry} from '../db/schema';
import {Utf8ToB64Encoder} from '../../util/encoders/utf8-to-b64-encoder';

export class KeyValueStoreImpl implements KeyValueStore {
    constructor(private dbService: DbService) {
    }

    getValue(key: string): Observable<string | undefined> {
        return this.dbService.read({
            table: KeyValueStoreEntry.TABLE_NAME,
            columns: [],
            selection: `${KeyValueStoreEntry.COLUMN_NAME_KEY} = ?`,
            selectionArgs: [key]
        }).map((res: { key: string, value: string }[]) => res[0] && res[0].value && this.b64_to_utf8(res[0].value));
    }

    setValue(key: string, value: string): Observable<boolean> {
        return this.getValue(key)
            .mergeMap((response: string | undefined) => {
                if (response) {
                    return this.dbService.update({
                        table: KeyValueStoreEntry.TABLE_NAME,
                        selection: `${KeyValueStoreEntry.COLUMN_NAME_KEY} = ?`,
                        selectionArgs: [key],
                        modelJson: {
                            [KeyValueStoreEntry.COLUMN_NAME_KEY]: key,
                            [KeyValueStoreEntry.COLUMN_NAME_VALUE]: this.utf8_to_b64(value)
                        }
                    });

                } else {
                    return this.dbService.insert({
                        table: KeyValueStoreEntry.TABLE_NAME,
                        modelJson: {
                            [KeyValueStoreEntry.COLUMN_NAME_KEY]: key,
                            [KeyValueStoreEntry.COLUMN_NAME_VALUE]: this.utf8_to_b64(value)
                        }
                    }).map(v => v > 0);
                }
            });
    }

    private utf8_to_b64(str: string) {
        return new Utf8ToB64Encoder().encode(str);
    }

    private b64_to_utf8(str: string) {
        return new Utf8ToB64Encoder().decode(str);
    }
}


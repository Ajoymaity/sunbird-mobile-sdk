import {SharedPreferences} from '..';
import {Observable} from 'rxjs';
import {injectable} from 'inversify';

@injectable()
export class SharedPreferencesAndroid implements SharedPreferences {

    private static readonly sharedPreferncesName = 'org.ekstep.genieservices.preference_file';

    private sharedPreferences = plugins.SharedPreferences.getInstance(SharedPreferencesAndroid.sharedPreferncesName);

    public getString(key: string): Observable<string | undefined> {
        return new Observable((observer) => {
            this.sharedPreferences.getString(key, '', (value) => {
                observer.next(value);
                observer.complete();
            }, (e) => {
                observer.error(e);
            });
        });
    }

    public putString(key: string, value: string): Observable<undefined> {
        return new Observable((observer) => {
            this.sharedPreferences.putString(key, value, () => {
                observer.next(undefined);
                observer.complete();
            }, (e) => {
                observer.error(e);
            });
        });
    }

    public putBoolean(key: string, value: boolean): Observable<boolean> {
        return new Observable((observer) => {
            this.sharedPreferences.putBoolean(key, value, () => {
                observer.next(true);
                observer.complete();
            }, (e) => {
                observer.error(e);
            });
        });
    }

    public getBoolean(key: string): Observable<boolean> {
        return new Observable((observer) => {
            this.sharedPreferences.getBoolean(key, false, (value) => {
                observer.next(value);
                observer.complete();
            }, (e) => {
                observer.error(e);
            });
        });
    }
}

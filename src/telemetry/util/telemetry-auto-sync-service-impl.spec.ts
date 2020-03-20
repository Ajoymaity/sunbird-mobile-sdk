import {TelemetryAutoSyncServiceImpl} from './telemetry-auto-sync-service-impl';
import {TelemetryAutoSyncModes, TelemetryService} from '..';
import {SharedPreferences} from '../../util/shared-preferences';
import {ProfileService, ProfileSource} from '../../profile';
import {CourseService} from '../../course';
import {SdkConfig} from '../../sdk-config';
import {ApiService} from '../../api';
import {DbService} from '../../db';
import {KeyValueStore} from '../../key-value-store';
import {TelemetryKeys} from '../../preference-keys';
import {of} from 'rxjs';
import {take} from 'rxjs/operators';
import advanceTimersByTime = jest.advanceTimersByTime;
import {ContentStatesSyncHandler} from '../../course/handlers/content-states-sync-handler';

jest.mock('../../course/handlers/content-states-sync-handler');

describe('TelemetryAutoSyncServiceImpl', () => {
    let telemetryAutoSyncService: TelemetryAutoSyncServiceImpl;
    const mockTelemetryService = {} as Partial<TelemetryService>;
    const mockSharedPreferences = {} as Partial<SharedPreferences>;
    const mockProfileService = {} as Partial<ProfileService>;
    const mockCourseService = {} as Partial<CourseService>;
    const mockSdkConfig = {} as Partial<SdkConfig>;
    const mockApiService = {} as Partial<ApiService>;
    const mockDbService = {} as Partial<DbService>;
    const mockKeyValueStore = {} as Partial<KeyValueStore>;

    beforeAll(() => {
        telemetryAutoSyncService = new TelemetryAutoSyncServiceImpl(
            mockTelemetryService as TelemetryService,
            mockSharedPreferences as SharedPreferences,
            mockProfileService as ProfileService,
            mockCourseService as CourseService,
            mockSdkConfig as SdkConfig,
            mockApiService as ApiService,
            mockDbService as DbService,
            mockKeyValueStore as KeyValueStore,
        );
    });

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.resetAllMocks();
    });

    it('should be able to create an instance of TelemetryAutoSyncServiceImpl', () => {
        expect(telemetryAutoSyncService).toBeTruthy();
    });

    describe('getSyncMode()', () => {
        it('should default to undefined if no sync mode set', (done) => {
            // arrange
            mockSharedPreferences.getString = jest.fn().mockImplementation(() => of(undefined));

            // act
            telemetryAutoSyncService.getSyncMode().subscribe((mode) => {
                // assert
                expect(mode).toEqual(undefined);
                expect(mockSharedPreferences.getString).toHaveBeenCalledWith(TelemetryKeys.KEY_AUTO_SYNC_MODE);
                done();
            });
        });

        it('should resolve to mode if sync mode is set', (done) => {
            // arrange
            mockSharedPreferences.getString = jest.fn().mockImplementation(() => of(TelemetryAutoSyncModes.ALWAYS_ON));

            // act
            telemetryAutoSyncService.getSyncMode().subscribe((mode) => {
                // assert
                expect(mode).toEqual(TelemetryAutoSyncModes.ALWAYS_ON);
                expect(mockSharedPreferences.getString).toHaveBeenCalledWith(TelemetryKeys.KEY_AUTO_SYNC_MODE);
                done();
            });
        });
    });

    describe('setSyncMode()', () => {
        it('should be able to set sync mode', (done) => {
            // arrange
            mockSharedPreferences.putString = jest.fn().mockImplementation(() => of(undefined));

            // act
            telemetryAutoSyncService.setSyncMode(TelemetryAutoSyncModes.OVER_WIFI).subscribe(() => {
                // assert
                expect(mockSharedPreferences.putString).toHaveBeenCalledWith(TelemetryKeys.KEY_AUTO_SYNC_MODE, TelemetryAutoSyncModes.OVER_WIFI);
                done();
            });
        });
    });

    describe('start', () => {
        beforeEach(() => jest.useFakeTimers());

        afterEach(() => jest.clearAllTimers());

        it('should be able to start telemetry sync', (done) => {
            // arrange
            window['downloadManager'] = {
                fetchSpeedLog: jest.fn().mockImplementation(() => {
                    return {};
                })
            };

            mockTelemetryService.sync = jest.fn().mockImplementation(() => {
                return of({
                    syncedEventCount: 0,
                    syncTime: Date.now(),
                    syncedFileSize: 0
                });
            });

            mockProfileService.getActiveSessionProfile = jest.fn().mockImplementation(() => {
                return of({
                    uid: 'SAMPLE_UID',
                    handle: 'SAMPLE_HANDLE',
                    source: ProfileSource.LOCAL
                });
            });

            // act
            telemetryAutoSyncService.start(30000).pipe(
                take(2),
            ).subscribe(() => {}, (e) => {
                console.error(e);
                fail(e);
            }, () => {
                expect(mockTelemetryService.sync).toHaveBeenCalledTimes(2);
                done();
            });

            advanceTimersByTime(61000);
        });

        describe('should generateDownloadSpeedTelemetry every 1 minute', () => {
            it('for start(30000) it should be invoked every 2 iteration', (done) => {
                // arrange
                window['downloadManager'] = {
                    fetchSpeedLog: jest.fn().mockImplementation(() => {
                        return {};
                    })
                };

                mockTelemetryService.sync = jest.fn().mockImplementation(() => {
                    return of({
                        syncedEventCount: 0,
                        syncTime: Date.now(),
                        syncedFileSize: 0
                    });
                });

                mockProfileService.getActiveSessionProfile = jest.fn().mockImplementation(() => {
                    return of({
                        uid: 'SAMPLE_UID',
                        handle: 'SAMPLE_HANDLE',
                        source: ProfileSource.LOCAL
                    });
                });

                // act
                telemetryAutoSyncService.start(30000).pipe(
                    take(4),
                ).subscribe(() => {}, (e) => {
                    console.error(e);
                    fail(e);
                }, () => {
                    expect(window['downloadManager'].fetchSpeedLog).toHaveBeenCalledTimes(2);
                    done();
                });

                advanceTimersByTime((30000 * 4) + 500);
            });

            it('for start(10000) it should be invoked every 6 iteration', (done) => {
                // arrange
                window['downloadManager'] = {
                    fetchSpeedLog: jest.fn().mockImplementation(() => {
                        return {};
                    })
                };

                mockTelemetryService.sync = jest.fn().mockImplementation(() => {
                    return of({
                        syncedEventCount: 0,
                        syncTime: Date.now(),
                        syncedFileSize: 0
                    });
                });

                mockProfileService.getActiveSessionProfile = jest.fn().mockImplementation(() => {
                    return of({
                        uid: 'SAMPLE_UID',
                        handle: 'SAMPLE_HANDLE',
                        source: ProfileSource.LOCAL
                    });
                });

                // act
                telemetryAutoSyncService.start(10000).pipe(
                    take(18),
                ).subscribe(() => {}, (e) => {
                    console.error(e);
                    fail(e);
                }, () => {
                    expect(window['downloadManager'].fetchSpeedLog).toHaveBeenCalledTimes(3);
                    done();
                });

                advanceTimersByTime((10000 * 18) + 500);
            });
        });

        it('should attempt Course progress and Assessment sync if online user', (done) => {
            // arrange
            window['downloadManager'] = {
                fetchSpeedLog: jest.fn().mockImplementation(() => {
                    return {};
                })
            };

            mockTelemetryService.sync = jest.fn().mockImplementation(() => {
                return of({
                    syncedEventCount: 0,
                    syncTime: Date.now(),
                    syncedFileSize: 0
                });
            });

            mockProfileService.getActiveSessionProfile = jest.fn().mockImplementation(() => {
                return of({
                    uid: 'SAMPLE_UID',
                    handle: 'SAMPLE_HANDLE',
                    source: ProfileSource.SERVER
                });
            });

            mockCourseService.syncAssessmentEvents = jest.fn().mockImplementation(() => of(undefined));

            const mockUpdateContentState = jest.fn().mockImplementation(() => of(undefined));
            (ContentStatesSyncHandler as any).mockImplementation(() => {
                return {
                    updateContentState: mockUpdateContentState
                };
            });

            // act
            telemetryAutoSyncService.start(30000).pipe(
                take(1),
            ).subscribe(() => {}, (e) => {
                console.error(e);
                fail(e);
            }, () => {
                expect(mockTelemetryService.sync).toHaveBeenCalledTimes(1);

                jest.useRealTimers();

                setTimeout(() => {
                    expect(mockCourseService.syncAssessmentEvents).toHaveBeenCalledWith(expect.objectContaining({ persistedOnly: true }));
                    expect(mockUpdateContentState).toHaveBeenCalled();
                    done();
                });
            });

            advanceTimersByTime(31000);
        });
    });

    describe('pause/continue', () => {
        beforeEach(() => jest.useFakeTimers());

        afterEach(() => jest.clearAllTimers());

        it('should be able to start telemetry sync', (done) => {
            // arrange
            window['downloadManager'] = {
                fetchSpeedLog: jest.fn().mockImplementation(() => {
                    return {};
                })
            };

            mockTelemetryService.sync = jest.fn().mockImplementation(() => {
                return of({
                    syncedEventCount: 0,
                    syncTime: Date.now(),
                    syncedFileSize: 0
                });
            });

            mockProfileService.getActiveSessionProfile = jest.fn().mockImplementation(() => {
                return of({
                    uid: 'SAMPLE_UID',
                    handle: 'SAMPLE_HANDLE',
                    source: ProfileSource.LOCAL
                });
            });

            // act
            telemetryAutoSyncService.start(30000).pipe(
                take(2),
            ).subscribe(() => {}, (e) => {
                console.error(e);
                fail(e);
            }, () => {
                expect(mockTelemetryService.sync).toHaveBeenCalledTimes(2);
                done();
            });

            advanceTimersByTime(31000);

            telemetryAutoSyncService.pause();

            advanceTimersByTime(31000);

            telemetryAutoSyncService.continue();

            advanceTimersByTime(31000);
        });
    });
});

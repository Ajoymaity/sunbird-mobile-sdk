import {ApiRequestHandler} from '../../api';
import {ProducerData, SunbirdTelemetry} from '../../telemetry';
import {Observable} from 'rxjs';
import {SummarizerService} from '..';
import Telemetry = SunbirdTelemetry.Telemetry;
import {ContentState, ContentStateResponse, CourseService, GetContentStateRequest, UpdateContentStateRequest} from '../../course';
import {SharedPreferences} from '../../util/shared-preferences';
import {ContentKeys} from '../../preference-keys';
import {AssesmentAnalyzer} from '../assesment-analyzer';

export class SummaryTelemetryEventHandler implements ApiRequestHandler<Telemetry, undefined> {
    private static readonly CONTENT_PLAYER_PID = 'contentplayer';

    private currentUID?: string = undefined;
    private currentContentID?: string = undefined;
    private courseContext = {};

    constructor(private courseService: CourseService,
                private sharedPreference: SharedPreferences,
                private summarizerService: SummarizerService) {
    }

    private static checkPData(pdata: ProducerData): boolean {
        if (pdata != null && pdata.pid !== null) {
            return pdata.pid.includes(SummaryTelemetryEventHandler.CONTENT_PLAYER_PID);
        }
        return false;
    }

    private static checkIsCourse(event: SunbirdTelemetry.Telemetry): boolean {
        if (event.object != null && event.object.type && event.object.type.toLowerCase() === 'course') {
            return true;
        }

        return false;
    }

    private setCourseContextEmpty(): Observable<undefined> {
        return this.sharedPreference.putString(ContentKeys.COURSE_CONTEXT, '');
    }

    private getCourseContext(): Observable<any> {
        if (this.courseContext) {
            return Observable.of(this.courseContext);
        } else {
            return this.sharedPreference.getString(ContentKeys.COURSE_CONTEXT).map((value: string | undefined) => {
                if (value) {
                    this.courseContext = JSON.parse(value);
                    return Observable.of(this.courseContext);
                } else {
                    return Observable.of({});
                }

            });
        }
    }


    handle(event: SunbirdTelemetry.Telemetry): Observable<undefined> {
        if (event.eid === 'START' && SummaryTelemetryEventHandler.checkPData(event.context.pdata)) {


            return this.processOEStart(event)
                .do(() => this.summarizerService.saveLearnerAssessmentDetails(event).mapTo(undefined))
                .do(async () => {
                    await this.getCourseContext().mergeMap(() => {
                        return this.updateContentState(event);
                    }).toPromise();
                });
        } else if (event.eid === 'START' && SummaryTelemetryEventHandler.checkIsCourse(event)) {
            return this.getCourseContext().mapTo(undefined);
        } else if (event.eid === 'ASSESS' && SummaryTelemetryEventHandler.checkPData(event.context.pdata)) {
            return this.processOEAssess(event)
                .do(async () => this.summarizerService.saveLearnerAssessmentDetails(event)
                    .mapTo(undefined).toPromise()
                );
        } else if (event.eid === 'END' && SummaryTelemetryEventHandler.checkPData(event.context.pdata)) {
            return this.processOEEnd(event)
                .do(async () => this.summarizerService.saveLearnerContentSummaryDetails(event)
                    .mapTo(undefined).toPromise()
                )
                .do(async () => {
                    await this.getCourseContext().mergeMap(() => {
                        return this.updateContentState(event);
                    }).toPromise();
                });
        } else if (event.eid === 'END' && SummaryTelemetryEventHandler.checkIsCourse(event)) {
            return this.setCourseContextEmpty();
        } else {
            return Observable.of(undefined);
        }
    }

    // private updateContentState(eid: string, objId: string): Observable<boolean> {
    //     this.sharedPreference.getString(ContentKeys.COURSE_CONTEXT).mergeMap((value: string | undefined) => {
    //         this.courseContext = JSON.parse(value!);
    //         if(this.courseContext){
    //             const userId = this.courseContext['userId'];
    //             const courseId = this.courseContext['courseId'];
    //             const batchId = this.courseContext['batchId'];
    //             const batchStatus = this.courseContext['batchStatus'];
    //
    //         }
    //     });
    // }

    updateContentState(event: Telemetry): Observable<undefined> {
        return this.getCourseContext().mergeMap((courseContext: any) => {
            const userId = courseContext['userId'];
            const courseId = courseContext['courseId'];
            const batchId = courseContext['batchId'];
            let batchStatus = 0;
            if (courseContext.hasOwnProperty('batchStatus')) {
                batchStatus = courseContext['batchStatus'];
            }

            const BATCH_IN_PROGRESS = 1;
            if (batchStatus === BATCH_IN_PROGRESS) { // If the batch is expired then do not update content status.
                const contentId = event.object.id;
                return this.checkStatusOfContent(userId, courseId, batchId, contentId)
                    .mergeMap((status: number) => {
                        if (event.eid === 'START' && status === 0) {
                            const updateContentStateRequest: UpdateContentStateRequest = {
                                userId: userId,
                                contentId: contentId,
                                courseId: courseId,
                                batchId: batchId,
                                status: 1,
                                progress: 5
                            };

                            return this.courseService.updateContentState(updateContentStateRequest)
                                .mapTo(undefined);
                        } else if ((event.eid === 'START' && status === 0) ||
                            (event.eid === 'END' && status === 1)) {
                            const updateContentStateRequest: UpdateContentStateRequest = {
                                userId: userId,
                                contentId: contentId,
                                courseId: courseId,
                                batchId: batchId,
                                status: 2,
                                progress: 100
                            };

                            return this.courseService.updateContentState(updateContentStateRequest)
                                .mapTo(undefined);
                        } else {
                            return Observable.of(undefined);
                        }
                    });
            } else {
                return Observable.of(undefined);
            }

        });
    }

    private checkStatusOfContent(userId: string, courseId: string, batchId: string, contentId: string): Observable<number> {
        const contentStateRequest: GetContentStateRequest = {
            userId: userId,
            batchId: batchId,
            contentIds: [contentId],
            courseIds: [courseId]
        };

        return this.courseService.getContentState(contentStateRequest).map((contentStateResponse?: ContentStateResponse) => {
            const contentStateList: ContentState[] = contentStateResponse! && contentStateResponse!.contentList;
            return this.getStatus(contentStateList, contentId);
        });
    }

    private getStatus(contentStateList: ContentState[], contentId): number {
        if (!contentStateList || !contentStateList.length) {
            return 0;
        }
        contentStateList.forEach((contentState: ContentState) => {
            if (contentState.contentId === contentId) {
                return contentState.status;
            }
        });
        return 0;
    }


    private processOEStart(event: Telemetry): Observable<undefined> {
        this.currentUID = event.actor.id;
        this.currentContentID = event.object.id;

        return Observable.of(undefined);
    }

    private processOEAssess(event: Telemetry): Observable<undefined> {
        if (
            this.currentUID && this.currentContentID &&
            this.currentUID.toLocaleLowerCase() === event.actor.id.toLocaleLowerCase() &&
            this.currentContentID.toLocaleLowerCase() === event.object.id.toLocaleLowerCase()
        ) {
            return this.summarizerService.deletePreviousAssessmentDetails(
                this.currentUID,
                this.currentContentID
            ).do(() => {
                this.currentUID = undefined;
                this.currentContentID = undefined;
            }).mapTo(undefined);
        }

        return Observable.of(undefined);
    }

    private processOEEnd(event: Telemetry): Observable<undefined> {
        return Observable.of(undefined);
    }
}


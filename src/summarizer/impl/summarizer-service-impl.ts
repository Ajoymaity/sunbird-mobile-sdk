import {SummarizerService} from '../def/summarizer-service';
import {Observable} from 'rxjs';
import {LearnerAssessmentDetails, LearnerAssessmentSummary, LearnerContentSummaryDetails, QuestionSummary} from '../def/response';
import {SummaryRequest} from '../def/request';
import {SummarizerHandler} from '../handler/summarizer-handler';
import {DbService} from '../../db';
import {LearnerAssessmentsEntry, LearnerSummaryEntry} from '../../profile/db/schema';
import {TelemetryEvents} from '../../telemetry';
import {SummarizerQueries} from '../handler/summarizer-queries';
import {KeyValueStoreEntry} from '../../key-value-store/db/schema';
import {NumberUtil} from '../../util/number-util';
import Telemetry = TelemetryEvents.Telemetry;

export class SummarizerServiceImpl implements SummarizerService {

    constructor(private dbService: DbService) {
    }

    getDetailsPerQuestion(request: SummaryRequest): Observable<{ [p: string]: any }[]> {
        const query = SummarizerQueries.getQuetsionDetailsQuery(request.uids, request.contentId, request.qId);
        return this.dbService.execute(query).map((questionSummaries: QuestionSummary[]) =>
            SummarizerHandler.mapDBEntriesToQuestionDetails(questionSummaries));
    }

    getLearnerAssessmentDetails(request: SummaryRequest): Observable<LearnerAssessmentDetails[]> {
        const query = SummarizerQueries.getDetailReportsQuery(request.uids, request.contentId);
        return this.dbService.execute(query).map((assesmentDetailsInDb: LearnerAssessmentsEntry.SchemaMap[]) =>
            SummarizerHandler.mapDBEntriesToLearnerAssesmentDetails(assesmentDetailsInDb));
    }

    getReportByQuestions(request: SummaryRequest): Observable<{ [p: string]: any }[]> {
        const questionReportQuery = SummarizerQueries.getQuetsionDetailsQuery(request.uids, request.contentId, request.qId);
        const accuracyQuery = SummarizerQueries.getReportAccuracyQuery(request.uids, request.contentId);
        return this.dbService.execute(accuracyQuery).map((accuracyReports: LearnerAssessmentsEntry.AccuracySchema[]) =>
            SummarizerHandler.mapDBEntriesToAccuracy(accuracyReports)).mergeMap((accuracyMap: { [p: string]: any }) => {
            return this.dbService.execute(questionReportQuery).map((assesmentDetailsInDb:
                                                                        LearnerAssessmentsEntry.QuestionReportsSchema[]) =>
                SummarizerHandler.mapDBEntriesToQuestionReports(accuracyMap, assesmentDetailsInDb));
        });
    }

    getReportsByUser(request: SummaryRequest): Observable<{ [p: string]: any }[]> {
        const query = SummarizerQueries.getReportsByUserQuery(request.uids, request.contentId);
        return this.dbService.execute(query).map((assesmentDetailsInDb: LearnerAssessmentsEntry.UserReportSchema[]) =>
            SummarizerHandler.mapDBEntriesToUserReports(assesmentDetailsInDb));
    }

    getSummary(request: SummaryRequest): Observable<LearnerAssessmentSummary[]> {
        let query;
        if (request.uids) {
            query = SummarizerQueries.getChildProgressQuery(request.uids);
        } else if (request.contentId) {
            query = SummarizerQueries.getContentProgressQuery(request.contentId);
        }
        return this.dbService.execute(query).map((assesmentsInDb: LearnerSummaryEntry.SchemaMap[]) =>
            SummarizerHandler.mapDBEntriesToLearnerAssesmentSummary(assesmentsInDb));
    }

    saveLearnerAssessmentDetails(event: Telemetry): Observable<boolean> {
        const learnerAssesmentDetils: LearnerAssessmentDetails = SummarizerHandler.mapTelemetryToLearnerAssesmentDetails(event);
        const learnerAssessmentDbSchema: LearnerAssessmentsEntry.SchemaMap =
            SummarizerHandler.mapLearnerAssesmentDetailsToDbEntries(learnerAssesmentDetils);
        const filter = SummarizerQueries.getFilterForLearnerAssessmentDetails(learnerAssesmentDetils.qid, learnerAssesmentDetils.uid,
            learnerAssesmentDetils.contentId, learnerAssesmentDetils.hierarchyData);
        const query = SummarizerQueries.getLearnerAssessmentsQuery(filter);
        return this.dbService.execute(query)
            .mergeMap((rows: LearnerAssessmentsEntry.SchemaMap[]) => {
                if (rows) {
                    return this.dbService.update({
                        table: LearnerAssessmentsEntry.TABLE_NAME,
                        selection: SummarizerQueries.getUpdateSelection(),
                        selectionArgs: [learnerAssesmentDetils.uid,
                            learnerAssesmentDetils.contentId,
                            learnerAssesmentDetils.hierarchyData ? learnerAssesmentDetils.hierarchyData : '',
                            learnerAssesmentDetils.qid],
                        modelJson: learnerAssessmentDbSchema
                    });

                } else {
                    return this.dbService.insert({
                        table: KeyValueStoreEntry.TABLE_NAME,
                        modelJson: learnerAssessmentDbSchema
                    }).map(v => v > 0);
                }
            });
    }

    saveLearnerContentSummaryDetails(event: Telemetry): Observable<boolean> {
        const learnerContentSummaryDetails: LearnerContentSummaryDetails = SummarizerHandler.mapTelemetryToContentSummaryDetails(event);
        const learnerAssessmentDbSchema: LearnerSummaryEntry.SchemaMap =
            SummarizerHandler.mapContentSummaryDetailsToDbEntries(learnerContentSummaryDetails);
        return this.dbService.read({
            table: LearnerSummaryEntry.TABLE_NAME,
            selection: SummarizerQueries.getLearnerSummaryReadSelection(learnerContentSummaryDetails.hierarchyData),
            selectionArgs: [learnerContentSummaryDetails.uid,
                learnerContentSummaryDetails.contentId,
                learnerContentSummaryDetails.hierarchyData]
        }).mergeMap((rows: LearnerAssessmentsEntry.SchemaMap[]) => {
            if (rows) {
                learnerAssessmentDbSchema.avg_ts = NumberUtil.toPrecision(learnerContentSummaryDetails.timespent /
                    learnerContentSummaryDetails.sessions!);
                learnerAssessmentDbSchema.sessions = learnerContentSummaryDetails.sessions! + 1;
                learnerAssessmentDbSchema.total_ts = learnerContentSummaryDetails.timespent;
                learnerAssessmentDbSchema.last_updated_on = learnerContentSummaryDetails.timestamp;
                return this.dbService.update({
                    table: LearnerAssessmentsEntry.TABLE_NAME,
                    selection: SummarizerQueries.getLearnerSummaryReadSelection(learnerContentSummaryDetails.hierarchyData),
                    selectionArgs: [learnerContentSummaryDetails.uid,
                        learnerContentSummaryDetails.contentId,
                        learnerContentSummaryDetails.hierarchyData],
                    modelJson: learnerAssessmentDbSchema
                });

            } else {
                learnerAssessmentDbSchema.avg_ts = learnerContentSummaryDetails.timespent;
                learnerAssessmentDbSchema.sessions = 1;
                learnerAssessmentDbSchema.total_ts = learnerContentSummaryDetails.timespent;
                learnerAssessmentDbSchema.last_updated_on = learnerContentSummaryDetails.timestamp;
                return this.dbService.insert({
                    table: KeyValueStoreEntry.TABLE_NAME,
                    modelJson: learnerAssessmentDbSchema
                }).map(v => v > 0);
            }
        });
    }

}

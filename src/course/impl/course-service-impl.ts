import {CourseService} from '../def/course-service';
import {Observable} from 'rxjs';
import {
    CourseBatchDetailsRequest,
    CourseBatchesRequest,
    EnrollCourseRequest,
    FetchEnrolledCourseRequest,
    UpdateContentStateRequest
} from '../def/request-types';
import {ApiService} from '../../api';
import {CourseServiceConfig} from '../config/course-service-config';
import {SessionAuthenticator} from '../../auth';
import {Batch} from '../def/batch';
import {ProfileService} from '../../profile';
import {GetBatchDetailsHandler} from '../handlers/get-batch-details-handler';
import {UpdateContentStateHandler} from '../handlers/update-content-state-handler';
import {GetCourseBatchesHandler} from '../handlers/get-course-batches-handler';
import {Course} from '../def/course';
import {GetEnrolledCourseHandler} from '../handlers/get-enrolled-course-handler';
import {EnrollCourseHandler} from '../handlers/enroll-course-handler';
import {KeyValueStore} from '../../key-value-store';

export class CourseServiceImpl implements CourseService {

    constructor(private apiService: ApiService,
                private profileService: ProfileService,
                private courseServiceConfig: CourseServiceConfig,
                private keyValueStore: KeyValueStore,
                private sessionAuthenticator: SessionAuthenticator) {
    }

    getBatchDetails(request: CourseBatchDetailsRequest): Observable<Batch> {
        return new GetBatchDetailsHandler(this.apiService, this.courseServiceConfig, this.sessionAuthenticator)
            .handle(request);
    }

    updateContentState(request: UpdateContentStateRequest): Observable<boolean> {
        return new UpdateContentStateHandler(this.apiService, this.courseServiceConfig, this.sessionAuthenticator)
            .handle(request);
    }

    getCourseBatches(request: CourseBatchesRequest): Observable<Batch[]> {
        return new GetCourseBatchesHandler(
            this.apiService, this.courseServiceConfig, this.sessionAuthenticator, this.profileService)
            .handle(request);
    }

    getEnrolledCourses(request: FetchEnrolledCourseRequest): Observable<Course[]> {
        return new GetEnrolledCourseHandler(
            this.keyValueStore, this.apiService, this.courseServiceConfig, this.sessionAuthenticator
        ).handle(request);
    }

    enrollCourse(request: EnrollCourseRequest): Observable<boolean> {
        return new EnrollCourseHandler(this.apiService, this.courseServiceConfig, this.sessionAuthenticator)
            .handle(request);
    }
}

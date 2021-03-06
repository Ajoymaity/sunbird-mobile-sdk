import { CourseService, GetContentStateRequest } from '..';
import { Observable } from 'rxjs';
import { CourseBatchDetailsRequest, CourseBatchesRequest, EnrollCourseRequest, FetchEnrolledCourseRequest, UpdateContentStateRequest } from '..';
import { Batch, Course, CourseServiceConfig } from '..';
import { ProfileService } from '../../profile';
import { KeyValueStore } from '../../key-value-store';
import { ApiService } from '../../api';
import { UnenrollCourseRequest } from '../def/unenrollCourseRequest';
export declare class CourseServiceImpl implements CourseService {
    private courseServiceConfig;
    private apiService;
    private profileService;
    private keyValueStore;
    private static readonly GET_CONTENT_STATE_KEY_PREFIX;
    constructor(courseServiceConfig: CourseServiceConfig, apiService: ApiService, profileService: ProfileService, keyValueStore: KeyValueStore);
    getBatchDetails(request: CourseBatchDetailsRequest): Observable<Batch>;
    updateContentState(request: UpdateContentStateRequest): Observable<boolean>;
    getCourseBatches(request: CourseBatchesRequest): Observable<Batch[]>;
    getEnrolledCourses(request: FetchEnrolledCourseRequest): Observable<Course[]>;
    enrollCourse(request: EnrollCourseRequest): Observable<boolean>;
    getContentState(request: GetContentStateRequest): Observable<boolean>;
    unenrollCourse(unenrollCourseRequest: UnenrollCourseRequest): Observable<boolean>;
}

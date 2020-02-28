import { UpdateEnrolledCoursesHandler } from './update-enrolled-courses-handler';
import { KeyValueStore, GetContentStateRequest, ContentStateResponse, ContentState } from '../..';
import { OfflineContentStateHandler } from './offline-content-state-handler';
import { of } from 'rxjs';

describe('UpdateEnrolledCoursesHandler', () => {
    let updateEnrolledCoursesHandler: UpdateEnrolledCoursesHandler;
    const mockKeyValueStore: Partial<KeyValueStore> = {};
    const mockOfflineContentStateHandler: Partial<OfflineContentStateHandler> = {};

    beforeAll(() => {
        updateEnrolledCoursesHandler = new UpdateEnrolledCoursesHandler(
            mockKeyValueStore as KeyValueStore,
            mockOfflineContentStateHandler as OfflineContentStateHandler
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of UpdateEnrolledCoursesHandler', () => {
        expect(updateEnrolledCoursesHandler).toBeTruthy();
    });

    it('should handle locla content state means offline', (done) => {
        // arrange
        const request: GetContentStateRequest = {
            userId: 'sample-user-id',
            batchId: 'sample-batch-id',
            courseIds: ['course-id-1', 'course-id-2']
        };
        const contentState: ContentState[] = [{
            lastAccessTime: '03:00AM',
            status: 2
        }];
        const responseData: ContentStateResponse = {
            contentList: contentState
        };
        mockOfflineContentStateHandler.getLocalContentStateResponse = jest.fn(() => of(responseData));
        mockKeyValueStore.getValue = jest.fn(() =>
            of('{"result": {}, "courses": [{"courseId": "course-id-1", "batchId": "sample-batch-id"}]}'));
        mockKeyValueStore.setValue = jest.fn(() => of(true));
        // act
        updateEnrolledCoursesHandler.updateEnrollCourses(request).subscribe(() => {
            // assert
            expect(mockKeyValueStore.getValue).toHaveBeenCalled();
            expect(mockKeyValueStore.setValue).toHaveBeenCalled();
            done();
        });
    });

    it('should set keyValue when newcourse is available', (done) => {
        // arrange
        const request: GetContentStateRequest = {
            userId: 'sample-user-id',
            batchId: 'sample-batch-id',
            courseIds: ['course-id-1', 'course-id-2']
        };
        const contentState: ContentState[] = [{
            lastAccessTime: '03:00AM',
            status: 2
        }];
        const responseData: ContentStateResponse = {
            contentList: contentState
        };
        mockOfflineContentStateHandler.getLocalContentStateResponse = jest.fn(() => of(responseData));
        mockKeyValueStore.getValue = jest.fn(() =>
            of('{"result": {"courses": [{"courseId": "course-id-1", "batchId": "sample-batch-id"}]}}'));
        mockKeyValueStore.setValue = jest.fn(() => of(true));
        // act
        updateEnrolledCoursesHandler.updateEnrollCourses(request).subscribe(() => {
            // assert
            expect(mockKeyValueStore.getValue).toHaveBeenCalled();
            expect(mockKeyValueStore.setValue).toHaveBeenCalled();
            done();
        });
    });

    it('should return local content state when newcourse is not available', (done) => {
        // arrange
        const request: GetContentStateRequest = {
            userId: 'sample-user-id',
            batchId: 'sample-batch-id',
            courseIds: ['course-id-1', 'course-id-2']
        };
        const contentState: ContentState[] = [{
            lastAccessTime: '03:00AM',
            status: 2
        }];
        const responseData: ContentStateResponse = {
            contentList: contentState
        };
        mockOfflineContentStateHandler.getLocalContentStateResponse = jest.fn(() => of(responseData));
        mockKeyValueStore.getValue = jest.fn(() =>
            of('{"result": {"courses": []}}'));
        // act
        updateEnrolledCoursesHandler.updateEnrollCourses(request).subscribe(() => {
            // assert
            expect(mockKeyValueStore.getValue).toHaveBeenCalled();
            done();
        });
    });
});

import {CopyAsset} from './copy-asset';
import {FileService} from '../../../util/file/def/file-service';
import {ContentEntry} from '../../db/schema';
import {ExportContentContext} from '../..';

declare const buildconfigreader;

describe('CopyAsset', () => {
    let copyAsset: CopyAsset;
    const mockFileService: Partial<FileService> = {};

    beforeAll(() => {
        copyAsset = new CopyAsset(
            mockFileService as FileService
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be create a instance of copy asset', () => {
        expect(copyAsset).toBeTruthy();
    });

    it('should be copied a file by invoked exicute() for error MEssage', async (done) => {
        // arrange
        const contentEntrySchema: ContentEntry.SchemaMap[] = [{
            identifier: 'IDENTIFIER',
            server_data: 'SERVER_DATA',
            local_data: '{"children": [{"DOWNLOAD": 1}, "do_234", "do_345"], "artifactUrl": "http:///do_123"}',
            mime_type: 'MIME_TYPE',
            manifest_version: 'MAINFEST_VERSION',
            content_type: 'CONTENT_TYPE',
            content_state: 2,
        }];
        const request: ExportContentContext = {
            destinationFolder: 'SAMPLE_DESTINATION_FOLDER',
            contentModelsToExport: contentEntrySchema,
            metadata: {'SAMPLE_KEY': 'SAMPLE_META_DATA'}
        };
        // act
        await copyAsset.execute(request).catch(() => {
            done();
        });
        // assert
    });

    it('should be copied a file by invoked exicute()', async (done) => {
        // arrange
        spyOn(buildconfigreader, 'copyFile').and.callFake((mapList, cb) => {
            setTimeout(() => {
                cb({
                    'IDENTIFIER': {
                        size: 0
                    }
                });
            });
        });
        const contentEntrySchema: ContentEntry.SchemaMap[] = [{
            identifier: 'IDENTIFIER',
            server_data: 'SERVER_DATA',
            local_data: '{"children": [{"DOWNLOAD": 1}, "do_234", "do_345"], "artifactUrl": "http:///do_123"}',
            mime_type: 'MIME_TYPE',
            manifest_version: 'MAINFEST_VERSION',
            content_type: 'CONTENT_TYPE',
            content_state: 2,
        }];
        const request: ExportContentContext = {
            destinationFolder: 'SAMPLE_DESTINATION_FOLDER',
            contentModelsToExport: contentEntrySchema,
            items: ['artifactUrl'],
            metadata: {'SAMPLE_KEY': 'SAMPLE_META_DATA'},

        };
        // act
        await copyAsset.execute(request).then(() => {
            done();
        });
        // assert
    });
});

import { DeleteContentHandler } from './delete-content-handler';
import { DbService } from '../../db';
import { FileService } from '../../util/file/def/file-service';
import { SharedPreferences } from '../..';
import { ContentEntry } from '../db/schema';
import { ContentUtil } from '../util/content-util';
import { of } from 'rxjs';
import { ArrayUtil } from '../../util/array-util';
import { ContentData, FileName, MimeType, State, Visibility } from '..';

jest.mock('../util/content-util');
declare const sbutility;

describe('DeleteContentHandler', () => {
    let deleteContentHandler: DeleteContentHandler;

    const mockDbService: Partial<DbService> = {};
    const mockFileService: Partial<FileService> = {};
    const mockSharedPreferences: Partial<SharedPreferences> = {};

    beforeAll(() => {
        deleteContentHandler = new DeleteContentHandler(
            mockDbService as DbService,
            mockFileService as FileService,
            mockSharedPreferences as SharedPreferences
        );
    });

    beforeEach(() => {
        jest.clearAllMocks();
        //  (ContentUtil as jest.Mock<ContentUtil>).
    });

    it('should be able to create an instance of deleteContentHandler', () => {
        expect(deleteContentHandler).toBeTruthy();
    });

    describe('deleteAllChildren', () => {
        it('should be deleted all children', async (done) => {
            // arrange
            sbutility.getMetaData = jest.fn((_, cb) => cb({
                'IDENTIFIER': {
                    size: 0
                }
            }));
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            };
            mockDbService.execute = jest.fn().mockImplementation(() => {
            });
            (mockDbService.execute as jest.Mock).mockReturnValue(of([{
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: '{"children": [{"DOWNLOAD": 1}, "do_234", "do_345"]}',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            }]));
            mockDbService.beginTransaction = jest.fn().mockImplementation(() => of({}));
            mockDbService.update = jest.fn().mockImplementation(() => of({}));
            mockDbService.endTransaction = jest.fn().mockImplementation(() => {
            });
            const isChildContent = true;
            mockFileService.readAsText = jest.fn().mockImplementation(() => {
            });
            const readAsText = (mockFileService.readAsText as jest.Mock)
                .mockResolvedValue('{"ver": "1.0", "archive": {"items": [{"status": "pass", "identifier": "do-123"}, {"status": "pass", "identifier": "do-223"}]}}');
            readAsText().then((value) => {
                return value;
            });
            jest.spyOn(ContentUtil, 'getFirstPartOfThePathNameOnLastDelimiter').mockImplementation(() => {
                return 'value';
            });
            mockSharedPreferences.putString = jest.fn(() => of(undefined));
            // act
            await deleteContentHandler.deleteAllChildren(request, isChildContent).then(() => {
                // assert
                expect(sbutility.getMetaData).toHaveBeenCalled();
                expect(mockDbService.beginTransaction).toHaveBeenCalled();
                expect(mockDbService.update).toHaveBeenCalled();
                expect(mockDbService.endTransaction).toHaveBeenCalled();
                expect(mockFileService.readAsText).toHaveBeenCalled();
                expect(mockSharedPreferences.putString).toHaveBeenCalled();
                done();
            });
        });

        it('should be deleted all children for contentRootPath is undefined', async (done) => {
            // arrange
            sbutility.getMetaData = jest.fn((_, cb) => cb({
                'IDENTIFIER': {
                    size: 0
                }
            }));
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            };
            mockDbService.execute = jest.fn().mockImplementation(() => {
            });
            (mockDbService.execute as jest.Mock).mockReturnValue(of([{
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: '{"children": [{"DOWNLOAD": 1}, "do_234", "do_345"]}',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            }]));
            mockDbService.beginTransaction = jest.fn().mockImplementation(() => of({}));
            mockDbService.update = jest.fn().mockImplementation(() => of({}));
            mockDbService.endTransaction = jest.fn().mockImplementation(() => {
            });
            const isChildContent = true;
            mockFileService.readAsText = jest.fn().mockImplementation(() => {
            });
            const readAsText = (mockFileService.readAsText as jest.Mock)
                .mockResolvedValue('{"ver": "1.0", "archive": {"items": [{"status": "pass", "identifier": "do-123"}, {"status": "pass", "identifier": "do-223"}]}}');
            readAsText().then((value) => {
                return value;
            });
            jest.spyOn(ContentUtil, 'getFirstPartOfThePathNameOnLastDelimiter').mockImplementation(() => {
                return undefined;
            });
            // act
            await deleteContentHandler.deleteAllChildren(request, isChildContent).then(() => {
                // assert
                expect(sbutility.getMetaData).toHaveBeenCalled();
                expect(mockDbService.beginTransaction).toHaveBeenCalled();
                expect(mockDbService.update).toHaveBeenCalled();
                expect(mockDbService.endTransaction).toHaveBeenCalled();
                expect(mockFileService.readAsText).toHaveBeenCalled();
                done();
            });
        });

        it('should be deleted all children for catch part', async (done) => {
            // arrange
            sbutility.getMetaData = jest.fn((_, cb) => cb({
                'IDENTIFIER': {
                    size: 0
                }
            }));
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            };
            mockDbService.execute = jest.fn().mockImplementation(() => {
            });
            (mockDbService.execute as jest.Mock).mockReturnValue(of([{
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: '{"children": [{"DOWNLOAD": 1}, "do_234", "do_345"]}',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            }]));
            mockDbService.beginTransaction = jest.fn().mockImplementation(() => of({}));
            mockDbService.update = jest.fn().mockImplementation(() => of({}));
            mockDbService.endTransaction = jest.fn().mockImplementation(() => {
            });
            const isChildContent = true;
            mockFileService.readAsText = jest.fn(() => Promise.reject({ error: 'error' }));
            // act
            await deleteContentHandler.deleteAllChildren(request, isChildContent).then(() => {
                // assert
                expect(sbutility.getMetaData).toHaveBeenCalled();
                expect(mockDbService.beginTransaction).toHaveBeenCalled();
                expect(mockDbService.update).toHaveBeenCalled();
                expect(mockDbService.endTransaction).toHaveBeenCalled();
                expect(mockFileService.readAsText).toHaveBeenCalled();
                done();
            });
        });

        it('should be deleted all children for catch part', async (done) => {
            // arrange
            sbutility.getMetaData = jest.fn((_, cb) => cb({
                'IDENTIFIER': {
                    size: 0
                }
            }));
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            };
            mockDbService.execute = jest.fn().mockImplementation(() => {
            });
            (mockDbService.execute as jest.Mock).mockReturnValue(of([{
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: '{"children": [{"DOWNLOAD": 1}, "do_234", "do_345"]}',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                path: 'http://sample-path'
            }]));
            mockDbService.beginTransaction = jest.fn().mockImplementation(() => of({}));
            mockDbService.update = jest.fn().mockImplementation(() => of({}));
            mockDbService.endTransaction = jest.fn().mockImplementation(() => {
            });
            const isChildContent = true;
            mockFileService.readAsText = jest.fn(() => Promise.reject({ error: 'error' }));
            // act
            await deleteContentHandler.deleteAllChildren(request, isChildContent).then(() => {
                // assert
                expect(sbutility.getMetaData).toHaveBeenCalled();
                expect(mockDbService.beginTransaction).toHaveBeenCalled();
                expect(mockDbService.update).toHaveBeenCalled();
                expect(mockDbService.endTransaction).toHaveBeenCalled();
                expect(mockFileService.readAsText).toHaveBeenCalled();
                done();
            });
        });

        it('should return void for getMetaData error part', async (done) => {
            // arrange
            sbutility.getMetaData = jest.fn((_, cb, err) => err({
                error: 'error'
            }));
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: 'MIME_TYPE',
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE'
            };
            mockFileService.readAsText = jest.fn().mockImplementation(() => {
            });
            const readAsText = (mockFileService.readAsText as jest.Mock)
                .mockResolvedValue('{"ver": "1.0", "archive": {"items": [{"status": "pass"}]}}');
            readAsText().then((value) => {
                return value;
            });
            ContentUtil.hasChildren = jest.fn().mockImplementation(() => of([]));
            mockDbService.execute = jest.fn().mockImplementation(() => of([]));
            ArrayUtil.joinPreservingQuotes = jest.fn().mockImplementation(() => of([]));
            // act
            await deleteContentHandler.deleteAllChildren(request, true).then(() => {
                expect(mockDbService.execute).toHaveBeenCalled();
                expect(ArrayUtil.joinPreservingQuotes).toHaveBeenCalled();
                done();
            }, (e) => {
                done();
            });
            // assert
        });
    });

    describe('deleteOrUpdateContent', () => {
        it('should delete or update a content when invoked deleteOrUpdateContent()', (done) => {
            // arrange
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: MimeType.COLLECTION,
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                ref_count: 2,
                visibility: Visibility.DEFAULT
            };
            const isChildItems = true;
            const isChildContent = true;
            // act
            deleteContentHandler.deleteOrUpdateContent(request, isChildItems, isChildContent).then(() => {
                // assert
                expect(request.visibility).toBe(Visibility.DEFAULT.valueOf());
                done();
            });
        });

        it('should delete or update a content when invoked deleteOrUpdateContent() for mime_type is not collection', (done) => {
            // arrange
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: MimeType.ECAR,
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                ref_count: 2,
                visibility: Visibility.DEFAULT
            };
            const isChildItems = true;
            const isChildContent = true;
            // act
            deleteContentHandler.deleteOrUpdateContent(request, isChildItems, isChildContent).then(() => {
                // assert
                expect(request.visibility).toBe(Visibility.DEFAULT.valueOf());
                done();
            });
        });

        it('should update a content if isChildContent is false', (done) => {
            // arrange
            const request: ContentEntry.SchemaMap = {
                identifier: 'IDENTIFIER',
                server_data: 'SERVER_DATA',
                local_data: 'LOCAL_DATA',
                mime_type: MimeType.ECAR,
                manifest_version: 'MAINFEST_VERSION',
                content_type: 'CONTENT_TYPE',
                ref_count: 2,
                visibility: Visibility.DEFAULT
            };
            const isChildItems = true;
            const isChildContent = false;
            // act
            deleteContentHandler.deleteOrUpdateContent(request, isChildItems, isChildContent).then(() => {
                // assert
                expect(request.visibility).toBe(Visibility.DEFAULT.valueOf());
                done();
            });
        });
    });

});

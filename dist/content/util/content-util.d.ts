import { ContentData, HierarchyInfo } from '../def/content';
import { Rollup } from '../../telemetry';
import { AppConfig } from '../../api/config/app-config';
import { ContentEntry } from '../db/schema';
export declare class ContentUtil {
    private static DEFAULT_PACKAGE_VERSION;
    static defaultCompatibilityLevel: number;
    private static INITIAL_VALUE_FOR_TRANSFER_COUNT;
    static isAvailableLocally(contentState: number): boolean;
    static isUpdateAvailable(serverData: ContentData, localData: ContentData): boolean;
    static hasChildren(localData: string): boolean;
    static getContentRollup(identifier: string, hierarchyInfoList: HierarchyInfo[]): Rollup;
    static getChildContentsIdentifiers(localData: string): string[];
    /**
     * This method gets you the first part of the string that is divided after last index of "/"
     *
     * @param contentFolderName
     * @return
     */
    static getFirstPartOfThePathNameOnLastDelimiter(contentFolderName: string): string | undefined;
    static hasPreRequisites(localData: string): boolean;
    static readVisibility(contentData: any): string;
    static isCompatible(appConfig: AppConfig, compatibilityLevel: any): boolean;
    static readCompatibilityLevel(contentData: any): number;
    static isDraftContent(status: any): boolean;
    static isExpired(expiryDate: string): boolean;
    /**
     * If status is DRAFT and pkgVersion == 0 then don't do the duplicate check..
     */
    static isDuplicateCheckRequired(isDraftContent: any, pkgVersion: number): boolean;
    static isImportFileExist(oldContentModel: ContentEntry.SchemaMap, contentData: any): boolean;
    static readPkgVersion(contentData: any): number;
    static readContentType(contentData: any): string;
    static readAudience(contentData: any): string;
    static readPragma(contentData: any): string;
    /**
     * To Check whether the content is exist or not.
     *
     * @param oldContent    Old ContentModel
     * @param newIdentifier New content identifier
     * @return True - if file exists, False- does not exists
     */
    static doesContentExist(existingContentInDB: ContentEntry.SchemaMap, newIdentifier: string, newPkgVersion: number, keepLowerVersion: boolean): boolean;
    static getContentRootDir(rootFilePath: string): string;
    private static transferCount;
    private static isContentMetadataAbsent;
    private static isContentMetadataPresentWithoutViralityMetadata;
    static addOrUpdateViralityMetadata(localData: any, origin: string): void;
    static addViralityMetadataIfMissing(localData: any, origin: string): void;
    /**
     * Content with artifact without zip i.e. pfd, mp4
     *
     * @param contentDisposition
     * @param contentEncoding
     * @return
     */
    static isInlineIdentity(contentDisposition: string, contentEncoding: string): boolean | "";
    static addOrUpdateDialcodeMapping(jsonStr: string, identifier: string, rootNodeIdentifier: string): string;
}

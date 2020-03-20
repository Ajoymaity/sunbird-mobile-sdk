import {PlayerService, PlayerServiceImpl} from '..';
import {Container} from 'inversify';
import {ProfileService, ProfileSession} from '../../profile';
import {InjectionTokens} from '../../injection-tokens';
import {SdkConfig} from '../../sdk-config';
import {mockSdkConfigWithSamplePlayerConfig} from './player-service-impl.spec.data';
import {GroupService, GroupSession} from '../../group';
import {FrameworkService} from '../../framework';
import {DeviceInfo} from '../../util/device';
import {AppInfo} from '../../util/app';
import {Observable} from 'rxjs';
import {Content} from '../../content';
import {Rollup} from '../../telemetry';
import { of } from 'rxjs';

describe('PlayerServiceImpl', () => {
    let playerService: PlayerService;

    const container = new Container();

    const mockDeviceInfoService: Partial<DeviceInfo> = {
        getDeviceID: jest.fn().mockImplementation(() => {})
    };
    const mockProfileService: Partial<ProfileService> = {
        getActiveSessionProfile: jest.fn().mockImplementation(() => {})
    };
    const mockGroupService: Partial<GroupService> = {};

    const mockFrameWorkService: Partial<FrameworkService> = {
        getActiveChannelId: jest.fn().mockImplementation(() => {
        })
    };
    const mockAppInfo: Partial<AppInfo> = {
        getVersionName: jest.fn().mockImplementation(() => {})
    };

    beforeAll(() => {
        container.bind<PlayerService>(InjectionTokens.PLAYER_SERVICE).to(PlayerServiceImpl);
        container.bind<ProfileService>(InjectionTokens.PROFILE_SERVICE).toConstantValue(mockProfileService as ProfileService);
        container.bind<GroupService>(InjectionTokens.GROUP_SERVICE).toConstantValue(mockGroupService as GroupService);
        container.bind<SdkConfig>(InjectionTokens.SDK_CONFIG).toConstantValue(mockSdkConfigWithSamplePlayerConfig as SdkConfig);
        container.bind<FrameworkService>(InjectionTokens.FRAMEWORK_SERVICE).toConstantValue(mockFrameWorkService as FrameworkService);
        container.bind<DeviceInfo>(InjectionTokens.DEVICE_INFO).toConstantValue(mockDeviceInfoService as DeviceInfo);
        container.bind<AppInfo>(InjectionTokens.APP_INFO).toConstantValue(mockAppInfo as AppInfo);

        playerService = container.get(InjectionTokens.PLAYER_SERVICE);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an instance from PlayerServiceImpl from Container', () => {
        // assert
        expect(playerService).toBeTruthy();
    });

    it('should return playerConfig when getPlayerConfig() invoked', () => {
        // arrange
        const content: Content = {
            rollup: Rollup,
            basePath: 'sample_base_path',

        } as Partial<Content> as Content;

        const mockProfileSession: ProfileSession = new ProfileSession('SAMPLE_UID');
        mockProfileService.getActiveProfileSession = jest.fn().mockImplementation(() => of(mockProfileSession));
        (mockProfileService.getActiveSessionProfile as jest.Mock).mockReturnValue(of('MOCK_PROFILE'));

        const mockGroupSession: GroupSession = new GroupSession('MOCK_GID');
        mockGroupService.getActiveGroupSession = jest.fn().mockImplementation(() => of(mockGroupSession));

        (mockFrameWorkService.getActiveChannelId as jest.Mock).mockReturnValue(of('MOCK_CHANNEL_ID'));
        (mockDeviceInfoService.getDeviceID as jest.Mock).mockReturnValue('SAMPLE_DEVICE_ID');
        (mockAppInfo.getVersionName as jest.Mock).mockReturnValue('SAMPLE_APP_VERSION_NAME');
        // act
        playerService.getPlayerConfig(content, {}).subscribe(() => {
            // assert
            expect(mockProfileService.getActiveProfileSession).toHaveBeenCalled();
            expect(mockGroupService.getActiveGroupSession).toHaveBeenCalled();
            expect(mockFrameWorkService.getActiveChannelId).toHaveBeenCalled();
        });
    });
});

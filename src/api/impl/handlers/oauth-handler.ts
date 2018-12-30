import {ApiConfig} from '../../index';
import {GoogleSessionProvider} from '../auth/providers/google-session-provider';
import {SessionData} from '../../def/auth/session-data';
import {KeycloakSessionProvider} from '../auth/providers/keycloak-session-provider';

declare var customtabs: {
    isAvailable: (success: () => void, error: (error: string) => void) => void;
    launch: (url: string, success: (callbackUrl: string) => void, error: (error: string) => void) => void;
    launchInBrowser: (url: string, success: (callbackUrl: string) => void, error: (error: string) => void) => void;
    close: (success: () => void, error: (error: string) => void) => void;
};

export class OauthHandler {

    constructor(private apiConfig: ApiConfig) {
    }

    private static isGoogleSignupCallBackUrl(url: string): boolean {
        return (url.indexOf('access_token') !== -1 && url.indexOf('refresh_token') !== -1);
    }

    public async doLogin(): Promise<SessionData> {
        return new Promise<SessionData>((resolve, reject) => {
            customtabs.isAvailable(() => {
                customtabs.launch(this.apiConfig.user_authentication.authUrl, async callbackUrl => {
                    resolve(this.resolveTokens(callbackUrl));
                }, error => {
                    reject(error);
                });
            }, () => {
                customtabs.launchInBrowser(this.apiConfig.user_authentication.authUrl, async callbackUrl => {
                    resolve(this.resolveTokens(callbackUrl));
                }, error => {
                    reject(error);
                });
            });
        });
    }

    public async doLogout() {
        return new Promise((resolve, reject) => {
            customtabs.isAvailable(() => {
                customtabs.launch(this.apiConfig.user_authentication.logoutUrl!!, async () => {
                    const keycloakSessionProvider = new KeycloakSessionProvider(this.apiConfig);
                    await keycloakSessionProvider.endSession();
                    resolve();
                }, error => {
                    reject(error);
                });
            }, error => {
                customtabs.launchInBrowser(this.apiConfig.user_authentication.logoutUrl!!, async () => {
                    const keycloakSessionProvider = new KeycloakSessionProvider(this.apiConfig);
                    await keycloakSessionProvider.endSession();
                    resolve();
                }, error => {
                    reject(error);
                });
            });
        });
    }

    private async resolveTokens(url: string): Promise<SessionData> {
        let params = (new URL(url)).searchParams;

        if (!params) {
            throw "Unable to Authenticate, no params found";
        }

        if (OauthHandler.isGoogleSignupCallBackUrl(url)) {
            const googleSessionProvider = new GoogleSessionProvider();
            await googleSessionProvider.createSession(params.get('access_token')!, params.get('refresh_token')!)
            return googleSessionProvider.getSession();
        } else {
            const keycloakSessionProvider = new KeycloakSessionProvider(this.apiConfig);
            await keycloakSessionProvider.createSession(params.get('access_token')!);
            return keycloakSessionProvider.getSession();
        }
    }
}
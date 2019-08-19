import {ApiConfig, ApiService} from '../../api';
import {OAuthSession, SignInError} from '..';
import {AuthEndPoints} from '../def/auth-end-points';
import {SunbirdOAuthSessionProviderFactory} from './sunbird-o-auth-session-provider-factory';
import {SunbirdError} from '../../sunbird-error';
import * as qs from 'qs';

export interface StepOneCallbackType {
    code?: string;
    access_token?: string;
    refresh_token?: string;
    id?: string;
    googleRedirectUrl?: string;
    error_message?: string;
}

export interface OAuthRedirectUrlQueryParams {
    redirect_uri: string;
    error_callback?: string;
    response_type: string;
    scope: string;
    client_id: string;
    version: string;
}

export class ForgotPasswordFlowDetectedError extends SunbirdError {
    constructor(message: string) {
        super(message, 'FORGOT_PASSWORD_FLOW_DETECTED');

        Object.setPrototypeOf(this, ForgotPasswordFlowDetectedError.prototype);
    }
}

export class OAuthDelegate {
    constructor(
        private apiConfig: ApiConfig,
        private apiService: ApiService
    ) {
    }

    public async doOAuthStepOne(): Promise<OAuthSession> {
        const oAuthRedirectUrlQueryParams: OAuthRedirectUrlQueryParams = {
            redirect_uri: this.apiConfig.host + '/oauth2callback',
            response_type: 'code',
            scope: 'offline_access',
            client_id: 'android',
            version: '4'
        };

        const launchUrl =
            this.apiConfig.host +
            this.apiConfig.user_authentication.authUrl +
            AuthEndPoints.LOGIN + '?' +
            qs.stringify(oAuthRedirectUrlQueryParams, {encode: false});

        const inAppBrowserRef = cordova.InAppBrowser.open(launchUrl, '_blank', 'zoom=no');

        return new Promise<OAuthSession>((resolve, reject) => {
            inAppBrowserRef.addEventListener('loadstart', (event) => {
                if (event.url) {
                    const sessionProvider = new SunbirdOAuthSessionProviderFactory(
                        this.apiConfig, this.apiService, inAppBrowserRef
                    ).fromUrl(event.url);

                    if ((event.url).indexOf('/sso/sign-in/error') !== -1) {
                        reject(new SignInError('Server Error'));
                    }

                    if ((event.url).indexOf('/resources') !== -1 || (event.url).indexOf('client_id=portal') !== -1) {
                        reject(new ForgotPasswordFlowDetectedError('Detected "Forgot Password" flow completion'));
                    }

                    if (sessionProvider) {
                        resolve(sessionProvider.provide());
                    }
                }
            });
        }).catch((e) => {
            if (e instanceof ForgotPasswordFlowDetectedError) {
                inAppBrowserRef.close();

                const delay = 500;

                return new Promise((resolve) => setTimeout(resolve, delay))
                  .then(() => this.doOAuthStepOne())
            }

            inAppBrowserRef.close();

            throw e;
        });
    }
}


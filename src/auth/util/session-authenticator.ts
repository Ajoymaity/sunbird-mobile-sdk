import {Authenticator} from '../../api/def/authenticator';
import {
    ApiConfig,
    Connection,
    KEY_USER_TOKEN,
    Request,
    Response,
    ResponseCode,
    ResponseInterceptor
} from '../../api';
import {AuthUtil} from './auth-util';

export class SessionAuthenticator implements Authenticator, ResponseInterceptor {

    constructor(private apiConfig: ApiConfig) {
    }

    interceptRequest(request: Request): Request {
        const sessionToken = localStorage.getItem(KEY_USER_TOKEN);

        if (sessionToken) {
            const existingHeaders = request.headers;
            existingHeaders['X-Authenticated-User-Token'] = sessionToken;
            request.headers = existingHeaders;
        }

        return request;
    }

    onResponse(request: Request, response: Response, connection: Connection): Promise<Response> {
        if (response.code() !== ResponseCode.HTTP_UNAUTHORISED) {
            return Promise.resolve(response);
        }

        if (response.response().message) {
            return Promise.resolve(response);
        }

        return this.refreshToken(request, connection);
    }

    private async refreshToken(request, connection): Promise<Response> {
        const sessionData = await AuthUtil.refreshSession(connection, this.apiConfig.user_authentication.authUrl);
        await AuthUtil.startSession(sessionData);

        return connection.invoke(request);
    }
}

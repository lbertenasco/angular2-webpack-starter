import {Injectable} from 'angular2/core';
import {Observable} from 'rxjs/Observable';

import {AuthState} from './auth.state';
import {AuthApi} from './auth.api';

@Injectable()
export class AuthService {

    static TOKEN_KEY:string = 'jwt';

    constructor(private authApi:AuthApi) {}

    getToken() {
        return localStorage.getItem(AuthService.TOKEN_KEY);
    }

    isLogged():boolean {
        let token = localStorage.getItem(AuthService.TOKEN_KEY);
        if (token && !this.isExpired(token)) {
            return true;
        }
        return false;
    }

    isExpired(token:string):boolean {
        //console.log('compare timestamps: ' + Date.now() + ' and ' + this.getExpireTimestamp(token));
        //return (Date.now() > this.getExpireTimestamp(token));
        return false;
    }

    login(token:string, tokenType:string):Observable<AuthState> {
        return this.authApi.login(token, tokenType);
    }

    removeToken() {
        localStorage.removeItem(AuthService.TOKEN_KEY);
    }

    setToken(token:string) {
        localStorage.setItem(AuthService.TOKEN_KEY, token);
    }

    /*getExpireTimestamp(token: string): number {
     let tokenArr = token.split('.');
     let decodedMeta = Base64VLQFormat.decode(tokenArr[1]);
     let jsonMeta = JSON.parse(decodedMeta);
     return jsonMeta.exp * 1000;
     }*/

    /**
     * Call REST api to request a JWT token
     * @return Promise object
     */
    /*getNewToken(username: String, password: String): Promise<any> {
     return $http.get(REST_HOST + '/api/newToken?username=' + username + '&password=' + password, null);
     }*/

}
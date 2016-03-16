import {Injectable} from 'angular2/core';
import {Headers, Http, Request, RequestMethod, Response } from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {AuthState} from './auth.state';

@Injectable()
export class AuthApi {

    constructor(private http:Http) {}

    login(token:string, tokenType:string):Observable<AuthState> {
        return this.request({
            options: {
                token,
                tokenType
            },
            method: RequestMethod.Get,
            url: `./assets/mock/login-facebook.json`
        });
    }

    request(options:any):Observable<any> {
        if (options.body) {
            if (typeof options.body !== 'string') {
                options.body = JSON.stringify(options.body);
            }

            options.headers = new Headers({
                'Content-Type': 'application/json'
            });
        }

        return this.http.request(new Request(options))
            .map((res: Response) => res.json());
    }
}

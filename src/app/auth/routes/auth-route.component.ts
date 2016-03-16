import {ChangeDetectionStrategy, Component} from 'angular2/core';

import {AuthLoginComponent} from '../components/auth-login';
import {AuthDispatcher} from '../auth.dispatcher';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [
        AuthLoginComponent
    ],
    selector: 'auth-route',
    templateUrl: './app/auth/routes/auth-route.html'
})
export class AuthRouteComponent {

    constructor(private authDispatcher:AuthDispatcher) {}

    onLogin(facebookAccessToken:string) {
        this.authDispatcher.login(facebookAccessToken);
    }

}

import {Inject,Injectable} from 'angular2/core';
import {Router} from 'angular2/router';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/merge';

import {dispatcher} from '../app.state';
import {AuthState} from './auth.state';
import {
    AuthAction, AuthInit, LoginAction, LoginInProgressAction, LoginSuccessAction,
    LoginFailureAction, LogoutAction, LogoutInProgressAction, LogoutSuccessAction
} from './auth.actions';
import {AuthService} from './auth.service';

@Injectable()
export class AuthDispatcher {

    private actions$ = new BehaviorSubject<AuthAction>(new AuthInit());

    constructor(private authService:AuthService,
                @Inject(dispatcher) private dispatcher:Observer<AuthAction>,
                private router:Router) {

        // Login
        let loginActions$ = this.actions$
            .filter(action => action instanceof LoginAction)
            .do(() => this.dispatcher.next(new LoginInProgressAction()))
            .mergeMap((action:LoginAction) => this.authService.login(action.token, action.tokenType))
            .share();

        let loginSuccessResponses$ = loginActions$
            .filter((response:AuthState) => response.token !== null)
            .map((response:AuthState) => new LoginSuccessAction(response.user, response.token));

        let loginFailureResponses$ = loginActions$
            .filter((response:AuthState) => response.token === null)
            .map((response:AuthState) => new LoginFailureAction());

        // Logout
        let logoutActions$ = this.actions$
            .filter(action => action instanceof LogoutAction)
            .do(() => this.dispatcher.next(new LogoutInProgressAction()))
            .map(() => new LogoutSuccessAction());

        // Dispatch actions to update app state
        Observable
            .merge(loginSuccessResponses$, loginFailureResponses$,  logoutActions$)
            .subscribe((action) => this.dispatcher.next(action));

        // Login success callback
        loginSuccessResponses$
            .subscribe((response:AuthState) => this.loginSuccess(response));

        // Logout success callback
        logoutActions$
            .filter(action => action instanceof LogoutSuccessAction)
            .subscribe(() => this.logoutSuccess());
    }

    login(facebookAccessToken:string = null) {
        console.debug('>> AuthDispatcher.login');
        if (facebookAccessToken) {
            // Facebook login with Graph API
            this.actions$.next(new LoginAction(facebookAccessToken, LoginAction.FACEBOOK_TYPE));
        } else if (this.authService.isLogged()) {
            // JWT login
            let token:string = this.authService.getToken();
            this.actions$.next(new LoginAction(token, LoginAction.JWT_TYPE));
        }
    }

    logout() {
        console.debug('>> AuthDispatcher.logout');
        this.actions$.next(new LogoutAction());
    }

    private loginSuccess(response:AuthState) {
        console.debug('AuthDispatcher.loginSuccess');
        this.authService.setToken(response.token);
        this.router.navigate(['Index']);

    }

    private logoutSuccess() {
        console.debug('AuthDispatcher.logoutSuccess');
        this.authService.removeToken();
        this.router.navigate(['Auth']);
    }

}

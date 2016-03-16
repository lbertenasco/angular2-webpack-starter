import {User} from '../user/user.model';

export class AuthInit {}
export class AuthTokenExpiredAction { constructor(public error:string) {} }
export class LoginAction {

    static FACEBOOK_TYPE:string = 'FACEBOOK';
    static JWT_TYPE:string = 'JWT';

    constructor(public token:string, public tokenType:string = LoginAction.FACEBOOK_TYPE) {}

}
export class LoginInProgressAction {}
export class LoginFailureAction {}
export class LoginSuccessAction { constructor(public user:User, public token:string) {} }
export class LogoutAction {}
export class LogoutInProgressAction {}
export class LogoutSuccessAction {}

export type AuthAction = AuthInit|AuthTokenExpiredAction
    |LoginAction|LoginInProgressAction|LoginFailureAction|LoginSuccessAction
    |LogoutAction|LogoutInProgressAction|LogoutSuccessAction;


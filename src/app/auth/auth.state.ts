import {User} from '../user/user.model';

export interface AuthState {
    authenticated:Boolean;
    error:string;
    user:User;
    token:string;
}

export let initialAuthState:AuthState = {
    authenticated: false,
    error: null,
    user: null,
    token: null
};

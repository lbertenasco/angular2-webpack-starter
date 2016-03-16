import {AuthState, initialAuthState} from './auth.state';
import {AuthAction, AuthTokenExpiredAction, LoginSuccessAction, LogoutSuccessAction} from './auth.actions';

export function reduceAuthState(state:AuthState, action:AuthAction):AuthState {
    if (!state) {
        return initialAuthState;
    }

    if (action instanceof LoginSuccessAction) {
        // Login success
        return Object.assign({}, state, {
            authenticated: true,
            token: action.token,
            user: action.user,
            error: null
        });
    } else if (action instanceof LogoutSuccessAction) {
        // Logout success
        return Object.assign({}, initialAuthState);
    } else if (action instanceof AuthTokenExpiredAction) {
        // AuthState token expired
        return Object.assign({}, state, {
            authenticated: false,
            error: action.error,
            token: null
        });
    } else {
        return state;
    }
}

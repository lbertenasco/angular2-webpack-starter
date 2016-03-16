import {OpaqueToken} from 'angular2/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/subject/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/scan';

import {AuthState} from './auth/auth.state';
import {reduceAuthState} from './auth/auth.reducer';

export const initialState = new OpaqueToken('initialState');
export const dispatcher = new OpaqueToken('dispatcher');
export const state = new OpaqueToken('state');

export interface AppState {

    auth:AuthState;

}

export function buildAppState(initialState:AppState, actions:Observable<any>):Observable<AppState> {
    let appState:Observable<AppState> = actions.scan((state:AppState, action) => {
            console.log('PROCESSING action', action);

            let newState:AppState = {
                auth: reduceAuthState(state.auth, action),
            };

            console.log('STATE changed', newState);
            return newState;

        } , initialState)
        .share();

    // Wrap into behaviour (for observer to receive the latest snapshot the moment it subscribes)
    return wrapIntoBehaviorSubject(initialState, appState);
}

function wrapIntoBehaviorSubject(init, observable) {
    const behaviorSubject = new BehaviorSubject(init);
    observable.subscribe(s => behaviorSubject.next(s));
    return behaviorSubject;
}

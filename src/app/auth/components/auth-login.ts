import {ChangeDetectionStrategy, Component, Output, EventEmitter} from 'angular2/core';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'auth-login',
    templateUrl: './app/auth/components/auth-login.html'
})
export class AuthLoginComponent {

    @Output() login:EventEmitter<string> = new EventEmitter<string>();

    onConnectClick() {
        this.login.emit('someFacebookToken');
    }

}

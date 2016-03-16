/*
 * Angular 2 decorators and services
 */
import {Component, Inject} from 'angular2/core';
import {RouteConfig, Router} from 'angular2/router';

import {AuthApi} from "./auth/auth.api";
import {AuthService} from "./auth/auth.service";
import {AuthDispatcher} from "./auth/auth.dispatcher";

import {HomeComponent} from './home/home.component';
import {AuthRouteComponent} from './auth/routes/auth-route.component';

import {state, AppState} from "./app.state";
import {Observable} from "rxjs/Observable";
import {User} from "./user/user.model";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  pipes: [ ],
  providers: [
    AuthApi,
    AuthService,
    AuthDispatcher
  ],
  directives: [ ],
  styles: [require('./app.style.css')],
  template: require('./app.view.html')
})
@RouteConfig([
  { path: '/',      name: 'Index', component: HomeComponent, useAsDefault: true },
  { path: '/home',  name: 'Home',  component: HomeComponent },
  { path: '/auth',  name: 'Auth',  component: AuthRouteComponent },
  // Async load a component using Webpack's require with es6-promise-loader and webpack `require`
  { path: '/about', name: 'About', loader: () => require('es6-promise!./about/about.component')('AboutComponent') },
])
export class AppComponent {
  angularclassLogo = 'assets/img/angularclass-avatar.png';
  name = 'Angular 2 Webpack Starter';
  url = 'https://twitter.com/AngularClass';

  public user:User;

  constructor(private authDispatcher:AuthDispatcher,
              private authService:AuthService,
              private router:Router,
              @Inject(state) private state$:Observable<AppState>) {

    this.state$
      .map(state => state.auth.user)
      .distinctUntilChanged()
      .subscribe(user => this.user = user);
  }

  ngOnInit() {
         if (this.authService.isLogged()) {
             // Auto login
             this.authDispatcher.login();
         } else {
           console.log("Facebook login required");
             // Facebook login required
             // FIXME generates an exception when running with webpack...
             //this.router.navigate(['Auth']);
         }
     }

     onLogoutClick() {
         this.authDispatcher.logout();
     }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */

/*
 * Providers provided by Angular
 */
import * as browser from 'angular2/platform/browser';
import * as ngCore from 'angular2/core';
import {
  //LocationStrategy,
  //HashLocationStrategy,
  ROUTER_PROVIDERS,
  ROUTER_DIRECTIVES
} from 'angular2/router';
import {FORM_PROVIDERS} from 'angular2/common';
import {HTTP_PROVIDERS} from 'angular2/http';

/*
 * App Component
 * our top level component that holds all of our components
 */
import {AppComponent} from './app/app.component';
import {RouterActive} from './app/directives/router-active';

import {Subject} from 'rxjs/Subject';
import {buildAppState, initialState, dispatcher, state} from './app/app.state';
import {initialAuthState} from './app/auth/auth.state';

/*
 * Application Providers/Directives/Pipes/States
 * providers/directives/pipes/states that only live in our browser environment
 */

// application_providers: providers that are global through out the application
const APPLICATION_PROVIDERS = [
  ...HTTP_PROVIDERS,
  ...ROUTER_PROVIDERS,
  ...FORM_PROVIDERS,
  //ngCore.provide(LocationStrategy, { useClass: HashLocationStrategy })
];

// application_directives: directives that are global through out the application
const APPLICATION_DIRECTIVES = [
  ...ROUTER_DIRECTIVES,
  RouterActive
];

// application_pipes: pipes that are global through out the application
const APPLICATION_PIPES = [

];

// application_states: states that are global through out the application
const APPLICATION_STATES = {
  auth: initialAuthState
};

// Environment
if ('production' === ENV) {
  // Production
  ngCore.enableProdMode();
  APPLICATION_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS_PROD_MODE);
} else {
  // Development
  APPLICATION_PROVIDERS.push(browser.ELEMENT_PROBE_PROVIDERS);
}


/*
 * Bootstrap our Angular app with a top level component `App` and inject
 * our Services and Providers into Angular's dependency injection
 */
export function main() {


  return browser.bootstrap(AppComponent, [
    ...APPLICATION_PROVIDERS,
    ngCore.provide(ngCore.PLATFORM_DIRECTIVES, {useValue: APPLICATION_DIRECTIVES, multi: true}),
    ngCore.provide(ngCore.PLATFORM_PIPES, {useValue: APPLICATION_PIPES, multi: true}),

    // Providing Application State to the app
    ngCore.provide(initialState, {useValue: APPLICATION_STATES}),
    ngCore.provide(dispatcher, {useValue: new Subject<any>(null)}),
    ngCore.provide(state, {useFactory: buildAppState, deps: [new ngCore.Inject(initialState), new ngCore.Inject(dispatcher)]})

  ])
  .catch(err => console.error(err));
}


/*
 * Vendors
 * For vendors for example jQuery, Lodash, angular2-jwt just import them anywhere in your app
 * You can also import them in vendors to ensure that they are bundled in one file
 * Also see custom-typings.d.ts as you also need to do `typings install x` where `x` is your module
 */


/*
 * Hot Module Reload
 * experimental version by @gdi2290
 */

function bootstrapDomReady() {
  // bootstrap after document is ready
  return document.addEventListener('DOMContentLoaded', main);
}

if ('development' === ENV) {
  // activate hot module reload
  if (HMR) {
    if (document.readyState === 'complete') {
      main();
    } else {
      bootstrapDomReady();
    }
    module.hot.accept();
  } else {
    bootstrapDomReady();
  }
} else {
  bootstrapDomReady();
}

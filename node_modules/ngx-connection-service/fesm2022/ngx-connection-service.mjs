import * as i0 from '@angular/core';
import { InjectionToken, EventEmitter, Injectable, Inject, Optional, NgModule } from '@angular/core';
import { timer, fromEvent } from 'rxjs';
import { switchMap, retryWhen, tap, delay, debounceTime, startWith } from 'rxjs/operators';
import * as i1 from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { getWindow } from 'ssr-window';

const window = getWindow();
/**
 * InjectionToken for specifing ConnectionService options.
 */
const ConnectionServiceOptionsToken = new InjectionToken('ConnectionServiceOptionsToken');
class ConnectionService {
    static { this.DEFAULT_OPTIONS = {
        enableHeartbeat: true,
        heartbeatUrl: 'https://corsproxy.io?' + encodeURIComponent('https://internethealthtest.org'),
        heartbeatInterval: 30000,
        heartbeatRetryInterval: 1000,
        requestMethod: 'get',
    }; }
    /**
     * Current ConnectionService options. Notice that changing values of the returned object has not effect on service execution.
     * You should use "updateOptions" function.
     */
    get options() {
        return { ...this.serviceOptions };
    }
    constructor(http, options) {
        this.http = http;
        this.stateChangeEventEmitter = new EventEmitter();
        this.currentState = {
            hasInternetAccess: false,
            hasNetworkConnection: window.navigator.onLine
        };
        this.serviceOptions = {
            ...ConnectionService.DEFAULT_OPTIONS,
            heartbeatExecutor: () => this.http.request(this.serviceOptions.requestMethod, this.serviceOptions.heartbeatUrl, { responseType: 'text', withCredentials: false }),
            ...options
        };
        this.checkNetworkState();
        this.checkInternetState();
    }
    checkInternetState() {
        if (this.httpSubscription) {
            this.httpSubscription.unsubscribe();
            this.httpSubscription = null;
        }
        if (this.serviceOptions.enableHeartbeat) {
            this.httpSubscription = timer(0, this.serviceOptions.heartbeatInterval)
                .pipe(switchMap(() => this.serviceOptions.heartbeatExecutor(this.serviceOptions)), retryWhen(errors => errors.pipe(tap(val => {
                this.currentState.hasInternetAccess = false;
                this.emitEvent();
            }), 
            // restart after 5 seconds
            delay(this.serviceOptions.heartbeatRetryInterval))))
                .subscribe(result => {
                this.currentState.hasInternetAccess = true;
                this.emitEvent();
            });
        }
        else {
            this.currentState.hasInternetAccess = false;
            this.emitEvent();
        }
    }
    checkNetworkState() {
        this.onlineSubscription = fromEvent(window, 'online').subscribe(() => {
            this.currentState.hasNetworkConnection = true;
            this.checkInternetState();
            this.emitEvent();
        });
        this.offlineSubscription = fromEvent(window, 'offline').subscribe(() => {
            this.currentState.hasNetworkConnection = false;
            this.currentState.hasInternetAccess = false;
            this.checkInternetState();
            this.emitEvent();
        });
    }
    emitEvent() {
        this.stateChangeEventEmitter.emit(this.currentState);
    }
    ngOnDestroy() {
        try {
            this.offlineSubscription.unsubscribe();
            this.onlineSubscription.unsubscribe();
            this.httpSubscription.unsubscribe();
        }
        catch (e) {
        }
    }
    /**
     * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
     * function will not report current status of the connections when initially subscribed.
     * @param reportCurrentState Report current state when initial subscription. Default is "true"
     */
    monitor(reportCurrentState = true) {
        return reportCurrentState ?
            this.stateChangeEventEmitter.pipe(debounceTime(300), startWith(this.currentState))
            :
                this.stateChangeEventEmitter.pipe(debounceTime(300));
    }
    /**
     * Update options of the service. You could specify partial options object. Values that are not specified will use default / previous
     * option values.
     * @param options Partial option values.
     */
    updateOptions(options) {
        this.serviceOptions = { ...this.serviceOptions, ...options };
        this.checkInternetState();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionService, deps: [{ token: i1.HttpClient }, { token: ConnectionServiceOptionsToken, optional: true }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [ConnectionServiceOptionsToken]
                }, {
                    type: Optional
                }] }] });

class ConnectionServiceModule {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionServiceModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "17.1.0", ngImport: i0, type: ConnectionServiceModule, imports: [HttpClientModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionServiceModule, providers: [ConnectionService], imports: [HttpClientModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "17.1.0", ngImport: i0, type: ConnectionServiceModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [HttpClientModule],
                    providers: [ConnectionService]
                }]
        }] });

/*
 * Public API Surface of connection-service
 */

/**
 * Generated bundle index. Do not edit.
 */

export { ConnectionService, ConnectionServiceModule, ConnectionServiceOptionsToken };
//# sourceMappingURL=ngx-connection-service.mjs.map

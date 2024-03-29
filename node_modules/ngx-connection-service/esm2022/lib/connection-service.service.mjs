import { EventEmitter, Inject, Injectable, InjectionToken, Optional } from '@angular/core';
import { fromEvent, timer } from 'rxjs';
import { debounceTime, delay, retryWhen, startWith, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { getWindow } from 'ssr-window';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const window = getWindow();
/**
 * InjectionToken for specifing ConnectionService options.
 */
export const ConnectionServiceOptionsToken = new InjectionToken('ConnectionServiceOptionsToken');
export class ConnectionService {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29ubmVjdGlvbi1zZXJ2aWNlLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9jb25uZWN0aW9uLXNlcnZpY2Uvc3JjL2xpYi9jb25uZWN0aW9uLXNlcnZpY2Uuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUMsWUFBWSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsY0FBYyxFQUFhLFFBQVEsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUNwRyxPQUFPLEVBQUMsU0FBUyxFQUE0QixLQUFLLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDaEUsT0FBTyxFQUFDLFlBQVksRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFDLE1BQU0sZ0JBQWdCLENBQUM7QUFDekYsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2hELE9BQU8sRUFBQyxTQUFTLEVBQUMsTUFBTSxZQUFZLENBQUM7OztBQUVyQyxNQUFNLE1BQU0sR0FBRyxTQUFTLEVBQUUsQ0FBQztBQWdEM0I7O0dBRUc7QUFDSCxNQUFNLENBQUMsTUFBTSw2QkFBNkIsR0FBNkMsSUFBSSxjQUFjLENBQUMsK0JBQStCLENBQUMsQ0FBQztBQUszSSxNQUFNLE9BQU8saUJBQWlCO2FBQ2Isb0JBQWUsR0FBNkI7UUFDekQsZUFBZSxFQUFFLElBQUk7UUFDckIsWUFBWSxFQUFFLHVCQUF1QixHQUFHLGtCQUFrQixDQUFDLGdDQUFnQyxDQUFDO1FBQzVGLGlCQUFpQixFQUFFLEtBQUs7UUFDeEIsc0JBQXNCLEVBQUUsSUFBSTtRQUM1QixhQUFhLEVBQUUsS0FBSztLQUNyQixBQU42QixDQU01QjtJQWFGOzs7T0FHRztJQUNILElBQUksT0FBTztRQUNULE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsWUFBb0Is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b3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0V2ZW50RW1pdHRlciwgSW5qZWN0LCBJbmplY3RhYmxlLCBJbmplY3Rpb25Ub2tlbiwgT25EZXN0cm95LCBPcHRpb25hbH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge2Zyb21FdmVudCwgT2JzZXJ2YWJsZSwgU3Vic2NyaXB0aW9uLCB0aW1lcn0gZnJvbSAncnhqcyc7XG5pbXBvcnQge2RlYm91bmNlVGltZSwgZGVsYXksIHJldHJ5V2hlbiwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRhcH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHtIdHRwQ2xpZW50fSBmcm9tICdAYW5ndWxhci9jb21tb24vaHR0cCc7XG5pbXBvcnQge2dldFdpbmRvd30gZnJvbSAnc3NyLXdpbmRvdyc7XG5cbmNvbnN0IHdpbmRvdyA9IGdldFdpbmRvdygpO1xuXG4vKipcbiAqIEluc3RhbmNlIG9mIHRoaXMgaW50ZXJmYWNlIGlzIHVzZWQgdG8gcmVwb3J0IGN1cnJlbnQgY29ubmVjdGlvbiBzdGF0dXMuXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29ubmVjdGlvblN0YXRlIHtcbiAgLyoqXG4gICAqIFwiVHJ1ZVwiIGlmIGJyb3dzZXIgaGFzIG5ldHdvcmsgY29ubmVjdGlvbi4gRGV0ZXJtaW5lZCBieSBXaW5kb3cgb2JqZWN0cyBcIm9ubGluZVwiIC8gXCJvZmZsaW5lXCIgZXZlbnRzLlxuICAgKi9cbiAgaGFzTmV0d29ya0Nvbm5lY3Rpb246IGJvb2xlYW47XG4gIC8qKlxuICAgKiBcIlRydWVcIiBpZiBicm93c2VyIGhhcyBJbnRlcm5ldCBhY2Nlc3MuIERldGVybWluZWQgYnkgaGVhcnRiZWF0IHN5c3RlbSB3aGljaCBwZXJpb2RpY2FsbHkgbWFrZXMgcmVxdWVzdCB0byBoZWFydGJlYXQgVXJsLlxuICAgKi9cbiAgaGFzSW50ZXJuZXRBY2Nlc3M6IGJvb2xlYW47XG59XG5cbi8qKlxuICogSW5zdGFuY2Ugb2YgdGhpcyBpbnRlcmZhY2UgY291bGQgYmUgdXNlZCB0byBjb25maWd1cmUgXCJDb25uZWN0aW9uU2VydmljZVwiLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucyB7XG4gIC8qKlxuICAgKiBDb250cm9scyB0aGUgSW50ZXJuZXQgY29ubmVjdGl2aXR5IGhlYXJ0YmVhdCBzeXN0ZW0uIERlZmF1bHQgdmFsdWUgaXMgJ3RydWUnLlxuICAgKi9cbiAgZW5hYmxlSGVhcnRiZWF0PzogYm9vbGVhbjtcbiAgLyoqXG4gICAqIFVybCB1c2VkIGZvciBjaGVja2luZyBJbnRlcm5ldCBjb25uZWN0aXZpdHksIGhlYXJ0YmVhdCBzeXN0ZW0gcGVyaW9kaWNhbGx5IG1ha2VzIFwiSEVBRFwiIHJlcXVlc3RzIHRvIHRoaXMgVVJMIHRvIGRldGVybWluZSBJbnRlcm5ldFxuICAgKiBjb25uZWN0aW9uIHN0YXR1cy4gRGVmYXVsdCB2YWx1ZSBpcyBcIi8vc2VydmVyLnRlc3QtY29ycy5vcmdcIi5cbiAgICovXG4gIGhlYXJ0YmVhdFVybD86IHN0cmluZztcbiAgLyoqXG4gICAqIENhbGxiYWNrIGZ1bmN0aW9uIHRvIHVzZWQgZm9yIGV4ZWN1dGluZyBoZWFydGJlYXQgcmVxdWVzdHMuIERlZmF1bHRzIHRvIEh0dHBDbGllbnQucmVxdWVzdCguLi4pIGZ1bmN0aW9uLlxuICAgKi9cbiAgaGVhcnRiZWF0RXhlY3V0b3I/OiAob3B0aW9ucz86IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucykgPT4gT2JzZXJ2YWJsZTxhbnk+O1xuICAvKipcbiAgICogSW50ZXJ2YWwgdXNlZCB0byBjaGVjayBJbnRlcm5ldCBjb25uZWN0aXZpdHkgc3BlY2lmaWVkIGluIG1pbGxpc2Vjb25kcy4gRGVmYXVsdCB2YWx1ZSBpcyBcIjMwMDAwXCIuXG4gICAqL1xuICBoZWFydGJlYXRJbnRlcnZhbD86IG51bWJlcjtcbiAgLyoqXG4gICAqIEludGVydmFsIHVzZWQgdG8gcmV0cnkgSW50ZXJuZXQgY29ubmVjdGl2aXR5IGNoZWNrcyB3aGVuIGFuIGVycm9yIGlzIGRldGVjdGVkICh3aGVuIG5vIEludGVybmV0IGNvbm5lY3Rpb24pLiBEZWZhdWx0IHZhbHVlIGlzIFwiMTAwMFwiLlxuICAgKi9cbiAgaGVhcnRiZWF0UmV0cnlJbnRlcnZhbD86IG51bWJlcjtcbiAgLyoqXG4gICAqIEhUVFAgbWV0aG9kIHVzZWQgZm9yIHJlcXVlc3RpbmcgaGVhcnRiZWF0IFVybC4gRGVmYXVsdCBpcyAnaGVhZCcuXG4gICAqL1xuICByZXF1ZXN0TWV0aG9kPzogJ2dldCcgfCAncG9zdCcgfCAnaGVhZCcgfCAnb3B0aW9ucyc7XG5cbn1cblxuLyoqXG4gKiBJbmplY3Rpb25Ub2tlbiBmb3Igc3BlY2lmaW5nIENvbm5lY3Rpb25TZXJ2aWNlIG9wdGlvbnMuXG4gKi9cbmV4cG9ydCBjb25zdCBDb25uZWN0aW9uU2VydmljZU9wdGlvbnNUb2tlbjogSW5qZWN0aW9uVG9rZW48Q29ubmVjdGlvblNlcnZpY2VPcHRpb25zPiA9IG5ldyBJbmplY3Rpb25Ub2tlbignQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zVG9rZW4nKTtcblxuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCdcbn0pXG5leHBvcnQgY2xhc3MgQ29ubmVjdGlvblNlcnZpY2UgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBwcml2YXRlIHN0YXRpYyBERUZBVUxUX09QVElPTlM6IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucyA9IHtcbiAgICBlbmFibGVIZWFydGJlYXQ6IHRydWUsXG4gICAgaGVhcnRiZWF0VXJsOiAnaHR0cHM6Ly9jb3JzcHJveHkuaW8/JyArIGVuY29kZVVSSUNvbXBvbmVudCgnaHR0cHM6Ly9pbnRlcm5ldGhlYWx0aHRlc3Qub3JnJyksXG4gICAgaGVhcnRiZWF0SW50ZXJ2YWw6IDMwMDAwLFxuICAgIGhlYXJ0YmVhdFJldHJ5SW50ZXJ2YWw6IDEwMDAsXG4gICAgcmVxdWVzdE1ldGhvZDogJ2dldCcsXG4gIH07XG5cbiAgcHJpdmF0ZSBzdGF0ZUNoYW5nZUV2ZW50RW1pdHRlciA9IG5ldyBFdmVudEVtaXR0ZXI8Q29ubmVjdGlvblN0YXRlPigpO1xuXG4gIHByaXZhdGUgY3VycmVudFN0YXRlOiBDb25uZWN0aW9uU3RhdGUgPSB7XG4gICAgaGFzSW50ZXJuZXRBY2Nlc3M6IGZhbHNlLFxuICAgIGhhc05ldHdvcmtDb25uZWN0aW9uOiB3aW5kb3cubmF2aWdhdG9yLm9uTGluZVxuICB9O1xuICBwcml2YXRlIG9mZmxpbmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBvbmxpbmVTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBodHRwU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgc2VydmljZU9wdGlvbnM6IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucztcblxuICAvKipcbiAgICogQ3VycmVudCBDb25uZWN0aW9uU2VydmljZSBvcHRpb25zLiBOb3RpY2UgdGhhdCBjaGFuZ2luZyB2YWx1ZXMgb2YgdGhlIHJldHVybmVkIG9iamVjdCBoYXMgbm90IGVmZmVjdCBvbiBzZXJ2aWNlIGV4ZWN1dGlvbi5cbiAgICogWW91IHNob3VsZCB1c2UgXCJ1cGRhdGVPcHRpb25zXCIgZnVuY3Rpb24uXG4gICAqL1xuICBnZXQgb3B0aW9ucygpOiBDb25uZWN0aW9uU2VydmljZU9wdGlvbnMge1xuICAgIHJldHVybiB7Li4udGhpcy5zZXJ2aWNlT3B0aW9uc307XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIEBJbmplY3QoQ29ubmVjdGlvblNlcnZpY2VPcHRpb25zVG9rZW4pIEBPcHRpb25hbCgpIG9wdGlvbnM6IENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucykge1xuICAgIHRoaXMuc2VydmljZU9wdGlvbnMgPSB7XG4gICAgICAuLi5Db25uZWN0aW9uU2VydmljZS5ERUZBVUxUX09QVElPTlMsXG4gICAgICBoZWFydGJlYXRFeGVjdXRvcjogKCkgPT4gdGhpcy5odHRwLnJlcXVlc3QoXG4gICAgICAgIHRoaXMuc2VydmljZU9wdGlvbnMucmVxdWVzdE1ldGhvZCxcbiAgICAgICAgdGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRVcmwsXG4gICAgICAgIHtyZXNwb25zZVR5cGU6ICd0ZXh0Jywgd2l0aENyZWRlbnRpYWxzOiBmYWxzZX1cbiAgICAgICksXG4gICAgICAuLi5vcHRpb25zXG4gICAgfTtcblxuICAgIHRoaXMuY2hlY2tOZXR3b3JrU3RhdGUoKTtcbiAgICB0aGlzLmNoZWNrSW50ZXJuZXRTdGF0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGVja0ludGVybmV0U3RhdGUoKSB7XG5cbiAgICBpZiAodGhpcy5odHRwU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuaHR0cFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc2VydmljZU9wdGlvbnMuZW5hYmxlSGVhcnRiZWF0KSB7XG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24gPSB0aW1lcigwLCB0aGlzLnNlcnZpY2VPcHRpb25zLmhlYXJ0YmVhdEludGVydmFsKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5zZXJ2aWNlT3B0aW9ucy5oZWFydGJlYXRFeGVjdXRvcih0aGlzLnNlcnZpY2VPcHRpb25zKSksXG4gICAgICAgICAgcmV0cnlXaGVuKGVycm9ycyA9PlxuICAgICAgICAgICAgZXJyb3JzLnBpcGUoXG4gICAgICAgICAgICAgIHRhcCh2YWwgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5lbWl0RXZlbnQoKTtcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgIC8vIHJlc3RhcnQgYWZ0ZXIgNSBzZWNvbmRzXG4gICAgICAgICAgICAgIGRlbGF5KHRoaXMuc2VydmljZU9wdGlvbnMuaGVhcnRiZWF0UmV0cnlJbnRlcnZhbClcbiAgICAgICAgICAgIClcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZShyZXN1bHQgPT4ge1xuICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlLmhhc0ludGVybmV0QWNjZXNzID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmVtaXRFdmVudCgpO1xuICAgICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzSW50ZXJuZXRBY2Nlc3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjaGVja05ldHdvcmtTdGF0ZSgpIHtcbiAgICB0aGlzLm9ubGluZVN1YnNjcmlwdGlvbiA9IGZyb21FdmVudCh3aW5kb3csICdvbmxpbmUnKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzTmV0d29ya0Nvbm5lY3Rpb24gPSB0cnVlO1xuICAgICAgdGhpcy5jaGVja0ludGVybmV0U3RhdGUoKTtcbiAgICAgIHRoaXMuZW1pdEV2ZW50KCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm9mZmxpbmVTdWJzY3JpcHRpb24gPSBmcm9tRXZlbnQod2luZG93LCAnb2ZmbGluZScpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5oYXNOZXR3b3JrQ29ubmVjdGlvbiA9IGZhbHNlO1xuICAgICAgdGhpcy5jdXJyZW50U3RhdGUuaGFzSW50ZXJuZXRBY2Nlc3MgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XG4gICAgICB0aGlzLmVtaXRFdmVudCgpO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBlbWl0RXZlbnQoKSB7XG4gICAgdGhpcy5zdGF0ZUNoYW5nZUV2ZW50RW1pdHRlci5lbWl0KHRoaXMuY3VycmVudFN0YXRlKTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLm9mZmxpbmVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMub25saW5lU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmh0dHBTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1vbml0b3IgTmV0d29yayAmIEludGVybmV0IGNvbm5lY3Rpb24gc3RhdHVzIGJ5IHN1YnNjcmliaW5nIHRvIHRoaXMgb2JzZXJ2ZXIuIElmIHlvdSBzZXQgXCJyZXBvcnRDdXJyZW50U3RhdGVcIiB0byBcImZhbHNlXCIgdGhlblxuICAgKiBmdW5jdGlvbiB3aWxsIG5vdCByZXBvcnQgY3VycmVudCBzdGF0dXMgb2YgdGhlIGNvbm5lY3Rpb25zIHdoZW4gaW5pdGlhbGx5IHN1YnNjcmliZWQuXG4gICAqIEBwYXJhbSByZXBvcnRDdXJyZW50U3RhdGUgUmVwb3J0IGN1cnJlbnQgc3RhdGUgd2hlbiBpbml0aWFsIHN1YnNjcmlwdGlvbi4gRGVmYXVsdCBpcyBcInRydWVcIlxuICAgKi9cbiAgbW9uaXRvcihyZXBvcnRDdXJyZW50U3RhdGUgPSB0cnVlKTogT2JzZXJ2YWJsZTxDb25uZWN0aW9uU3RhdGU+IHtcbiAgICByZXR1cm4gcmVwb3J0Q3VycmVudFN0YXRlID9cbiAgICAgIHRoaXMuc3RhdGVDaGFuZ2VFdmVudEVtaXR0ZXIucGlwZShcbiAgICAgICAgZGVib3VuY2VUaW1lKDMwMCksXG4gICAgICAgIHN0YXJ0V2l0aCh0aGlzLmN1cnJlbnRTdGF0ZSksXG4gICAgICApXG4gICAgICA6XG4gICAgICB0aGlzLnN0YXRlQ2hhbmdlRXZlbnRFbWl0dGVyLnBpcGUoXG4gICAgICAgIGRlYm91bmNlVGltZSgzMDApXG4gICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSBvcHRpb25zIG9mIHRoZSBzZXJ2aWNlLiBZb3UgY291bGQgc3BlY2lmeSBwYXJ0aWFsIG9wdGlvbnMgb2JqZWN0LiBWYWx1ZXMgdGhhdCBhcmUgbm90IHNwZWNpZmllZCB3aWxsIHVzZSBkZWZhdWx0IC8gcHJldmlvdXNcbiAgICogb3B0aW9uIHZhbHVlcy5cbiAgICogQHBhcmFtIG9wdGlvbnMgUGFydGlhbCBvcHRpb24gdmFsdWVzLlxuICAgKi9cbiAgdXBkYXRlT3B0aW9ucyhvcHRpb25zOiBQYXJ0aWFsPENvbm5lY3Rpb25TZXJ2aWNlT3B0aW9ucz4pIHtcbiAgICB0aGlzLnNlcnZpY2VPcHRpb25zID0gey4uLnRoaXMuc2VydmljZU9wdGlvbnMsIC4uLm9wdGlvbnN9O1xuICAgIHRoaXMuY2hlY2tJbnRlcm5ldFN0YXRlKCk7XG4gIH1cblxufVxuIl19
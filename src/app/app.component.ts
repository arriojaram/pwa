import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScannerComponent } from './scanner/scanner.component';
import { ConnectionService } from 'ngx-connection-service';
import { Subject, debounceTime, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ScannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {

  hasNetworkConnection: boolean = true;
  hasInternetAccess: boolean = true;
  status: string = "";

  private unsubscribe$: Subject<void> = new Subject();

  constructor(private connectionService: ConnectionService) {
    this.connectionService.monitor()
      .pipe(debounceTime(1000), takeUntil(this.unsubscribe$))
      .subscribe(currentState => {
        this.hasNetworkConnection = currentState.hasNetworkConnection;
        this.hasInternetAccess = currentState.hasInternetAccess;
        this.status = this.hasNetworkConnection && this.hasInternetAccess ? 'ONLINE' : 'OFFLINE';
        console.log(`${this.status} - ${new Date()}`);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    console.log(`Unsuscribe - ${this.status} - ${new Date()}`);
  }

  title = 'pwa_sample';
  
}


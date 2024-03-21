import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ListaVentaComponent } from './lista-venta/lista-venta.component';
import { ScannerComponent } from './scanner/scanner.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ListaVentaComponent, ScannerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'pwa_sample';
}

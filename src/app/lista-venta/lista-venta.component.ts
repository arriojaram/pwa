import { Component } from '@angular/core';
import { VentaService } from '../venta.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lista-venta',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-venta.component.html',
  styleUrl: './lista-venta.component.css'
})
export class ListaVentaComponent {
  constructor(public ventaService: VentaService)
  {
    this.isHidden = true;
  }

  isHidden?: boolean;
  message?: string;
  messageClass: string = "alert  alert-success mt-2";

  canFinishSale()
  {
    var terminarVenta = false;
    if(this.ventaService.ventaProductos.length > 0)
      terminarVenta = true;
    
    return !terminarVenta;
  }
  
  finalizarVenta()
  {
    const newProduct = {
      title: 'Test Product',
      description: 'This is a test product',
      price: 100,
      // Agrega más propiedades según el API espera
    };

    this.isHidden = false;
         
    this.ventaService.saveVenta(newProduct).subscribe(
      {
        next: (response) => 
        {
          this.message = `Venta registrada: ${JSON.stringify(response)}`;
          this.messageClass = "alert  alert-success mt-2";
          this.ventaService.ventaProductos = [];
        },
        error: (error) => {
          this.messageClass = "alert  alert-danger mt-2";
          this.message = `Error: ${JSON.stringify(error)}`;
        }
    });

    setTimeout(() => {
      this.isHidden = true; // Oculta el div después de X segundos
  }, 5000);
  }

}

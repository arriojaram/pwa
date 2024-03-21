import { Component, OnInit } from "@angular/core"; 
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { VentaService } from "../venta.service";  
import { CommonModule } from "@angular/common"; 
  

@Component({
    selector: 'app-scanner',
    standalone: true,
    imports: [ReactiveFormsModule, CommonModule],
    templateUrl: './scanner.component.html',
    styleUrls: ['./scanner.component.css']
})

export class ScannerComponent implements OnInit {
    constructor(public ventasService: VentaService) {}

    ngOnInit(): void {
        this.isHidden = true;
        //this.loadProductCatalog();
    }

    isHidden?: boolean;
    label_productoAdded?: string;
    messageClass: string = "alert  alert-success mt-2";

    formVenta = new FormGroup({
        codigo : new FormControl('', Validators.required)
    });
    

    get codigo(){
        return this.formVenta.get('codigo') as FormControl;
    }

    procesar()
    {
        // TODO get this information from a WS
       
        var isAdded = this.ventasService.addProduct(this.codigo.value);
        this.isHidden = false;

        if(isAdded)
        {
            this.messageClass = "alert  alert-success mt-2";
            this.label_productoAdded = `Producto ${ this.codigo.value} agregado correctamente`;        
        }
        else
        {
            this.messageClass = "alert  alert-danger mt-2";
            this.label_productoAdded = `El producto no existe : ${ this.codigo.value}`;        
        }

        
        setTimeout(() => {
            this.isHidden = true; // Oculta el div después de 5 segundos
        }, 3000);
    
        this.formVenta.get('codigo')?.setValue('');
    }
    
}
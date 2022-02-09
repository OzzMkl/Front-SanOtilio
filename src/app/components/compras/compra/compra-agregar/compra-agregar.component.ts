import { Component, OnInit } from '@angular/core';
/**Servicios */
import { ProveedorService } from 'src/app/services/proveedor.service';

@Component({
  selector: 'app-compra-agregar',
  templateUrl: './compra-agregar.component.html',
  styleUrls: ['./compra-agregar.component.css'],
  providers: [ProveedorService]
})
export class CompraAgregarComponent implements OnInit {

  public proveedores: any;

  constructor( private _proveedorService: ProveedorService) { }

  ngOnInit(): void {
    this.getProvee();
  }
/**SERVICIOS */
  getProvee(){
    this._proveedorService.getProveedores().subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedores = response.proveedores;
          console.log(this.proveedores);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
}

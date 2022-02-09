import { Component, OnInit } from '@angular/core';
/**Servicios */
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MedidaService } from 'src/app/services/medida.service';
/**MODELOS */
import { compra } from 'src/app/models/compra'

@Component({
  selector: 'app-compra-agregar',
  templateUrl: './compra-agregar.component.html',
  styleUrls: ['./compra-agregar.component.css'],
  providers: [ProveedorService, MedidaService]
})
export class CompraAgregarComponent implements OnInit {

  public proveedores: any;
  public medidas: any;
  public compra: compra;

  constructor( 
    private _proveedorService: ProveedorService,
    private _medidaService: MedidaService) {
      this.compra = new compra();
     }

  ngOnInit(): void {
    this.getProvee();
    this.getMedida();
  }
/**SERVICIOS */
  getProvee(){
    this._proveedorService.getProveedores().subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedores = response.proveedores;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getMedida(){
    this._medidaService.getMedidas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.medidas = response.medidas
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}

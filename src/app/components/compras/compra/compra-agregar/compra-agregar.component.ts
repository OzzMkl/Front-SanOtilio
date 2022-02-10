import { Component, OnInit } from '@angular/core';
/**Servicios */
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MedidaService } from 'src/app/services/medida.service';
/**MODELOS */
import { Compra } from 'src/app/models/compra'

@Component({
  selector: 'app-compra-agregar',
  templateUrl: './compra-agregar.component.html',
  styleUrls: ['./compra-agregar.component.css'],
  providers: [ProveedorService, MedidaService]
})
export class CompraAgregarComponent implements OnInit {

  public proveedoresLista: any;
  public proveedorVer: any;
  public medidas: any;
  public compra: Compra;

  constructor( 
    private _proveedorService: ProveedorService,
    private _medidaService: MedidaService) {
      this.compra = new Compra(0,null,null,0,0,0,0,0,'',null,'',null);
     }

  ngOnInit(): void {
    this.getProvee();
    this.getMedida();
    
  }
  onChange(id:any){//evento que muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }
/**SERVICIOS */
  getProvee(){
    this._proveedorService.getProveedores().subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedoresLista = response.proveedores;
          
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
  getProveeVer(id:any){
    this._proveedorService.getProveedoresVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedorVer = response.proveedores;
          console.log(this.proveedorVer);
        }
      }, error =>{
          console.log(error);
      }
    );
  }
  

}

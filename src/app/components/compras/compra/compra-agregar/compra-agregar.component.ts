import { Component, OnInit } from '@angular/core';
/**Servicios */
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MedidaService } from 'src/app/services/medida.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
/**MODELOS */
import { Compra } from 'src/app/models/compra'
import { Producto_compra } from 'src/app/models/producto_compra';

@Component({
  selector: 'app-compra-agregar',
  templateUrl: './compra-agregar.component.html',
  styleUrls: ['./compra-agregar.component.css'],
  providers: [ProveedorService, MedidaService,
  ProductoService]
})
export class CompraAgregarComponent implements OnInit {

  public proveedoresLista: any;
  public proveedorVer: any;
  public productoVer: any;
  public medidas: any;
  public compra: Compra;
  public Lista_compras: Array<Producto_compra>;
  public producto_compra: Producto_compra;
  //public producto_datos_extra:any;
  public dato:any;
  public url:any;

  constructor( 
    private _proveedorService: ProveedorService,
    private _medidaService: MedidaService,
    private _productoService: ProductoService) {
      this.compra = new Compra(0,null,null,0,0,0,0,0,'',null,'',null);
      this.producto_compra = new Producto_compra(0,0,0,0,0,0,null,null,null);
      this.Lista_compras = [];
      this.url = global.url;
     }

  ngOnInit(): void {
    this.getProvee();
    this.getMedida();
    
  }
  onChange(id:any){//evento que muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }
  Consultar(event:any){
    if (event.keyCode === 13) {
      //alert('you just pressed the enter key'+event);
      this.dato=event.target.value;
      //console.log(this.dato)
      this.getProd(this.dato);
    }
  }
  capturar(datos:any){
    this.Lista_compras.push({...this.producto_compra});
    console.log(this.Lista_compras);
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
  getProd(id:any){
    this._productoService.getProdverDos(id).subscribe(
      response =>{
        this.productoVer = response.producto;
        //console.log(this.productoVer);
      },error => {
        console.log(error);
      }
    );
  }
}

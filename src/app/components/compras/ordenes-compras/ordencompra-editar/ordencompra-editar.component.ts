import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ordencompra-editar',
  templateUrl: './ordencompra-editar.component.html',
  styleUrls: ['./ordencompra-editar.component.css'],
  providers:[ProveedorService,ProductoService, OrdendecompraService, EmpleadoService]
})
export class OrdencompraEditarComponent implements OnInit {

//variables servicios
public url: string = global.url;
public orden_compra: Ordencompra;
public productosOrden: Producto_orden;
public detallesProveedor:any;
public proveedoresLista:any;
public isSearch: boolean = true;
date!: Date;
public test: boolean = false;
//modelode bootstrap datapicker
  //modelode bootstrap datapicker

  model!: NgbDateStruct;
  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _productoService: ProductoService,
    public toastService: ToastService,
    private _ordencompraService: OrdendecompraService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
  ) {
    this.orden_compra = new Ordencompra (0,null,0,'',null,0,null,null);
    this.productosOrden = new Producto_orden(0,0,0,null,null,null,null);
    
    
   }

  ngOnInit(): void {
    this.getOrdencompra();
    this.getAllProveedores();
  }
  getOrdencompra(){
    //Nos suscribimos al url para extraer el id
    this._route.params.subscribe( params =>{
      let id = + params['idOrd'];//la asignamos en una variable
      //Mandamos a traer la informacion de la orden de compra
      this._ordencompraService.getDetailsOrdes(id).subscribe(
        response =>{
          if(response.status  == 'success' && response.ordencompra.length > 0 && response.productos.length > 0){
            this.orden_compra.idProveedor = response.ordencompra[0]['idProveedor'];
            this.orden_compra.fecha = response.ordencompra[0]['fecha'];
            //let date: Date = new Date(response.ordencompra[0]['fecha']);
            this.date = new Date(response.ordencompra[0]['fecha']);
            this.orden_compra.idEmpleado = response.ordencompra[0]['idEmpleado'];
            this.orden_compra.idOrd = response.ordencompra[0]['idOrd'];
            this.orden_compra.idReq = response.ordencompra[0]['idReq'];
            this.orden_compra.idStatus = response.ordencompra[0]['idStatus'];
            this.orden_compra.observaciones = response.ordencompra[0]['observaciones'];
            this.orden_compra.updated_at = response.ordencompra[0]['updated_at'];

            response.productos.array.forEach((element:any) => {
              
              this.productosOrden.claveEx = element.claveexterna;
            });

            //console.log(parseInt(response.ordencompra[0]['fecha'].substr(8,10)));
            //console.log(this.model);
          }
          console.log(response.productos);
        },error =>{
          console.log(error);
      });
    });
  }
  getAllProveedores(){
    this._proveedorService.getProveedores().subscribe(
      response =>{
        this.proveedoresLista = response.proveedores;
      },error =>{
        console.log(error);
        
      });
  }
  seleccionaProveedor(id:any){
    this._proveedorService.getProveedoresVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.detallesProveedor = response.proveedores;
        }
    },error =>{
      console.error(error);
    });
  }

}

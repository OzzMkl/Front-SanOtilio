import { Component, OnInit } from '@angular/core';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
//Modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ordencompra-agregar',
  templateUrl: './ordencompra-agregar.component.html',
  styleUrls: ['./ordencompra-agregar.component.css'],
  providers:[ProveedorService,ProductoService]
})
export class OrdencompraAgregarComponent implements OnInit {

  closeResult = '';

  public proveedoresLista:any;
  public proveedorVer:any;
  public orden_compra: Ordencompra;
  public producto_orden: Producto_orden;
  public Lista_compras: Array<Producto_orden>;
  public productos: any;
  public isSearch: boolean = true;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
//Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar = '';
  //variables servicios
  public dato:any;
  public productoVer: any;
  public url:any;
  

  constructor( private _proveedorService: ProveedorService,
      private modalService: NgbModal,
      private _productoService: ProductoService,
      public toastService: ToastService
    ) {
    this.orden_compra = new Ordencompra(0,null,0,'',null,0,0,null);
    this.producto_orden = new Producto_orden(0,0,0,null,null,null,null);
    this.Lista_compras = [];
    this.url = global.url;
   }

  ngOnInit(): void {
    this.getProvee();
    this.getAllProducts();
  }
  onChange(id:any){//evento que muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }
  capturar(datos:any){//Agregar a lista de compras
    if(this.producto_orden.cantidad == 0){
      this.toastService.show('No se pueden agregar productos con cantidad: 0',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.producto_orden.idProducto == 0){
      this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000})
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_orden.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this.Lista_compras.push({...this.producto_orden});
      this.isSearch=true;
    }
    
    //console.log(this.Lista_compras);
  } 
  consultarProducto(event:any){//mostrar informacion del producto al dar enter
    if (event.keyCode === 13) {
      //alert('you just pressed the enter key'+event);
      this.dato=event.target.value;
      //console.log(this.dato)
      this.getProd(this.dato);
      this.isSearch = false;
      //console.log(this.producto_orden);
    }
  }
  consultarProductoModal(dato:any){
    this.getProd(dato);
    this.isSearch = false;
  }
  agregarOrdCompra(form:any,event:any){
    if(event.keyCode === 13){
      console.log('ño')
    }else{
      console.log(this.orden_compra)
      console.log(this.Lista_compras)
    }
  }
  //Servicios
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
  getProveeVer(id:any){
    this._proveedorService.getProveedoresVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedorVer = response.proveedores;
          //console.log(this.proveedorVer);
        }
      }, error =>{
          console.log(error);
      }
    );
  }
  getAllProducts(){
    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.productos = response.productos;
          //navegacion paginacion
          this.totalPages = response.productos.total;
          //console.log(response.productos);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getProd(id:any){
    this._productoService.getProdclaveex(id).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.producto_orden.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_orden.claveEx = this.productoVer[0]['claveEx'];
        this.producto_orden.idProducto = this.productoVer[0]['idProducto'];
        this.producto_orden.nombreMedida = this.productoVer[0]['nombreMedida'];
        //console.log(this.productoVer);
      },error => {
        console.log(error);
      }
    );
  }
  // Modal
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

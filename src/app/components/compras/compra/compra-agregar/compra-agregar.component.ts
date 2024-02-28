import { Component, OnInit } from '@angular/core';
/**Servicios */
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MedidaService } from 'src/app/services/medida.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ImpuestoService } from 'src/app/services/impuesto.service';
import { CompraService } from 'src/app/services/compra.service';
import { global } from 'src/app/services/global';
/**MODELOS */
import { Compra } from 'src/app/models/compra'
import { Producto_compra } from 'src/app/models/producto_compra';
import { ToastService } from 'src/app/services/toast.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons, NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-compra-agregar',
  templateUrl: './compra-agregar.component.html',
  styleUrls: ['./compra-agregar.component.css'],
  providers: [ProveedorService, MedidaService,ProductoService,ImpuestoService, OrdendecompraService, EmpleadoService, CompraService]
})
export class CompraAgregarComponent implements OnInit {
  
  closeResult = '';

  public orden_compra: Ordencompra;
  public proveedoresLista: any;
  public proveedorVer: any;
  public medidas: any;
  public impuestos: any;
  public impuestoVer: any;
  public compra: Compra;
  public Lista_compras: Array<Producto_compra>;
  public producto_compra: Producto_compra;
  public productos: any;
  public isSearch: boolean = true;
  public idUser:any;
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
  public identity: any;
  public ultimaCompra: any;
  public detailOrd: any;
  public detailComp: any;
  //modelo de bootstrap
  model!: NgbDateStruct;
  today = this.calendar.getToday();
  //variable para el pdf
  public fecha : Date = new Date();


  constructor( 
    private _proveedorService: ProveedorService,
    private _medidaService: MedidaService,
    private _productoService: ProductoService,
    private _impuestoService: ImpuestoService,
    private modalService: NgbModal,
    public toastService: ToastService,
    private _ordencompraService: OrdendecompraService,
    public _empleadoService : EmpleadoService,
    public _compraService : CompraService,
    private calendar: NgbCalendar
    ) {
      this.orden_compra = new Ordencompra(0,null,0,'',null,0,1,null);
      this.compra = new Compra(0,null,0,0,0,0,0,0,null,'',false,null);
      this.producto_compra = new Producto_compra(0,0,0,0,0,1,null,0,null,null,null,null,null,0,null);
      this.Lista_compras = [];
      this.url = global.url;
     }

  ngOnInit(): void {
    this.getProvee();
    this.getMedida();
    this.getImpuesto();
    this.getAllProducts();
    this.loadUser();
  }

  /*Eventos*/
  onChange(id:any){//Muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }

  onChangeI(id:any){//Muestra los datos del impuesto al seleccionarlo
    this.getImpuestoVer(id);    
    // console.log(id);
  }

  onChangeT(subtotal:any){//Recalcula el subtotal al hacer un cambio
    this.producto_compra.subtotal = this.producto_compra.cantidad * this.producto_compra.precio;
    this.producto_compra.subtotal = this.producto_compra.subtotal + (this.producto_compra.subtotal * (this.producto_compra.valorImpuesto / 100)); 
  }

  cambioSeleccionado(e:any){//Limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }

  capturar(datos:any){//Agregar a lista de compras
    if(this.producto_compra.cantidad <= 0 || this.producto_compra.precio <= 0 || this.producto_compra.subtotal <= 0){
      // this.toastService.show('No se pueden agregar productos con cantidad, precio o importe menor o igual a 0',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.producto_compra.idProducto == 0){
      // this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000})
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_compra.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      // this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this.Lista_compras.push({...this.producto_compra});
      this.isSearch=true;
    }
    console.log(this.Lista_compras);
  }

  consultarProductoModal(dato:any){
    this.getProd(dato);
    this.isSearch = false;
  }

  consultarProducto(event:any){//Mostrar informacion del producto al dar enter
    //alert('you just pressed the enter key'+event);
    this.dato=event.target.value;
    //console.log(this.dato)
    this.getProd(this.dato);
    this.isSearch = false;
    //console.log(this.producto_orden);
  
  }
  
  public createPDF():void{//Crear PDF
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
    // this._productoService.getProdclaveex(id).subscribe(
    //   response =>{
    //     this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
    //     this.producto_compra.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
    //     this.producto_compra.claveexterna = this.productoVer[0]['claveEx'];
    //     this.producto_compra.idProducto = this.productoVer[0]['idProducto'];
    //     this.producto_compra.nombreMedida = this.productoVer[0]['nombreMedida'];
    //     //console.log(this.productoVer);
    //   },error => {
    //     console.log(error);
    //   }
    // );
  }
  
  loadUser(){
    this.identity = this._empleadoService.getIdentity();
  }

  getDetailsOrd(){
    this._compraService.getLastCompra().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ultimaCompra = response.compra;
          this._compraService.getDetailsCompra(this.ultimaCompra['idCompra']).subscribe(
            response => {
              this.detailComp = response.compra;
              console.log(this.detailComp);
              this.createPDF();
            },error =>{
              console.log(error);
            });
        }else{
          console.log('fallo');
        }
     
      },error =>{
        console.log(error);
      });
  }

  getImpuesto(){
    this._impuestoService.getImpuestos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.impuestos = response.impuestos
          console.log(this.impuestos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  
  getImpuestoVer(id:any){
    //console.log(id);
    this._impuestoService.getImpuestoVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.impuestoVer = response.impuesto;
          this.producto_compra.NombreImpuesto = response.impuesto[0]['nombre'];
          this.producto_compra.valorImpuesto = response.impuesto[0]['valor'];
          if(this.producto_compra.valorImpuesto > 0){
            // subtotal = subtotal + ( subtotal *( valorImpuesto /100));
            this.producto_compra.subtotal = this.producto_compra.cantidad * this.producto_compra.precio;
            this.producto_compra.subtotal = this.producto_compra.subtotal + (this.producto_compra.subtotal * (this.producto_compra.valorImpuesto / 100)); 
          }
          // console.log('Nombreimpuesto: ',this.producto_compra.NombreImpuesto);
          // console.log('valorImpuesto: ',this.producto_compra.valorImpuesto);
        }
      }, error =>{
          console.log(error);
      }
    );
  }

  agregarCompra(form:any){//Enviar Form insertar en DB
    this.compra.idEmpleadoR = this.identity['sub'];//asginamos id de Empleado
    this.compra.fechaRecibo = this.model.year+'-'+this.model.month+'-'+this.model.day;//concatenamos la fecha del datepicker
    this.compra.idStatus = 1;
    //console.log(this.compra);
    this._compraService.registrerCompra(this.compra).subscribe(
    response =>{
      if(response.status == 'Success!'){
        // console.log(response)       
        //   this.toastService.show(' ⚠ Orden creada', { classname: 'bg-warning  text-bold', delay: 5000 });
          this._compraService.registerProductoscompra(this.Lista_compras).subscribe(
            res =>{
                console.log(res);
                // this.toastService.show(' ⚠ Compra creada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                this.getDetailsOrd();
                //this.createPDF();
            },error =>{
              console.log(<any>error);
              // this.toastService.show('Ups... Fallo al agregar los productos a la compra', { classname: 'bg-danger text-light', delay: 15000 });
            });
        //Agregar a PELOTE
          this._compraService.updateExistencia(this.Lista_compras).subscribe(
            res =>{
                console.log(res);
                // this.toastService.show(' ⚠ Producto-Existencia-Lote agregado exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                //this.getDetailsOrd();
                //this.createPDF();
            },error =>{
              console.log(<any>error);
              // this.toastService.show('Ups... Fallo al agregar los productos a Producto-Existencia-Lote', { classname: 'bg-danger text-light', delay: 15000 });
            });

      }else{
        console.log('fallo');  
        console.log(response);
      }
    },error =>{
      console.log(<any>error);
      // this.toastService.show('Ups... Fallo al crear la compra', { classname: 'bg-danger text-light', delay: 15000 });
    });
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



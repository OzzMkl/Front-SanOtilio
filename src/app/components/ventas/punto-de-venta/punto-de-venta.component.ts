import { Component, OnInit } from '@angular/core';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
//modelos
import { Ventag } from 'src/app/models/ventag';
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion } from 'src/app/models/cdireccion';
import { Producto_ventasg } from 'src/app/models/productoVentag';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-punto-de-venta',
  templateUrl: './punto-de-venta.component.html',
  styleUrls: ['./punto-de-venta.component.css'],
  providers:[ProductoService]
})
export class PuntoDeVentaComponent implements OnInit {
  //cerrar modal
  closeResult = '';
  //variable de servicios
  public tipopago:any;//getTipopago
  public clientes:any;//getClientes
  public cliente:any;//seleccionarCliente
  public listaDireccionesC:any;//seleccionarCliente
  public tipocliente :any;//tipocliente
  public productos:any;//getProductos
  public producto:any;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  pageActual2: number = 1;
  //pipes de busqueda en modal
  buscarCliente ='';//modal cliente
  seleccionado:number = 1;//para cambiar entre pipes de buscarProducto
  buscarProducto = '';//modal de buscar producto
  buscarProductoCE = '';//modal de buscar producto
  buscarProductoCbar = '';//modal de buscar producto
  //modelos
  public ventag: Ventag;
  public modeloCliente: Cliente;
  public cdireccion: Cdireccion;
  public nuevaDir: Cdireccion;
  public productoVentag: Producto_ventasg;
  //variables html checks
  public seEnvia: boolean = false;
  public isCompany: boolean = false;
  public isCredito: boolean = false;
  public checkDireccion: boolean = false;
  public subtotal:number =0;


  constructor( 
    //declaramos servicios
    private modalService: NgbModal,
    private _clienteService: ClientesService,
    public toastService: ToastService,
    private _productoService:ProductoService,
    private _ventasService: VentasService) {
    //declaramos modelos
    this.ventag = new Ventag(0,0,0,0,'',0,null,0,'','');
    this.modeloCliente = new Cliente (0,'','','','','',0,1,0);
    this.cdireccion = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
    this.nuevaDir = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
    this.productoVentag = new Producto_ventasg(0,0,'',0,0,0,'','');
   }

  ngOnInit(): void {
//    this.getProductos();
this.getTipopago();
  }
  getTipopago(){
    this._ventasService.getTipoventa().subscribe( 
      response =>{
        
        if(response.status == 'success'){
          this.tipopago = response.tipo_pago;
          //console.log(this.tipopago);
        }
      },error =>{
        console.log(error);
      });
  }
  //traemos todos los clientes
  getClientes(){
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          //console.log(this.clientes);
        }
      },error =>{
      console.log(error);
    });
  }
  //obtenemos los tipos de clientes para el select
  getTipocliente(){
    this._clienteService.getTipocliente().subscribe(
      response =>{
        this.tipocliente = response.tipocliente;
      },error =>{
        console.log(error);
      });
  }
  //obtener direcciones del cliente si es que se envia la venta
  getDireccionCliente(idCliente:any){
  this._clienteService.getDireccionCliente(idCliente).subscribe( 
    response => {
      if(response.status == 'success'){
        this.listaDireccionesC = response.direccion;
      }
      //this.listaDireccionesC = response.
    },error =>{
      console.log(error);
    });
  }
  //traemos la informacion del cliente seleccionado
  seleccionarCliente(idCliente:any){
    this.ventag.dirCliente = '';
    this.seEnvia == false;

    this._clienteService.getDetallesCliente(idCliente).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.cliente = response.cliente;
          //this.dirCliente= response.cdireccion;
          this.ventag.nombreCliente = this.cliente[0]['nombre']+' '+this.cliente[0]['aPaterno']+' '+this.cliente[0]['aMaterno'];
          this.ventag.idCliente = this.cliente[0]['idCliente'];
        }else{
          console.log('algo salio mal'+response);
        }
        //console.log(response.cliente);
        //console.log(response.cdireccion);
      },error=>{
        console.log(error);
      });
  }
  //cargamos la informacion selccionada a la propiedad de venta.dirCliente direccion del cliente
  seleccionarDireccion(direccion:any){
    this.ventag.dirCliente=direccion;
  }
  //accion de guardar el nuevo cliente del modal
  guardarCliente(){
    
    if(this.isCompany == true ){
      this.modeloCliente.aMaterno ='';
      this.modeloCliente.aPaterno='';
    }
    this._clienteService.postCliente(this.modeloCliente).subscribe( 
      response =>{
        if(response.status == 'success'){
          if(this.checkDireccion == true){
            this._clienteService.postCdireccion(this.cdireccion).subscribe( 
              response=>{
                this.toastService.show('Cliente registrado correctamente',{classname: 'bg-success text-light', delay: 3000});
                //console.log(response);
              },error=>{
                this.toastService.show('Cliente registrado, pero sin direccion',{classname: 'bg-danger text-light', delay: 6000})
                console.log(error);
              });
          }else{
            this.toastService.show('Cliente registrado, pero sin direccion',{classname: 'bg-success text-light', delay: 3000});
          }
        }else{
          this.toastService.show('Algo salio mal',{classname: 'bg-danger text-light', delay: 6000})
          //console.log('Algo salio mal');
        }
      },error=>{
        console.log(error);
    });
  }
  //guarda una nueva direccion
  guardarNuevaDireccion(){
    this.nuevaDir.idCliente = this.ventag.idCliente;
    this._clienteService.postNuevaDireccion(this.nuevaDir).subscribe( 
      response=>{
        if(response.status == 'success'){
          this.toastService.show('Direccion registrada correctamente',{classname: 'bg-success text-light', delay: 3000});
        }
        //console.log(response)
       }, error =>{
      console.log(error);
    });
    //this.getDireccionCliente(this.ventag.idCliente);
  }
  //obtenemos todos los productos
  getProductos(){
    this._productoService.getProductosPV().subscribe( 
      response => {
        if(response.status == 'success'){
          this.productos = response.productos;
          //console.log(response);
        }
      }, error =>{
      console.log(error);
    });
  }
  seleccionarProducto(idProducto:any){
    //console.log(idProducto);
    this._productoService.getProdverDos(idProducto).subscribe( response => {
      //console.log(response);
      if(response.status == 'success'){
        this.producto = response.producto;
        this.productoVentag.claveEx = this.producto[0]['claveEx'];
        this.productoVentag.nombreMedida = this.producto[0]['nombreMedida'];
        this.productoVentag.precio = this.producto[0]['precioS'];
        this.productoVentag.descripcion = this.producto[0]['descripcion'];
      }
    },error =>{
      console.log(error);
    });
  }
  calculaSubtotal(){
    if(this.productoVentag.precio < this.producto[0]['precioR']){
      this.toastService.show('nO SE PUEDE',{classname: 'bg-danger text-light', delay: 6000});
    }else{
      this.subtotal= (this.productoVentag.cantidad * this.productoVentag.precio)- this.productoVentag.descuento;
    }
  }


  // Metodos del  modal
  open(content:any) {//abrir modal aplica para la mayoria de los modales
    this.getClientes();
    this.getTipocliente();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {//cerrarmodal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  modalSeEnvia(content:any){//abre modal para seleccionaar direccion del cliente
    //si el chek de se envia es true abrimos modal
    if(this.seEnvia == true){
      this.getClientes();
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }else{
      //si el check es falso ponemos vacia la propiedad de direccion cliente
      this.ventag.dirCliente = '';
    }
  }
  modalAgregarDireccion(content:any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  modalBuscarProducto(content:any){
    this.getProductos();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }
}
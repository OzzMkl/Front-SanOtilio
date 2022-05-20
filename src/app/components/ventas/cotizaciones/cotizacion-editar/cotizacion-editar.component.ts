import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//servicios
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
//modelos
import { Ventag } from 'src/app/models/ventag';
import { Producto_ventasg } from 'src/app/models/productoVentag';
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion } from 'src/app/models/cdireccion';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-cotizacion-editar',
  templateUrl: './cotizacion-editar.component.html',
  styleUrls: ['./cotizacion-editar.component.css'],
  providers:[ProductoService]
})
export class CotizacionEditarComponent implements OnInit {
  
      //modelos
  public cotizacion_editada: Ventag;//getDetallesCotiza
  public productos_cotizacion_e: Array<Producto_ventasg>;//getDetallesCotiza
  public modeloCliente: Cliente;
  public cdireccion: Cdireccion;
  public nuevaDir: Cdireccion;
  public productoVentag: Producto_ventasg;
  //variables servicios
  public empresa:any;//getDatosempresa
  public clientes:any;
  public cliente:any;//getDetallesCliente
  public listaDireccionesC:any;
  public tipocliente :any;//gettipocliente
  public productos:any;//getProductos
  public producto:any;//seleccionar producto
  public productoEG:any;//agregarProductoLista
  //Variables html
  public seEnvia: boolean = false;
  public isCompany: boolean = false;
  public isRFC: boolean = false;
  public checkDireccion: boolean = false;
  public isCredito: boolean = false;
  public isSearch: boolean = true;
  //spinners
  public isLoadingClientes: boolean = false;
  public isLoadingDatos: boolean = false;
  public isLoadingProductos: boolean = false;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pagePV: number = 1;
  pageActual: number =1;//modal clientes
  pageActual2: number =1;//modal clientes
  //cerrar modal
  closeResult ='';
  //pipes
  buscarCliente ='';
  seleccionado:number = 1;//para cambiar entre pipes de buscarProducto
  buscarProducto = '';//modal de buscar producto
  buscarProductoCE = '';//modal de buscar producto
  buscarProductoCbar = '';//modal de buscar producto

  constructor( private _clienteService: ClientesService, public toastService: ToastService,
               private _productoService: ProductoService, private _ventasService: VentasService,
               private _empleadoService: EmpleadoService, private _empresaService: EmpresaService,
               private _route: ActivatedRoute, private modalService: NgbModal ) {
                 this.cotizacion_editada = new Ventag(0,0,2,'',1,null,0,0,0,0,'','',0);
                 this.productos_cotizacion_e = [];
                 this.modeloCliente = new Cliente (0,'','','','','',0,1,0);
                 this.cdireccion = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
                 this.nuevaDir = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
                 this.productoVentag = new Producto_ventasg(0,0,'',0,0,0,'','',0,0,true);
               }

  ngOnInit(): void {
    this.getDatosEmpresa();
    this.getDetallesCotiza();
  }
  //TRAEMOS LOS DATOS DE LA COTIZACION
  getDetallesCotiza(){
    this.isLoadingDatos=true;
    this._route.params.subscribe( params =>{
      let id = + params['idCotiza'];
      //
      this._ventasService.getDetallesCotiza(id).subscribe(
        response =>{
          if(response.status == 'success'){
            this.cotizacion_editada.idCliente = response.Cotizacion[0]['idCliente'];
            this.cotizacion_editada.cdireccion = response.Cotizacion[0]['cdireccion'];
            this.cotizacion_editada.observaciones = response.Cotizacion[0]['observaciones'];
            this.cotizacion_editada.subtotal = response.Cotizacion[0]['subtotal'];
            this.cotizacion_editada.descuento = response.Cotizacion[0]['descuento'];
            this.cotizacion_editada.total = response.Cotizacion[0]['total'];
            //cargamos los productos
            this.productos_cotizacion_e = response.productos_cotiza;

            this.seleccionarCliente(this.cotizacion_editada.idCliente);
            
            this.isLoadingDatos = false;
            
          }
          console.log(this.cotizacion_editada);
          //console.log(this.productos_cotizacion_e);
        },error =>{
          console.log(error);
        }
      )
    });
  }
  //TRAEMOS LA INFORMACION DE LA EMPRESA / SUCURSAL
  getDatosEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe( 
      response => {
        if(response.status == 'success'){
           this.empresa = response.empresa;
           //console.log(this.empresa)
        }
      },error => {console.log(error)});
  }
  //traemos informacion de todos los clientes
  getClientes(){
    this.isLoadingClientes = true;
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          this.isLoadingClientes = false;
        }
      }, error =>{
        console.log(error);
      });
  }
  //obtenemos los tipos de clientes para el select del modal para agregar nuevos clientes
  getTipocliente(){
    this._clienteService.getTipocliente().subscribe(
      response =>{
        this.tipocliente = response.tipocliente;
      },error =>{
        console.log(error);
      });
  }
   //cargamos la informacion selccionada a la propiedad de venta.dirCliente direccion del cliente
   seleccionarDireccion(direccion:any){
    this.cotizacion_editada.cdireccion=direccion;
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
    //obtenemos todos los productos
  getProductos(){
    this.isLoadingProductos=true;
    this._productoService.getProductosPV().subscribe( 
      response => {
        if(response.status == 'success'){
          this.productos = response.productos;
          //console.log(response);
          this.isLoadingProductos = false;
        }
      }, error =>{
      console.log(error);
    });
  }
  //cargamos la informacion al modelo del producto que se selecciono con el click
  seleccionarProducto(idProducto:any){
    //console.log(idProducto);
    this._productoService.getProdverDos(idProducto).subscribe( response => {
      //console.log(response);
      if(response.status == 'success'){
        this.producto = response.producto;
        this.productoVentag.claveEx = this.producto[0]['claveEx'];
        this.productoVentag.idProducto = this.producto[0]['idProducto'];
        this.productoVentag.nombreMedida = this.producto[0]['nombreMedida'];
        this.productoVentag.precio = this.producto[0]['precioS'];
        this.productoVentag.descripcion = this.producto[0]['descripcion'];
        this.productoVentag.precioMinimo = this.producto[0]['precioR'];
        //this.productoVentag.tieneStock = this.producto[0]['existenciaG']
        this.productoVentag.cantidad = 0;
        //this.calculaSubtotalPP();
        this.isSearch=false;
      }
    },error =>{
      console.log(error);
    });
  }
  //traemos la informacion del cliente seleccionado del modal o el cliente que ya trae la cotizacion
  seleccionarCliente(idCliente:any){
    this._clienteService.getDetallesCliente(idCliente).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.cliente = response.cliente;
          this.cotizacion_editada.nombreCliente = this.cliente[0]['nombre']+' '+this.cliente[0]['aPaterno']+' '+this.cliente[0]['aMaterno'];
          this.cotizacion_editada.idCliente = this.cliente[0]['idCliente'];
          if(this.cotizacion_editada.idCliente != idCliente){
            this.cotizacion_editada.cdireccion = '';
          }
        }else{
          console.log('Algo salio mal '+response);
        }
      }, error =>{
        console.log( error);
      });
  }
  //evitamod que den enter en el textarea de observaciones
  omitirEnter(event:any){
    if(event.which === 13 && !event.shiftKey){
      event.preventDefault();
      console.log('prevented');
      
    }
  }
  //accion de guardar el nuevo cliente del modal
  guardarCliente(){
    if(this.isCompany == true ){
      this.modeloCliente.aMaterno ='';
      this.modeloCliente.aPaterno='';
    }
    if(this.isRFC == false){
      this.modeloCliente.rfc = 'XAXX010101000';
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
  this.nuevaDir.idCliente = this.cotizacion_editada.idCliente;
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
calculaSubtotalPP(){
  if(this.productoVentag.precio < this.producto[0]['precioR']){
    this.toastService.show('El precio minimo permitido es de: $'+this.producto[0]['precioR'],{classname: 'bg-danger text-light', delay: 6000});
    this.isSearch=true;
  }else if(this.productoVentag.descuento < 0){
    this.toastService.show('No puedes agregar descuento negativo',{classname: 'bg-danger text-light', delay: 6000});
    this.isSearch=true;
  }else{
    this.productoVentag.subtotal = (this.productoVentag.cantidad * this.productoVentag.precio)- this.productoVentag.descuento;
    this.isSearch=false;
  }
}
//agregar producto a lista de ventas
agregarProductoLista(){
  if( this.productoVentag.cantidad <= 0){
    this.toastService.show('No se pueden agregar productos con cantidad 0 ó menor a 0',{classname: 'bg-danger text-light', delay: 6000})
  }else if( this.productoVentag.idProducto == 0){
    this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000});
  }else if (this.productos_cotizacion_e.find(x => x.idProducto == this.productoVentag.idProducto)){
    //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
    this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000});
  }else if(this.productoVentag.descuento < 0){
    this.toastService.show('No puedes agregar descuento negativo',{classname: 'bg-danger text-light', delay: 6000});
  }else{
    
    this._productoService.getExistenciaG(this.productoVentag.idProducto).subscribe(
      response =>{
        this.productoEG = response.producto;
      }, error =>{
        console.log(error);
      }
    );

    if(this.productoEG[0]['existenciaG']< this.productoVentag.cantidad){
      this.toastService.show('Stock insuficiente',{classname: 'bg-warning', delay: 6000});
      this.productoVentag.tieneStock = false;
    }

    this.cotizacion_editada.subtotal = this.cotizacion_editada.subtotal + (this.productoVentag.precio * this.productoVentag.cantidad);
    //this.subtotalVenta = this.subtotalVenta + this.productoVentag.subtotal;
    this.cotizacion_editada.descuento = this.cotizacion_editada.descuento + this.productoVentag.descuento;
    //this.descuentoVenta = this.descuentoVenta + this.productoVentag.descuento;
    this.cotizacion_editada.total = this.cotizacion_editada.total + this.productoVentag.subtotal;
    this.productos_cotizacion_e.push({...this.productoVentag});
    this.isSearch = true;
  }

}
//editar/eliminar producto de la lista de compras
editarProductoLista(dato:any){
  //buscamos el producto a eliminar para traer sus propiedades
  this.productoVentag = this.productos_cotizacion_e.find(x => x.idProducto == dato)!;
  //re calculamos los importes de la venta 
  this.cotizacion_editada.subtotal = this.cotizacion_editada.subtotal - (this.productoVentag.precio * this.productoVentag.cantidad);
  this.cotizacion_editada.descuento = this.cotizacion_editada.descuento - this.productoVentag.descuento;
  this.cotizacion_editada.total = this.cotizacion_editada.total - this.productoVentag.subtotal;
  //cremos nuevo array eliminando el producto que se selecciono
  this.productos_cotizacion_e = this.productos_cotizacion_e.filter((item) => item.idProducto !== dato);
  //consultamos el producto a editar
  this._productoService.getProdverDos(dato).subscribe( 
    response =>{
      this.producto = response.producto;
      this.productoVentag.claveEx = this.producto[0]['claveEx'];
      this.productoVentag.idProducto = this.producto[0]['idProducto']
      this.productoVentag.nombreMedida = this.producto[0]['nombreMedida'];
      this.productoVentag.precio = this.producto[0]['precioS'];
      this.productoVentag.descripcion = this.producto[0]['descripcion'];
      this.productoVentag.precioMinimo = this.producto[0]['precioR']
      this.productoVentag.cantidad = 0;
      this.productoVentag.descuento = 0;
      this.calculaSubtotalPP();
      this.isSearch=false;
    },error =>{
      console.log(error);
    });
}
  //modales
  open(content:any) {//abrir modal
    this.getClientes();
    this.getTipocliente();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  modalSeEnvia(content:any){//abre modal para seleccionaar direccion del cliente
    //si el chek de se envia es true abrimos modal
    if(this.seEnvia == true){
      //this.getClientes();
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
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
  // modalAlertaExistencia(content:any){
  //   let encontrado = this.productos_cotizacion_e.find(x => x.tieneStock == false);
  //   if(typeof(encontrado) == 'object' ){
  //     this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'}).result.then((result) => {
  //       this.closeResult = `Closed with: ${result}`;
  //     }, (reason) => {
  //       this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  //     });
  //   }else{
  //     //this.creaCotizacion();
  //     console.log('ok')
  //   }
  // }
  private getDismissReason(reason: any): string {//cerrarmodal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }
}

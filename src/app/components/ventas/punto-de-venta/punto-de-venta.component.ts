import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
//modelos
import { Ventag } from 'src/app/models/ventag';
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion } from 'src/app/models/cdireccion';
import { Producto_ventasg } from 'src/app/models/productoVentag';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
//import jsPDF from 'jspdf/dist/jspdf.node.debug'
// import { applyPlugin } from 'jspdf-autotable'
// applyPlugin(jsPDF)



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
  public clientes:any;//getClientes
  public cliente:any;//seleccionarCliente
  public listaDireccionesC:any;//seleccionarCliente
  public tipocliente :any;//tipocliente
  public productos:any;//getProductos
  public producto:any;
  public identity: any;//loadUser
  public UltimaCotizacion: any;//obtenerultimacotiza
  public detallesCotiza:any;//ontederultimacotiza
  public productosdCotiza:any;
  public empresa:any;//getDetallesEmpresa
  public productoEG:any;
  public userPermisos:any//loaduser
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  pageActual2: number = 1;
  pageActual3: number = 1;
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
  public lista_productoVentag: Array<Producto_ventasg>;
  //variables html checks
  public seEnvia: boolean = false;
  public isCompany: boolean = false;
  public isCredito: boolean = false;
  public isRFC: boolean = false;
  public checkDireccion: boolean = false;

  //public descuentoVenta:number = 0;
  //public subtotalVenta:number =0;
  public isSearch: boolean = true;
  public isLoadingProductos: boolean = false;
  public isLoadingClientes: boolean = false;


  constructor( 
    //declaramos servicios
    private modalService: NgbModal,
    private _clienteService: ClientesService,
    public toastService: ToastService,
    private _productoService:ProductoService,
    private _ventasService: VentasService,
    private _empleadoService : EmpleadoService,
    private _empresaService: EmpresaService,
    private _router:Router) {
    //declaramos modelos
    this.ventag = new Ventag(0,0,2,'',1,null,0,0,0,0,'','',0);
    this.modeloCliente = new Cliente (0,'','','','','',0,1,0);
    this.cdireccion = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
    this.nuevaDir = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
    this.productoVentag = new Producto_ventasg(0,0,'',0,0,0,'','',0,0,true);
    this.lista_productoVentag = [];
   }

  ngOnInit(): void {
//    this.getProductos();
  this.loadUser();
  this.getDatosEmpresa();
  //this.creaPDFcotizacion();
  }
 getDatosEmpresa(){
   this._empresaService.getDatosEmpresa().subscribe( 
     response => {
       if(response.status == 'success'){
          this.empresa = response.empresa;
          //console.log(this.empresa)
       }
     },error => {console.log(error)});
 }
  //traemos todos los clientes
  getClientes(){
    this.isLoadingClientes = true;
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          //console.log(this.clientes);
          this.isLoadingClientes = false;
        }
      },error =>{
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
    this.ventag.cdireccion = '';
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
    this.ventag.cdireccion=direccion;
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
        this.calculaSubtotalPP();
        this.isSearch=false;
      }
    },error =>{
      console.log(error);
    });
  }
  //calculamos el subtotal por producto
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
    }else if (this.lista_productoVentag.find(x => x.idProducto == this.productoVentag.idProducto)){
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

      this.ventag.subtotal = this.ventag.subtotal + (this.productoVentag.precio * this.productoVentag.cantidad);
      //this.subtotalVenta = this.subtotalVenta + this.productoVentag.subtotal;
      this.ventag.descuento = this.ventag.descuento + this.productoVentag.descuento;
      //this.descuentoVenta = this.descuentoVenta + this.productoVentag.descuento;
      this.ventag.total = this.ventag.total + this.productoVentag.subtotal;
      this.lista_productoVentag.push({...this.productoVentag});
      this.isSearch = true;
    }

  }
  //traemos la informacion del usuario logeado
  loadUser(){
    this.identity = this._empleadoService.getIdentity();
    this.userPermisos = this._empleadoService.getPermisosModulo()
    if(this.userPermisos['agregar'] != 1){
      this._router.navigate(['./ventas-modulo/ventas-realizadas-buscar'])
      
      this.toastService.show('Acceso denegado', { classname: 'bg-danger  text-light', delay: 5000 });
    }
  }
  //evitamod que den enter en el textarea de observaciones
  omitirEnter(event:any){
    if(event.which === 13 && !event.shiftKey){
      event.preventDefault();
      console.log('prevented');
      
    }
  }
  //editar/eliminar producto de la lista de compras
  editarProductoLista(dato:any){
    //buscamos el producto a eliminar para traer sus propiedades
    this.productoVentag = this.lista_productoVentag.find(x => x.idProducto == dato)!;
    //re calculamos los importes de la venta 
    this.ventag.subtotal = this.ventag.subtotal - (this.productoVentag.precio * this.productoVentag.cantidad);
    this.ventag.descuento = this.ventag.descuento - this.productoVentag.descuento;
    this.ventag.total = this.ventag.total - this.productoVentag.subtotal;
    //cremos nuevo array eliminando el producto que se selecciono
    this.lista_productoVentag = this.lista_productoVentag.filter((item) => item.idProducto !== dato);
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
  //guardamos cotizacion en DB
  creaCotizacion(){

    //asignamos id del empleado
    this.ventag.idEmpleado = this.identity['sub'];
    if(this.lista_productoVentag.length == 0){
      this.toastService.show('No puedes generar una venta/cotizacion sin productos!',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.ventag.idCliente == 0){
      this.toastService.show('No puedes generar una venta/cotizacion sin cliente!',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this._ventasService.postCotizaciones(this.ventag).subscribe( response=>{
        if(response.status == 'success'){
          this._ventasService.postProductosCotiza(this.lista_productoVentag).subscribe( response =>{
            if(response.status == 'success'){
              this.toastService.show(' ⚠ Cotizacion creada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
              this.obtenerUltimaCotiza();
              //console.log(response);
            }
          },error=>{
            console.log(error);
          });
        }
      },error =>{
        console.log(error);
      });
    }

    //console.log(this.ventag);
    //console.log(this.lista_productoVentag);
  }
  //Obtener detalles de cotizacion registrada
  obtenerUltimaCotiza(){
    this._ventasService.getLastCotiza().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.UltimaCotizacion = response.Cotizacion;
          this._ventasService.getDetallesCotiza(this.UltimaCotizacion['idCotiza']).subscribe( 
            response => {
            this.detallesCotiza = response.Cotizacion;
            this.productosdCotiza = response.productos_cotiza;
            this.creaPDFcotizacion();
          },error =>{
            console.log(error)
          });
        }
      },error =>{
        console.log(error);
      });
  }
  //CREACION DE PDF PARA COTIZACIONES
  creaPDFcotizacion(){
    const doc = new jsPDF;
    //PARA LA TABAL DE PRODUCTOS
    var cabeceras = ["CLAVE EXTERNA","DESCRIPCION","MEDIDA","PRECIO","CANTIDAD","DESCUENTO","SUBTOTAL"];
    var rows:any = [];
    var logo = new Image();//CREAMOS VARIABLE DONDE ASIGNAREMOS LA IMAGEN
    logo.src = 'assets/images/logo-solo.png';//ASIGNAMOS LA UBICACION DE LA IMAGEN

    // variable con logo, tipo x1,y1, ancho, largo
    doc.addImage(logo,'PNG',10,9,25,25);
    doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
    //          tipografia       tamaño letra       texto                                        x1,y1
    doc.setFont('Helvetica').setFontSize(18).text('MATERIALES PARA CONSTRUCCION \"SAN OTILIO\"', 40,15);
    doc.setFont('Helvetica').setFontSize(9).text(this.empresa[0]['nombreCorto']+': COLONIA '+this.empresa[0]['colonia']+', CALLE '+ this.empresa[0]['calle']+' #'+this.empresa[0]['numero']+', '+this.empresa[0]['ciudad']+', '+this.empresa[0]['estado'], 45,20);
    doc.setFont('Helvetica').setFontSize(9).text('CORREOS: '+this.empresa[0]['correo1']+', '+this.empresa[0]['correo2'],60,25);
    doc.setFont('Helvetica').setFontSize(9).text('TELEFONOS: '+this.empresa[0]['telefono']+' ó '+this.empresa[0]['telefono2']+'   RFC: '+this.empresa[0]['rfc'],68,30);
    //           ancho linea   x1,y1  x2,y2
    doc.setLineWidth(2.5).line(10,37,200,37);//colocacion de linea
    doc.setLineWidth(5).line(10,43,55,43);//colocacion de linea
    //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1     
    doc.setFont('Helvetica','bold').setFontSize(12).text('COTIZACION #'+this.detallesCotiza[0]['idCotiza'], 12,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('VENDEDOR: '+this.detallesCotiza[0]['nombreEmpleado'].toUpperCase(), 60,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('FECHA: '+this.detallesCotiza[0]['created_at'].substring(0,10), 170,45);
    doc.setLineWidth(2.5).line(10,50,200,50);//colocacion de linea
    doc.setFont('Helvetica','normal').setFontSize(9).text('CLIENTE: '+this.detallesCotiza[0]['nombreCliente'], 10,55);
    doc.setFont('Helvetica','normal').setFontSize(9).text('RFC: '+this.detallesCotiza[0]['clienteRFC'], 165,55);
    //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1   PONEMOS TEXTO JUSTIFICADO    ENTRE        ANCHO MAXIMO
    doc.setFont('Helvetica','normal').setFontSize(9).text('DIRECCION: '+this.detallesCotiza[0]['cdireccion'], 10,60,{align: 'justify',lineHeightFactor: 1.5,maxWidth:190});
    ///
    //doc.setFont('Helvetica','normal').setFontSize(9).text('TELEFONO: 0000000000', 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('EMAIL: '+this.detallesCotiza[0]['clienteCorreo'], 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('TIPO CLIENTE: '+this.detallesCotiza[0]['tipocliente'], 60,70);
    doc.setLineWidth(2.5).line(10,75,200,75);//colocacion de linea
    //recorremos los productos
    this.productosdCotiza.forEach((element:any) =>{
      var temp = [element.claveEx,element.descripcion,element.nombreMedida,element.precio,element.cantidad,element.descuento,element.total];
      rows.push(temp);
    });
    //generamos la tabla
    autoTable(doc,{ head:[cabeceras],
      body:rows, startY:80 });
      //OBTEMOS DONDE FINALIZA LA TABLA CREADA
      let posY = (doc as any).lastAutoTable.finalY;
      //         TIPOLETRA  NEGRITA O NORMAL     TAMAÑO                                                               X1, POSICION FINAL DE LA TABLA + 10
      doc.setFont('Helvetica','normal').setFontSize(9).text('SUBTOTAL:          $'+this.detallesCotiza[0]['subtotal'], 145,posY+10);
      doc.setFont('Helvetica','normal').setFontSize(9).text('DESCUENTO:      $'+this.detallesCotiza[0]['descuento'], 145,posY+15);
      doc.setFont('Helvetica','normal').setFontSize(9).text('TOTAL:                 $'+this.detallesCotiza[0]['total'], 145,posY+20);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*** TODOS LOS PRECIOS SON NETOS ***', 140,posY+25);

      doc.setFont('Helvetica','normal').setFontSize(9).text('OBSERVACIONES: '+this.detallesCotiza[0]['observaciones'], 10,posY+32,{align: 'left',lineHeightFactor: 1.5,maxWidth:180});
      doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
      doc.setLineWidth(5).line(10,posY+47,200,posY+47);//colocacion de linea
      doc.setFont('Helvetica','bold').setFontSize(9).text('*** PRECIOS SUJETOS A CAMBIOS SIN PREVIO AVISO ***', 60,posY+48);
    //doc.autoPrint();
    //GUARDAMOS PDF
    doc.save("cotizacion-"+this.detallesCotiza[0]['idCotiza']+".pdf");
  }
  creaVenta(){
    //asignamos id del empleado
    this.ventag.idEmpleado = this.identity['sub'];
    if(this.lista_productoVentag.length == 0){
      this.toastService.show('No puedes generar una venta/cotizacion sin productos!',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.ventag.idCliente == 0){
      this.toastService.show('No puedes generar una venta/cotizacion sin cliente!',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this._ventasService.postVentas(this.ventag).subscribe(
        response => {
          if(response.status == 'success'){
            this.toastService.show(' ⚠ Venta creada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
            this._ventasService.postProductosVentas(this.lista_productoVentag).subscribe(
              response => {
                if(response.status == 'success'){
                  this.toastService.show('productos cargados exitosamente',{ classname: 'bg-success text-light', delay: 5000});
                }
                console.log(response);
              }, error =>{
                console.log(error);
              }
            )
          }
          console.log(response);
        }, error => {
          console.log(error);
        }
      );
    }
  }
  creaTicket(){
    
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
      //this.getClientes();
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }else{
      //si el check es falso ponemos vacia la propiedad de direccion cliente
      this.ventag.cdireccion = '';
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
  modalAlertaExistencia(content:any){
    
    let encontrado = this.lista_productoVentag.find(x => x.tieneStock == false);
    
    if(typeof(encontrado) == 'object'){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }else{
      this.creaCotizacion();
    }

    
  }
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }
}
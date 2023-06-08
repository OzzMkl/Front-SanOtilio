import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
//servicios
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { global } from 'src/app/services/global';
//modelos
import { Ventag } from 'src/app/models/ventag';
import { Producto_ventasg } from 'src/app/models/productoVentag';
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion } from 'src/app/models/cdireccion';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService } from 'primeng/api';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-cotizacion-editar',
  templateUrl: './cotizacion-editar.component.html',
  styleUrls: ['./cotizacion-editar.component.css'],
  providers:[ProductoService, MessageService]
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
  public clientes: Array<any> = [];
  public cliente:any;//getDetallesCliente
  public listaDireccionesC:any;
  public tipocliente :any;//gettipocliente
  public productos:any;//getProductos
  public producto:any;//seleccionar producto
  public productoEG:any;//agregarProductoLista
  public identity: any;//loadUser
  public claveExt:string = '';//mostrar precios
  public prod_med:Array<any> = [];//mostrar precios
  public existenciasPorMed: Array<any> = [];//mostrarPrecios
  public imagenPM: string = '';//mostrarPrecios
  public isImage: boolean = false;//mostrarPrecios
  public idp: number = 0;//mostrarPrecios
  public url:string = global.url;//mostrarPrecios
  public productos_medidas: Array<any> = [];//seleccionarProducto
  public preciosArray: Array<any> = [];//muestraPrecios

  public detallesCotiza:any;
  public productosdCotiza:any;
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
  public itemsPerPage: number = 0;
  public totalPages: any;
  public totalPagesClientes: any;
  public path: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pagePV: number = 1;
  pageActual: number =1;//modal clientes
  pageActual2: number =1;//modal productos
  //cerrar modal
  closeResult ='';
  //pipes
  seleccionado:string = 'uno';//para cambiar entre pipes de buscarProducto
  buscarProducto:any;//modal de buscar producto

  constructor( private _clienteService: ClientesService, public toastService: ToastService,
               private _productoService: ProductoService, private _ventasService: VentasService,
               private _empleadoService: EmpleadoService, private _empresaService: EmpresaService,
               private _route: ActivatedRoute, private modalService: NgbModal,
               private _http: HttpClient, 
               private messageService: MessageService) {
                 this.cotizacion_editada = new Ventag(0,0,2,'',1,null,0,0,0,0,'','',0);
                 this.productos_cotizacion_e = [];
                 this.modeloCliente = new Cliente (0,'','','','','',0,1,0);
                 this.cdireccion = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
                 this.nuevaDir = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
                 this.productoVentag = new Producto_ventasg(0,0,'',0,0,0,0,0,'','',0,0,true);
               }

  ngOnInit(): void {
    this.getDatosEmpresa();
    this.getDetallesCotiza();
    this.loadUser();
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
            this.cotizacion_editada.idCotiza = response.Cotizacion[0]['idCotiza'];
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
          //console.log(this.cotizacion_editada);
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
    //Iniciamos spinner
    this.isLoadingClientes = true;
    //ejecutamos servicio
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){

          this.clientes = response.clientes.data;

          //navegacion de paginacion
          this.totalPagesClientes = response.clientes.total;
          this.itemsPerPage = response.clientes.per_page;
          this.pageActual = response.clientes.current_page;
          this.next_page = response.clientes.next_page_url;
          this.path = response.clientes.path;

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
    //mostramos spinner de carga
    this.isLoadingProductos=true;
    //ejecutamos el servicio
    this._productoService.getProductosPV().subscribe( 
      response => {
        if(response.status == 'success'){
          this.productos = response.productos.data;
          //console.log(response);

          //navegacion de paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual2 = response.productos.current_page;
          this.path = response.productos.path;

          this.isLoadingProductos = false;
        }
      }, error =>{
      console.log(error);
    });
  }

  getPageProductos(page:number){
    //cargamos spinner
    this.isLoadingProductos = true;
    //ejecutamos servicio
    this._http.get(this.path+ '?page='+ page).subscribe(
      (response:any) =>{
        this.productos = response.productos.data;
        this.totalPages = response.productos.total;
        this.itemsPerPage = response.productos.per_page;
        this.pageActual2 = response.productos.current_page;
        this.next_page = response.productos.next_page_url;
        this.path = response.productos.path;

        //quitamos spinner
        this.isLoadingProductos = false;
      }
    );
  }

  /**
     * 
     * @param page
     * Es el numero de pagina a la cual se va acceder
     * @description
     * De acuerdo al numero de pagina recibido lo concatenamos a
     * la direccion para "ir" a esa direccion y traer la informacion
     * no retornamos ya que solo actualizamos las variables a mostrar
     */
  getPageClientes(page:number){
    //iniciamos spinner
    this.isLoadingClientes = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        //console.log(response);
        this.clientes = response.clientes.data;
        //navegacion paginacion
        this.totalPagesClientes = response.clientes.total;
        this.itemsPerPage = response.clientes.per_page;
        this.pageActual = response.clientes.current_page;
        this.next_page = response.clientes.next_page_url;
        this.path = response.clientes.path

        //una vez terminado quitamos el spinner
        this.isLoadingClientes=false;
      })
  }

  /**
   * Buscar clientes por nombre
   * @param nombreCliente 
   */
  searchNombreClienteS(nombreCliente: any){
    //iniciamos spinner
    this.isLoadingClientes = true;
    if(nombreCliente.target.value == ''){
      this.getClientes();
    } else {
      //declaramos la palabra
      let nomCliente = nombreCliente.target.value;

      //generamos conulta
      this._clienteService.searchNombreCliente(nomCliente).subscribe(
        response => {
          if(response.status == 'success'){
            this.clientes = response.clientes.data;
            
            //navegacion de paginacion
            this.totalPagesClientes = response.clientes.total;
            this.itemsPerPage = response.clientes.per_page;
            this.pageActual = response.clientes.current_page;
            this.next_page = response.clientes.next_page_url;
            this.path = response.clientes.path;

            //una vez terminado de cargar quitamos el spinner
            this.isLoadingClientes = false;
          }
        } );
    }
  }

  /**
  * 
  * @param descripcion 
  * Recibimos el evento del input
  * @description
  * Recibe los valores del Keyup, luego buscamos y actualizamos
  * los datos que se muestran en la tabla
  */
  getSearchDescripcion(descripcion:string){
   
    //mostramos el spinner
    this.isLoadingProductos = true;

    //llamamos al servicio
    this._productoService.searchDescripcion(descripcion).subscribe(
      response =>{
          if(response.status == 'success'){
            //asignamos datos a varibale para poder mostrarla en la tabla
            this.productos = response.productos.data;
            //console.log(this.productos)

            //navegacion paginacion
            this.totalPages = response.productos.total;
            this.itemsPerPage = response.productos.per_page;
            this.pageActual = response.productos.current_page;
            this.next_page = response.productos.next_page_url;
            this.path = response.productos.path
            
            //una ves terminado de cargar quitamos el spinner
            this.isLoadingProductos = false;
          }
      }, error => {
        console.log(error)
      }
    )
 }

 /**
   * 
   * @param codbar 
   * Recibimos el evento del input
   * @description
   * Recibe los valores del evento keyup, luego busca y actualiza
   * los datos que se muestran en la tabla
   */
 getSearchCodbar(codbar:number){

  //mostramos el spinner
  this.isLoadingProductos = true;

  //llamamos al servicio
  this._productoService.searchCodbar(codbar).subscribe(
    response =>{
        if(response.status == 'success'){
          //asignamos datos a varibale para poder mostrarla en la tabla
          this.productos = response.productos.data;
          //console.log(this.productos)

          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          this.next_page = response.productos.next_page_url;
          this.path = response.productos.path
          
          //una ves terminado de cargar quitamos el spinner
          this.isLoadingProductos = false;
        }
    }, error => {
      console.log(error)
    }
  )
}

/**
 * 
 * @param claveExterna 
 * Recibimos el evento del input
 * @description
 * Recibe los valores del evento keyUp, luego busca y actualiza
 * los datos de la tabla
 */
getSearch(claveExterna:string){

  //mostramos el spinner 
  this.isLoadingProductos = true;

  //generamos consulta
  this._productoService.searchClaveExterna(claveExterna).subscribe(
    response =>{
        if(response.status == 'success'){

          //asignamos datos a varibale para poder mostrarla en la tabla
          this.productos = response.productos.data;
          //console.log(this.productos)

          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          this.next_page = response.productos.next_page_url;
          this.path = response.productos.path
          
          //una ves terminado de cargar quitamos el spinner
          this.isLoadingProductos = false;
      }
    }, error =>{
        console.log(error)
    }
  )
}

  //cargamos la informacion al modelo del producto que se selecciono con el click
  seleccionarProducto(idProducto:number){
    //cerramos modales
    this.modalService.dismissAll();
    //console.log(idProducto);
    this._productoService.getProdverDos(idProducto).subscribe( response => {
      //console.log(response);
      if(response.status == 'success'){
        this.limpiaProducto();

        this.producto = response.producto;
        this.productoVentag.claveEx = this.producto[0]['claveEx'];
        this.productoVentag.idProducto = this.producto[0]['idProducto'];
        this.productoVentag.descripcion = this.producto[0]['descripcion'];
        this.productoVentag.cantidad = 0;

        this.productos_medidas = response.productos_medidas;
        
        this.calculaSubtotalPP();
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
    var identity = this._empleadoService.getIdentity();

    if(this.isCompany == true ){
      this.modeloCliente.aMaterno ='';
      this.modeloCliente.aPaterno='';
    }
    if(this.isRFC == false){
      this.modeloCliente.rfc = 'XAXX010101000';
    }
    this._clienteService.postCliente(this.modeloCliente,identity).subscribe( 
      response =>{
        if(response.status == 'success'){
          if(this.checkDireccion == true){
            this._clienteService.postCdireccion(this.cdireccion,identity).subscribe( 
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

/**
   * @description
   * Muestra los precios deacuerdo a la medida seleccionada
   */
muestraPrecios(){
  //limpiamos array
  this.preciosArray = [];
  //buscamos la medida seleccionada
  var med = this.productos_medidas.find(x => x.idProdMedida == this.productoVentag.idProdMedida);
  //asignamos nombre de medida
  this.productoVentag.nombreMedida = med.nombreMedida;
  //cargamos los precios a mostrar en el select
  this.preciosArray.push(med.precio1, med.precio2, med.precio3, med.precio4, med.precio5);
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
    this.messageService.add({severity:'warn', summary:'Alerta', detail: 'No se pueden agregar productos con cantidad 0 ó menor a 0'});

  }else if( this.productoVentag.idProducto == 0){
    this.messageService.add({severity:'error', summary:'Error', detail: 'Ese producto no existe'});

  }else if (this.productos_cotizacion_e.find(x => x.idProducto == this.productoVentag.idProducto) &&
            this.productos_cotizacion_e.find(x=> x.idProdMedida == this.productoVentag.idProdMedida ) ){
    //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
    this.messageService.add({severity:'warn', summary:'Alerta', detail: 'El producto ya se encuentra en la lista'});

  }else if(this.productoVentag.descuento < 0){
    this.messageService.add({severity:'warn', summary:'Alerta', detail: 'No puedes agregar descuento negativo'});

  }else{
    //revisamos la existencia del producto
    this._productoService.getExistenciaG(this.productoVentag.idProducto).subscribe(
      response =>{
        this.productoEG = response.producto;
        if(response.status == 'success'){
            //verificamos la existencia
            //si esta es menor a la cantidad solicitada mandamos alerta
            if(this.productoEG[0]['existenciaG']< this.productoVentag.cantidad){
              //this.messageService.add({severity:'warn', summary:'Alerta', detail:'El producto no cuenta con suficiente stock'});
              this.productoVentag.tieneStock = false;
            } else {
              //asignamos los valores de producto
              this.cotizacion_editada.subtotal = this.cotizacion_editada.subtotal + (this.productoVentag.precio * this.productoVentag.cantidad);
              this.cotizacion_editada.descuento = this.cotizacion_editada.descuento + this.productoVentag.descuento;
              this.cotizacion_editada.total = this.cotizacion_editada.total + this.productoVentag.subtotal;
              this.productos_cotizacion_e.push({...this.productoVentag});
              this.isSearch = true;

            }
        }
      }, error =>{
        this.messageService.add({severity:'error', summary:'Error!', detail:'Ocurrio un error al verificar la existencia'});
        console.log(error);
      }
    );

  }

}

//editar/eliminar producto de la lista de compras
editarProductoLista(dato:any){
  //buscamos el producto a eliminar para traer sus propiedades
  this.productoVentag = this.productos_cotizacion_e.find(x => x.idProdMedida == dato)!;
  //re calculamos los importes de la venta 
  this.cotizacion_editada.subtotal = this.cotizacion_editada.subtotal - (this.productoVentag.precio * this.productoVentag.cantidad);
  this.cotizacion_editada.descuento = this.cotizacion_editada.descuento - this.productoVentag.descuento;
  this.cotizacion_editada.total = this.cotizacion_editada.total - this.productoVentag.subtotal;
  //cremos nuevo array eliminando el producto que se selecciono
  this.productos_cotizacion_e = this.productos_cotizacion_e.filter((item) => item.idProdMedida !== this.productoVentag.idProdMedida);
  //consultamos el producto a editar
  this.seleccionarProducto(this.productoVentag.idProducto);
}

//traemos la informacion del usuario logeado
loadUser(){
  this.identity = this._empleadoService.getIdentity();
}

//actualizamos la cotizacion
actualizaCotizacion(){
  //asignamos el id del Empleado que realiza la operacion
  this.cotizacion_editada.idEmpleado = this.identity['sub'];
  if(this.productos_cotizacion_e.length == 0){
    this.toastService.show('No puedes generar una venta/cotizacion sin productos!',{classname: 'bg-danger text-light', delay: 6000})
  }else if(this.cotizacion_editada.idCliente == 0){
    this.toastService.show('No puedes generar una venta/cotizacion sin cliente!',{classname: 'bg-danger text-light', delay: 6000})
  } else{
    this._ventasService.putCotizacion(this.cotizacion_editada.idCotiza,this.cotizacion_editada).subscribe(
      response =>{
        if(response.status == 'success'){
          this.toastService.show('Cotizacion actualzada',{classname: 'bg-success text-light', delay: 3000});
          this._ventasService.putProductosCotiza(this.cotizacion_editada.idCotiza, this.productos_cotizacion_e).subscribe(
            response => {
              if(response.status == 'success'){
                this.toastService.show('Productos actualzados',{classname: 'bg-success text-light', delay: 3000});
                this.generaPDF();
              }
              console.log(response)
            },error =>{
              console.log(error);
            }
          )
        }
        //console.log(response);
      },error =>{
        console.log(error);
      }
    );
  }
  console.log(this.cotizacion_editada)
}

generaPDF(){

  this._ventasService.getDetallesCotiza(this.cotizacion_editada.idCotiza).subscribe(
    response =>{
      if(response.status == 'success'){
        this.detallesCotiza = response.Cotizacion;
        this.productosdCotiza = response.productos_cotiza;

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
      var temp = [element.claveEx,element.descripcion,element.nombreMedida,element.precio,element.cantidad,element.descuento,element.subtotal];
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
    },error =>{
      console.log(error);
    }
  );
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

  openModalDirec(content:any){
    if(this.checkDireccion){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
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
     let encontrado = this.productos_cotizacion_e.find(x => x.tieneStock == false);
     if(typeof(encontrado) == 'object' ){
       this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'sm'}).result.then((result) => {
         this.closeResult = `Closed with: ${result}`;
       }, (reason) => {
         this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
       });
     }else{
       this.actualizaCotizacion();
       
     }
   }

   modalMuestraMedidas(content:any, idProducto:number, claveEx:string){
    this.mostrarPrecios(idProducto,claveEx);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size:'lg'});
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

  /**
   * 
   */
  selectBusqueda(){
    if(this.buscarProducto == '' || null){
      this.getProductos();
    } else{

      switch(this.seleccionado){
        case 'uno':
              this.getSearchDescripcion(this.buscarProducto);
            break;
        case 'dos':
              this.getSearch(this.buscarProducto);
            break;
        case 'tres':
              this.getSearchCodbar(this.buscarProducto);
            break;
        default:
            console.log('Valor fuera de rango'+ this.seleccionado);
            break;
      }
    }
  }

  /**
   * @description
   * Pone a default las propiedades de los ojetos
   * productoVentag, productos_medidas y arrayPrecios
   */
  limpiaProducto(){
    //limipiamos productoVentasg
    this.productoVentag.idVenta = 0;
    this.productoVentag.idProducto = 0;
    this.productoVentag.descripcion = "";
    this.productoVentag.idProdMedida = 0;
    this.productoVentag.cantidad = 0;
    this.productoVentag.precio = 0;
    this.productoVentag.descuento = 0;
    this.productoVentag.total = 0;
    this.productoVentag.claveEx = "";
    this.productoVentag.nombreMedida = "";
    this.productoVentag.precioMinimo = 0;
    this.productoVentag.subtotal = 0;
    this.productoVentag.tieneStock = false;
    //limpia medidas
    this.productos_medidas=[];
    //limpia array
    this.preciosArray=[];

  }

  /**
   * Recibimos el id del producto y lo busca
   * @param idProducto
   * Returna consulta con las medidas e imagen del producto
   */
  mostrarPrecios(idProducto:number, claveEx:string){
    this.claveExt = claveEx;
    this._productoService.searchProductoMedida(idProducto).subscribe(
      response =>{
        this.prod_med = response.productoMedida;
        this.existenciasPorMed = response.existencia_por_med;
        this.imagenPM = response.imagen;
        if(this.imagenPM == "" || this.imagenPM == null){
          this.imagenPM = "1650558444no-image.png";
        }
        this.idp = idProducto;
      }, error =>{
        console.log(error);
      }
    );
  }
}

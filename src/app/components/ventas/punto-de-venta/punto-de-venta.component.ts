import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { global } from 'src/app/services/global';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { MdlProductoService } from 'src/app/services/mdlProductoService';
//modelos
import { Ventag } from 'src/app/models/ventag';
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion } from 'src/app/models/cdireccion';
import { Producto_ventasg } from 'src/app/models/productoVentag';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-punto-de-venta',
  templateUrl: './punto-de-venta.component.html',
  styleUrls: ['./punto-de-venta.component.css'],
  providers:[ProductoService, MessageService, ConfirmationService]
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
  public productos_medidas: Array<any> = [];//seleccionarProducto
  public preciosArray: Array<any> = [];//muestraPrecios
  public identity: any;//loadUser
  public UltimaCotizacion: number = 0;//obtenerultimacotiza
  public tipo_venta: Array<any> = []; //getTiposVentas
  public productoEG:any;
  public claveExt : string = '';//mostrarPrecios
  public prod_med: Array<any> = [];//mostrarPrecios
  public existenciasPorMed: Array<any> = [];//mostrarPrecios
  public imagenPM: string = '';//mostrarPrecios
  public isImage: boolean = false;//mostrarPrecios
  public idp: number = 0;//mostrarPrecios
  public url:string = global.url;//mostrarPrecios
  /**PAGINATOR */
  public itemsPerPage: number = 0;
  public totalPages: any;
  public totalPagesClientes: any;
  public path: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  pageActual2: number = 1;
  pageActual3: number = 1;
  //pipes de busqueda en modal
  buscarCliente ='';//modal cliente
  seleccionado:string = 'uno';//para cambiar entre pipes de buscarProducto
  buscar = '';//modal de buscar producto
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
  public isModificaPrecio: boolean = false;
  public isRFC: boolean = false;
  public checkDireccion: boolean = false;
  public PagoConTarjeta: boolean = false;

  //public descuentoVenta:number = 0;
  //public subtotalVenta:number =0;
  public isSearch: boolean = true;
  public isLoadingGeneral: boolean = false;
  public isLoadingProductos: boolean = false;
  public isLoadingClientes: boolean = false;
  //contadores para los text area
  contador: number =0;
  //PERMISOS
  public userPermisos:any = [];
  public mPuV = this._modulosService.modsPuntodeVenta();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;

  /***Motivo de edicion */
  public modoEdicion: boolean = false;
  public motivoEdicion: string = "";
  @ViewChild('mMotivoEdicion',{static:true}) mitempalte!: TemplateRef<any>;
  //modales
  public mdlProductos: boolean = false;
  //input de busqueda claveex
  public idProducto?: number;

  selectedValue: any;
  private subscription: Subscription;

  constructor( 
    //declaramos servicios
    private modalService: NgbModal,
    private _clienteService: ClientesService,
    private _productoService:ProductoService,
    private _ventasService: VentasService,
    private _empleadoService : EmpleadoService,
    private _modulosService: ModulosService,
    private _router:Router,
    private _http: HttpClient,
    private _confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _sharedMessage: SharedMessage,
    private _route: ActivatedRoute,
    private _mdlProductoService: MdlProductoService,
    ) {
    //declaramos modelos
    this.ventag = new Ventag(0,0,1,'',1,0,null,0,0,0,0,'','',0);
    this.modeloCliente = new Cliente (0,'','','','','',0,1,1);
    this.cdireccion = new Cdireccion (0,'MEXICO','PUEBLA','','','','','','',0,'',0,1,'');
    this.nuevaDir = new Cdireccion (0,'MEXICO','PUEBLA','','','','','','',0,'',0,1,'');
    this.productoVentag = new Producto_ventasg(0,0,'',0,0,0,0,0,'','',0,0,true,0,false);
    this.lista_productoVentag = [];
    this.subscription = this._mdlProductoService.selectedValue$.subscribe(
      value =>{
        this.seleccionarProducto(value.idProducto);
      });
   }

  ngOnInit(): void { 
    this.loadUser();
    this._sharedMessage.messages$.subscribe(
      messages =>{
        if(messages){
          this.messageService.add(messages[0]);
        }
      }
    )
  }

  

  getTiposVentas(){
    this._ventasService.getTipoVenta().subscribe(
      response =>{
        if(response.status == 'success'){
          this.tipo_venta = response.tipo_venta;
        }
      }, error =>{
        console.log(error);
      }
    );
  }

  /**
   * Trae la informacion de los clientes
   */
  getClientes(){
    //iniciamos spinner
    this.isLoadingClientes = true;
    //ejecutamosservicio
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){

          this.clientes = response.clientes.data;
          //console.log(this.clientes);

          //navegacion de paginacion
          this.totalPagesClientes = response.clientes.total;
          this.itemsPerPage = response.clientes.per_page;
          this.pageActual = response.clientes.current_page;
          this.next_page = response.clientes.next_page_url;
          this.path = response.clientes.path;

          //una vez terminado de cargar quitamos el spinner
          this.isLoadingClientes = false;
        }
      },error =>{
      console.log(error);
    });
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
   * Obtener tipo de clientes al agregar uno nuevo
   */
  getTipocliente(){
    this.isLoadingGeneral = true;
    this._clienteService.getTipocliente().subscribe(
      response =>{
        this.tipocliente = response.tipocliente;
        this.isLoadingGeneral = false;
      },error =>{
        console.log(error);
      });
  }

  /**
   * Consulta las direciones del cliente
   * @param idCliente 
   */
  getDireccionCliente(idCliente:any){
    this.isLoadingGeneral =true;
  this._clienteService.getDireccionCliente(idCliente).subscribe( 
    response => {
      if(response.status == 'success'){
        this.listaDireccionesC = response.direccion;
        this.isLoadingGeneral = false;
      }
      //this.listaDireccionesC = response.
    },error =>{
      console.log(error);
    });
  }

  /**
   * Trae detalles del cliente
   * @param idCliente 
   */
  seleccionarCliente(idCliente:any){
    this.ventag.cdireccion = '';
    this.seEnvia == false;
    this.isLoadingGeneral = true;

    this._clienteService.getDetallesCliente(idCliente).subscribe(
      response =>{
        if(response.status == 'success'){
          this.cliente = response.cliente;
          //this.dirCliente= response.cdireccion;
          this.ventag.nombreCliente = this.cliente[0]['nombre']+' '+this.cliente[0]['aPaterno']+' '+this.cliente[0]['aMaterno'];
          this.ventag.idCliente = this.cliente[0]['idCliente'];
          this.isLoadingGeneral = false;
        }else{
          console.log('algo salio mal'+response);
        }
        //console.log(response.cliente);
        //console.log(response.cdireccion);
      },error=>{
        console.log(error);
      });
  }

  /**
   * 
   * @param direccion 
   * Carga la direccion seleccionada a la propiedad venta.cdireccion
   */
  seleccionarDireccion(direccion:any){
    this.ventag.cdireccion=direccion;
  }

  //accion de guardar el nuevo cliente del modal
  guardarCliente(){
    //asignamos variables de usuario
    var identity = this._empleadoService.getIdentity();
    //Revisamo si fue marcada el checkbox
      if(this.isCompany == true ){
        this.modeloCliente.aMaterno ='';
        this.modeloCliente.aPaterno='';
      }
      //revimos el check de rfc
      if(this.isRFC == false){
        this.modeloCliente.rfc = 'XAXX010101000';
      }
      this._clienteService.postCliente(this.modeloCliente,identity).subscribe( 
        response =>{
          if(response.status == 'success'){
            this.messageService.add({severity:'success', summary:'Registro exitoso', detail: 'Cliente registrado correctamente'});
            //revisamos que los campos de la direccion vengan completos
            if(this.checkDireccion == true && this.cdireccion.ciudad != '' && this.cdireccion.colonia != '' && this.cdireccion.calle != ''
                && this.cdireccion.numExt != '' && this.cdireccion.cp != 0 && this.cdireccion.referencia != '' && this.cdireccion.telefono != 0){

              this._clienteService.postCdireccion(this.cdireccion,identity).subscribe( 
                response=>{
                  this.messageService.add({severity:'success', summary:'Registro exitoso', detail:'La direccion se registro correctamente'});
                  //console.log(response);
                },error=>{
                  console.log(error);
                  this.messageService.add({severity:'error', summary:'Algo salio mal', detail:error.error.message, sticky: true});
                });
            }else{
              this.messageService.add({severity:'warn', summary:'Advertencia', detail:'No se registro ninguna direccion, faltan rellenar campos'});
            }
          } else{
            console.log('Algo salio mal');
            console.log(response);
          }
        },error=>{
          console.log(error);
      });
    
    
  }

  //guarda una nueva direccion
  guardarNuevaDireccion(){
    this.isLoadingGeneral = true;
    this.nuevaDir.idCliente = this.ventag.idCliente;
    this._clienteService.postNuevaDireccion(this.nuevaDir).subscribe( 
      response=>{
        if(response.status == 'success'){
          this.isLoadingGeneral = true;
          this.messageService.add({severity:'success', summary:'Registro exitoso', detail: 'Direccion registrada correctamente'});
          this.getDireccionCliente(this.nuevaDir.idCliente);
        } else{
          this.messageService.add({severity:'error', summary:'Error', detail: 'Fallo al guardar la direccion',sticky:true});
          console.log(response)
        }
       }, error =>{
      console.log(error);
    });
  }

  //obtenemos todos los productos
  getProductos(){
    //mostramos el spinner
    this.isLoadingProductos=true;
    //ejeecutamos servicio
    this._productoService.getProductosPV().subscribe( 
      response => {
        if(response.status == 'success'){

          //asignamos a variable para mostrar
          this.productos = response.productos.data;
          //console.log(response);

          //navegacion de paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual2 = response.productos.current_page;
          this.path = response.productos.path;

          //una vez cargada la informacion quitamos el spinner
          this.isLoadingProductos = false;
        }
      }, error =>{
      console.log(error);
    });
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
  getPage(page:number) {
    //mostramos spinner
    this.isLoadingProductos = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        //console.log(response);
        this.productos = response.productos.data;
        //navegacion paginacion
        this.totalPages = response.productos.total;
        this.itemsPerPage = response.productos.per_page;
        this.pageActual = response.productos.current_page;
        this.next_page = response.productos.next_page_url;
        this.path = response.productos.path  
        
        this.isLoadingProductos = false;
    })
  }

  //cargamos la informacion al modelo del producto que se selecciono con el click
  seleccionarProducto(idProducto:number){
    this.isLoadingGeneral = true;
    //cerramos los modales abiertos
    this.modalService.dismissAll();
    
    this.limpiaProducto();

    //console.log(idProducto);
    this._productoService.getProdverDos(idProducto).subscribe( response => {
      //console.log(response);
      if(response.status == 'success'){

        this.producto = response.producto;
        this.productoVentag.claveEx = this.producto[0]['claveEx'];
        this.productoVentag.idProducto = this.producto[0]['idProducto'];
        this.productoVentag.descripcion = this.producto[0]['descripcion'];
        this.productoVentag.cantidad = 0;
        
        this.productos_medidas = response.productos_medidas;
        //console.log(this.productos_medidas)

        this.isSearch=false;
        this.isLoadingGeneral = false;
      }
    },error =>{
      console.log(error);
    });
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
    //asiignamos el precio compra al producto
    this.productoVentag.precioCompra = med.precioCompra;
    //asignamos el primer precio
    if(this.preciosArray.length > 1){
      this.productoVentag.precio = this.preciosArray[0];
    }
    this.calculaSubtotalPP();
  }

  /***
   * Calcula el subtotal por producto
   */
  calculaSubtotalPP(){
    if(this.productoVentag.descuento < 0){
      this.messageService.add({severity:'warn', summary:'Alerta', detail: 'No puedes agregar descuento negativo'});
      this.isSearch=true;
    } else if(this.productoVentag.precioCompra > (this.productoVentag.precio - this.productoVentag.descuento)){
      if(this.productoVentag.precio < this.productoVentag.precioCompra){
        this.messageService.add({severity:'warn', summary:'Alerta', detail: 'El precio no puede ser menor al precio compra'});  
      } else{
        this.messageService.add({severity:'warn', summary:'Alerta', detail: 'No puedes agregar descuento mayor al precio compra'});
      }
      this.isSearch=true;
    } else{
      //Ponemos comision a cero
      this.productoVentag.comision = 0;
      /**
       * Calcula la comision del precio seleccionado/ingresado, se redondeda a 2 decimales y se convierte a numero
       * ya que el metodo toFixed() retorna un string
       */
      this.productoVentag.comision = parseFloat((this.productoVentag.precio * 0.03).toFixed(2));

      if(this.PagoConTarjeta){
        /**
         * Si el check de pagocontarjeta es true, multiplicamos la cantidad por la comision y
         * lo sumamos al subtotal del producto
         */
        this.productoVentag.subtotal = (this.productoVentag.cantidad * this.productoVentag.precio) + (this.productoVentag.cantidad * this.productoVentag.comision) - this.productoVentag.descuento;

      } else{
        this.productoVentag.subtotal = (this.productoVentag.cantidad * this.productoVentag.precio)- this.productoVentag.descuento;
      }
      this.isSearch=false;      
    }
    //console.log(this.productoVentag);
  }

  /**
   * @description
   * Agrega el producto a la lista de ventas
   */
  agregarProductoLista(){
    this.isLoadingGeneral = true;
    //console.log('agregar producto')
    if( this.productoVentag.cantidad <= 0){
      this.isLoadingGeneral = false;
      this.messageService.add({severity:'warn', summary:'Alerta', detail: 'No se pueden agregar productos con cantidad 0 o menor a 0'});

    }else if( this.productoVentag.idProducto == 0){
      this.isLoadingGeneral = false;
      this.messageService.add({severity:'error', summary:'Error', detail: 'Ese producto no existe'});

    }else if (this.lista_productoVentag.find(x => x.idProducto == this.productoVentag.idProducto) &&
              this.lista_productoVentag.find(x => x.idProdMedida == this.productoVentag.idProdMedida) ){
                this.isLoadingGeneral = false;
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.messageService.add({severity:'warn', summary:'Alerta', detail: 'El producto ya se encuentra en la lista'});

    }else if(this.productoVentag.descuento < 0){
      this.isLoadingGeneral = false;
      this.messageService.add({severity:'warn', summary:'Alerta', detail: 'No puedes agregar descuento negativo'});

    }else{
      //revisamos la existencia del producto
      this._productoService.getExistenciaG(this.productoVentag.idProducto, this.productoVentag.idProdMedida, this.productoVentag.cantidad).subscribe(
        response =>{

          //this.productoEG = response.producto;
          //si la respuesta es positiva continuamos
          if(response.status == 'success'){
            //verificamos la existencia
            //si esta es menor a la cantidad solicitada mandamos alerta
            if(response.disponibilidad == false){
              this.messageService.add({severity:'warn', summary:'Alerta', detail:'El producto no cuenta con suficiente stock'});
              this.productoVentag.tieneStock = false;
            } 

              //Verificamos si esta true el check de pago con tarjeta
              if(this.PagoConTarjeta){
                //Si es true al precio le agregamos la comision del 3% del precio
                this.productoVentag.precio = this.productoVentag.precio * 1.03;
              }
              
              //asignamos los valores del producto 
              this.ventag.subtotal = this.ventag.subtotal + (this.productoVentag.precio * this.productoVentag.cantidad);
              this.ventag.descuento = this.ventag.descuento + this.productoVentag.descuento;
              this.ventag.total = this.ventag.total + this.productoVentag.subtotal;
              this.lista_productoVentag.push({...this.productoVentag}); 
              this.isSearch = true;

              this.limpiaProducto();
              this.isLoadingGeneral = false;
          }
        }, error =>{
          this.messageService.add({severity:'error', summary:'Error!', detail:'Ocurrio un error al verificar la existencia'});
          console.log(error);
        }
      );

    }

  }

  //traemos la informacion del usuario logeado
  loadUser(){
    this.isLoadingGeneral = true;
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mPuV.idModulo, this.mPuV.idSubModulo);
        //revisamos si el permiso del modulo esta activo si no redireccionamos
        if( this.userPermisos.agregar != 1 ){
          this.timerId = setInterval(()=>{
            this.counter--;
            if(this.counter === 0){
              clearInterval(this.timerId);
              this._router.navigate(['./']);
            }
            this.messageService.add({severity:'error', summary:'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'});
          },1000);
        } else{

          this._route.params.subscribe(params =>{
            if(params['idVenta']){
              this.openModalMotivo();
              this.modoEdicion = true;
            } else{
              this.identity = this._empleadoService.getIdentity();
              this.getTiposVentas();
              this.isLoadingGeneral = false;
            }
          });
        }
  }

  //evitamod que den enter en el textarea de observaciones
  contadorCaracteres(event:Event){
    this.contador = ((event.target as HTMLInputElement).value).length;
  }

  //editar/eliminar producto de la lista de compras
  editarProductoLista(idPM:number){
    //buscamos el producto a eliminar para traer sus propiedades
    this.productoVentag = this.lista_productoVentag.find(x => x.idProdMedida == idPM)!;
    ////re calculamos los importes de la venta 
    this.ventag.subtotal = this.ventag.subtotal - (this.productoVentag.precio * this.productoVentag.cantidad);
    this.ventag.descuento = this.ventag.descuento - this.productoVentag.descuento;
    this.ventag.total = this.ventag.total - this.productoVentag.subtotal;
    ////cremos nuevo array eliminando el producto que se selecciono
    this.lista_productoVentag = this.lista_productoVentag.filter((item) => item.idProdMedida !== this.productoVentag.idProdMedida);
    ////consultamos el producto a editar
    this.seleccionarProducto(this.productoVentag.idProducto);
  }

  //guardamos cotizacion en DB
  creaCotizacion(){

    //asignamos id del empleado
    this.ventag.idEmpleado = this.identity['sub'];
    if(this.lista_productoVentag.length == 0){
      this.messageService.add({severity:'warn', summary:'Alerta', detail:'No puedes generar una cotizacion sin productos!'});

    }else if(this.ventag.idCliente == 0){
      this.messageService.add({severity:'warn', summary:'Alerta', detail:'No puedes generar una cotizacion sin cliente!'});

    }else{
      this._ventasService.postCotizaciones(this.ventag).subscribe( response=>{
          //console.log("response cotizacion");
          //console.log(response);
        if(response.status == 'success'){
          this._ventasService.postProductosCotiza(this.lista_productoVentag).subscribe( response =>{
              //console.log("response productos cotizacion");
              //console.log(response);
            if(response.status == 'success'){
              this.messageService.add({severity:'success', summary:'Registro exitoso', detail:'Cotizacion creada exitosamente!'});
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
          this.generaPDF(this.UltimaCotizacion);
        }
      },error =>{
        console.log(error);
      });
  }

  generaPDF(idCotiza:number){
    this._ventasService.getPDF(idCotiza).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
  }

  creaVenta(){
    //asignamos id del empleado
    this.ventag.idEmpleado = this.identity['sub'];
    if(this.lista_productoVentag.length == 0){
      this.messageService.add({severity:'warn', summary:'Alerta', detail:'No puedes generar una venta sin productos!'});

    }else if(this.ventag.idCliente == 0){
      this.messageService.add({severity:'warn', summary:'Alerta', detail:'No puedes generar una venta sin cliente!'});

    }else{
      //Sustituimos todos los permisos por solo los permisos del modulo
      //Esto con la finalidad de no enviar informacion innecesaria
      let identityMod = {
        ... this.identity,
        'permisos': this.userPermisos
      }
      //Agregamos propiedad de envio
      Object.assign( this.ventag, {seEnvia: this.seEnvia});
      this.isLoadingGeneral = true;

      this._ventasService.postVenta(this.ventag, this.lista_productoVentag, identityMod).subscribe(
        response =>{
          if(response.status == 'success'){
            this.isLoadingGeneral = false;
            this.messageService.add({severity:'success', summary:'Registro exitoso', detail:'Venta creada correctamente'});
            this.ventag.idCliente = 0;
            // refrescamos la pagina
            setTimeout(()=>{
              window.location.reload();
            },2000);
          }
        }, error =>{
          this.messageService.add({severity:'error', summary:'Error', detail:'Algo salio mal al crear la venta'});
          console.log(error);
        });
    }
  }

  // Metodos del  modal
  open(content:any,type:number) {//abrir modal aplica para la mayoria de los modales
    this.getClientes();
    if(type == 1){
      this.getTipocliente();
    }
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  
  /**
   * Abre modal de agregar direccion
   * @param content 
   */
  openModalDirec(content:any){
    if(this.checkDireccion == true){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
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
        if(this.closeResult != 'Dismissed with: row click'){
          this.seEnvia = false;
        }
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
    this.mdlProductos = true;
    // this.getProductos();
    // this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
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

  modalMuestraMedidas(content:any,idProducto:number,claveEx:string){
    this.mostrarPrecios(idProducto,claveEx);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'});
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
  
/**
 * @description
 * Obtiene la informacion del input y busca
 */
  selectBusqueda(){
  
    if(this.buscar == "" || null){
     
      this.getProductos();
   } else{
     
     switch(this.seleccionado){
       case "uno":
            this.getSearchDescripcion(this.buscar);
         break;
       case "dos":
            this.getSearch(this.buscar);
         break;
       case "tres":
            this.getSearchCodbar(parseInt(this.buscar));
         break;
       default:
         console.log('default tp'+this.seleccionado)
          break;
      }
    }//finelse
    
 }//finFunction

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
    this.productoVentag.precioCompra = 0;
    this.productoVentag.subtotal = 0;
    this.productoVentag.tieneStock = false;
    this.productoVentag.comision = 0;
    this.productoVentag.isComision = false;
    //limpia medidas
    this.productos_medidas=[];
    //limpia array
    this.preciosArray=[];

    this.isModificaPrecio = false;

  }

  /**
   * Recibimos el id y lo buscamos en el servicio
   * @param idProducto
   * 
   * retornamos la consulta con las medias e imagen del producto
   */
  mostrarPrecios(idProducto:number,claveEx:string){
    this.isLoadingGeneral = true;
    this.claveExt = claveEx;
    this._productoService.searchProductoMedida(idProducto).subscribe(
      response =>{
        //console.log(response)
        this.prod_med = response.productoMedida;
        this.existenciasPorMed = response.existencia_por_med;
        this.imagenPM = response.imagen;
        if(this.imagenPM == "" || this.imagenPM == null){
          this.imagenPM = "1650558444no-image.png";
        }
        this.idp = idProducto;
        this.isLoadingGeneral = false;
    }, error =>{
      console.log(error);
    });
  }

  habilitaInputPrecio(e:any){
    if(this.preciosArray.length == 0 && this.isModificaPrecio == true){
      this.messageService.add({severity:'warn', summary:'Advertencia', detail: 'No puedes modificar el precio sin elegir una medida'});
      this.isModificaPrecio = false
    }
  }

  sumaPorcentajeComi(e:any){
    if(e == true){
      //llamamos el metodo para recalcular si es que un producto esta por agregarse
      this.calculaSubtotalPP();
      /**
       * Como se moveran todos los precios de la lista de productos se inician nuevamente en ceros
       * Descuento no se modifica aqui ya que no se toca.
       */
      this.ventag.subtotal = 0;
      this.ventag.total = 0;
      //Recorremos la lista de productos
      this.lista_productoVentag.forEach(producto =>{
        /*
        * Sumamos la comision al precio del producto la comision ya viene calculada y esta se calcula en calculaSubtotalPP()
        * Generemos subtotal del producto y despues lo sumamos al subtotal de la venta y asi sucesivamente
        * hasta terminar de recorrer la lista de productos
        */
        producto.precio = producto.precio + producto.comision;
        producto.subtotal = (producto.precio * producto.cantidad) - producto.descuento;
        this.ventag.subtotal = this.ventag.subtotal + (producto.precio * producto.cantidad);
        this.ventag.total = this.ventag.total + producto.subtotal;
      });
    } else {
      //Ponemos variables en ceros
      this.ventag.subtotal = 0;
      this.ventag.total = 0;
      //Recorremos la lista de productos
      this.lista_productoVentag.forEach(producto =>{
        /**
         * Ahora descontamos la comision del precio
         * Recalculamos el subtotal por producto y lo sumamos al total y subtotal de la venta
         */
        producto.precio = producto.precio - producto.comision;
        producto.subtotal = (producto.precio * producto.cantidad) - producto.descuento;
        this.ventag.subtotal = this.ventag.subtotal + (producto.precio * producto.cantidad);
        this.ventag.total = this.ventag.total + producto.subtotal;
      });
    }
  }

  confirmVenta() {
    this._confirmationService.confirm({
        message: '¿Esta seguro(a) que desea terminar la venta?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            if(this.modoEdicion){
              this.updateVenta();
            } else{
              this.creaVenta();
            }
        },
        reject: (type:any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de venta cancelada.'});
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de venta cancelada.'});
                break;
            }
        }
    });
  }
  
  openModalMotivo(){
    this.modalService.open(this.mitempalte, {ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop:'static'});
    this.isLoadingGeneral = false;
    //console.log(this.mAlertaExistencia)
  }
   /**
   * @description
   * Revisa que el motivo tenga mas de 10 caracteres, si es asi
   * cierra modal, notifica que fue capturado el motivo y 
   * comienza a cargar la informacion de la venta
   */
   almacenaMotivo(){
    if(this.motivoEdicion.length >= 10){
      //cerramos modal
      this.modalService.dismissAll();
      //notificamos
      this.messageService.add({severity:'success', summary:'Realizado', detail: 'El motivo fue capturado.'});
      //asignamos informacion usuario y cargamos detalle venta
      this.identity = this._empleadoService.getIdentity();
      this.getTiposVentas();
      this.getDetallesVenta();
    } else {
      this.messageService.add({severity:'error', summary:'Advertencia', detail: 'El motivo de modificacón tiene que contener minimo 10 caracteres.'});
    }
  }

  /**
   * @description
   * Redirecciona al componente de ventas-realizadas-buscar, al hacer
   * click en el boton cancelar del modal
   */
  cancelaEdicion(){
    this._router.navigate(['/ventas-modulo/ventas-realizadas-buscar']);
    this.modalService.dismissAll();
  }

  /**
   * @description
   * Obtiene la informacion de la venta a modificar.
   */
  getDetallesVenta(){
    //Mostramos spiner de cargando
    this.isLoadingGeneral = true;
    //notificamos que la inforamcion se esta cargando
    this.messageService.add({severity:'warn', summary:'Cargando', detail: 'Cargando informacion de la venta.'});
    //obtenemos el id de la ruta
    this._route.params.subscribe( params =>{
      //la asignamos
      let idVenta = + params['idVenta'];
      //ejecutamos servicio que trae la informacion
      this._ventasService.getDetallesVenta(idVenta).subscribe(
        response =>{
          if(response.status == 'success'){

            this.ventag.idVenta = response.venta[0]['idVenta'];
            this.ventag.idCliente = response.venta[0]['idCliente'];
            this.ventag.idEmpleado = response.venta[0]['idEmpleado'];
            this.ventag.cdireccion = response.venta[0]['cdireccion'];
            this.ventag.observaciones = response.venta[0]['observaciones'];
            this.ventag.idStatusCaja = response.venta[0]['idStatusCaja'];
            this.ventag.idStatusEntregas = response.venta[0]['idStatusEntregas'];
            this.ventag.subtotal = response.venta[0]['subtotal'];
            this.ventag.descuento = response.venta[0]['descuento'];
            this.ventag.total = response.venta[0]['total'];
            //cargamos productos
            this.lista_productoVentag = response.productos_ventasg;

            this.lista_productoVentag.forEach(element => {
              element.comision = element.precio * 0.03;
            });
            //cargamos cliente
            this.seleccionarCliente(this.ventag.idCliente);


            this.messageService.add({severity:'success', summary:'Realizado', detail: 'Informacion cargada exitosamente.'});
            this.isLoadingGeneral = false;
            //console.log(response);
            //console.log(this.lista_productoVentag);
          } else{
            this.messageService.add({severity:'error', summary:'Error', detail: 'Fallo al obtener la informacion de la venta.'});
            console.log(response);
          }
        }, error =>{
          this.messageService.add({severity:'error', summary:'Error', detail: 'Fallo al obtener la informacion de la venta.'});
          console.log(error);
        }
      );
    })
  }

  updateVenta(){
    this.isLoadingGeneral = true;
    //Sustituimos todos los permisos por solo los permisos del modulo
    //Esto con la finalidad de no enviar informacion innecesaria
    let identityMod ={
      ... this.identity,
      'permisos': this.userPermisos
    }

    this._ventasService.putVenta(this.ventag.idVenta, this.ventag, this.lista_productoVentag, identityMod, this.motivoEdicion).subscribe(
      response =>{
        if(response.status == 'success'){
          //desactivamos spinner
          this.isLoadingGeneral = false;
          //cargamos mensaje
          let message = {severity:'success', summary:'Alerta', detail:response.message, sticky:true};
          this._sharedMessage.addMessages(message);
          //mandamos a indexventas
          this._router.navigate(['./ventas-modulo/ventas-realizadas-buscar']);
          
        }
        console.log(response);
      }, error =>{
        this.messageService.add({severity:'error', summary:'Alerta', detail:error.error.message});
        console.log(error)
      }
    );
  }

  openMdlProductos():void{
    this._mdlProductoService.openMdlProductosDialog(true);
  }

  // Función que maneja el evento 'idProductoObtenido' emitido por el componente hijo
  handleIdProductoObtenido(idProducto: number) {
    if(idProducto){
      this.seleccionarProducto(idProducto);
    } else{
      this.limpiaProducto();
    }
  }
}
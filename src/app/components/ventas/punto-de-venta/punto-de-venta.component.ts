import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { MdlProductoService } from 'src/app/services/mdlProductoService';
import { MdlClienteService } from 'src/app/services/mdlClienteService';
//modelos
import { Ventag } from 'src/app/models/ventag';
import { Cdireccion } from 'src/app/models/cdireccion';
import { Producto_ventasg } from 'src/app/models/productoVentag';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
import { handleRedirect } from 'src/app/utils/fnUtils';
import { dialogOptionsProductos } from 'src/app/models/interfaces/dialogOptions-productos';
import { dialogOptionsClientes } from 'src/app/models/interfaces/dialogOptions-clientes';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-punto-de-venta',
  templateUrl: './punto-de-venta.component.html',
  styleUrls: ['./punto-de-venta.component.css'],
  providers:[ProductoService, MessageService, ConfirmationService]
})
export class PuntoDeVentaComponent implements OnInit, OnDestroy {
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
  public tipo_venta: Array<any> = []; //getTiposVentas
  /**PAGINATOR */
  public itemsPerPage: number = 0;
  pageActual3: number = 1;
  //modelos
  public ventag: Ventag;
  public cdireccion: Cdireccion;
  public nuevaDir: Cdireccion;
  public productoVentag: Producto_ventasg;
  public lista_productoVentag: Array<Producto_ventasg>;
  //variables html checks
  public seEnvia: boolean = false;
  public isModificaPrecio: boolean = false;
  public PagoConTarjeta: boolean = false;

  public isSearch: boolean = true;
  public isLoadingGeneral: boolean = false;
  //contadores para los text area
  contador: number =0;
  //PERMISOS
  public userPermisos:any = [];
  public mPuV = this._modulosService.modsPuntodeVenta();
  public mCoti = this._modulosService.modsCotizaciones();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;

  /***Motivo de edicion */
  public modoEdicion: boolean = false;
  public modoEdicionCotizacion: boolean = false;
  public motivoEdicion: string = "";
  @ViewChild('mMotivoEdicion',{static:true}) mitempalte!: TemplateRef<any>;
  //modales
  public mdlProductos: boolean = false;
  public mdlDireccion: boolean = false;
  public mdlAcuentaDeUnaNota: boolean = false;
  //input de busqueda claveex
  public idProducto?: number;
  public dialogOpt?: dialogOptionsProductos;
  public dialogOptCliente?: dialogOptionsClientes;

  //subscriptions
  private sub_producto: Subscription;
  private sub_whatever?: Subscription;
  private sub_cliente?: Subscription;
  private sub_venta?: Subscription;
  private sub_searchCliente?: Subscription;
  private searchTerms = new Subject<string>();

  constructor( 
    //declaramos servicios
    private modalService: NgbModal,
    private _clienteService: ClientesService,
    private _productoService:ProductoService,
    private _ventasService: VentasService,
    private _empleadoService : EmpleadoService,
    private _modulosService: ModulosService,
    private _router:Router,
    private _confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _sharedMessage: SharedMessage,
    private _route: ActivatedRoute,
    private _mdlProductoService: MdlProductoService,
    private _mdlClientesService: MdlClienteService,
    ) {
    //declaramos modelos
    this.ventag = new Ventag(0,0,1,'',1,0,null,0,0,0,0,'','',0);
    this.cdireccion = new Cdireccion (0,'MEXICO','PUEBLA','TEHUACAN','','','','','',null,'',null,1,'');
    this.nuevaDir = new Cdireccion (0,'MEXICO','PUEBLA','TEHUACAN','','','','','',null,'',null,1,'');
    this.productoVentag = new Producto_ventasg(0,0,'',0,0,0,0,0,'','',0,0,true,0,false);
    this.lista_productoVentag = [];

    this.sub_producto = this._mdlProductoService.selectedValue$.subscribe(
      value =>{
        this.seleccionarProducto(value.idProducto);
      });

    this.sub_cliente = _mdlClientesService.selectedValue$.subscribe(
      value => {
        this.seleccionarCliente(value.idCliente)
      }
    )
   }

  ngOnInit(): void { 
    this.loadUser();

    this.sub_whatever = this._sharedMessage.messages$.subscribe(
      messages =>{
        if(messages){
          this.messageService.add(messages[0]);
        }
      }
    );

    this.sub_searchCliente = this.searchTerms.pipe(
      debounceTime(300)
    ).subscribe( term =>{
      if(term.length >= 3){
        this.openMdlClientes();
      }
    });
  }

  getTiposVentas(){
    this.sub_venta = this._ventasService.getTipoVenta().subscribe(
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
   * Obtener tipo de clientes al agregar uno nuevo
   */
  getTipocliente(){
    this.isLoadingGeneral = true;
    this.sub_cliente = this._clienteService.getTipocliente().subscribe(
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
    this.sub_cliente = this._clienteService.getDireccionCliente(idCliente).subscribe( 
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
  seleccionarCliente(idCliente:any, isDetalles:boolean = false){
    if(!isDetalles){
      this.ventag.cdireccion = '';
      this.seEnvia = false;
    }

    this.isLoadingGeneral = true;

    this.sub_cliente = this._clienteService.getDetallesCliente(idCliente).subscribe(
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
    direccion.numExt = direccion.numExt.length > 1 ? direccion.numExt :'S/N';
    this.ventag.cdireccion='CALLE '+direccion.calle+
                          ', #'+ direccion.numExt+
                          ', COLONIA '+ direccion.colonia+
                          ' --- TELEFONO: '+ direccion.telefono;
  }


  //guarda una nueva direccion
  guardarNuevaDireccion(){
    this.isLoadingGeneral = true;
    this.nuevaDir.idCliente = this.ventag.idCliente;
    this.sub_cliente = this._clienteService.postNuevaDireccion(this.nuevaDir).subscribe( 
      response=>{
        if(response.status == 'success'){
          this.isLoadingGeneral = true;
          this.messageService.add({severity:'success', summary:'Registro exitoso', detail: 'Direccion registrada correctamente'});
          this.getDireccionCliente(this.nuevaDir.idCliente);
          this.mdlDireccion = false;
        } else{
          this.messageService.add({severity:'error', summary:'Error', detail: 'Fallo al guardar la direccion',sticky:true});
          console.log(response)
        }
       }, error =>{
      console.log(error);
    });
  }

  //cargamos la informacion al modelo del producto que se selecciono con el click
  seleccionarProducto(idProducto:number){
    this.isLoadingGeneral = true;
    //cerramos los modales abiertos
    this.modalService.dismissAll();
    
    this.limpiaProducto();

    //console.log(idProducto);
    this.sub_producto = this._productoService.getProdverDos(idProducto).subscribe( response => {
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
      this.sub_producto = this._productoService.getExistenciaG(this.productoVentag.idProducto, this.productoVentag.idProdMedida, this.productoVentag.cantidad).subscribe(
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
    this.sub_whatever = this._route.params.subscribe(params =>{ 
      
      if(params['idVenta']){
        this.verificaPermisos("edit_venta",params['idVenta']);
      } else if(params['idCotiza']){
        this.verificaPermisos("edit_cotizacion",params['idCotiza']);
      } else{
        this.verificaPermisos("new_venta",null);
      }
    });   
  }

  verificaPermisos(typeAction: string, idParam: number | null){
    switch(typeAction){
      case "edit_venta":
            this.userPermisos = this._empleadoService.getPermisosModulo(this.mPuV.idModulo, this.mPuV.idSubModulo);
            //revisamos si el permiso del modulo esta activo si no redireccionamos
            if( this.userPermisos.editar != 1 ){
              handleRedirect(this.counter, this._router, this.messageService);
            } else{
              this.openModalMotivo();
              this.modoEdicion = true;
            }
        break;
      case "edit_cotizacion":
            this.userPermisos = this._empleadoService.getPermisosModulo(this.mCoti.idModulo, this.mCoti.idSubModulo);
            if( this.userPermisos.editar != 1 ){
              handleRedirect(this.counter, this._router, this.messageService);
            } else{
              this.identity = this._empleadoService.getIdentity();
              this.modoEdicionCotizacion = true;
              this.getTiposVentas();
              this.getDetallesCotizacion(idParam ?? 0);
            }
        break;
      case "new_venta":
            this.userPermisos = this._empleadoService.getPermisosModulo(this.mPuV.idModulo, this.mPuV.idSubModulo);
            //revisamos si el permiso del modulo esta activo si no redireccionamos
            if( this.userPermisos.agregar != 1 ){
              this.timerId = setInterval(()=>{
                this.counter--;
                if(this.counter === 0){
                  clearInterval(this.timerId);
                  this._router.navigate(['./']);
                }
                this.messageService.add({
                    severity:'error', 
                    summary:'Acceso denegado', 
                    detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'});
              },1000);
            } else{
              this.identity = this._empleadoService.getIdentity();
              this.getTiposVentas();
              this.isLoadingGeneral = false;
              this.seleccionarCliente(1);
            }
        break;
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
    this.isLoadingGeneral = true;
    //asignamos id del empleado
    this.ventag.idEmpleado = this.identity['sub'];

    if(!this.validacionSubmit()){
      
      let identityMod = {
        ... this.identity,
        'permisos': this.userPermisos
      }

      this.ventag.seEnvia = this.seEnvia;
      this.sub_venta = this._ventasService.postCotizaciones(this.ventag, this.lista_productoVentag, identityMod).subscribe( 
        response=>{
          if(response.status == 'success'){

            this.isLoadingGeneral = false;
            let message = {
                severity:'success', 
                summary:'Cotizacion #' + response.idCotiza, 
                detail:'La cotizacion se registro correctamente', 
                sticky: true,
            };
            this._sharedMessage.addMessages(message);
            
            this.generaPDF(response.idCotiza);

          }
        },error =>{
          console.log(error);
        });
    } else{
      this.isLoadingGeneral = false;
    }
  }

  generaPDF(idCotiza:number){
    this.sub_venta = this._ventasService.getPDF(idCotiza).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this._router.navigate(['./cotizacion-modulo/cotizacion-buscar']);
      }
    );
  }

  creaVenta(){
    //asignamos id del empleado
    this.ventag.idEmpleado = this.identity['sub'];
    if(!this.validacionSubmit()){
      
      this.isLoadingGeneral = true;

      //Sustituimos todos los permisos por solo los permisos del modulo
      //Esto con la finalidad de no enviar informacion innecesaria
      let identityMod = {
        ... this.identity,
        'permisos': this.userPermisos
      }
      //Agregamos propiedad de envio
      this.ventag.seEnvia = this.seEnvia;

      this.sub_venta = this._ventasService.postVenta(this.ventag, this.lista_productoVentag, identityMod).subscribe(
        response =>{
          // console.log(response)
          if(response.status == 'success'){
            //desactivamos spinner
            this.isLoadingGeneral = false;
            //generamos mensaje
            let message = {severity:'success', summary:'Venta #'+response.idVenta, detail:'La venta se registro correctamente',sticky:true};
            this._sharedMessage.addMessages(message);
            //mandamos a indexventas
            this._router.navigate(['./ventas-modulo/ventas-realizadas-buscar']);
          }
        }, error =>{
          this.messageService.add({severity:'error', summary:'Error', detail:'Algo salio mal al crear la venta'});
          console.log(error);
      });
    }
  }

  // Metodos del  modal
  open(content:any,type:number) {//abrir modal aplica para la mayoria de los modales
    if(type == 1){
      this.getTipocliente();
    }
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
    this.mdlDireccion = true;
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
    this.sub_whatever = this._route.params.subscribe( params =>{
      //la asignamos
      let idVenta = + params['idVenta'];
      //ejecutamos servicio que trae la informacion
      this.sub_venta = this._ventasService.getDetallesVenta(idVenta).subscribe(
        response =>{
          // console.log(response);
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
            this.ventag.seEnvia = response.venta[0]['seEnvia'];
            this.seEnvia = this.ventag.seEnvia;

            //cargamos productos
            this.lista_productoVentag = response.productos_ventasg;

            this.lista_productoVentag.forEach(element => {
              element.comision = element.precio * 0.03;
            });
            //cargamos cliente
            this.seleccionarCliente(this.ventag.idCliente, true);

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

  /**
   * @description
   * Metodo que actualiza una venta
   */
  updateVenta(){
    this.isLoadingGeneral = true;
    //Sustituimos todos los permisos por solo los permisos del modulo
    //Esto con la finalidad de no enviar informacion innecesaria
    let identityMod ={
      ... this.identity,
      'permisos': this.userPermisos
    }
    // console.log(this.ventag)
    this.sub_venta = this._ventasService.putVenta(this.ventag.idVenta, this.ventag, this.lista_productoVentag, identityMod, this.motivoEdicion).subscribe(
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
        // console.log(response);
      }, error =>{
        this.messageService.add({severity:'error', summary:'Alerta', detail:error.error.message});
        console.log(error)
      }
    );
  }

  /**
   * @description
   * Funcion que abre el modal de productos del componente externo
   */
  openMdlProductos():void{
    this.dialogOpt = {
      openMdlMedidas: true,
    };
    this._mdlProductoService.openMdlProductosDialog(this.dialogOpt);
  }

  /**
   * 
   * @param idProducto 
   * @description
   * Función que maneja el evento 'idProductoObtenido' emitido por el componente hijo
   */
  handleIdProductoObtenido(idProducto: number) {
    if(idProducto){
      this.seleccionarProducto(idProducto);
    } else{
      this.limpiaProducto();
    }
  }

  /**
   * 
   * @returns boolean
   * @description
   * Valida que la laista de productos no este vacia
   * Valida que se tenga un cliente (idCliente)
   * Valida que si el tipo de venta es "Firma" no tiene que ser cliente eventual (1)
   */
  validacionSubmit(): boolean{
    let validate = false;

    if(this.lista_productoVentag.length == 0){
        validate = true;
        this.messageService.add({
          severity:'warn', 
          summary:'Alerta', 
          detail:'No puedes generar una venta sin productos!'
        });

    }else if(this.ventag.idCliente == 0){
        validate = true;
        this.messageService.add({
          severity:'warn', 
          summary:'Alerta', 
          detail:'No puedes generar una venta sin cliente!'
        });
    } else if(this.ventag.idTipoVenta > 3 && this.ventag.idCliente === 1){
      validate = true;
        this.messageService.add({
          severity:'warn', 
          summary:'Alerta', 
          detail:'No puedes generar una venta con tipo de venta "FIRMA" si el cliente es "CLIENTE EVENTUAL"',
          sticky: true,
        });
    }

    return validate;
  }

  /**
   * 
   * @param idCotiza 
   * @description
   * Trae los detalles de la cotizacion
   */
  getDetallesCotizacion(idCotiza:number){
    this.sub_venta = this._ventasService.getDetallesCotiza(idCotiza).subscribe(
      response =>{
        // console.log(response);
        if(response.status == 'success'){
          
          this.ventag = response.Cotizacion;
          this.ventag.idTipoVenta = 1;
          //asignamos datos del cliente para mostrar
          this.cliente = [{'rfc':response.Cotizacion.clienteRFC,'nombreTipoC':response.Cotizacion.tipocliente}];
          this.seEnvia = this.ventag.cdireccion ? true : false;
          this.lista_productoVentag = response.productos_cotiza;
          this.lista_productoVentag.forEach(element => {
            element.comision = element.precio * 0.03;
          });
          this.isLoadingGeneral = false;
        }
      }, error =>{

        let msg = {
          severity:'error', 
          summary:'Error', 
          detail:'Ocurrio un error al buscar la cotizacion',
          sticky: true,
        }
        this._sharedMessage.addMessages(msg);
        this._router.navigate(['./cotizacion-modulo/cotizacion-buscar']);

        console.log(error)
      }
    )
  }

  /**
   * @description
   * Metodo que actualiza la cotizacion
   */
  updateCotizacion(){
    this.isLoadingGeneral = true;

    let identityMod = {
      ... this.identity,
      'permisos': this.userPermisos,
    }

    this.sub_venta = this._ventasService.putCotizacion(this.ventag.idCotiza, this.ventag, this.lista_productoVentag, identityMod).subscribe(
      response =>{
        if(response.status == 'success'){
          //desactivamos spinner
          this.isLoadingGeneral = false;
          //cargamos mensaje
          let message = {severity:'success', summary:'Alerta', detail:response.message, sticky:true};
          this._sharedMessage.addMessages(message);
          //mandamos a indexventas
          this._router.navigate(['./cotizacion-modulo/cotizacion-buscar']);
          
        }
        // console.log(response);
      }, error =>{
        this.messageService.add({severity:'error', summary:'Alerta', detail:error.error.message});
        console.log(error);
      }
    );
  }

  /**
  * @description
  * Funcion que abre el modal de clientes del componente externo
  */
  openMdlClientes():void{
    this.dialogOptCliente = {
      idCliente: 0,
      search: this.ventag.nombreCliente,
    };
    this._mdlClientesService.openMdlProductosDialog(this.dialogOptCliente);
  }

  checkInputLength():void{
    this.searchTerms.next(this.ventag.nombreCliente);
  }

  /**
   * @description
   * Verifica si el idTipoVenta es igual a 8 (a cuenta de una nota)
   * Si es verdadero abrimos modal
   */
  selectAcuentaDeUnaNota(){
    if(this.ventag.idTipoVenta == 8){
      this.mdlAcuentaDeUnaNota = true;
    }
  }

  /**
   * @description
   * Destruimos todos los subscriptions
   */
  ngOnDestroy(): void {
    this.sub_producto.unsubscribe();
    this.sub_whatever?.unsubscribe();
    this.sub_cliente?.unsubscribe();
    this.sub_venta?.unsubscribe();
    this.sub_searchCliente?.unsubscribe();
  }
}
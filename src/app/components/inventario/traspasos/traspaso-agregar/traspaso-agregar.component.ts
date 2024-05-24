import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
//Services
import { SucursalService } from 'src/app/services/sucursal.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { HttpClient} from '@angular/common/http';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { TraspasoService } from 'src/app/services/traspaso.service';
import { SharedMessage } from 'src/app/services/sharedMessage'; 
import { MdlProductoService } from 'src/app/services/mdlProductoService';
//Modelos
import { Traspaso } from 'src/app/models/traspaso';
import { Empresa } from 'src/app/models/empresa';
import { Producto_traspaso } from 'src/app/models/producto_traspaso';
//primeng
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
//Modal
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//Router
import { Router } from '@angular/router';
import { dialogOptionsProductos } from 'src/app/models/interfaces/dialogOptions-productos';


@Component({
  selector: 'app-traspaso-agregar',
  templateUrl: './traspaso-agregar.component.html',
  styleUrls: ['./traspaso-agregar.component.css'],
  providers:[MessageService,ConfirmationService,ProductoService,EmpleadoService]
})
export class TraspasoAgregarComponent implements OnInit, OnDestroy {

  //modelos
  public traspaso: Traspaso = new Traspaso(0,0,0,0,0,0,0,'',null,null);
  public producto_traspaso = new Producto_traspaso(0,0,'','',0,0,0,0,0,null,'');
  public empresaSesion: Empresa = new Empresa(0,'','','','','','','','','','','','','','');
  public lista_producto_traspaso: Array<Producto_traspaso> = [];
  //Recive services
  public sucursales: Array<any> = [];
  public productoVer:any;
  public productoVerM:any;
  public productos: any;
  public url: string = global.url;
  public identity: any;
  public Empresa: Array<any> = [];
  //Ayudantes
  public tipoTraspaso: string = '';
  public classSelect: string = 'col-5';
  public classInput: string = 'col-1';
  public medidaActualizada:any;
  public isHidden:boolean = true;
  //Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar : number = 0 ;
  //spinner
  public isLoading:boolean = false;
  //cerrar modal
  closeResult = '';
  //Paginacion modal lista de productos
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //Paginacion lista de productos
  pageActualLista: number = 0;
  //Contadores para los text area
  conta: number =0;

  //Input de busqueda
  public idProducto ? : number;

  //Modal productos
  public selectedValue : any;
  private subscription : Subscription;
  public dialogOpt?: dialogOptionsProductos;
  

  constructor(
    private _sucursalService: SucursalService,
    private _empresaService: EmpresaService,
    public _empleadoService : EmpleadoService,
    private _confirmationService: ConfirmationService,
    private messageService: MessageService,
    private _productoService: ProductoService,
    private _http: HttpClient,
    private _traspasoService: TraspasoService,
    private modalService: NgbModal,
    public _router: Router,
    private _sharedMessage: SharedMessage,
    private _mdlProductoService: MdlProductoService
    ) {
        this.subscription = _mdlProductoService.selectedValue$.subscribe(
          value => [this.getProd(value)]
        )
     }

  ngOnInit(): void {
    this.getSucursales();
    this.getEmpresa();
    this.loadUser();
    this._sharedMessage.messages$.subscribe(
      messages => { 
        if(messages){
          this.messageService.add(messages[0]);
        }

      }
    )
  }

  //Getters

  loadUser(){//traemos la informacion del usuario
    this.identity = this._empleadoService.getIdentity();
  }

  /**
   * @description
   * Obtiene todas las sucursales
   */
  getSucursales(){
    this._sucursalService.getSucursales().subscribe(
      response =>{
        if(response.status == 'success'){
          this.sucursales = response.sucursales;
          
        }
        console.log(response);
      }, error =>{
        console.log(error);
      });
  }

  /**
   * @description
   * Obtiene la empresa/sucursal en la que se esta loguedo
   */
  getEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe(
      response =>{
        if(response.status == 'success'){
          this.empresaSesion = response.empresa[0];
          // console.log(this.empresaSesion);
        }
      }, error =>{
        console.log(error);
      });
  }

  //Funciones

  /**
   * 
   */
  changeTipoTraspaso(){
    if(this.traspaso.sucursalE == this.empresaSesion.idSuc && this.traspaso.sucursalR == this.empresaSesion.idSuc){
      this.tipoTraspaso = 'Uso interno';
      this.classSelect = 'col-3';
      this.classInput = 'col-2';
      this.isHidden = true;
      this.confirmUsoInterno();
    } else if(this.traspaso.sucursalE == this.empresaSesion.idSuc){
      this.tipoTraspaso = 'Envia';
      this.classSelect = 'col-5';
      this.classInput = 'col-1';
      this.isHidden = true;
    } else if(this.traspaso.sucursalR == this.empresaSesion.idSuc){
      this.tipoTraspaso = 'Recibe';
      this.classSelect = 'col-4';
      this.classInput = 'col-1';
      this.isHidden = false;
    } else if(this.traspaso.sucursalE != this.empresaSesion.idSuc && this.traspaso.sucursalR != this.empresaSesion.idSuc){
      if(this.traspaso.sucursalE != 0 && this.traspaso.sucursalR != 0){
        this.messageService.add({severity:'error', summary:'Error', detail:'Tienes que elegir tu sucursal de sesion en una de las opciones.'});
        this.tipoTraspaso = '';
        this.classSelect = 'col-5';
        this.classInput = 'col-1';
        this.isHidden = true;
        
    }
    }
  }

  /**
   * @description
   * Confirm de uso interno, habilitara mas opciones si es aceptada
   * Si no se regresan a 0 los valores sucursalE y sucursalR
   */
  confirmUsoInterno() {
    this._confirmationService.confirm({
        message: 'Al enviar a la misma sucursal se considera uso interno ¿Esta seguro(a)?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //this.messageService.add({severity:'info', summary:'Confirmado', detail:'Venta'});
        },
        reject: (type:any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de uso interno cancelado.'});
                    this.traspaso.sucursalE = 0;
                    this.traspaso.sucursalR = 0;
                    this.tipoTraspaso = '';
                    this.classSelect = 'col-5';
                    this.classInput = 'col-1';
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion deuso interno cancelado.'});
                    this.traspaso.sucursalE = 0;
                    this.traspaso.sucursalR = 0;
                    this.tipoTraspaso = '';
                    this.classSelect = 'col-5';
                    this.classInput = 'col-1';
                break;
            }
        }
    });
  }


  //Captura de productos
  capturar(datos:any){//Agrega un producto a lista de compras
    // if(this.producto_compra.caducidad)
    console.log('capturar',datos.idProdMedida);

    if(this.producto_traspaso.cantidad <= 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con cantidad igual o menor a 0'});
    }else if(datos.idProdMedida == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Falta agregar la medida'});
    }else if(this.producto_traspaso.precio < 0 ){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con precio menor a 0'});
    }else if(this.producto_traspaso.subtotal < 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con subtotal menor a 0'});
    }
    else if(this.producto_traspaso.idProducto == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto no existe'});
    }else if( this.lista_producto_traspaso.find( x => x.idProducto == this.producto_traspaso.idProducto)){
      //verificamos si la lista de productos del traspaso ya contiene el producto buscandolo por idProducto
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto ya esta en la lista'});
    }else{

      //Asignar idProdMedida y nombreMedida antes de capturar
      this.medidaActualizada = this.productoVerM.find( (x:any) => x.idProdMedida == datos.idProdMedida);
      this.producto_traspaso.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
      this.producto_traspaso.nombreMedida = this.medidaActualizada.nombreMedida;

      this.lista_producto_traspaso.push({...this.producto_traspaso}); 
      //Reset variables
      this.resetVariables(); 

    }
    console.log('lista de produstos traspaso',this.lista_producto_traspaso);
    
  }

  resetVariables(){
    this.productoVer=[];
    this.productoVerM=[];
    this.producto_traspaso.claveEx = '';
    this.producto_traspaso.cantidad = 0 ;
    this.producto_traspaso.precio = 0 ;
    this.producto_traspaso.subtotal = 0 ;
    this.producto_traspaso.idProdMedida = 0;


  }

  //Envio de formulario
  agregarTraspaso(form:any){//Enviar Form insertar en DB
    this.traspaso.idEmpleado = this.identity['sub'];//asginamos id de Empleado

    if(this.traspaso.folio == 0 && this.tipoTraspaso == 'Recibe'){
      this.messageService.add({severity:'error', summary:'Error', detail:'Falta ingresar el folio del envío'});
    }
    else if(this.lista_producto_traspaso.length == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'La lista de traspaso está vacía'});
    }
    else{
      console.log(this.traspaso);
      if(this.tipoTraspaso == 'Uso interno'){
        this._traspasoService.registerTraspasoUsoInterno(this.traspaso,this.tipoTraspaso,this.lista_producto_traspaso,this.identity).subscribe(
          response =>{
            if(response.status == 'success'){
              this.messageService.add({severity:'success', summary:'Éxito', detail:'Traspaso registrado'});
              console.log(response);
              this.createPDF(response.traspaso,this.tipoTraspaso);
              //this.createPDF();
            }else{
              //IMPRIMIR RESPONSE.DATA
            }
          },error =>{
            console.log(<any>error);
            console.log(error.error.message);
            this.messageService.add({severity:'error', summary:'Error', detail:error.error.message});
          }
        );
      }else{
        this._traspasoService.registerTraspaso(this.traspaso,this.tipoTraspaso,this.lista_producto_traspaso,this.identity).subscribe(
          response =>{
            if(response.status == 'success'){
              this.messageService.add({severity:'success', summary:'Éxito', detail:'Traspaso registrado'});
              console.log(response);
              if(this.tipoTraspaso == 'Recibe'){
                this.createPDF(response.traspaso,this.tipoTraspaso);
              }else if(this.tipoTraspaso == 'Envia'){
                this.createPDF(response.traspaso,this.tipoTraspaso);
              }else{}
              //this.createPDF();
            }else{
              //IMPRIMIR RESPONSE.DATA
            }
          },error =>{
            console.log(<any>error);
            console.log(error.error.message);
            this.messageService.add({severity:'error', summary:'Error', detail:error.error.message});
          }
        );
      }
    }
  }

  public createPDF(idTraspaso:number,tipoTraspaso:any):void{//Crear PDF
    console.log(idTraspaso);
    console.log(tipoTraspaso);
    this._traspasoService.getPDF(idTraspaso,this.identity['sub'],tipoTraspaso).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this._router.navigate(['./traspaso-modulo/traspaso-buscar']);
      }
    );
  }

  handleIdProductoObtenido(idProducto:any){
    
    if(idProducto){
      this.getProd(idProducto);
    }else{
      this.resetVariables();
    }
   }
    
    openMdlProductos():void{
      this.dialogOpt = {
        openMdlMedidas: true,
      };
      this._mdlProductoService.openMdlProductosDialog(this.dialogOpt);
    }























  // Modal
  open(content:any) {
    this.getAllProducts();
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

  /**
  * PAGINACION 
  * @param page
  * Es el numero de pagina a la cual se va acceder
  * @description
  * De acuerdo al numero de pagina recibido lo concatenamos a
  * la direccion para "ir" a esa direccion y traer la informacion
  * no retornamos ya que solo actualizamos las variables a mostrar
  */
  getPage(page:number) {
    //iniciamos spinner
    this.isLoading = true;
    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        
        //asignamos datos a varibale para poder mostrarla en la tabla
        this.productos = response.productos.data;
        //navegacion de paginacion
        this.totalPages = response.productos.total;
        this.itemsPerPage = response.productos.per_page;
        this.pageActual = response.productos.current_page;
        this.next_page = response.productos.next_page_url;
        this.path = response.productos.path;
        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }

  getAllProducts(){//traemos la informacion de todos los productos para el modal
    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.productos = response.productos.data;
          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          this.next_page = response.productos.next_page_url;
          this.path = response.productos.path;
          //una vez terminado quitamos el spinner
          this.isLoading=false;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  //Busqueda dentro de modal
  /**
  * 
  * @param descripcion 
  * Recibimos el evento del input
  * @description
  * Recibe los valores del evento keyUp, luego busca y actualiza
  * los datos de la tabla
  */
  getSearchDescripcion(descripcion:any){
   
    //mostramos el spinner
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion que trae todo
    if(descripcion.target.value == ''){
      this.getAllProducts();
    }

    //componemos el codigo a buscar
    this.buscarProducto = descripcion.target.value;

    //llamamos al servicio
    this._productoService.searchDescripcion(this.buscarProducto).subscribe(
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
            this.isLoading = false;
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
  getSearchCodbar(codbar:any){

   //mostramos el spinner
   this.isLoading = true;

   //si es vacio volvemos a llamar la primera funcion que trae todo
   if(codbar.target.value == ''){
     this.getAllProducts();
   }

   //componemos el codigo a buscar
   this.buscarProductoCbar = codbar.target.value;

   //llamamos al servicio
   this._productoService.searchCodbar(this.buscarProductoCbar).subscribe(
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
           this.isLoading = false;
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
  getSearch(claveExterna:any){

   //mostramos el spinner 
   this.isLoading = true;

   //si es vacio volvemos a llamar la primera funcion
   if(claveExterna.target.value == ''){
     this.getAllProducts();
   }
   //componemos la palabra
   this.buscarProducto = claveExterna.target.value;

   //generamos consulta
   this._productoService.searchClaveExterna(this.buscarProducto).subscribe(
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
           this.isLoading = false;
       }
     }, error =>{
         console.log(error)
     }
   )
  }

  consultarProductoModal(dato:any){
    let cantidad: any;
    cantidad = 0;
    this.getProd(dato);
  }

  getProd(lpo:any){//consultar producto y rellenar el formulario de producto
    // console.log('getProd(lpo)',lpo);
    this.resetVariables();
    this._productoService.getProdverDos(lpo.idProducto).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        // console.log('productoVer',this.productoVer);
        this.producto_traspaso.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_traspaso.claveEx = this.productoVer[0]['claveEx'];
        this.producto_traspaso.idProducto = this.productoVer[0]['idProducto'];
        this.producto_traspaso.cantidad = lpo.cantidad ?? 0;
        this.productoVerM = response.productos_medidas;//informacion completa de productos_medidas para recorrerlo atraves del html
        // console.log('productoVerM',this.productoVerM);

        if(lpo.nombreMedida){
          // console.log('CON NOMBREMEDIDA');
          //obtener idProdMedida actualizado y asignarlo
          //buscar lpo.nombreMedida en productoVerM, regresar y asignar this.producto_traspaso.idProdMedida, this.producto_compra.nombreMedida
          this.medidaActualizada = this.productoVerM.find( (x:any) => x.nombreMedida == lpo.nombreMedida);
          if(this.medidaActualizada == undefined ){

          }else{
            // console.log('medidaActualizada',this.medidaActualizada);
            this.producto_traspaso.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
            this.producto_traspaso.nombreMedida = this.medidaActualizada.nombreMedida;
          }
        }else{
          // console.log('SIN NOMBREMEDIDA');
          //console.log(this.productoVerM[0]['idProdMedida']);
          this.producto_traspaso.idProdMedida = this.productoVerM[0]['idProdMedida'];
          this.producto_traspaso.nombreMedida = this.productoVerM[0]['nombreMedida'];

        }
        
        this.asignaPrecioCompra();
        // console.log('producto_traspaso',this.producto_traspaso);
        
      },error => {
        //console.log(error);
      }
    );
  }























  /**EVENTOS */
  onChangeT(subtotal:any){//Recalcula el subtotal al hacer un cambio dentro del formulario de productos
    this.producto_traspaso.subtotal = this.producto_traspaso.cantidad * this.producto_traspaso.precio;
  }

  cambioSeleccionado(e:any){//Limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = 0;
  }

  editarProducto(lpo:any){//metodo para editar la lista de productos
    console.log('editarProducto',lpo);

    this.lista_producto_traspaso = this.lista_producto_traspaso.filter((item) => item.idProducto !== lpo.idProducto);//eliminamos el producto
    //consultamos la informacion para motrar el producto nuevamente
    this.getProd(lpo);
    //this.isSearch = false;
  }

  
  /**
  * Omite el salto de linea del textarea de descripcion
  * cuenta el numero de caracteres insertados
  * @param event 
  * omitimos los eventes de "enter""
  */
  omitirEnter(event:any){
    this.conta = event.target.value.length;
    if(event.which === 13){
      event.preventDefault();
      //console.log('prevented');
     }
   }
  /**
   * Lo mismoq que el de arriba pero para las observaciones xd
   */
   contaCaracteres(event:any){
    this.conta = event.target.value.length;
    if(event.which === 13){
      event.preventDefault();
      //console.log('prevented');
     }
   }
  

  /**
   * Asigna precio de producto en función de la medida proporcionada por el usuario
   */
  asignaPrecioCompra(){
    //console.log(this.producto_traspaso.idProdMedida);
    //Buscar por idProdMedida
      var med = this.productoVerM.find((x: { idProdMedida: number; }) => x.idProdMedida == this.producto_traspaso.idProdMedida);
    //console.log(med);
    //Asignar valor
      this.producto_traspaso.precio = med.precio1;
    //console.log(this.producto_traspaso.precio);    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MedidaService } from 'src/app/services/medida.service';
import { ImpuestoService } from 'src/app/services/impuesto.service';
import { CompraService } from 'src/app/services/compra.service';
import { HttpClient} from '@angular/common/http';
import {MessageService} from 'primeng/api';
//modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
import { Compra } from 'src/app/models/compra'
import { Producto_compra } from 'src/app/models/producto_compra';
//Modal
import { NgbDateStruct, NgbModal,ModalDismissReasons, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-compra-agregar-id',
  templateUrl: './compra-agregar-id.component.html',
  styleUrls: ['./compra-agregar-id.component.css'],
  providers:[ProveedorService,MedidaService,ProductoService,ImpuestoService,OrdendecompraService, EmpleadoService,CompraService,MessageService]
})
export class CompraAgregarIdComponent implements OnInit {

//variables servicios
  public url: string = global.url;

  public orden_compra: Ordencompra;
  public productosOrden: Producto_orden;
  public lista_productosorden: Array<Producto_orden>;

  public detallesProveedor:any;
  public proveedoresLista:any;
  public productos: any;
  public productoVer: any;
  public productoVerM: any;
  public identity: any;
//variables de detalles de la orden
  public detailOrd: any;
  public productosdetailOrd: any;
  public fecha : Date = new Date();
  public dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };
//variable para el cambio de fecha
  public isSearch: boolean = true;
//date!: Date;
  public test: boolean = false;
  public facturableCheck: boolean = false;
//modelo de bootstrap datapicker
  model!: NgbDateStruct;
  modelP!: NgbDateStruct;

//paginador Lista de productos orden
  public totalPages2: any;
  public path2: any;
  public next_page2: any;
  public prev_page2: any;
  public itemsPerPage2:number=0;
  pageActual2: number = 0;   

//paginador Lista de productos orden
  public totalPages3: any;
  public path3: any;
  public next_page3: any;
  public prev_page3: any;
  public itemsPerPage3:number=0;
  pageActual3: number = 0; 

/**PAGINATOR modal*/
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;

  //cerrar modal
  closeResult = '';
  //Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar : number = 0 ;


  public proveedorVer: any;
  public medidas: any;
  public impuestos: any;
  public impuestoVer: any;
  public idUser:any;

  //variables servicios
  public dato:any;
  public ultimaCompra: any;
  public detailComp: any;
  public detailProdComp: any;


  //modelo de bootstrap
  today = this.calendar.getToday();

  //Variables para actualizar medida
  public medidaActualizada:any;

  public compra: Compra;
  public Lista_compras: Array<Producto_compra>;
  public producto_compra: Producto_compra;

  //spinner
  public isLoading:boolean = false;

  //contadores para los text area
  conta: number =0;

  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _productoService: ProductoService,
    private messageService: MessageService,
    private _ordencompraService: OrdendecompraService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
    private modalService: NgbModal,
    private _http: HttpClient,

    private _medidaService: MedidaService,
    private _impuestoService: ImpuestoService,
    public _compraService : CompraService,
    private calendar: NgbCalendar


  ) {
    this.orden_compra = new Ordencompra (0,null,0,'',null,0,null,null);
    this.productosOrden = new Producto_orden(0,0,0,0,'','','');
    this.lista_productosorden = [];

    this.compra = new Compra(0,null,0,0,0,0,0,0,null,'',false,null);
    this.producto_compra = new Producto_compra(0,0,0,0,0,0,0,null,0,null,null,null,null,0,null);
    this.Lista_compras = [];
    this.url = global.url;


  }

  ngOnInit(): void {
    this.getOrdencompra();
    this.getAllProveedores();
    this.getAllProducts();
    this.loadUser();
    this.getImpuesto();
  }
  //Al iniciar
  getOrdencompra(){//traemos la informacion de la orden seleccionada
    //Nos suscribimos al url para extraer el id
    this._route.params.subscribe( params =>{
      let id = + params['idOrd'];//la asignamos en una variable
      //console.log(id);
      //Mandamos a traer la informacion de la orden de compra
      this._ordencompraService.getDetailsOrdes(id).subscribe(
        response =>{
          if(response.status  == 'success' && response.ordencompra.length > 0 && response.productos.length > 0){

            //asignamos de uno en uno las propiedades de la orden                     
            this.orden_compra.idProveedor = response.ordencompra[0]['idProveedor'];
            this.orden_compra.fecha = response.ordencompra[0]['fecha'];
            //this.date = new Date(response.ordencompra[0]['fecha']);
            this.orden_compra.idEmpleado = response.ordencompra[0]['idEmpleado'];
            this.orden_compra.idOrd = response.ordencompra[0]['idOrd'];
            this.orden_compra.idReq = response.ordencompra[0]['idReq'];
            this.orden_compra.idStatus = response.ordencompra[0]['idStatus'];
            this.orden_compra.observaciones = response.ordencompra[0]['observaciones'];
            this.orden_compra.updated_at = response.ordencompra[0]['updated_at'];
            //llenamos la lista con la respuesta obtenida
            this.lista_productosorden = response.productos;
            //console.log(this.orden_compra.fecha);
            
            //Asignar propiedades a la compra
            this.compra.idProveedor = response.ordencompra[0]['idProveedor'];
            this.getProveeVer(this.compra.idProveedor);
            this.compra.idOrd = response.ordencompra[0]['idOrd'];
            //console.log('Asignacion de datos a compra',this.compra);


          }
          console.log('---INFORMACION ORDEN DE COMPRA---');
          console.log(response.ordencompra);
          console.log(response.productos);
          console.log('---------------------------------');

        },error =>{
          console.log(error);
      });
    });
  }

  getAllProveedores(){//Rellenamos el select de proveedores
    this._proveedorService.getProveedoresSelect().subscribe(
      response =>{
        this.proveedoresLista = response.provedores;
        //console.log(this.proveedoresLista);
      },error =>{
        console.log(error);
        
      });
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

  loadUser(){//traemos la informacion del usuario
    this.identity = this._empleadoService.getIdentity();
  }

  getImpuesto(){//traemos los impuestos
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
  /*************** */





   /*Eventos*/
  onChange(id:any){//Muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }

  onChangeI(id:any){//Muestra los datos del impuesto al seleccionarlo
    this.getImpuestoVer(id);    
    // console.log(id);
  }

  onChangeT(subtotal:any){//Recalcula el subtotal al hacer un cambio dentro del formulario de productos
    this.producto_compra.subtotal = this.producto_compra.cantidad * this.producto_compra.precio;
    this.producto_compra.subtotal = this.producto_compra.subtotal + (this.producto_compra.subtotal * (this.producto_compra.valorImpuesto / 100)); 
  }

  cambioSeleccionado(e:any){//Limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = 0;
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






  capturar(datos:any){//Agrega un producto a lista de compras
    // if(this.producto_compra.caducidad)
    if(this.test == true){
      this.producto_compra.caducidad = this.modelP.year+'-'+this.modelP.month+'-'+this.modelP.day;//concatenamos la fecha del datepicker
    }
    console.log('capturar',datos.idProdMedida);
    console.log('Caducidad: ',this.producto_compra.caducidad);

    //Asignar idProdMedida y nombreMedida antes de capturar
    this.medidaActualizada = this.productoVerM.find( (x:any) => x.idProdMedida == datos.idProdMedida);
    this.producto_compra.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
    this.producto_compra.nombreMedida = this.medidaActualizada.nombreMedida;

    
    if(this.producto_compra.cantidad <= 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con cantidad igual o menor a 0'});
    }else if(this.producto_compra.precio < 0 ){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con precio menor a 0'});
    }else if(this.producto_compra.subtotal < 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con subtotal menor a 0'});
    }
    else if(this.producto_compra.idProducto == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto no existe'});
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_compra.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto ya esta en la lista'});
    }else{
      this.Lista_compras.push({...this.producto_compra}); 
      this.isSearch=true;

      //Calculo de subtotal y total de la compra
      this.compra.subtotal=(this.producto_compra.cantidad*this.producto_compra.precio)+this.compra.subtotal;
      this.compra.total=this.producto_compra.subtotal+this.compra.total;
      this.compra.total = Math.round((this.compra.total + Number.EPSILON) * 100 ) / 100 ;
      console.log('Subtotal: ',this.compra.subtotal);
      console.log('Total: ',this.compra.total);

      //Reset variables 
      this.productoVer=[];
      this.productoVerM=[];
      this.producto_compra.claveEx = '';
      this.producto_compra.cantidad = 0 ;
      this.producto_compra.precio = 0 ;
      this.producto_compra.idImpuesto = 0 ;
      this.producto_compra.valorImpuesto = 0 ;
      this.producto_compra.subtotal = 0 ;
      this.producto_compra.caducidad = '' ;
      this.producto_compra.idProdMedida = 0;
      if(this.test == true){
        this.modelP.day = 0;
        this.modelP.month = 0;
        this.modelP.year = 0;
        this.test = false;
      }

    }



    console.log('lista de compras',this.Lista_compras);
    
  }

  consultarProductoModal(dato:any){
    let cantidad: any;
    cantidad = 0;
    this.getProd(dato);
    this.isSearch = false;
  }

  consultarProducto(event:any){//Mostrar informacion del producto al dar enter
    //alert('you just pressed the enter key'+event);
    this.dato=event.target.value;
    //console.log(this.dato)
    let cantidad: any;
    cantidad = 0;
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

  getProd(lpo:any){//consultar producto y rellenar el formulario de producto
    console.log('getProd(lpo)',lpo);
    this._productoService.getProdverDos(lpo.idProducto).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        console.log('productoVer',this.productoVer);
        this.producto_compra.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_compra.claveEx = this.productoVer[0]['claveEx'];
        this.producto_compra.idProducto = this.productoVer[0]['idProducto'];
        this.producto_compra.cantidad = lpo.cantidad;
        this.productoVerM = response.productos_medidas;//informacion completa de productos_medidas para recorrerlo atraves del html
        console.log('productoVerM',this.productoVerM);
        //obtener idProdMedida actualizado y asignarlo
        //buscar lpo.nombreMedida en productoVerM, regresar y asignar this.producto_compra.idProdMedida, this.producto_compra.nombreMedida
        this.medidaActualizada = this.productoVerM.find( (x:any) => x.nombreMedida == lpo.nombreMedida);
        if(this.medidaActualizada == undefined ){

        }else{
          console.log('medidaActualizada',this.medidaActualizada);
          this.producto_compra.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
          this.producto_compra.nombreMedida = this.medidaActualizada.nombreMedida;
        }
        
        console.log('producto_compra',this.producto_compra)
        
      },error => {
        //console.log(error);
      }
    );
  }


  getLastCompra(){
    this._compraService.getLastCompra().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ultimaCompra = response.compra;
          this._compraService.getDetailsCompra(this.ultimaCompra['idCompra']).subscribe(
            response => {
              this.detailComp = response.compra;
              this.detailProdComp = response.productos;
              console.log('detailComp',this.detailComp);
              console.log('detailProdComp',this.detailProdComp);
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

  getImpuestoVer(id:any){
    //console.log(id);
    this._impuestoService.getImpuestoVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.impuestoVer = response.impuesto;
          this.producto_compra.NombreImpuesto = response.impuesto[0]['nombre'];
          this.producto_compra.valorImpuesto = response.impuesto[0]['valor'];
          this.producto_compra.idImpuesto = response.impuesto[0]['idImpuesto'];
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

    if(this.model == undefined){
      this.messageService.add({severity:'error', summary:'Error', detail:'Falta ingresar la fecha de recepción'});
    }
    else if(this.compra.folioProveedor == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Falta ingresar el folio del proveedor'});
    }
    else if(this.Lista_compras.length == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'La lista de compras está vacía'});
    }
    else 
    {
      this.compra.fechaRecibo = this.model.year+'-'+this.model.month+'-'+this.model.day;//concatenamos la fecha del datepicker
      this.compra.idStatus = 1;
      if(this.facturableCheck == true){
        this.compra.facturable = 1;
      }else{
        this.compra.facturable = 0;
      }
      console.log(this.compra);
      this._compraService.registrerCompra(this.compra).subscribe(
      response =>{
        console.log('response',response)
        console.log('response.status',response.status)
        if(response.status == 'success'){
          console.log(response)       
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Compra creada'});
            this._compraService.registerProductoscompra(this.Lista_compras).subscribe(
              res =>{
                  console.log(res);
                  this.messageService.add({severity:'success', summary:'Éxito', detail:'Productos agregados'});
                  this.getLastCompra();
                  //this.createPDF();
              },error =>{
                console.log(<any>error);
                this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al agregar los productos a la compra'});
              });
          //Registro de lote
          // this._compraService.registerLote().subscribe( res =>{
          //   console.log(res)
          // });
          //SUMAR EXISTENCIAG
            this._compraService.updateExistencia(this.Lista_compras).subscribe(
              res =>{
                  console.log(res);
                  this.messageService.add({severity:'success', summary:'Éxito', detail:'Existencia actualizada'});
                  //this.getLastCompra();
                  //this.createPDF();
              },error =>{
                console.log(<any>error);
                this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al actualizar la existencia'});
              });

            if(this.facturableCheck==true){
              this._compraService.updateExistenciaFacturable(this.Lista_compras).subscribe(
                res =>{
                    console.log(res);
                  this.messageService.add({severity:'success', summary:'Éxito', detail:'Existencia facturable actualizada'});
                },error =>{
                  console.log(<any>error);
                this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al actualizar la existencia facturable'});
                });
            }else{

            }


        }
      },error =>{
        console.log(<any>error);
        this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al crear la compra'});
      });

    }
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

  editarProducto(lpo:any){//metodo para editar la lista de productos
    console.log('editarProducto',lpo);

    this.lista_productosorden = this.lista_productosorden.filter((item) => item.idProducto !== lpo.idProducto);//eliminamos el producto
    //consultamos la informacion para motrar el producto nuevamente
    this.getProd(lpo);
    this.isSearch = false;
  }

  editarProductoC(p_d:any){//metodo para editar la lista de compras
    console.log('p_d',p_d);
    this.Lista_compras = this.Lista_compras.filter((item) => item.idProducto !== p_d.idProducto);//eliminamos el producto
    //consultamos la informacion para motrar el producto nuevamente
    this.getProd(p_d);

    //Calculo de subtotal y total de la compra
    this.compra.subtotal=this.compra.subtotal-(p_d.cantidad*p_d.precio);
    this.compra.total=this.compra.total-p_d.subtotal;
    console.log('Subtotal: ',this.compra.subtotal);
    console.log('Total: ',this.compra.total);

    this.isSearch = false;
  }  

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

}

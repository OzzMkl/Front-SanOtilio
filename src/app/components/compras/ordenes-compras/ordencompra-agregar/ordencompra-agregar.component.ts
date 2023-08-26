import { Component, OnInit } from '@angular/core';
//Servicios
import { global } from 'src/app/services/global';
import { MessageService } from 'primeng/api';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { RequisicionService } from 'src/app/services/requisicion.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { HttpClient} from '@angular/common/http';
import { Subscription } from 'rxjs';
//Modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';

//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//import { error } from 'console';
//pdf
//Router
import { Router } from '@angular/router';




@Component({
  selector: 'app-ordencompra-agregar',
  templateUrl: './ordencompra-agregar.component.html',
  styleUrls: ['./ordencompra-agregar.component.css'],
  providers:[ProveedorService,ProductoService, OrdendecompraService, EmpleadoService, MessageService]
})
export class OrdencompraAgregarComponent implements OnInit {
//cerrar modal
  closeResult = '';

  //Lista de requisiciones
  public requisiciones: Array<any> = [];
  //Paginacion en modalReq
  public totalPagesModR: any;
  public pathModR: any;
  public next_pageModR: any;
  public prev_pageModR: any;
  public itemsPerPageModR:number=0;
  pageActualModR: number = 0;  
  //Subscripciones
  private getReqSub : Subscription = new Subscription;
  public listaReq : Array<any> = [];



  public proveedoresLista:any;
  public proveedorVer:any;
  public orden_compra: Ordencompra;
  public producto_orden: Producto_orden;
  public Lista_compras: Array<Producto_orden>;
  public productos: any;
  public isSearch: boolean = true;
  public idUser:any;
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
/**Paginador lista de productos */
  public totalPages2: any;
  public path2: any;
  public next_page2: any;
  public prev_page2: any;
  public itemsPerPage2:number=0;
  pageActual2: number = 0;

  //spinner
  public isLoading:boolean = false;

//Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar : number = 0;
  //variables servicios
  public dato:any;
  public productoVer: any;
  public url:any;
  public identity: any;
  public ultimaOrden: any;
  public detailOrd: any;
  public productosdetailOrd: any;
  public medidasLista:any; //Lista de medidas de un producto en especifico
  //modelode bootstrap
  //modelode bootstrap
  model!: NgbDateStruct;
  //variable para el pdf
  public fecha : Date = new Date();
  //contadores para los text area
  conta: number =0;

  constructor( private _proveedorService: ProveedorService,
      private _http: HttpClient,
      private modalService: NgbModal,
      private _productoService: ProductoService,
      private messageService: MessageService,
      private _ordencompraService: OrdendecompraService,
      public _empleadoService : EmpleadoService,
      public _requisicionservice : RequisicionService,
      public _router: Router
    ) {
    this.orden_compra = new Ordencompra(0,null,0,'',null,0,1,null);
    this.producto_orden = new Producto_orden(0,0,0,0,'','','');
    this.Lista_compras = [];
    this.url = global.url;
    
   }

  ngOnInit(): void {
    this.getProvee();
    this.getAllProducts();
    this.loadUser(); 
    //this.createPDF();
    //this.getDetailsOrd();
  }
  
  //
  onChange(id:any){//evento que muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = 0;
  }
  capturar(datos:any){//Agregar a lista de compras
    if(this.producto_orden.cantidad <= 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con cantidad igual o menor a 0'});
    }else if(this.producto_orden.idProducto == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto no existe'});
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_orden.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto ya esta en la lista'});
    }else if(this.producto_orden.idProdMedida <= 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Falta ingresar medida'});
    }else{
      this.Lista_compras.push({...this.producto_orden});
      this.isSearch=true;
    }
    this.producto_orden.idProdMedida = 0;
    
    //console.log(this.Lista_compras);
  } 
  consultarProducto(event:any){//mostrar informacion del producto al dar enter
      //alert('you just pressed the enter key'+event);
      this.dato=event.target.value;
      //console.log(this.dato)
      this.getProd(this.dato);
      this.isSearch = false;
      //console.log(this.producto_orden);
  }
  consultarProductoModal(dato:any){
    this.getProd(dato);
    this.isSearch = false;
  }
  agregarOrdCompra(form:any){//Enviar Form insertar en DB
    this.orden_compra.idEmpleado = this.identity['sub'];//asginamos id de Empleado
    this.orden_compra.fecha = this.model.year+'-'+this.model.month+'-'+this.model.day;//concatenamos la fecha del datepicker
    console.log(this.orden_compra);
    if(this.Lista_compras.length == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se puede crear la orden de compra si no tiene productos'});
    }else{
      this._ordencompraService.registerOrdencompra(this.orden_compra).subscribe(
        response =>{
          console.log('response',response);
          if(response.status == 'Success!'){
           // console.log(response)       
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Orden de compra creada'});
             this._ordencompraService.registerProductosOrdenCompra(this.Lista_compras).subscribe(
               res =>{
                   //console.log(res);
                  this.messageService.add({severity:'success', summary:'Éxito', detail:'Productos agregados'});
                  //this.getDetailsOrd();
                  if(this.listaReq.length > 0){
                    this.updateidOrden();
                    //console.log(this.listaReq);
                  }else{
                    //console.log('listaReq vacía',this.listaReq);
                  }
                  this.createPDF(response.Ordencompra.idOrd);
               },error =>{
                 console.log(<any>error);
                this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al agregar los productos a la orden de compra'});
               });
          }else{
           console.log('fallo');  
           console.log(response);
          }
        },error =>{
         console.log(<any>error);
         this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al crear la orden de compra'});
        });
    }
  }
  //
  public createPDF($idOrd:number):void{
    this._ordencompraService.getPDF($idOrd, this.identity['sub']).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
    this._router.navigate(['./ordencompra-modulo/ordencompra-buscar']);


  }
  //Servicios
  getProvee(){
    this._proveedorService.getProveedoresSelect().subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedoresLista = response.provedores;
          console.log(response.provedores);
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
    //mostramos el spinner
    this.isLoading = true;

    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
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
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getProd(idProducto:any){
    this._productoService.getProdverDos(idProducto).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.producto_orden.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_orden.claveEx = this.productoVer[0]['claveEx'];
        this.producto_orden.idProducto = this.productoVer[0]['idProducto'];
        //this.producto_orden.nombreMedida = this.productoVer[0]['nombreMedida'];
        this.medidasLista = response.productos_medidas;
        console.log(this.productoVer);
        console.log(this.medidasLista);
        //Si el producto tiene una sola medida se asigna directo
        //if(this.medidasLista.length == 1){ this.producto_orden.idProdMedida = this.medidasLista[0].idProdMedida }
      },error => {
        console.log(error);
      }
    );
  }
  loadUser(){
    this.identity = this._empleadoService.getIdentity();
  }
  getDetailsOrd(){
    this._ordencompraService.getLastOrd().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ultimaOrden = response.ordencompra;
          this._ordencompraService.getDetailsOrdes(this.ultimaOrden['idOrd']).subscribe(
            response => {
              this.detailOrd = response.ordencompra;
              this.productosdetailOrd = response.productos;
              //this.createPDF();
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
  capturaNombreMedida(idProdMedida:any){
    console.log(idProdMedida);
    var pm = this.medidasLista.find((x:any) => x.idProdMedida == idProdMedida)!;
    this.producto_orden.nombreMedida = pm.nombreMedida;
    console.log(this.producto_orden.nombreMedida);
  }

  /**
  * 
  * @param descripcion 
  * Recibimos el evento del input
  * @description
  * Recibe los valores del Keyup, luego buscamos y actualizamos
  * los datos que se muestran en la tabla
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

 editarProductoO(p_d:any){//metodo para editar la lista de compras
  console.log('p_d',p_d);
  this.producto_orden.cantidad = p_d.cantidad;
  this.Lista_compras = this.Lista_compras.filter((item) => item.idProducto !== p_d.idProducto);//eliminamos el producto
  //consultamos la informacion para motrar el producto nuevamente
  this.getProd(p_d.idProducto);



  this.isSearch = false;
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

  //Modal Requisiciones
    // Modal
    open2(content2:any) {
      this.getRequisiciones();
      this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }

    getRequisiciones(){
      //mostramos el spinner
      this.isLoading = true;
  
  
      this.getReqSub = this._requisicionservice.getReq().subscribe(
        response =>{
          if(response.status == 'success'){
  
             this.requisiciones = response.requisicion.data;
             console.log('getReq',response.requisicion.data);
             //navegacion de paginacion
             this.totalPagesModR = response.requisicion.last_page;
             this.itemsPerPageModR = response.requisicion.per_page;
             this.pageActualModR = response.requisicion.current_page;
             this.next_pageModR = response.requisicion.next_page_url;
             this.pathModR = response.requisicion.path;
  
            //una vez terminado quitamos el spinner
            this.isLoading=false;
          }
        },
        error =>{
          console.log(error);
        }
      );
    }

    getPageModR(page:number) {
      //iniciamos spinner
      this.isLoading = true;
  
      this._http.get(this.path+'?page='+page).subscribe(
        (response:any) => {
          
          //asignamos datos a varibale para poder mostrarla en la tabla
          this.requisiciones = response.requisicion.data;
          console.log('getReq',response.requisicion.data);
          //navegacion de paginacion
          this.totalPagesModR = response.requisicion.last_page;
          this.itemsPerPageModR = response.requisicion.per_page;
          this.pageActualModR = response.requisicion.current_page;
          this.next_pageModR = response.requisicion.next_page_url;
          this.pathModR = response.requisicion.path;
  
          //una vez terminado quitamos el spinner
          this.isLoading=false;        
      })
    }

    agregarReq(idReq:number){
      if(this.listaReq.find( x => x == idReq)){
        this.listaReq =  this.listaReq.filter((x) => x != idReq);
        this.messageService.add({severity:'error', summary:'Alerta', detail:'Requisicion eliminada de la lista'});
      }else{
        this.listaReq.push(idReq);
        this.messageService.add({severity:'success', summary:'Éxito', detail:'Requisicion agregada a la lista'});

      }
      //console.log(this.listaReq);
    }
    estaPintada(idReq:number):boolean{
      return this.listaReq.includes(idReq);
    }

    generarOrden(){
      this.modalService.dismissAll();
      console.log(this.listaReq);
      this._requisicionservice.generarOrden(this.listaReq).subscribe(
        response =>{
          if(response.status == 'success'){
            this.Lista_compras = response.ListaCompras;
            //console.log(response.ListaCompras);

            //  this.requisiciones = response.requisicion.data;
            //  console.log('getReq',response.requisicion.data);
            //  //navegacion de paginacion
            //  this.totalPagesModR = response.requisicion.last_page;
            //  this.itemsPerPageModR = response.requisicion.per_page;
            //  this.pageActualModR = response.requisicion.current_page;
            //  this.next_pageModR = response.requisicion.next_page_url;
            //  this.pathModR = response.requisicion.path;
  
            //una vez terminado quitamos el spinner
            this.isLoading=false;
          }
        },
        error =>{
          console.log(error);
        }
      );


      



      
    }

    updateidOrden(){
      this._requisicionservice.updateidOrden(this.listaReq).subscribe(
        resp =>{
          if(resp.status == 'success'){
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Requisiciones actualizadas exitosamente'});
            console.log(resp);
          }
        },
        error =>{
          this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al actualizar los idOrd de las requisiciones'});
          console.log(error);
        }
      )
    }


}
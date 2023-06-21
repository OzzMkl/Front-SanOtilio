import { Component, OnInit } from '@angular/core';
//Servicios
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { RequisicionService } from 'src/app/services/requisicion.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { HttpClient} from '@angular/common/http';
//Modelos
import { Requisicion } from 'src/app/models/requisicion';
import { Producto_requisicion } from 'src/app/models/producto_requisicion';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//Router
import { Router } from '@angular/router';


@Component({
  selector: 'app-requisicion-agregar',
  templateUrl: './requisicion-agregar.component.html',
  styleUrls: ['./requisicion-agregar.component.css'],
  providers:[ProductoService, RequisicionService, EmpleadoService]
})
export class RequisicionAgregarComponent implements OnInit {

  //Datos de la requisicion
  public requisicion: Requisicion;
  public producto_requisicion: Producto_requisicion;
  public Lista_compras: Array<Producto_requisicion>;
  public productos: any;

  //Usuario
  public idUser:any;

  // Habilitar / Deshabilitar botón de agregar
  public isSearch: boolean = true;

  //Modal
  //Cerrar modal
  closeResult = ''; 
  //Paginacion en modal
  public totalPagesMod: any;
  public pathMod: any;
  public next_pageMod: any;
  public prev_pageMod: any;
  public itemsPerPageMod:number=0;
  pageActualMod: number = 0;  
  //spinner
  public isLoading:boolean = false;
  //Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar : number = 0;

  //Paginacion lista de compras
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;

  //variables servicios
  public dato:any;
  public productoVer: any;
  public url:any;
  public identity: any;
  public ultimaReq: any;
  public detailReq: any;
  public productosdetailReq: any;
  public medidasLista:any; //Lista de medidas de un producto en especifico

  //contador para el text area
  conta: number =0;

  constructor(
    private _http: HttpClient,
    private modalService: NgbModal,
    private _productoService: ProductoService,
    public toastService: ToastService,
    private _requisicionservice: RequisicionService,
    public _empleadoService : EmpleadoService,
    public _router: Router
    ) {
      this.requisicion = new Requisicion(0,'',0,0,29,null);
      this.producto_requisicion = new Producto_requisicion(0,0,0,0,0,null,'','','');
      this.Lista_compras = [];
      this.url = global.url;
    }

  ngOnInit(): void {
    this.getAllProducts();
    this.loadUser(); 
  }

  /**
   * @description
   * Obtenemos la lista de productos al iniciar el componente
   */
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

  /**
   * @description
   * Cargar los datos del usuario al iniciar el componente
   */
  loadUser(){
    this.identity = this._empleadoService.getIdentity();
  }





  //Formulario 


 /**
  * @param idProducto
  * Recibimos el id del producto
  * @description
  * Trae la informacion de uin producto en especifico
  */
  getProd(idProducto:any){
    this._productoService.getProdverDos(idProducto).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.producto_requisicion.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_requisicion.claveEx = this.productoVer[0]['claveEx'];
        this.producto_requisicion.idProducto = this.productoVer[0]['idProducto'];
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

  capturaNombreMedida(idProdMedida:any){
    console.log(idProdMedida);
    var pm = this.medidasLista.find((x:any) => x.idProdMedida == idProdMedida)!;
    this.producto_requisicion.nombreMedida = pm.nombreMedida;
    console.log(this.producto_requisicion.nombreMedida);
  }

  /**
  * @param datos
  * Recibimos la informacion del producto
  * @description
  * Agrega el producto a la lista de compras
  */
  capturar(datos:any){ 
    if(this.producto_requisicion.cantidad <= 0){
      // this.toastService.show('No se pueden agregar productos con cantidad 0 ó menor a 0',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.producto_requisicion.idProducto == 0){
      // this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000});
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_requisicion.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      // this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000});
    }else if(this.producto_requisicion.idProdMedida <= 0){
      // this.toastService.show('Falta ingresar medida',{classname: 'bg-danger text-light', delay: 6000});
    }else{
      this.Lista_compras.push({...this.producto_requisicion});
      this.isSearch=true;
    }
    this.producto_requisicion.idProdMedida = 0;
    //console.log(this.Lista_compras);
  }

  getDetailsReq(){
    this._requisicionservice.getLastReq().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ultimaReq = response.requisicion;
          console.log('ultima requisicion', this.ultimaReq);
          this._requisicionservice.getDetailsReq(this.ultimaReq['idReq']).subscribe(
            response => {
              this.detailReq = response.requisicion;
              console.log('detailReq',this.detailReq);
              this.productosdetailReq = response.productos;
              console.log('productosdetailReq',this.productosdetailReq);
              this.generaPDF(this.detailReq[0]['idReq']);
              this._router.navigate(['./requisicion-modulo/requisicion-buscar']);
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


  agregarRequisicion(form:any){//Enviar Form insertar en DB
    this.requisicion.idEmpleado = this.identity['sub'];//asginamos id de Empleado
    console.log('Requisicion',this.requisicion);
    if(this.Lista_compras.length == 0){
      // this.toastService.show('No se puede crear Orden de compra si no tiene productos',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this._requisicionservice.registerRequisicion(this.requisicion).subscribe(
        response =>{
          if(response.status == 'Success!'){
           // console.log(response)       
           //   this.toastService.show(' ⚠ Orden creada', { classname: 'bg-warning  text-bold', delay: 5000 });
             this._requisicionservice.registerProductosRequisicion(this.Lista_compras).subscribe(
               res =>{
                   //console.log(res);
                  //  this.toastService.show(' ⚠ Requisicion creada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                   this.getDetailsReq();
                   //this.createPDF();
               },error =>{
                 console.log(<any>error);
                //  this.toastService.show('Ups... Fallo al agregar los productos a la requisicion', { classname: 'bg-danger text-light', delay: 15000 });
               });
          }else{
           console.log('fallo');  
           console.log(response);
          }
        },error =>{
         console.log(<any>error);
        //  this.toastService.show('Ups... Fallo al crear la requisicion', { classname: 'bg-danger text-light', delay: 15000 });
        });
    }
  }

  editarProductoO(p_d:any){//metodo para editar la lista de compras
    console.log('p_d',p_d);
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
  
  consultarProducto(event:any){//mostrar informacion del producto al dar enter
    //alert('you just pressed the enter key'+event);
    this.dato=event.target.value;
    //console.log(this.dato)
    this.getProd(this.dato);
    this.isSearch = false;
    //console.log(this.producto_orden);
  }

  generaPDF(idReq:number){
    this._requisicionservice.getPDF(idReq).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
  }




  //Modal

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
        this.totalPagesMod = response.productos.total;
        this.itemsPerPageMod = response.productos.per_page;
        this.pageActualMod = response.productos.current_page;
        this.next_pageMod = response.productos.next_page_url;
        this.pathMod = response.productos.path;

        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }

  /**
  * @param e 
  * Recibimos el evento del input
  * @description
  * Detecta cambios en el select y limpia los input del modal
  */
  cambioSeleccionado(e:any){
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = 0;
  }

    /**
  * @param dato
  * Recibimos el id del producto
  * @description
  * Envia el id de un producto al metodo getProd para consultarlo
  * y deshabilita el boton de agregar
  */
  consultarProductoModal(dato:any){
    this.getProd(dato);
    this.isSearch = false;
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
  

}

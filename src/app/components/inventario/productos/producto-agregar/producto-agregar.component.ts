/**
 *  @fileoverview Logica del componente producto-buscar
 *                muestra campo para buscar productos
 *                muestra tabla con los productos paginados
 * 
 *  @version 1.0
 * 
 *  @autor Oziel pacheco<ozielpacheco.m@gmail.com>
 *  @copyright Materiales San Otilio
 * 
 *  @History
 * 
 *  -Primera version escrita por Oziel Pacheco
 * 
 */
import { Component, OnInit } from '@angular/core';
import { global } from 'src/app/services/global';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

/*****SERVICIOS*/
import { MedidaService } from 'src/app/services/medida.service';
import { MarcaService } from 'src/app/services/marca.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SubCategoriaService } from 'src/app/services/subcategoria.service';
import { AlmacenService } from 'src/app/services/almacen.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ToastService } from 'src/app/services/toast.service';
/*NGBOOTSTRAP */
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
/*MODELOS */
import { Producto} from 'src/app/models/producto';
import { Producto_precio } from 'src/app/models/producto_precio';


@Component({
  selector: 'app-producto-agregar',
  templateUrl: './producto-agregar.component.html',
  styleUrls: ['./producto-agregar.component.css'],
  providers: [MedidaService, MarcaService,DepartamentoService,
  CategoriaService, SubCategoriaService, AlmacenService,
  ProductoService]
})
export class ProductoAgregarComponent implements OnInit {
  
  //variables para cargar informacion en los select
  public medidas: Array<any> = [];
  public marca: Array<any> = [];
  public departamentos: Array<any> = [];
  public categoria: Array<any> = [];
  //  public subcategoria: Array<any> = [];
  public almacenes: Array<any> = [];
  public productos: Array<any> = [];//getProd
  public producto: Producto;
  public producto_precio : Producto_precio;
  public pd: any;//getLP
  public url: string = global.url;
  //contadores para los text area
  conta: number =0;
  contaUbi: number =0;
  //spinner
  public isLoading: boolean = false;
  //PAGINATOR
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //CERRAR MODAL
  public closeResult: string = '';
  //variables para busqueda en modal
  searchProducto='';
  searchProductoCodbar=0;
  searchProductoDescrip='';
  public tipoBusqueda: number = 1;
  //mostrar clave externa en el input
  public muestraClaveEx: string = '';
  //boleanos
  hasTax: boolean = false
  invoice: boolean = false
  precio1: boolean = false
  precio2: boolean = false
  precio3: boolean = false
  precio4: boolean = false
  precio5: boolean = false
  selectImpuesto: string = ''

  pCompraImp: number = 0 //precioCompraImpuesto

  //configurador para la carga de imagen
  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg",
    maxSize: .5,
    uploadAPI: {
      url: global.url+'productos/uploadimage',
    },
    theme: "attachPin", 
    hideProgressBar: false,
    hideResetBtn: false,
    hideSelectBtn:false,
    replaceTexts:{
      attachPinBtn: 'Subir imagen ..'
    }
  };

  constructor(
    private _productoService: ProductoService,
    private _medidaService: MedidaService,
    private _marcaService: MarcaService,
    private _departamentosService: DepartamentoService,
    private _categoriaService: CategoriaService,
    private _almacenService: AlmacenService,
    private modalService: NgbModal,
    public toastService: ToastService,
    private _router: Router,
    private _http: HttpClient

  ) {
    this.producto = new Producto(0,0,0,0,0,null,'',0,'',0,0,'',1,'','',null,0,null,0,0);
    this.producto_precio = new Producto_precio(0,0,0,0,0,0,0,0,0,0,0,0);
    this.pd=[];
   }

  ngOnInit(): void {
    this.getMedida();
    this.getMarca();
    this.getDepartamentos();
    this.getCategoria();
    // this.getSubcategoria();
    this.getAlmacen();
    this.getLP();
    this.getProd();
  }
  /**
   * Omite el salto de linea del textarea de descripcion
   * cuenta el numero de caracteres insertados
   * @param event 
   * omitimos los eventes de "enter" y "shift + enter"
   */
  omitirEnter(event:any){
    this.conta = event.target.value.length;
    if(event.which === 13 || event.shiftKey){
      event.preventDefault();
      //console.log('prevented');
    }
  }

  /**
   * Omite el salto de linea del textarea de ubicacion
   * cuenta el numero de caracteres insertados
   * @param event 
   * omitimos los eventes de "enter" y "shift + enter"
   */
  omitirEnterUbicacion(event:any){
    this.contaUbi = event.target.value.length;
    if(event.which === 13 || event.shiftKey){
      event.preventDefault();
      //console.log('prevented');  
    }
  }

  submit(form:any){
    this.getLP();
    //console.log(this.pd.cbarras+1);
     this.producto.cbarras =  parseInt(this.pd.cbarras) + 1;
     //this.producto.cbarras =  parseInt(this.pd.cbarras) + 1;
    this._productoService.registerProducto(this.producto).subscribe(
      response =>{
        //console.log(response);
        this._router.navigate(['./producto-modulo/producto-buscar']);
        this.toastService.show('Producto guardado correctamente', { classname: 'bg-success text-light', delay: 5000 });
      },
      error =>{
        //console.log(this.producto);
        console.log(<any>error);
        this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
      }
    )
  }

  /**
     * Trae todos los productos con su paginacion
     * para mostrar en la tabla
     */
  getProd(){

    //mostramos el spinner
    this.isLoading = true;

    //ejecutamos el servicio
    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){

          //asignamos a varibale para mostrar
          this.productos = response.productos.data;
          //console.log(this.productos)

          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          this.next_page = response.productos.next_page_url;
          this.path = response.productos.path
          
          //una vez terminado de cargar quitamos el spinner
          this.isLoading = false;
        }
      },
      error =>{
        console.log(error);
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
  getPage(page:number) { 
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
          
      })
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
        this.getProd();
      }
      //componemos la palabra
      this.searchProducto = claveExterna.target.value;
  
      //generamos consulta
      this._productoService.searchClaveExterna(this.searchProducto).subscribe(
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
        this.getProd();
      }
  
      //componemos el codigo a buscar
      this.searchProductoCodbar = codbar.target.value;
  
      //llamamos al servicio
      this._productoService.searchCodbar(this.searchProductoCodbar).subscribe(
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
        this.getProd();
      }
  
      //componemos el codigo a buscar
      this.searchProductoDescrip = descripcion.target.value;
  
      //llamamos al servicio
      this._productoService.searchDescripcion(this.searchProductoDescrip).subscribe(
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
   * El idProducto que se trae se asigna a la propieda del
   * producto.idProductoS y claveEx se asigna a una variable
   * para mostrarla en el formulario
   * @param idProducto 
   * @param claveEx 
   */
  seleccionaidProductoSiguiente(idProducto:number,claveEx: string){
    this.muestraClaveEx = claveEx;
    this.producto.idProductoS = idProducto;
  }

  /**
   * Asigna el nombre de la imagen cargada a la propiedad de
   * producto.imagen
   * @param datos 
   */
  productImage(datos:any){
    //console.log(datos.body.image);
    this.producto.imagen = datos.body.image;
  }

  /**
   * Obtenemos la informacion del ultimo producto agregado
   * con la finalidad de obtener su codigo de barras 
   * y asi sumarle +1 para crear el siguiente codbar
   */
  getLP(){
    this._productoService.getLastPro().subscribe(
       response =>{
         if(response.status == 'success'){
           this.pd = response.productos;

         }
       },
       error =>{
         console.log(error);
       }
     );
  }

  /**
   * Revisamos el modelo hasTax si es falso verdarero
   * segun su valor llamamos la funcion de calcularImpuesto()
   * o reseteamos los valores a por defecto
   * @param e 
   * recive el evento
   */
  tieneImpuesto(e:any){
    if(this.hasTax){
      this.calcularImpuesto();
    } else {
      this.pCompraImp = 0;
      this.selectImpuesto =''
    }
  }

  /**
   * Deacuerdo a lo que reciba la variable selectImpuesto
   * se realiza el calculo y se asigna a la variable pCompraImp
   * pCompraImp es "precioCompra sin Impuesto" 
   */
  calcularImpuesto(){
    
      switch (this.selectImpuesto){
        case "IVA" : { 
                        console.log( this.producto_precio.preciocompra / 1.16 )
                        this.pCompraImp = this.producto_precio.preciocompra / 1.16;
                        break; 
                      } 
        case "IEPS" : { 
                        console.log(this.producto_precio.preciocompra / 1.09) 
                        this.pCompraImp = this.producto_precio.preciocompra / 1.09;
                        break; 
                      }   
      }
    
    
    
  }

  /**
   * Revisa los precios ingresados desde precio5 a precio1
   * y manda una alerta si el precio ingresado es menor al anterior
   * @param e 
   * Recibimos evento de un (change)
   */
  revisaPreciosventa(e:any){
    /**
     * Tomamos del evento change el id del input modificado
     */
    let inputId = e.target.id;

    switch (inputId) {
        case "monto5": {
          
            /**
             * Comparamos el precio ingresdo con el precio anterior
             * en este caso precio compra y si es menor mandamos una alerta
             */
            if(this.producto_precio.precio5 < this.producto_precio.preciocompra){
              this.toastService.show('El precio 5 no pueder ser menor al precio de compra', { classname: 'bg-danger text-light', delay: 1500 });
            }
            break;
        }

        case "monto4": {

            if(this.producto_precio.precio4 < this.producto_precio.precio5){
              this.toastService.show('El precio 4 no pueder ser menor que el precio 5', { classname: 'bg-danger text-light', delay: 1500 });
            }
            break;
        }

        case "monto3": {

          if(this.producto_precio.precio3 < this.producto_precio.precio4){
            this.toastService.show('El precio 3 no pueder ser menor que el precio 4', { classname: 'bg-danger text-light', delay: 1500 });
          }
          break;

        }
        case "monto2": {

          if(this.producto_precio.precio2 < this.producto_precio.precio3){
            this.toastService.show('El precio 2 no pueder ser menor que el precio 3', { classname: 'bg-danger text-light', delay: 1500 });
          }
          break;

        }
        case "monto1": {

          if(this.producto_precio.precio1 < this.producto_precio.precio2){
            this.toastService.show('El precio 1 no pueder ser menor que el precio 2', { classname: 'bg-danger text-light', delay: 1500 });
          }
          break;
        }
    }
  }

  /**
   * Calcula el porcentaje entre 2 precios del apartado 
   * PRECIOS VENTA
   * @param e 
   * Recibimos el evento (keyup) y accedemos a sus propiedades
   * para extraer el id y saber que input modificamos
   */
  calculaPorcentaje(e:any){

    let inputId = e.target.id;

    /**
     * De acuerdo al valor obtenido del input, ingresamos
     * al caso correspondiente
     */
    switch (inputId){
        case "monto5" : {
              /**
               * Realizamos el calculo del porcentaje : le restamos al precio nuevo (precio5) el precio anterior (precio compra)
               * y el resultado lo dividimos entre el precio  anterior (precio compra)
               * Por ultimo lo multiplicamos por 100
               */
              this.producto_precio.porcentaje5 = ((this.producto_precio.precio5 - this.producto_precio.preciocompra) / this.producto_precio.preciocompra) * 100 ;
              //Redondeamos el resultado a 2 decimales
              this.producto_precio.porcentaje5 = Math.round((this.producto_precio.porcentaje5 + Number.EPSILON) * 100 ) / 100 ;
              break;
        }
        case "monto4" : {
              this.producto_precio.porcentaje4 = ((this.producto_precio.precio4 - this.producto_precio.preciocompra) / this.producto_precio.preciocompra) * 100 ;
              
              this.producto_precio.porcentaje4 = Math.round((this.producto_precio.porcentaje4 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
        case "monto3" : {
              this.producto_precio.porcentaje3 = ((this.producto_precio.precio3 - this.producto_precio.preciocompra) / this.producto_precio.preciocompra) * 100 ;
              
              this.producto_precio.porcentaje3 = Math.round((this.producto_precio.porcentaje3 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
        case "monto2" : {
              this.producto_precio.porcentaje2 = ((this.producto_precio.precio2 - this.producto_precio.preciocompra) / this.producto_precio.preciocompra) * 100 ;
              
              this.producto_precio.porcentaje2 = Math.round((this.producto_precio.porcentaje2 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
        case "monto1" : {
              this.producto_precio.porcentaje1 = ((this.producto_precio.precio1 - this.producto_precio.preciocompra) / this.producto_precio.preciocompra) * 100 ;
              
              this.producto_precio.porcentaje1 = Math.round((this.producto_precio.porcentaje1 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
    }
  }

  /**
   * Calcula el monto (precioX) de acuerdo
   * al porcentaje ingresado
   * @param e 
   * Recibimos el evento de un (keyup)
   */
  calculaMonto(e:any){
    let inputId = e.target.id
    /**
    * Obtenemos el valor del input y lo convertimos a Float
    * luego lo dividimos entre 100 para obtener su porcentaje
    */
    var inputValue  = parseFloat((<HTMLInputElement>document.getElementById(inputId)).value) / 100;

    /**
     * revisamos que el porcentaje no sea menor o igual a cero
     * Si es asi mandamos una alerta
     */
    if(inputValue <= 0){

      this.toastService.show('No puedes ingresar porcentajes negativos ', { classname: 'bg-danger text-light', delay: 1500 });

    } else{

      switch (inputId){
        case "porcentaje5" : {
              /**
               * Multiplicamos el precio compra por 1. y el valor del inputValue
               * ejem: inputValue = 3    la operacion seria   preciocompra * 1.03
               */
              this.producto_precio.precio5 =  this.producto_precio.preciocompra * (1+inputValue);
              //Redondeamos el resultado a 2 decimales
              this.producto_precio.precio5 = Math.round((this.producto_precio.precio5 + Number.EPSILON) * 100 ) / 100;
  
              break;
        }

        case "porcentaje4" : {
              
              this.producto_precio.precio4 =  this.producto_precio.preciocompra * (1+inputValue);
              this.producto_precio.precio4 = Math.round((this.producto_precio.precio4 + Number.EPSILON) * 100 ) / 100;
          break;
        }

        case "porcentaje3" : {
              this.producto_precio.precio3 =  this.producto_precio.preciocompra * (1+inputValue);
              this.producto_precio.precio3 = Math.round((this.producto_precio.precio3 + Number.EPSILON) * 100 ) / 100;
          break;
        }

        case "porcentaje2" : {
              this.producto_precio.precio2 =  this.producto_precio.preciocompra * (1+inputValue);
              this.producto_precio.precio2 = Math.round((this.producto_precio.precio2 + Number.EPSILON) * 100 ) / 100;
          break;
        }

        case "porcentaje1" : {
              this.producto_precio.precio1 =  this.producto_precio.preciocompra * (1+inputValue);
              this.producto_precio.precio1 = Math.round((this.producto_precio.precio1 + Number.EPSILON) * 100 ) / 100;
          break;
        }

      }//fin switch
    }//fin else
  }//fin calculaMonto()

  revisaCheckventa(e:any){
    console.log(e)
  }

  /*    SERVICIOS 
   * Todos estos metodos traen la informacion de su nombre
   * ejemplo getMedida() trae las medidas que se muestran
   * en el select del html
   */
  getMedida(){
    this._medidaService.getMedidas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.medidas = response.medidas;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getMarca(){
    this._marcaService.getMarcas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.marca = response.marca;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getDepartamentos(){
    this._departamentosService.getDepartamentos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.departamentos = response.departamentos;
          
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getCategoria(){
    this._categoriaService.getCategorias().subscribe(
      response =>{
        if(response.status == 'success'){
          this.categoria = response.categoria;
          
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getAlmacen(){
    this._almacenService.getAlmacenes().subscribe(
      response =>{
        if(response.status == 'success'){
          this.almacenes = response.almacenes;
         
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  //MODAL
  // Metodos del  modal
  open(content:any) {//abrir modal
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
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

}



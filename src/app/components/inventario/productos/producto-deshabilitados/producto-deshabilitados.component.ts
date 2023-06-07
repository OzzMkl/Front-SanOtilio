/**
 *  @fileoverview Logica del componente producto-deshabilitados
 *                muestra tabla con los productos deshabilitados
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
import { ProductoService } from 'src/app/services/producto.service';
import { HttpClient} from '@angular/common/http';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-producto-deshabilitados',
  templateUrl: './producto-deshabilitados.component.html',
  styleUrls: ['./producto-deshabilitados.component.css'],
  providers: [ProductoService]
})
export class ProductoDeshabilitadosComponent implements OnInit {

  public url:string = global.url;
  public productos: Array<any> = [];
  public productosMedida: Array<any> = [];
  public existenciasPorMed: Array<any> = [];
  public imagenPM: string = '';
  public claveExt: string ='';
  public isShow: boolean = false;
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //
  searchProducto='';
  searchProductoCodbar=0;
  searchProductoDescrip='';
  public tipoBusqueda: number = 1;

  //spinner
  public isLoading:boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getProd();
  }

  /**
   * Trae todos los productos con su paginacion
   * para mostrar en la tabla
   */
  getProd(){

    //mostramos el spinner
    this.isLoading = true;

    //Ejecutamos el servicio
    this._productoService.getProductosDes().subscribe(
      response =>{
        if(response.status == 'success'){
          //console.log(response);
          //asignamos la respues a la variable a mostrar
          this.productos = response.productos.data;

          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          this.next_page = response.productos.next_page_url;
          this.path = response.productos.path;
          
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
  * Recinimos el id y lo buscamos en el sewrvicio
  * @param idProducto
  * 
  * retornamos la consulta con las medias e imagen del producto
  */
   mostrarPrecios(idProducto:number,claveEx:string){
     this._productoService.searchProductoMedidaI(idProducto).subscribe(
       response =>{
         //console.log(response)
         if(response.status == 'success'){
          this.claveExt = response.Producto_cl;
          this.productosMedida = response.productoMedida;
          this.existenciasPorMed = response.existencia_por_med;
          this.imagenPM = response.imagen;
          if(this.imagenPM == "" || this.imagenPM == null){
            this.imagenPM = "1650558444no-image.png";
          }
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
    this.isLoading = true;
    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        //console.log(response);
        this.productos = response.productos.data;
        //navegacion paginacion
        this.totalPages = response.productos.total;
        this.itemsPerPage = response.productos.per_page;
        this.pageActual = response.productos.current_page;
        this.next_page = response.productos.next_page_url;
        this.path = response.productos.path;
        
        this.isLoading = false;
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
    if(claveExterna.target.value == '' || claveExterna.target.value == null){
      this.getProd();
    } else{
      //componemos la palabra
    this.searchProducto = claveExterna.target.value;

    //generamos consulta
    this._productoService.searchClaveExternaInactivos(this.searchProducto).subscribe(
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
            this.path = response.productos.path;
            
            //una ves terminado de cargar quitamos el spinner
            this.isLoading = false;
        }
      }, error =>{
          console.log(error);
      });
    }
    
  }

  /**
   * 
   * @param codbar 
   * Recibimos el evento del input
   * @description
   * Recibe los valores del evento keyup, luego busca y actualiza
   * los datos que se muestran en la tabla
   */
   getSearchCodbarI(codbar:any){

    //mostramos el spinner
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion que trae todo
    if(codbar.target.value == '' || codbar.target.value == null){
      this.getProd();
    } else{
      
    //componemos el codigo a buscar
    this.searchProductoCodbar = codbar.target.value;

    //llamamos al servicio
    this._productoService.searchCodbarI(this.searchProductoCodbar).subscribe(
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
            this.path = response.productos.path;
            
            //una ves terminado de cargar quitamos el spinner
            this.isLoading = false;
          }
      }, error => {
        console.log(error);
      });
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
  getSearchDescripcionI(descripcion:any){
    
    //mostramos el spinner
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion que trae todo
    if(descripcion.target.value == '' || descripcion.target.value == null){
      this.getProd();
    } else{
      //componemos el codigo a buscar
    this.searchProductoDescrip = descripcion.target.value;

    //llamamos al servicio
    this._productoService.searchDescripcionI(this.searchProductoDescrip).subscribe(
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
            this.path = response.productos.path;
            
            //una ves terminado de cargar quitamos el spinner
            this.isLoading = false;
          }
      }, error => {
        console.log(error);
      });
    }
  }

}

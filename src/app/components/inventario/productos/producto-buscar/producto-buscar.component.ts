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
import { ProductoService } from 'src/app/services/producto.service';
import { HttpClient} from '@angular/common/http';
import { global } from 'src/app/services/global';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css'],
  providers: [ProductoService, EmpleadoService, MessageService]
})
export class ProductoBuscarComponent implements OnInit {
  
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
  search='';
  public tipoBusqueda: string = "uno";
  //spinner
  public isLoading:boolean = false;
  //PERMISOS
  public userPermisos:any = [];
  public mInv = this._modulosService.modsInventario();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;

  constructor(
    private _productoService: ProductoService,
    private _empleadoService:EmpleadoService,
    private messageService: MessageService,
    private _modulosService: ModulosService,
    private _router: Router,
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  /**
   * Funcion que carga los permisos
   */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mInv.idModulo, this.mInv.idSubModulo);
        //revisamos si el permiso del modulo esta activo si no redireccionamos
        if( this.userPermisos.ver != 1 ){
          this.timerId = setInterval(()=>{
            this.counter--;
            if(this.counter === 0){
              clearInterval(this.timerId);
              this._router.navigate(['./']);
            }
            this.messageService.add({severity:'error', summary:'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'});
          },1000);
        } else{
          this.getProd();
        }
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
   * Recinimos el id y lo buscamos en el sewrvicio
   * @param idProducto
   * 
   * retornamos la consulta con las medias e imagen del producto
   */
  mostrarPrecios(idProducto:number){
    
    this._productoService.searchProductoMedida(idProducto).subscribe(
      response =>{
        if(response.status == 'success'){
          this.claveExt = response.Producto_cl;
          this.productosMedida = response.productoMedida;
          this.existenciasPorMed = response.existencia_por_med;
          this.imagenPM = response.imagen;
          if(this.imagenPM == "" || this.imagenPM == null){
            this.imagenPM = "1650558444no-image.png";
          }
        } else{

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
    //mostramos el spinner
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
        this.path = response.productos.path
        
        //una vez terminado de cargar quitamos el spinner
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
  getSearch(claveExterna:string){
    //mostramos el spinner 
    this.isLoading = true;

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
  getSearchCodbar(codbar:number){
    //mostramos el spinner
    this.isLoading = true;

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
  getSearchDescripcion(descripcion:string){
    //mostramos el spinner
    this.isLoading = true;
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
            this.isLoading = false;
          }
      }, error => {
        console.log(error)
      }
    )
  }

  /**
   * @description
   * Obtiene la informacion del input y busca
   */
  selectBusqueda(){
    
     if(this.search == "" || null){
      
       this.getProd();
    } else{
      
      switch(this.tipoBusqueda){
        case "uno":
            this.getSearch(this.search);
          break;
        case "dos":
            this.getSearchCodbar(parseInt(this.search));
          break;
        case "tres":
            this.getSearchDescripcion(this.search);
          break;
        default:
          console.log('default tp'+this.tipoBusqueda)
           break;
       }
     }//finelse
     
  }//finFunction
}

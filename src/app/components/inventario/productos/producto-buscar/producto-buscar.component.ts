/**
 *  @fileoverview Logica del componente producto-buscar
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

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css'],
  providers: [ProductoService]
})
export class ProductoBuscarComponent implements OnInit {
  
  public url:string = global.url;
  public productos: Array<any> = [];
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  searchProducto='';

  //spinner
  public isLoading:boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _router: Router,
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
   * @param id 
   * Es el id del producto a buscar
   * @description
   * Redireccionamos al componente producto-ver y mostramos
   *  los detalles del producto
   */
  selected(id:number){
    this._router.navigate(['./producto-modulo/producto-ver/'+id]);
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

}

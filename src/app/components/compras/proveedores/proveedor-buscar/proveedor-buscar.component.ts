/**
 *  @fileoverview Logica del componente proveedor-buscar
 *                muestra campo para buscar proveedores
 *                muestra tabla con los proveedores habilitados paginados
 * 
 *  @version 1.0
 * 
 *  @autor Oziel pacheco<ozielpacheco.m@gmail.com>
 *  @copyright Materiales San Otilio
 * 
 *  @History
 * 
 *  -Primera version escrita por Oziel Pacheco
 *  -Se agrega la paginacion (Oziel - 23-02-2022)
 * 
 */
import { Component, OnInit } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Router} from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-proveedor-buscar',
  templateUrl: './proveedor-buscar.component.html',
  styleUrls: ['./proveedor-buscar.component.css'],
  providers: [ProveedorService]
})
export class ProveedorBuscarComponent implements OnInit {
 
  //Variable donde almacenaremos la data del api
  public proveedores: Array<any> = [];
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  public tipoBusqueda: number = 1;
  //Spinner
  public isLoading: boolean = false;
  //subscription
  private getProveedorSub : Subscription = new Subscription;

  constructor(
    private _proveedorService: ProveedorService,
    private _router: Router,
    private _http: HttpClient ) { }

  ngOnInit(): void {
    this.getProve();
  }

  /**
   * Lista de proveedores habilidatos
   */
  getProve(){
    //mostramos el spinner
    this.isLoading = true;
    //ejecutamas servicio
    this.getProveedorSub = this._proveedorService.getProveedores().subscribe(
      response =>{
        if(response.status == 'success'){

          //asignamos a varibale para mostrar
          this.proveedores = response.proveedores.data;

          //navegacion paginacion
          this.totalPages = response.proveedores.total;
          this.itemsPerPage = response.proveedores.per_page;
          this.pageActual = response.proveedores.current_page;
          this.next_page = response.proveedores.next_page_url;
          this.path = response.proveedores.path
          
          //una vez terminado de cargar quitamos el spinner
          this.isLoading = false;
          
          //console.log(response.proveedores);
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
  getPage(page:number){
    //iniciamos spinner
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        //asignamos a varibale para mostrar
        this.proveedores = response.proveedores.data;

        //navegacion paginacion
        this.totalPages = response.proveedores.total;
        this.itemsPerPage = response.proveedores.per_page;
        this.pageActual = response.proveedores.current_page;
        this.next_page = response.proveedores.next_page_url;
        this.path = response.proveedores.path
        
        //una vez terminado de cargar quitamos el spinner
        this.isLoading = false;
        
    })
  }

  selected(idProveedor:any){
    let id = idProveedor;
    this._router.navigate(['./proveedor-modulo/proveedorVer/'+id]);
  }
  /**
   * Destruye las subscripciones a los observables
   */
  ngOnDestroy(): void {
    this.getProveedorSub.unsubscribe();
  }
  /**
   * 
   * @param nombreProveedor 
   * Recibimos el evento del input
   * @description
   * Recibe los valores del evento (keyup), luego busca y actualiza
   * 
   */
  getSearchNombreProv(nombreProveedor:any){
     //mostramos el spinner
     this.isLoading = true;
     let nomProv = nombreProveedor.target.value;
     if(nomProv == '' || nomProv == null){
      this.getProve();
     } else{
      //ejecutamas servicio
     this._proveedorService.searchNombreProveedor(nomProv).subscribe(
      response =>{
        if(response.status == 'success'){

          //asignamos a varibale para mostrar
          this.proveedores = response.proveedores.data;

          //navegacion paginacion
          this.totalPages = response.proveedores.total;
          this.itemsPerPage = response.proveedores.per_page;
          this.pageActual = response.proveedores.current_page;
          this.next_page = response.proveedores.next_page_url;
          this.path = response.proveedores.path
          
          //una vez terminado de cargar quitamos el spinner
          this.isLoading = false;
          
          //console.log(response.proveedores);
        }
      },
      error =>{
        console.log(error);
      }
    );
     }
  }
  /**
   * 
   * @param rfc 
   * Recibimos el evento del input
   * @description
   * Recibe los valores del evento (keyup), luego busca y actualiza
   * 
   */
  getSearchRfcProv(rfc:any){
    //mostramos el spinner
    this.isLoading = true;
    let rfcProv = rfc.target.value;

    if(rfcProv == '' || rfcProv == null){
     this.getProve();
    } else{
     //ejecutamas servicio
    this._proveedorService.searchRfcProveedor(rfcProv).subscribe(
     response =>{
       if(response.status == 'success'){

         //asignamos a varibale para mostrar
         this.proveedores = response.proveedores.data;

         //navegacion paginacion
         this.totalPages = response.proveedores.total;
         this.itemsPerPage = response.proveedores.per_page;
         this.pageActual = response.proveedores.current_page;
         this.next_page = response.proveedores.next_page_url;
         this.path = response.proveedores.path
         
         //una vez terminado de cargar quitamos el spinner
         this.isLoading = false;
         
         //console.log(response.proveedores);
       }
     },
     error =>{
       console.log(error);
     }
   );
    }
 }

}

import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';
//SERVICIOS
import { ProveedorService } from 'src/app/services/proveedor.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//MODELOS
import { Proveedor } from 'src/app/models/proveedor';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-proveedor-deshabilitados',
  templateUrl: './proveedor-deshabilitados.component.html',
  styleUrls: ['./proveedor-deshabilitados.component.css'],
  providers: [ProveedorService, EmpleadoService, MessageService]
})
export class ProveedorDeshabilitadosComponent implements OnInit {

  public proveedores: Array<Proveedor> = [];
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
  //PERMISOS
  public userPermisos:any = [];
  public mProv = this._modulosService.modsProveedores();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;


  constructor(
    private _proveedorService: ProveedorService,
    private _empleadoService:EmpleadoService,
    private _modulosService: ModulosService,
    private messageService: MessageService,
    private _router: Router,
    private _http: HttpClient ) { }

  ngOnInit(): void {
    this.loadUser();//inicializamos el metodo
  }

  /**
  * Funcion que carga los permisos
  */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mProv.idModulo, this.mProv.idSubModulo);
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
          this.getProve();
        }
  }

  /**
   * Lista de proveedores DESHABILITADOS
   */
  getProve(){
    //mostramos el spinner
    this.isLoading = true;

    this.getProveedorSub = this._proveedorService.getProveedoresDes().subscribe(
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
   * 
   * @param nombreProveedor 
   * Recibimos el evento del input
   * @description
   * Recibe los valores del evento (keyup), luego busca y actualiza
   * 
   */
  getSearchNombreProvI(nombreProveedor:any){
    //mostramos el spinner
    this.isLoading = true;
    let nomProv = nombreProveedor.target.value;
    if(nomProv == '' || nomProv == null){
     this.getProve();
    } else{
     //ejecutamas servicio
    this._proveedorService.searchNombreProveedorI(nomProv).subscribe(
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
 getSearchRfcProvI(rfc:any){
   //mostramos el spinner
   this.isLoading = true;
   let rfcProv = rfc.target.value;

   if(rfcProv == '' || rfcProv == null){
    this.getProve();
   } else{
    //ejecutamas servicio
   this._proveedorService.searchRfcProveedorI(rfcProv).subscribe(
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
   * Destruye las subscripciones a los observables
   */
  ngOnDestroy(): void {
    this.getProveedorSub.unsubscribe();
  }

}

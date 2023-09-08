import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { TraspasoService } from 'src/app/services/traspaso.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService, MenuItem } from 'primeng/api';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-traspaso-buscar',
  templateUrl: './traspaso-buscar.component.html',
  styleUrls: ['./traspaso-buscar.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class TraspasoBuscarComponent implements OnInit {

  //variables servicios
  public traspasos: Array<any> = [];
  //Buscador
  public tipoBusqueda: string = 'traspasoe';
  public search: string = '';
  public date_actual: Date = new Date();
  public datInicial: NgbDateStruct= { year:this.date_actual.getFullYear() , month:this.date_actual.getMonth(), day: this.date_actual.getDate()};
  public datFinal: NgbDateStruct= { year:this.date_actual.getFullYear() , month:this.date_actual.getMonth(), day: this.date_actual.getDate()};
  //spinner
  public isLoading:boolean = false;
  //PERMISOS
  public userPermisos:any = [];
  public mTras = this._modulosService.modsTraspaso();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //////////
  items: MenuItem[] =[];

  constructor(
    private _empleadoService: EmpleadoService,
    private _modulosService: ModulosService,
    private _traspasoService: TraspasoService,
    private messageService: MessageService,
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
     this.userPermisos = this._empleadoService.getPermisosModulo(this.mTras.idModulo, this.mTras.idSubModulo);
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
         this.getTrasp();
         this.menuBusqueda();
         }
   }

   getTrasp(){
    //Mostramos spinner de carga
    this.isLoading = true;
    let str_datInicial = this.datInicial.year+'-'+this.datInicial.month+'-'+this.datInicial.day;
    let str_datFinal = this.datFinal.year+'-'+this.datFinal.month+'-'+this.datFinal.day;

    //ejecutamos el servicio
    this._traspasoService.getTraspasos(this.tipoBusqueda,this.search,str_datInicial,str_datFinal).subscribe(
      response =>{
        console.log(response);
        if(response.status == 'success'){
          this.traspasos = response.traspasos.data;
          //paginacion
          this.totalPages = response.traspasos.total;
          this.itemsPerPage = response.traspasos.per_page;
          this.pageActual = response.traspasos.current_page;
          this.next_page = response.traspasos.next_page_url;
          this.path = response.traspasos.path;

          //quitamos spinner
          this.isLoading = false;
        }
        // console.log(response)
      }, error=>{
        this.messageService.add({severity:'error', summary:'Ocurrio un error', detail: 'Fallo al obtener los traspasos.'});
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
        this.traspasos = response.traspasos.data;
        //navegacion paginacion
        this.totalPages = response.traspasos.total;
        this.itemsPerPage = response.traspasos.per_page;
        this.pageActual = response.traspasos.current_page;
        this.next_page = response.traspasos.next_page_url;
        this.path = response.traspasos.path
        
        //una vez terminado de cargar quitamos el spinner
        this.isLoading = false;
    })
  }

   /**
   * @description
   * Obtiene la informacion del input y busca
   */
  selectBusqueda(){
    
    if(this.search == "" || null){
     
      this.getTrasp();
   } else{
     this.getTrasp();
    }//finelse
 }//finFunction

 menuBusqueda(){
  this.items = [
    {
      icon:'pi pi-pencil',
      command: () => {
        this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
      }
    },
    {
        icon: 'pi pi-refresh',
        command: () => {
            this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
        }
    }];
 }

}

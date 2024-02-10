import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'app-notas-a-credito',
  templateUrl: './notas-a-credito.component.html',
  styleUrls: ['./notas-a-credito.component.css'],
  providers: [MessageService, ConfirmationService]
})
export class NotasACreditoComponent implements OnInit {

  // Permisos
  public userPermisos:any;
  public mCreditos = this._modulosService.modsCreditos();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;
  //spinner de carga
  public isLoadingGeneral:boolean = false;
  //variables servicios
  public ventas_credito: Array<any> = [];
  public detalles_venta: Array<any> = [];
  public productos_venta: Array<any> = [];
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //Buscador
  public tipoBusqueda: string = "uno";
  search='';

  constructor(
    private _router: Router,
    private _ventasService: VentasService,
    private _empleadoService: EmpleadoService,
    private _modulosService: ModulosService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  //cargamos inforamcion del usuario guardada en el localstorage
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCreditos.idModulo, this.mCreditos.idSubModulo);
      // revisamos si el permiso del modulo esta activo si no redireccionamos
      if( this.userPermisos.agregar != 1 ){
        this.timerId = setInterval(()=>{
          this.counter--;
          if(this.counter === 0){
            clearInterval(this.timerId);
            this._router.navigate(['./']);
          }
          this.messageService.add({
                    severity:'error', 
                    summary:'Acceso denegado', 
                    detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'
                  });
        },1000);
      } else{
        this.getVentasCredito();
      }
  }

  /**
   * 
   * @param page Number Pagina de donde comenzara a traer los datos. Default 1
   * @param type Number Tipo de busqueda. Default 0
   * @param search String Cadena a buscar. Default "null"
   * 
   * @description Trae los datos de las ventas canceladas paginados
   */
  getVentasCredito(page:number = 1, type:number = 0, search:string = 'null'){
    this.isLoadingGeneral = true;
    this._ventasService.getVentasCredito(page,type,search).subscribe(
      response =>{
        console.log(response)
        if(response.status == 'success' ){
          this.ventas_credito = response.ventas_credito.data;
          //paginacion
          this.totalPages = response.ventas_credito.total;
          this.itemsPerPage = response.ventas_credito.per_page;
          this.pageActual = response.ventas_credito.current_page;
          this.next_page = response.ventas_credito.next_page_url;
          this.path = response.ventas_credito.path;
          //spinner
          this.isLoadingGeneral = false;
        }
      }, error =>{
        console.log(error);
      }
    )
  }

  /**
   * @description
   * Obtiene la informacion del input y busca
   */
  selectBusqueda(){
    
      if(this.search == "" || null){
       
        this.getVentasCredito();
     } else{
       
       switch(this.tipoBusqueda){
         case "uno"://Folio
             this.getVentasCredito(1,1,this.search);
           break;
         case "dos"://cliente
            this.getVentasCredito(1,2,this.search);
           break;
         case "tres"://vendedor
            this.getVentasCredito(1,3,this.search);
           break;
        }
      }//finelse
      
  }

}

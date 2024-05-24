import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { MdlVentaService } from 'src/app/services/mdl-venta-service.service';
import { dialogOptionsVentas } from 'src/app/models/interfaces/dialogOptions-ventas';
import { CajasService } from 'src/app/services/cajas.service';
import { Caja } from 'src/app/models/caja';


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
  public mpageActual:any;//para el modal
  //Buscador
  public tipoBusqueda: string = "uno";
  search='';
  //interfaces
  public dialogOpt?: dialogOptionsVentas;
  //variables servicios
  public vCaja:any;
  public ventas:any;//getVentas
  public empleado:any//loaduser
  public sesionCaja:boolean = false;
  //modelos
  public caja: Caja = new Caja (null,null,0,'',0);

  constructor(
    private _router: Router,
    private _ventasService: VentasService,
    private messageService: MessageService,
    private _modulosService: ModulosService,
    private _empleadoService: EmpleadoService,
    private _mdlVentaService: MdlVentaService,
    private _cajaService: CajasService
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
        this.empleado = this._empleadoService.getIdentity();
        this.verificaCaja();
      }
  }

  /***Revisamos si el usuario tiene abierto una sesion en caja*/
  verificaCaja(){
    this.isLoadingGeneral = true;
    this._cajaService.verificarCaja(this.empleado['sub']).subscribe(
      response =>{
        // console.log(this.vCaja);
        this.vCaja = response.caja;
        if(this.vCaja['horaF'] != null){
          this.messageService.add({
              severity:'error', 
              summary:'Caja no iniciada'
            });
        } else{
          this.sesionCaja = true;
          this.getVentasCredito();
        }
        this.isLoadingGeneral = false;
      }, error =>{
        // this.isLoadingGeneral = false;
        console.log(error);
        if(error._error){
          this.messageService.add({
            severity:'warn', 
            summary: error.error.message,
          });
        } else{
          this.messageService.add({
            severity:'error', 
            summary: "Algo salio mal",
            detail: "Si el problema persiste comuniquese con el departamento de sistemas.",
            sticky: true,
          });
        }
          
      }
    )
  }

  //Guarda Formulario para hacer apertura de caja
  iniciarCaja(FormCaja:any){
  
    const fecha = new Date();
    this.caja.idEmpleado = this.empleado['sub'];
    this.caja.horaI = fecha.getFullYear() + '-' + ( fecha.getMonth() + 1 ) + '-' + fecha.getDate()+' '+fecha.getHours() + ':' + fecha.getMinutes() + ':' + fecha.getSeconds();
    //console.log(this.caja)
    this._cajaService.aperturaCaja(this.caja).subscribe(
      response =>{
        if(response.status == 'success'){
          //console.log(response)
          this.loadUser();
        } else{
          console.log('algo salio mal')
        }
      }, error =>{
        console.error(error)
      }
    )
    
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

  openMdlVenta(idVenta:number){
    this.dialogOpt = {
      idVenta: idVenta,
      modulo: 'cajas',
      submodulo: 'ventas-credito',
      vCaja: this.vCaja,
    }
    this._mdlVentaService.openMdlVentaDialog(this.dialogOpt);
  }


}

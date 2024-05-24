import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { CajasService } from 'src/app/services/cajas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MessageService, } from 'primeng/api';
import { MdlVentaService } from 'src/app/services/mdl-venta-service.service';
//modelos
import { Caja } from 'src/app/models/caja';
import { dialogOptionsVentas } from 'src/app/models/interfaces/dialogOptions-ventas';


@Component({
  selector: 'app-notas-por-cobrar',
  templateUrl: './notas-por-cobrar.component.html',
  styleUrls: ['./notas-por-cobrar.component.css'],
  providers: [MessageService]
})
export class NotasPorCobrarComponent implements OnInit {

  // Permisos
  public userPermisos:any;
  public mCaja = this._modulosService.modsCaja();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;

  //variables servicios
  public vCaja:any;
  public ventas:any;//getVentas
  public empleado:any//loaduser
   //spinner de carga
   public isLoading:boolean = false;
   public isLoadingGeneral:boolean = false;
   public sesionCaja:boolean = false;
   //paginator
   public totalPages:any;
   public page:any;
   public next_page:any;
   public prev_page:any;
   public pageActual:any;
   public mpageActual:any;//para el modal
   //pipe
   tipoBusqueda:number = 1;
   buscaFolio=''
   buscaNombreCliente='';
   buscaNombreEmpleado='';
   //cerrar modal
   closeResult = '';
   //modelos
  public caja: Caja = new Caja (null,null,0,'',0);

  //interfaces
  public dialogOpt?: dialogOptionsVentas;

  constructor(private _ventasService: VentasService, 
              private _cajaService: CajasService, 
              private _router: Router,
              private _empleadoService: EmpleadoService, 
              private _modulosService:ModulosService,
              private messageService: MessageService,
              private _mdlVentaService: MdlVentaService,
            ) {}

  ngOnInit(): void {
    this.loadUser();
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

  //cargamos inforamcion del usuario guardada en el localstorage
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCaja.idModulo, this.mCaja.idSubModulo);
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
        // console.log(this.empleado);
        this.verificaCaja();
        this.getVentas();
      }
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
          this.ngOnInit();
        } else{
          console.log('algo salio mal')
        }
      }, error =>{
        console.error(error)
      }
    )
    
  }

  /**
   * SERVICIOS
   */
  getVentas(){
    this.isLoading = true;
    this._ventasService.getIndexVentas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ventas = response.Ventas
          this.isLoading = false;
        }
      }, error =>{
        console.log(error);
      }
    )
  }

  //ponemos vacio al cambiar entre tipo de busqueda
  seleccionTipoBusqueda(e:any){
    this.buscaFolio='';
    this.buscaNombreCliente='';
    this.buscaNombreEmpleado='';
  }

  openMdlVenta(idVenta:number):void{
    
    this.dialogOpt = {
      idVenta: idVenta,
      modulo: 'cajas',
      submodulo: 'ventas-realizadas',
      vCaja: this.vCaja
    }
    this._mdlVentaService.openMdlVentaDialog(this.dialogOpt)
  }
}
/*********************** */

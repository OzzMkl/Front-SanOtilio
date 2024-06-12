import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { MdlVentaService } from 'src/app/services/mdl-venta-service.service';
//primeng
import { MessageService} from 'primeng/api';
//modelos
import { dialogOptionsVentas } from 'src/app/models/interfaces/dialogOptions-ventas';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ventas-realizadas',
  templateUrl: './ventas-realizadas.component.html',
  styleUrls: ['./ventas-realizadas.component.css'],
  providers:[MessageService]
})
export class VentasRealizadasComponent implements OnInit, OnDestroy {

  //variables servicios
  public ventas:any;
  public userPermisos:any//loaduser
  public identity: any;//loadUser
  //spinner de carga
  public isLoading:boolean = false;
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
  //PERMISOS
  private idModulo: number = 6;
  private idSubmodulo: number = 17;
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;

  public idVentaMdlMotivo: number = 0;
  public nombreClienteMdlMotivo: string = '';

  public isLoadingGeneral: boolean = true;
  //interfaces
  public dialogOpt?: dialogOptionsVentas;
  //subscription
  private actualizaVentasSubscription?: Subscription;

  constructor( private _ventasService: VentasService,
                private _empleadoService: EmpleadoService,
                private messageService: MessageService,
                private _router:Router,
                private _sharedMessage: SharedMessage,
                private _mdlVentaService: MdlVentaService,
                ) { }

  ngOnInit(): void {
    this.loadUser();
    this.actualizaVentasSubscription = this._mdlVentaService.actualizaListaVentas$.subscribe(
      () =>{
        this.getVentas();
      }
    );
    setTimeout(()=>{
      this._sharedMessage.messages$.subscribe(
        messages =>{
          if(messages){
            this.messageService.add(messages[0]); // Agregar el mensaje al servicio de mensajes de PrimeNG
          }
        }
      )
    },500);
    
  }

  ngOnDestroy(): void {
    this.actualizaVentasSubscription?.unsubscribe();
  }

  getVentas(){
    this.isLoading = true;
    this._ventasService.getIndexVentas().subscribe(
      response =>{
        // console.log(response);
        if(response.status == 'success'){
          this.ventas = response.Ventas
          this.isLoading = false;
          this.isLoadingGeneral = false;
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
  //cargamos permisos
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.idModulo,this.idSubmodulo);
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
      //asignamos informacion usuario y cargamos las ventas
      this.identity = this._empleadoService.getIdentity();
      this.getVentas();
    }
  }

  openMdlVenta(venta:any):void{
    this.dialogOpt = {
      idVenta: venta.idVenta,
      modulo: 'ventas',
      submodulo: venta.isCredito ? 'ventas-credito' : 'ventas-realizadas-buscar',
    }
    this._mdlVentaService.openMdlVentaDialog(this.dialogOpt);
  }

}

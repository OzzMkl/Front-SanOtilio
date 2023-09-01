import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-ventas-realizadas',
  templateUrl: './ventas-realizadas.component.html',
  styleUrls: ['./ventas-realizadas.component.css'],
  providers:[MessageService,ConfirmationService]
})
export class VentasRealizadasComponent implements OnInit {

  //variables servicios
  public ventas:any;
  public detallesVenta:any;
  public productosDVenta:any;
  public userPermisos:any//loaduser
  //spinner de carga
  public isLoading:boolean = false;
  //
  public motivoCancelacion: string = '';
  public identity: any;//loadUser
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
  //PERMISOS
  private idModulo: number = 6;
  private idSubmodulo: number = 17;
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;


  constructor( private _ventasService: VentasService, 
                private modalService: NgbModal, 
                private _empleadoService: EmpleadoService,
                private messageService: MessageService,
                private _confirmationService: ConfirmationService,
                private _router:Router,) { }

  ngOnInit(): void {
    this.loadUser();
  }
  getVentas(){
    this.isLoading = true;
    this._ventasService.getIndexVentas().subscribe(
      response =>{
        console.log(response);
        if(response.status == 'success'){
          this.ventas = response.Ventas
          this.isLoading = false;
        }
      }, error =>{
        console.log(error);
      }
    )
  }
  getDetallesVenta(idVenta:any){
    this._ventasService.getDetallesVenta(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesVenta = response.venta;
          this.productosDVenta = response.productos_ventasg;
          //console.log(this.detallesVenta[0])
        }
      },error =>{
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
  // Metodos del  modal
  open(content:any) {//abrir modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'});
  }
  //Abre motal de motivo de cancelacion
  openModalMotivo(content:any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop:'static'});
  }

  almacenaMotivo(){
    if(this.motivoCancelacion.length >= 10){
      //notificamos
      this.messageService.add({severity:'success', summary:'Realizado', detail: 'El motivo fue capturado.'});
      //segudo cuadro de confirmacion
      this.confirmCancelacion();
    } else {
      this.messageService.add({severity:'error', summary:'Advertencia', detail: 'El motivo de modificacón tiene que contener minimo 10 caracteres.'});
    }
  }

  confirmCancelacion() {
    this._confirmationService.confirm({
        message: '¿Esta seguro(a) que desea cancelar la venta?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //Sustituimos todos los permisos por solo los permisos del modulo
            //Esto con la finalidad de no enviar informacion innecesaria
            let identityMod ={
              ... this.identity,
              'permisos': this.userPermisos
            }

            this._ventasService.cancelaVenta(this.detallesVenta[0].idVenta, identityMod, this.motivoCancelacion).subscribe(
              response =>{
                if(response.status == 'success'){
                  this.messageService.add({severity:'success', summary:'Exito', detail:response.message});
                  this.modalService.dismissAll();
                  this.getVentas();
                }
                //console.log(response);
              }, error =>{
                console.log(error)
              });
        },
        reject: (type:any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de cancelacion cancelada.'});
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de cancelacion cancelada.'});
                break;
            }
        }
    });
}

}

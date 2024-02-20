import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { CajasService } from 'src/app/services/cajas.service';
import { SharedMessage } from 'src/app/services/sharedMessage';
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
  public abonos_ventas:any; //getAbonosVentasg
  public total_abono:number = 0;
  public total_actualizado: number = 0;
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

  public idVentaMdlMotivo: number = 0;
  public nombreClienteMdlMotivo: string = '';

  public isLoadingGeneral: boolean = true;

  constructor( private _ventasService: VentasService,
                private _cajaService: CajasService,
                private modalService: NgbModal, 
                private _empleadoService: EmpleadoService,
                private messageService: MessageService,
                private _confirmationService: ConfirmationService,
                private _router:Router,
                private _sharedMessage: SharedMessage,
                ) { }

  ngOnInit(): void {
    this.loadUser();
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
  getDetallesVenta(idVenta:number){
    this.isLoadingGeneral = true;
    this._ventasService.getDetallesVenta(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){
          // console.log(response);
          this.detallesVenta = response.venta;
          this.productosDVenta = response.productos_ventasg;
          //console.log(this.detallesVenta[0])
          this.isLoadingGeneral = false;
        }
      },error =>{
        console.log(error);
      });
      this.getAbonosVentasg(idVenta);
  }

  getAbonosVentasg(idVenta:number){
    this._cajaService.abonosVentasg(idVenta).subscribe(
      response =>{
          this.abonos_ventas = response.abonos;
          this.total_abono = response.total_abono;
          this.total_actualizado = response.total_actualizado;
          // console.log(this.abonos_ventas);
      });
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
  openModalMotivo(content:any,idVenta:number,nombreCliente:string){
    this.idVentaMdlMotivo = 0;
    this.motivoCancelacion ='';
    this.idVentaMdlMotivo = idVenta;
    this.nombreClienteMdlMotivo = nombreCliente;
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop:'static'});
  }

  almacenaMotivo(){
    if(this.motivoCancelacion.length >= 10){
      // revisamos si tiene abonos
        // console.log(this.abonos_ventas)
        if(this.abonos_ventas.length > 0){
          this.confirmCancelacionAbono(this.idVentaMdlMotivo, this.abonos_ventas.length,this.total_abono,this.nombreClienteMdlMotivo);
        } else{
          //segudo cuadro de confirmacion
          this.confirmCancelacion();
        }
        
      //notificamos
      this.messageService.add({severity:'success', summary:'Realizado', detail: 'El motivo fue capturado.'});
    } else {
      this.messageService.add({severity:'error', summary:'Advertencia', detail: 'El motivo de cancelación tiene que contener minimo 10 caracteres.'});
    }
  }

  confirmCancelacion() {
    this._confirmationService.confirm({
        message: '¿Esta seguro(a) que desea cancelar la venta?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.cancelaVenta();
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

  confirmCancelacionAbono(idVentaMotivo:number, lengthAbono:number, total_abono:number,nombreClienteMotivo:string){
    this._confirmationService.confirm({
      message: 'La venta '+idVentaMotivo+' tiene '+lengthAbono+' abono(s). <br>'+
                'Se sumara como credito disponible la cantidad de <strong>$'+total_abono+'</strong>'+ 
                ' al cliente <strong>'+nombreClienteMotivo+'</strong><br>'+
                '¿Esta seguro(a) que desea continuar?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.cancelaVenta();
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

  confirmEdicionAbono(){
    /**
     * cerrar modal
     * y mandar modal que se cerro
     * Si tiene abonos se ejecuta confirm si no
     */
    this._confirmationService.confirm({
      message: '¿Esta seguro(a) que desea cancelar la venta?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.cancelaVenta();
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

  cancelaVenta(){
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
  }

}

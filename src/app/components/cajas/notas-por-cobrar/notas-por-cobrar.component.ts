import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { CajasService } from 'src/app/services/cajas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//modelos
import { Caja } from 'src/app/models/caja';
import { Caja_movimientos } from 'src/app/models/caja_movimientos';


@Component({
  selector: 'app-notas-por-cobrar',
  templateUrl: './notas-por-cobrar.component.html',
  styleUrls: ['./notas-por-cobrar.component.css'],
  providers: [MessageService, ConfirmationService]
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
  public detallesVenta:any;//getDetallesventas
  public productosDVenta:any;//getDetallesventas
  public empresa:any;//getDetallesEmpresa
  public empleado:any//loaduser
  public tipo_pago:any//getTipoMovimiento
  public abonos_ventas:any; //getAbonosVentasg
  public total_abono:number = 0;
  public total_actualizado: number = 0;
   //spinner de carga
   public isLoading:boolean = false;
   public isLoadingGeneral:boolean = false;
   public sesionCaja:boolean = false;
   //modal de cobrar venta
   public isTipoPago2:boolean = false;
   public isCero:boolean = true;
   public isSaldo: boolean = true;
   public tp1:number = 0;
   public select1:number =0;
   public cambio:number = 0;
   public saldo_restante:number = 0;
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
  public caja_movimiento: Caja_movimientos = new Caja_movimientos(0,null,0,0,0,0,0,0,0,'',0);

  constructor(private _ventasService: VentasService, 
              private modalService: NgbModal,
              private _cajaService: CajasService, 
              private _router: Router,
              private _empleadoService: EmpleadoService, 
              private _modulosService:ModulosService,
              private messageService: MessageService,
              private _confirmationService: ConfirmationService) {}

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
        this.getTipoPago();
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

  //validacion del campo del cambio para el cobro de notas
  calculaCambio(){

    if(this.tp1 <= 0){
      this.messageService.add({
        severity:'warn', 
        summary:'Movimiento invalido', 
        detail: 'Ingrese solo valores mayores a cero.'
      });
      this.isCero=true
    }  else if(this.select1 == 0){
      this.messageService.add({
        severity:'warn', 
        summary:'Movimiento invalido', 
        detail: 'No puedes cobrar sin seleccionar un metodo de pago.'
      });
      this.isCero=true
    } else{
      this.saldo_restante = 0;
      this.cambio= 0;

      if(this.abonos_ventas.length > 0){
        this.cambio = this.total_actualizado - this.tp1;
      } else{
        this.cambio = this.detallesVenta[0]['total'] - this.tp1;
      }

      if(this.cambio <= 0){
        
        this.cambio = (this.cambio)*(-1)
        //habilitamos el boton de cobrar
        this.isCero = false;
        this.isSaldo= false;
      } else{
        //si el cambio aun es positivo lo ponemos a cero
        //esto con la finalidad de confundir al cajero
        this.saldo_restante = this.cambio;
        this.cambio = 0;
        this.isCero = false;
        this.isSaldo = true;
      }
    }
  }

  //metodo para cobrar la nota
  cobroVenta(){
      if(this.select1 == 0){
          this.messageService.add({
            severity:'warn', 
            summary:'Movimiento invalido', 
            detail: 'No puedes cobrar sin seleccionar un metodo de pago.'
          });
          this.isCero=true;
      } else{

        //cargamos la informacion del cobro
        this.caja_movimiento.idCaja = this.vCaja['idCaja'];
        this.caja_movimiento.totalNota = this.detallesVenta[0]['total'];
        this.caja_movimiento.idTipoMov = this.saldo_restante > 0 ? 2: 1;
        this.caja_movimiento.idTipoPago = this.select1;
        this.caja_movimiento.pagoCliente = this.tp1;
        this.caja_movimiento.cambioCliente = this.cambio;
        this.caja_movimiento.idOrigen = this.detallesVenta[0]['idVenta'];
        this.caja_movimiento.saldo_restante = this.saldo_restante;

        let tieneAbono = this.abonos_ventas.length > 0 ? true : false;

        // console.log(this.caja_movimiento);
        this._cajaService.cobroVenta(this.detallesVenta[0]['idVenta'], this.caja_movimiento, this.isSaldo,this.empleado.sub,tieneAbono).subscribe(
          response => {
            //si la respuesta es correcta
            if(response.status == 'success'){
              //recargamos la tabla con las notas
              this.getVentas();
              //cerramos los dos modales
              this.modalService.dismissAll();
              //mandamos mensaje de la nota fue cobrada correctamente
              this.messageService.add({severity:'success', detail:'Nota #'+this.detallesVenta[0]['idVenta']+' cobrada correctamente'});
            } else{
              //si devuelve otra coosa 
              console.log('algo salio mal');
              //mostramos mensaje de error
            }
          }, error => {
            console.log(error);
          });
      }
      
  }

  /**
   * 
   */
  guardaVentaCredito(idVenta:number){
    //Creamos objeto con la idVenta y los permisos del modulo
    let ventaCredito = {
      idVenta: idVenta,
      idEmpleado: this.empleado.sub,
      permisos: this.userPermisos
    }
    this._cajaService.guardaVentaCredito(ventaCredito).subscribe(
      response =>{
        if(response.status == 'success'){
          this.messageService.add({
            severity:'success', 
            summary: "Registro correcto",
            detail: response.message,
          });
          this.modalService.dismissAll();
          this.getVentas();
        } else{
          console.log(response);
          this.messageService.add({
            severity:'error', 
            summary:'Algo salio mal', 
            detail: 'Intente de nuevo por favor, si el problema persiste comuniquese con el departamento de sistemas.',
            sticky: true,
          });
        }
      }, error =>{
        console.log(error);
        this.messageService.add({
          severity:'error', 
          summary:'Algo salio mal', 
          detail: 'Intente de nuevo por favor, si el problema persiste comuniquese con el departamento de sistemas.',
          sticky: true,
        });
      }
    );
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

  getDetallesVenta(idVenta:number){
    this.isLoadingGeneral = true;
    this._ventasService.getDetallesVenta(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesVenta = response.venta;
          this.productosDVenta = response.productos_ventasg;
          this.isLoadingGeneral = false;
          //console.log(this.detallesVenta)
          //console.log(this.productosDVenta)
        }
      },error =>{
        console.log(error);
      });
    this.getAbonosVentasg(idVenta);
  }
  
  getTipoPago(){
    this._ventasService.getTipoPago().subscribe(
      response =>{
        this.tipo_pago = response.tipo_pago;
      }
    )
  }
  
  getAbonosVentasg(idVenta:number){
    this._cajaService.abonosVentasg(idVenta).subscribe(
      response =>{
          this.abonos_ventas = response.abonos ?? null;
          this.total_abono = response.total_abono ?? null;
          this.total_actualizado = response.total_actualizado ?? null;
          // console.log(this.abonos_ventas);
      });
  }

  //ponemos vacio al cambiar entre tipo de busqueda
  seleccionTipoBusqueda(e:any){
    this.buscaFolio='';
    this.buscaNombreCliente='';
    this.buscaNombreEmpleado='';
  }

  generaPDF(idVenta: number):void{
    this.isLoadingGeneral = true;
    this._cajaService.getPDF(idVenta).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this.isLoadingGeneral = false;
      }
    );
  }

  // Metodos del  modal
  open(content:any) {//abrir modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalCobro(content:any){
    //Limpiamos input de cobro
    this.tp1 = 0;
    this.select1 = 0;
    this.isCero=true;

    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: ''}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openModalAbonos(content:any){
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg', backdropClass: ''});
  }

  private getDismissReason(reason: any): string {//cerrarmodal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  confirmCobro():void{
    let messageConfirm: string = '';
    let messageAccept: string = '';
    let messageReject:string = '';
    if(!this.isSaldo){
      messageConfirm = '¿Esta seguro(a) de cobrar la siguiente nota?';
      messageAccept = 'Cobro confirmado';
      messageReject = 'Confirmacion de cobro cancelado.';
    } else{
      messageConfirm = 'El siguiente pago se registrara como un abono. <br> ¿Esta  seguro(a) de continuar?';
      messageAccept = 'Abono confirmado';
      messageReject = 'Confirmacion de abono cancelado.';
    }
    this._confirmationService.confirm({
      message: messageConfirm,
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.messageService.add({severity:'info', detail:messageAccept});
        this.cobroVenta();
      },
      reject: (type:any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity:'warn', detail:messageReject});
          break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity:'warn', detail:messageReject});
          break;
        }
      }
    });
  }

  confirmCredito(idVenta:number):void{
    this._confirmationService.confirm({
      message: '¿Esta seguro(a) de mover la venta a credito?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.guardaVentaCredito(idVenta);
      },
      reject: (type:any) => {
        switch(type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({severity:'warn', detail:'Confirmacion cancelada'});
          break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({severity:'warn', detail:'Confirmacion cancelada'});
          break;
        }
      }
    });
  }
}
/*********************** */

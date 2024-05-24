import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
//Servicios
import { CajasService } from 'src/app/services/cajas.service';
import { VentasService } from 'src/app/services/ventas.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MdlVentaService } from 'src/app/services/mdl-venta-service.service';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
//Modelos-interfaces
import { Ventag } from 'src/app/models/ventag';
import { abono } from 'src/app/models/interfaces/abono';
import { tipo_pago } from 'src/app/models/interfaces/tipo_pago';
import { Producto_ventasg } from 'src/app/models/productoVentag';
import { Caja_movimientos } from 'src/app/models/caja_movimientos';
import { dialogOptionsVentas } from 'src/app/models/interfaces/dialogOptions-ventas';
import { propModulo } from 'src/app/models/interfaces/propModulo';

@Component({
  selector: 'app-modal-ventas',
  templateUrl: './modal-ventas.component.html',
  styleUrls: ['./modal-ventas.component.css'],
  providers:[MessageService, ConfirmationService]
})
export class ModalVentasComponent implements OnInit, OnDestroy {

  //Permisos
  public userPermisos:any;
  public mCaja?: propModulo;
  public identity: any;
  //Spinner
  public isLoadingGeneral: boolean = false;
  //Var modales
  public isMdlVenta: boolean = false;
  public isMdlAbono: boolean = false;
  public isMdlCobroVenta: boolean = false;
  /*** MODELOS ***/
  dialogOptions:any;
  //modelos-venta
  public venta?: Ventag;
  public productos_venta?: Array<Producto_ventasg>;
  //modelos-abonos
  public arr_abonos: Array<abono> = [];
  public total_abono: number = 0;
  public total_actualizado: number = 0;
  //modelo-cajas-COBRO
  public tipo_pago: Array<tipo_pago> = [];
  public selectedTipoPago?: tipo_pago;
  public tp1:number = 0;
  public isCero:boolean = true;
  public isSaldo: boolean = true;
  public cambio:number = 0;
  public saldo_restante:number = 0;
  public caja_movimiento?: Caja_movimientos;

  //Subscriptions
  private sub_mdlVentaService: Subscription = new Subscription();
  private sub_ventasService: Subscription = new Subscription();
  private sub_cajaService: Subscription = new Subscription();

  constructor(
    private _mdlVentaService: MdlVentaService,
    private _ventasService: VentasService,
    private _cajaService: CajasService,
    private messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _empleadoService: EmpleadoService,
    private _modulosService:ModulosService,
  ) { }

  ngOnInit(): void {
    this.sub_mdlVentaService = this._mdlVentaService.openMdlVentaDialog$.subscribe(
      (dialogOptions: dialogOptionsVentas) =>{
        this.dialogOptions = dialogOptions;
        // console.log(this.dialogOptions)
        this.loadUser(this.dialogOptions);
    });
  }

  ngOnDestroy(): void {
    this.sub_mdlVentaService.unsubscribe();
    this.sub_ventasService.unsubscribe();
    this.sub_cajaService.unsubscribe();
  }

  loadUser(dialogOptions:dialogOptionsVentas){
    switch(dialogOptions.modulo){
      case 'cajas':
          if(dialogOptions.submodulo == 'ventas-realizadas'){
            this.mCaja = this._modulosService.modsCaja();
            this.userPermisos = this._empleadoService.getPermisosModulo(this.mCaja.idModulo,this.mCaja.idSubModulo);
            this.identity = this._empleadoService.getIdentity();
            this.getVenta(dialogOptions.idVenta);
          } else if(dialogOptions.submodulo == 'ventas-credito'){
            this.mCaja = this._modulosService.modsCreditos();
            this.userPermisos = this._empleadoService.getPermisosModulo(this.mCaja.idModulo,this.mCaja.idSubModulo);
            this.identity = this._empleadoService.getIdentity();
            this.getVentaCredito(dialogOptions.idVenta);
          }
        break;
      default:
        this.messageService.add({
          severity:'error', 
          summary:'Algo salio mal', 
          detail: 'Intente de nuevo por favor, si el problema persiste comuniquese con el departamento de sistemas.',
          sticky: true,
        });
        break;
    }
  }

  /**
   * 
   * @param idVenta Number
   * @description
   * Obtiene la informacion detallada de la venta
   */
  getVenta(idVenta:number){
    this.isLoadingGeneral = true;
    this.sub_ventasService = this._ventasService.getDetallesVenta(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){

          this.venta = response.venta[0];
          this.productos_venta = response.productos_ventasg;
          this.isLoadingGeneral = false;
          this.isMdlVenta = true;
        }
      },error =>{
        console.log(error);
      });
    this.getAbonosVentas(idVenta);
  }

  getVentaCredito(idVenta:number){
    this.isLoadingGeneral = true;
    this.sub_ventasService = this._ventasService.getDetallesVentaCredito(idVenta).subscribe(
      response =>{
        if(response.code == 200 && response.status == 'success'){
          this.venta = response.venta_credito;
          this.productos_venta = response.productos_ventascre;
          this.isLoadingGeneral = false;
          this.isMdlVenta = true;
        }
      }, error =>{
        console.log(error);
      }
    );
    this.getAbonosVentas(idVenta);
  }

  /**
   * 
   * @param idVenta number
   * @description
   * Consulta los abonos de la venta seleccionada
   */
  getAbonosVentas(idVenta:number){
    this.sub_cajaService = this._cajaService.abonosVentasg(idVenta).subscribe(
      response =>{
        if(response.code == 200 && response.status == 'success'){
          this.arr_abonos = response.abonos;
          this.total_abono = response.total_abono;
          this.total_actualizado = response.total_actualizado;
        }
      }, error =>{
        console.log(error);
      }
    )
  }

  //OPERACIONES CAJAS

  /**
   * 
   * @param idVenta number
   * @description
   * Genera pdf del modulo de cajas
   */
  generaPDF_caja(idVenta:number){
    this.isLoadingGeneral = true;
    this.sub_cajaService = this._cajaService.getPDF(idVenta).subscribe(
      (pdf: Blob) =>{
        const blob = new Blob([pdf], {type:'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this.isLoadingGeneral = false;
      }
    );
  }
  
  /**
   * @description
   * Apertura del modal de cobro y obtencion de los tipo de pago
   * llama a funcion getTipoPago()
   */
  openMdlCobro(){
    this.getTipoPago();
    this.isMdlCobroVenta = true;
  }

  /**
   * @description
   * Obtiene los tipo de pago disponibles para cobro
   */
  getTipoPago(){
    this.isLoadingGeneral = true;
    this.sub_ventasService = this._ventasService.getTipoPago().subscribe(
      response =>{
        if(response.status == 'success' && response.code == 200){
          this.tipo_pago = response.tipo_pago;
          this.isLoadingGeneral = false;
          this.selectedTipoPago = this.tipo_pago[0]
        }
      }
    )
  }

  /**
   * @description
   * Obtiene el cambio y saldo restante al ingresar la cantidad a cobrar
   */
  calculaCambio(){

    if(this.tp1 <= 0){
      this.messageService.add({
        severity:'warn', 
        summary:'Movimiento invalido', 
        detail: 'Ingrese solo valores mayores a cero.'
      });
      this.isCero=true
    }  else if(this.selectedTipoPago == undefined){
      this.messageService.add({
        severity:'warn', 
        summary:'Movimiento invalido', 
        detail: 'No puedes cobrar sin seleccionar un metodo de pago.'
      });
      this.isCero=true
    } else{
      this.saldo_restante = 0;
      this.cambio= 0;

      if(this.arr_abonos.length > 0){
        this.cambio = this.total_actualizado - this.tp1;
      } else{
        this.cambio = this.venta!.total - this.tp1;
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
  
  /**
   * @description
   * Reseteo de variables del modal cobro
   */
  resetVarCobro(){
    this.tp1 = 0;
    this.isCero   = true;
    this.cambio = 0;
    this.isSaldo = true;
    this.saldo_restante = 0;
  }

  /**
   * @description
   * Mensaje de confirmacion de cobro/abono
   */
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

  /**
   * 
   * @param idVenta number
   * @description
   * Mensaje de confirmacion de mover venta a credito
   */
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

  /**
   * @description
   * Envio de cobro de la venta
   */
  cobroVenta(){
    if(this.selectedTipoPago == undefined){
        this.messageService.add({
          severity:'warn', 
          summary:'Movimiento invalido', 
          detail: 'No puedes cobrar sin seleccionar un metodo de pago.'
        });
        this.isCero=true;
    } else{

      //cargamos la informacion del cobro
      this.caja_movimiento = new Caja_movimientos(
        this.dialogOptions.vCaja.idCaja,
        null,
        this.venta!.total,
        this.saldo_restante > 0 ? 2: 1,
        this.selectedTipoPago.idt,
        this.tp1,
        this.cambio,
        this.venta!.idVenta,
        null,
        '',
        this.saldo_restante
      );

      let tieneAbono = this.arr_abonos.length > 0 ? true : false;
      let isCredito = this.venta?.isCredito ?? false;
      // console.log(this.caja_movimiento);
      this.sub_cajaService = this._cajaService.cobroVenta(this.venta!.idVenta, this.caja_movimiento, this.isSaldo,this.identity.sub,tieneAbono,isCredito).subscribe(
        response => {
          //si la respuesta es correcta
          if(response.status == 'success'){
            //recargamos la tabla con las notas
            // this.getVentas();
            //cerramos los dos modales
            // this.modalService.dismissAll();
            //mandamos mensaje de la nota fue cobrada correctamente
            this.messageService.add({severity:'success', detail:'Nota #'+this.venta!.idVenta+' cobrada correctamente'});
            this.isMdlVenta = false;
            this.isMdlCobroVenta = false;
            this._mdlVentaService.actualizarVentas();
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
  * @description
  * Funcion que llama al backend para mover la venta a credito
  */
  guardaVentaCredito(idVenta:number){
    //Creamos objeto con la idVenta y los permisos del modulo
    let ventaCredito = {
      idVenta: idVenta,
      // idEmpleado: this.empleado.sub,
      idEmpleado: this.identity.sub,
      // permisos: this.userPermisos
      permisos: this.userPermisos,
    }
    this.sub_cajaService = this._cajaService.guardaVentaCredito(ventaCredito).subscribe(
      response =>{
        if(response.status == 'success'){
          this.messageService.add({
            severity:'success', 
            summary: "Registro correcto",
            detail: response.message,
          });
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


}

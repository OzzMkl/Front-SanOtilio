import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MonedaLiteralService } from 'src/app/services/moneda-literal.service';
import { CajasService } from 'src/app/services/cajas.service';
import { ToastService } from 'src/app/services/toast.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
              private _empresaService: EmpresaService,
              private _monedaLiteral: MonedaLiteralService, 
              private _cajaService: CajasService, 
              private _router: Router,
              public toastService: ToastService, 
              private _empleadoService: EmpleadoService, 
              private _modulosService:ModulosService,
              private messageService: MessageService,
              private _confirmationService: ConfirmationService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  /***Revisamos si el usuario tiene abierto una sesion en caja*/
  verificaCaja(){
    //console.log(this.empleado)
    this._cajaService.verificarCaja(this.empleado['sub']).subscribe(
      response =>{
        this.vCaja = response.caja;
        if(this.vCaja['horaF'] != null){
          //this.toastService.show('Caja no iniciada', { classname: 'bg-danger  text-light', delay: 5000 });
          
        } else{
          this.sesionCaja = true;
        }
        // console.log(this.vCaja)
      }, error =>{
        console.log(error)
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
        this.getDatosEmpresa();
        this.getTipoPago();
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
      //Si todo esta bien realizamos la operacion
      this.cambio = this.detallesVenta[0]['total'] - this.tp1;

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
          this.isCero=true
      } else{

        //cargamos la informacion del cobro
        this.caja_movimiento.idCaja = this.vCaja['idCaja'];
        this.caja_movimiento.totalNota = this.detallesVenta[0]['total'];
        this.caja_movimiento.idTipoMov = 2;
        this.caja_movimiento.idTipoPago = this.select1;
        this.caja_movimiento.pagoCliente = this.tp1;
        this.caja_movimiento.cambioCliente = this.cambio;
        this.caja_movimiento.idOrigen = this.detallesVenta[0]['idVenta'];
        this.caja_movimiento.saldo_restante = this.saldo_restante;

        // console.log(this.caja_movimiento);
        this._cajaService.cobroVenta(this.detallesVenta[0]['idVenta'], this.caja_movimiento, this.isSaldo,this.empleado.sub).subscribe(
          response => {
            //si la respuesta es correcta
            if(response.status == 'success'){
              //recargamos la tabla con las notas
              this.getVentas();
              //cerramos los dos modales
              this.modalService.dismissAll()
              //mandamos mensaje de la nota fue cobrada correctamente
              //this.toastService.show('Nota #'+this.detallesVenta[0]['idVenta']+' cobrada correctamente',{classname: 'bg-success text-light', delay: 3000});
            } else{
              //si devuelve otra coosa 
              console.log('algo salio mal');
              //mostramos mensaje de error
              //this.toastService.show('algo salio mal',{classname: 'bg-danger text-light', delay: 6000});
            }
          }, error => {
            console.log(error);
          });
      }
      
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
    this._ventasService.getDetallesVenta(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesVenta = response.venta;
          this.productosDVenta = response.productos_ventasg;
          //console.log(this.detallesVenta)
          //console.log(this.productosDVenta)
        }
      },error =>{
        console.log(error);
      });
    this.getAbonosVentasg(idVenta);
  }

  getDatosEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe( 
      response => {
        if(response.status == 'success'){
           this.empresa = response.empresa;
           //console.log(this.empresa)
        }
      },error => {console.log(error)});
  }
  
  getTipoPago(){
    this._ventasService.getTipoPago().subscribe(
      response =>{
        this.tipo_pago = response.tipo_pago
      }
    )
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

  generaPDF(){
    const doc = new jsPDF;
    //para la tabla de productos
    var cabeceras =["CLAVE EXTERNA","DESCRIPCION","MEDIDA","PRECIO","CANTIDAD","DESCUENTO","SUBTOTAL"];
    var rows:any = [];
    var logo = new Image();
    logo.src = "assets/images/logo-solo.png"

    // variable con logo, tipo x1,y1, ancho, largo
    doc.addImage(logo,'PNG',10,9,25,25);
    doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
    //          tipografia       tamaño letra       texto                                        x1,y1
    doc.setFont('Helvetica').setFontSize(18).text('MATERIALES PARA CONSTRUCCION \"SAN OTILIO\"', 40,15);
    doc.setFont('Helvetica').setFontSize(9).text(this.empresa[0]['nombreCorto']+': COLONIA '+this.empresa[0]['colonia']+', CALLE '+ this.empresa[0]['calle']+' #'+this.empresa[0]['numero']+', '+this.empresa[0]['ciudad']+', '+this.empresa[0]['estado'], 45,20);
    doc.setFont('Helvetica').setFontSize(9).text('CORREOS: '+this.empresa[0]['correo1']+', '+this.empresa[0]['correo2'],60,25);
    doc.setFont('Helvetica').setFontSize(9).text('TELEFONOS: '+this.empresa[0]['telefono']+' ó '+this.empresa[0]['telefono2']+'   RFC: '+this.empresa[0]['rfc'],68,30);
    //           ancho linea   x1,y1  x2,y2
    doc.setLineWidth(2.5).line(10,37,200,37);//colocacion de linea
    doc.setLineWidth(5).line(10,43,55,43);//colocacion de linea
    //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1     
    doc.setFont('Helvetica','bold').setFontSize(12).text('VENTA #'+this.detallesVenta[0]['idVenta'], 12,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('VENDEDOR: '+this.detallesVenta[0]['nombreEmpleado'].toUpperCase(), 60,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('FECHA: '+this.detallesVenta[0]['created_at'].substring(0,10), 170,45);
    doc.setLineWidth(2.5).line(10,50,200,50);//colocacion de linea
    doc.setFont('Helvetica','normal').setFontSize(9).text('CLIENTE: '+this.detallesVenta[0]['nombreCliente'], 10,55);
    doc.setFont('Helvetica','normal').setFontSize(9).text('RFC: '+this.detallesVenta[0]['clienteRFC'], 165,55);
    //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1   PONEMOS TEXTO JUSTIFICADO    ENTRE        ANCHO MAXIMO
    doc.setFont('Helvetica','normal').setFontSize(9).text('DIRECCION: '+this.detallesVenta[0]['cdireccion'], 10,60,{align: 'justify',lineHeightFactor: 1.5,maxWidth:190});
    ///
    //doc.setFont('Helvetica','normal').setFontSize(9).text('TELEFONO: 0000000000', 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('EMAIL: '+this.detallesVenta[0]['clienteCorreo'], 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('TIPO CLIENTE: '+this.detallesVenta[0]['tipocliente'], 60,70);
    doc.setLineWidth(2.5).line(10,75,200,75);//colocacion de linea
    //recorremos los productos
    this.productosDVenta.forEach((element:any) =>{
      var temp = [element.claveEx,element.descripcion,element.nombreMedida,element.precio,element.cantidad,element.descuento,element.total];
      rows.push(temp);
    });
    //generamos la tabla
    autoTable(doc,{ head:[cabeceras],
      body:rows, startY:80 });
      //OBTEMOS DONDE FINALIZA LA TABLA CREADA
      let posY = (doc as any).lastAutoTable.finalY;
      //         TIPOLETRA  NEGRITA O NORMAL     TAMAÑO                                                               X1, POSICION FINAL DE LA TABLA + 10
      doc.setFont('Helvetica','normal').setFontSize(9).text('SUBTOTAL:          $'+this.detallesVenta[0]['subtotal'], 145,posY+10);
      doc.setFont('Helvetica','normal').setFontSize(9).text('DESCUENTO:      $'+this.detallesVenta[0]['descuento'], 145,posY+15);
      doc.setFont('Helvetica','normal').setFontSize(9).text('TOTAL:                 $'+this.detallesVenta[0]['total'], 145,posY+20);
      doc.setFont('Helvetica','normal').setFontSize(9).text('OBSERVACIONES: '+this.detallesVenta[0]['observaciones'], 10,posY+32,{align: 'left',lineHeightFactor: 1.5,maxWidth:180});
      doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
      doc.setLineWidth(1).line(10,posY+47,200,posY+47);//colocacion de linea
      doc.setDrawColor(0, 0, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
      doc.setLineWidth(.3).line(10,posY+48,200,posY+48);//colocacion de linea
      doc.setLineWidth(.3).line(10,posY+48,10,posY+77);//colocacion de linea
      doc.setLineWidth(.3).line(200,posY+48,200,posY+77);//colocacion de linea
      doc.setLineWidth(.3).line(10,posY+77,200,posY+77);//colocacion de linea
      doc.setFont('Helvetica','normal').setFontSize(9).text('Por medio de este pagare me(nos) obligo(amos) a pagar incondicionalmente en este plazo, el dia     de', 15,posY+51);
      doc.setFont('Helvetica','normal').setFontSize(9).text('a nombre de LUNA PEREZ BENJAMIN por la cantidad de : $'+this.detallesVenta[0]['total'], 15,posY+56);
      doc.setFont('Helvetica','normal').setFontSize(9).text(this._monedaLiteral.numeroALetras(this.detallesVenta[0]['total'],''), 15,posY+61);
      doc.setFont('Helvetica','normal').setFontSize(9).text('Valor recibido en mercancias. En caso de no pagar a su vencimiento causara interes moratorio de     % mensual', 15,posY+66);
      doc.setFont('Helvetica','normal').setFontSize(9).text('________________________________', 77,posY+71);
      doc.setFont('Helvetica','normal').setFontSize(9).text('Acepto de conformidad', 89,posY+76);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*TODO CAMBIO CAUSARA UN 10% EN EL IMPORTE TOTAL.', 15,posY+81);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*TODA CANCELACION SE COBRARA 20% DEL IMPORTE TOTAL SIN EXCEPCION.', 15,posY+86);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*LA DESCARGA DE MATERIAL SERA EN UN MAXIMO DE 6m.', 15,posY+91);


    //GUARDAMOS PDF
    doc.save("venta-"+this.detallesVenta[0]['idVenta']+".pdf");

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
}
/*********************** */

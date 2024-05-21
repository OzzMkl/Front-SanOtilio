import { Component, OnInit } from '@angular/core';
//servicio
import { CajasService } from 'src/app/services/cajas.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//modelo
import { Caja_movimientos } from 'src/app/models/caja_movimientos';
//pdf
import jsPDF from 'jspdf';
import { ModulosService } from 'src/app/services/modulos.service';
import { handleRedirect } from 'src/app/utils/fnUtils';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { totales_caja } from 'src/app/models/interfaces/totales_caja';


@Component({
  selector: 'app-corte-de-caja',
  templateUrl: './corte-de-caja.component.html',
  styleUrls: ['./corte-de-caja.component.css'],
  providers:[MessageService]
})
export class CorteDeCajaComponent implements OnInit {

  //
  public empresa:any;//getDetallesEmpresa
  public  sesiones:any//getVerificaSesionesCaja
  public sesionPDF:any
  public  movCaja:any//getMovSesionCaja
  public empleado:any//loaduser
  public totales?: totales_caja;

  public fondo:number = 0;//getMovSesionCaja
  public total:any;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  //variable para el pdf obtenemos fecha actual
  public fecha : Date = new Date();

  //PERMISOS
  public userPermisos:any = [];
  public mCaja_Cortecaja = this._modulosService.modsCaja_Cortecaja();

  constructor(
            private _router: Router,
            private _cajaService: CajasService,
            private messageService: MessageService,
            private _modulosService: ModulosService,
            private _empleadoService: EmpleadoService,
          ) { }

  ngOnInit(): void {
    this.loadUser();
  }
  loadUser(){

    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCaja_Cortecaja.idModulo,this.mCaja_Cortecaja.idSubModulo);
    if(this.userPermisos.editar == 1 && this.userPermisos.ver && this.userPermisos.agregar == 1){
      this.empleado = this._empleadoService.getIdentity();
      this.getVerificaSesionesCaja();
    } else{
      handleRedirect(5,this._router,this.messageService);
    }
  }

  getVerificaSesionesCaja(){
    this._cajaService.verificaSesionCaja().subscribe(
      response => {
        this.sesiones = response.caja
        console.log(this.sesiones)
      }
    )
  }
  getMovSesionCaja(sesion:any){
    
    this._cajaService.movimientosSesionCaja(sesion.idCaja).subscribe(
      response => {
        //console.log(response)
        if(response.status == 'success'){
          this.movCaja=response.caja;
          this.totales = response.totales;
          console.log(this.totales)
          this.fondo = sesion.fondo;
        }
      }, error =>{
        console.error(error)
      }
    )
  }
  generaCorte(){
    this._cajaService.cierreCaja(this.movCaja[0]).subscribe(
      response =>{
        if(response.status == 'success'){
          //this.toastService.show('Corte generado exitosamente',{classname: 'bg-success text-light', delay: 3000});
          this.generaPDF();
        } else{
          //this.toastService.show('Algo salio mal',{classname: 'bg-danger text-light', delay: 3000});
        }
      }, error => {
        console.log( error)
      }
    )
  }
  generaPDF(){
    // const doc = new jsPDF;
    // var logo = new Image();
    // logo.src = 'assets/images/logo-solo.png'//ASIGNAMOS LA UBICACION DE LA IMAGEN

    // // variable con logo, tipo x1,y1, ancho, largo
    // doc.addImage(logo,'PNG',10,9,25,25);
    // doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
    // //          tipografia       tamaño letra       texto                                        x1,y1
    // doc.setFont('Helvetica').setFontSize(18).text('MATERIALES PARA CONSTRUCCION \"SAN OTILIO\"', 40,15);
    // doc.setFont('Helvetica').setFontSize(9).text(this.empresa[0]['nombreCorto']+': COLONIA '+this.empresa[0]['colonia']+', CALLE '+ this.empresa[0]['calle']+' #'+this.empresa[0]['numero']+', '+this.empresa[0]['ciudad']+', '+this.empresa[0]['estado'], 45,20);
    // doc.setFont('Helvetica').setFontSize(9).text('CORREOS: '+this.empresa[0]['correo1']+', '+this.empresa[0]['correo2'],60,25);
    // doc.setFont('Helvetica').setFontSize(9).text('TELEFONOS: '+this.empresa[0]['telefono']+' ó '+this.empresa[0]['telefono2']+'   RFC: '+this.empresa[0]['rfc'],68,30);
    // //           ancho linea   x1,y1  x2,y2
    // doc.setLineWidth(2.5).line(10,37,200,37);//colocacion de linea
    // doc.setLineWidth(5).line(10,43,55,43);//colocacion de linea
    // //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1     
    // doc.setFont('Helvetica','bold').setFontSize(12).text('CORTE DE CAJA', 12,45);
    // doc.setFont('Helvetica','normal').setFontSize(9).text('GENERA CORTE: '+this.empleado['nombre'].toUpperCase()+' '+this.empleado['apellido'].toUpperCase()+' '+this.empleado['amaterno'].toUpperCase(), 60,43);
    // doc.setFont('Helvetica','normal').setFontSize(9).text('CAJERO: '+this.sesionPDF.nombreEmpleado.toUpperCase(), 60,47);
    // doc.setFont('Helvetica','normal').setFontSize(9).text('FECHA: '+this.fecha.toLocaleDateString(), 170,43);
    // doc.setFont('Helvetica','normal').setFontSize(9).text('HORA: '+this.fecha.getHours()+':'+this.fecha.getMinutes()+':'+this.fecha.getMilliseconds() , 170,47);
    // doc.setLineWidth(2.5).line(10,50,200,50);//colocacion de linea

    // doc.setLineWidth(5).line(10,60,55,60)
    // doc.setFont('Helvetica','normal').setFontSize(10).text('EFECTIVO', 12,62);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total          $ '+(this.totales.total_efectivo ?? 0), 60,62);

    // doc.setLineWidth(5).line(10,70,55,70)
    // doc.setFont('Helvetica','normal').setFontSize(12).text('TARJETA', 12,72);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total          $ '+this.tarjeta, 60,72);

    // doc.setLineWidth(5).line(10,80,55,80)
    // doc.setFont('Helvetica','normal').setFontSize(12).text('TRANSFERENCIA', 12,82);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total          $ '+this.transferencia, 60,82);

    // doc.setLineWidth(5).line(10,90,55,90)
    // doc.setFont('Helvetica','normal').setFontSize(12).text('CREDITO', 12,92);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total          $ '+this.credito, 60,92);

    // doc.setLineWidth(5).line(10,100,55,100)
    // doc.setFont('Helvetica','normal').setFontSize(12).text('CHEQUE', 12,102);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total          $ '+this.cheque, 60,102);

    // doc.setLineWidth(5).line(10,110,55,110)
    // doc.setFont('Helvetica','normal').setFontSize(12).text('DEPOSITO', 12,112);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total          $ '+this.deposito, 60,112);

    // doc.setLineWidth(5).line(10,120,55,120)
    // doc.setFont('Helvetica','normal').setFontSize(12).text('FONDO', 12,122);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total          $ '+this.fondo, 60,122);

    // doc.setLineWidth(2.5).line(140,130,200,130);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Saldo inicial          $ '+this.fondo, 140,137);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total efectivo        $ '+this.efectivo, 140,142);
    // doc.setFont('Helvetica','normal').setFontSize(10).text('Total neto             $ '+this.total, 140,147);
    // doc.setLineWidth(3).line(140,150,200,150);


    // doc.save("Corte-de-caja.pdf");

    // this.ngOnInit()
  }

}

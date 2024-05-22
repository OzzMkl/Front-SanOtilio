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
  providers:[MessageService],
})
export class CorteDeCajaComponent implements OnInit {

  //Modelos
  public  sesiones:any//getVerificaSesionesCaja
  public  movCaja:any//getMovSesionCaja
  public  selectedCaja:any//getMovSesionCaja
  public empleado:any//loaduser
  public totales?: totales_caja;
  public fondo:number = 0;//getMovSesionCaja

  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  // chart
  public chartData: any ;
  public chartOptions: any;
  //Spinner
  isLoadingGeneral: boolean = false;

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

  /**
   * @description
   * Verificamos los permisos del usuario respecto al modulo
   */
  loadUser(){

    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCaja_Cortecaja.idModulo,this.mCaja_Cortecaja.idSubModulo);
    if(this.userPermisos.editar == 1 && this.userPermisos.ver && this.userPermisos.agregar == 1){
      this.empleado = this._empleadoService.getIdentity();
      this.getVerificaSesionesCaja();
    } else{
      handleRedirect(5,this._router,this.messageService);
    }
  }

  /**
   * @description
   * trae todas las sesiones de abiertas en caja
   */
  getVerificaSesionesCaja(){
    this.isLoadingGeneral = true;
    this._cajaService.verificaSesionCaja().subscribe(
      response => {
        if(response.code == 200 && response.status == 'success'){
          this.sesiones = response.caja
          this.isLoadingGeneral = false;
        }
      }, error =>{
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al consultar las sesiones disponibles.'
        })
        console.log(error);
      }
    )
  }

  /**
   * 
   * @param idCaja Number
   * Buscar los movimientos de caja a partir del numero de sesion recibido
   */
  getMovSesionCaja(idCaja:number){
    this.isLoadingGeneral = true;

    this.resetVariables();
    
    this._cajaService.movimientosSesionCaja(idCaja).subscribe(
      response => {
        //console.log(response)
        if(response.status == 'success' && response.code == 200){

          this.selectedCaja = response.caja;
          this.movCaja = response.caja_mov;
          this.totales = response.totales;
          this.fondo = response.caja.fondo;
          this.chartData = {
            labels: ['EFECTIVO', 'TARJETA', 'TRANSFERENCIA', 'CREDITO', 'CHEQUE', 'DEPOSITO'],
            datasets:[
              {
                label: 'Monto',
                data: [
                  this.totales?.total_efectivo,
                  this.totales?.total_tarjeta,
                  this.totales?.total_transferencia,
                  this.totales?.total_credito,
                  this.totales?.total_cheque,
                  this.totales?.total_deposito,
                ]
              }
            ]
          }
          this.isLoadingGeneral = false;
        }
      }, error =>{
        console.error(error)
      }
    )
  }

  /**
   * @description
   * Resetea variables a default
   */
  resetVariables():void{
    // this.sesiones = null;
    this.movCaja = null;
    this.selectedCaja = null;
    this.totales = undefined;
    this.fondo = 0;
    this.chartData = {};
  }

  /**
   * 
   */
  generaCorte(){
    this.isLoadingGeneral = true;
    const imgChart = document.getElementById('idChart');
    const canvasElement = imgChart?.querySelector('canvas');
    let dataURL = ''

    if(canvasElement){
      dataURL = canvasElement.toDataURL('image/png').split(',')[1];
    }

    this._cajaService.cierreCaja(this.empleado.sub ,this.selectedCaja,this.totales,dataURL).subscribe(
      (response: Blob) => {
        this.getVerificaSesionesCaja();
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        
        this.isLoadingGeneral = false;
        window.location.reload();
      },
      error => {
        console.error('Error en la solicitud:', error);
      }
    )
  }

}

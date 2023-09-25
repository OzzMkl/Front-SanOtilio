import { Component, OnInit } from '@angular/core';
//Services
import { SucursalService } from 'src/app/services/sucursal.service';
import { EmpresaService } from 'src/app/services/empresa.service';
//Modelos
import { Traspaso } from 'src/app/models/traspaso';
import { Empresa } from 'src/app/models/empresa';
//primeng
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';

@Component({
  selector: 'app-traspaso-agregar',
  templateUrl: './traspaso-agregar.component.html',
  styleUrls: ['./traspaso-agregar.component.css'],
  providers:[MessageService, ConfirmationService]
})
export class TraspasoAgregarComponent implements OnInit {

  //modelos
  public traspaso: Traspaso = new Traspaso(0,0,0,0,0,0,0,'',null,null);
  public empresaSesion: Empresa = new Empresa(0,'','','','','','','','','','','','','','');
  //Recive services
  public sucursales: Array<any> = [];
  //Ayudantes
  public tipoTraspaso: string = '';
  public classSelect: string = 'col-5';
  public classInput: string = 'col-1';

  constructor(
    private _sucursalService: SucursalService,
    private _empresaService: EmpresaService,
    private _confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) { }

  ngOnInit(): void {
    this.getSucursales();
    this.getEmpresa();
  }

  //Getters

  /**
   * @description
   * Obtiene todas las sucursales
   */
  getSucursales(){
    this._sucursalService.getSucursales().subscribe(
      response =>{
        if(response.status == 'success'){
          this.sucursales = response.sucursales;
        }
        console.log(this.sucursales);
      }, error =>{
        console.log(error);
      });
  }

  /**
   * @description
   * Obtiene la empresa/sucursal en la que se esta loguedo
   */
  getEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe(
      response =>{
        if(response.status == 'success'){
          this.empresaSesion = response.empresa[0];
          console.log(this.empresaSesion);
        }
      }, error =>{
        console.log(error);
      });
  }

  //Funciones

  /**
   * 
   */
  changeTipoTraspaso(){
    if(this.traspaso.sucursalE == this.empresaSesion.idSuc && this.traspaso.sucursalR == this.empresaSesion.idSuc){
      this.tipoTraspaso = 'Uso interno';
      this.classSelect = 'col-3';
      this.classInput = 'col-2';
      this.confirmUsoInterno();
    } else if(this.traspaso.sucursalE == this.empresaSesion.idSuc){
      this.tipoTraspaso = 'Envia';
      this.classSelect = 'col-5';
      this.classInput = 'col-1';
    } else if(this.traspaso.sucursalR == this.empresaSesion.idSuc){
      this.tipoTraspaso = 'Recibe';
      this.classSelect = 'col-4';
      this.classInput = 'col-1';
    } else if(this.traspaso.sucursalE != this.empresaSesion.idSuc && this.traspaso.sucursalR != this.empresaSesion.idSuc){
      if(this.traspaso.sucursalE != 0 && this.traspaso.sucursalR != 0){
        this.messageService.add({severity:'error', summary:'Error', detail:'Tienes que elegir tu sucursal de sesion en una de las opciones.'});
        this.tipoTraspaso = '';
        this.classSelect = 'col-5';
        this.classInput = 'col-1';
      }
    }
  }

  /**
   * @description
   * Confirm de uso interno, habilitara mas opciones si es aceptada
   * Si no se regresan a 0 los valores sucursalE y sucursalR
   */
  confirmUsoInterno() {
    this._confirmationService.confirm({
        message: 'Al enviar a la misma sucursal se considera uso interno ¿Esta seguro(a)?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //this.messageService.add({severity:'info', summary:'Confirmado', detail:'Venta'});
        },
        reject: (type:any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de uso interno cancelado.'});
                    this.traspaso.sucursalE = 0;
                    this.traspaso.sucursalR = 0;
                    this.tipoTraspaso = '';
                    this.classSelect = 'col-5';
                    this.classInput = 'col-1';
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion deuso interno cancelado.'});
                    this.traspaso.sucursalE = 0;
                    this.traspaso.sucursalR = 0;
                    this.tipoTraspaso = '';
                    this.classSelect = 'col-5';
                    this.classInput = 'col-1';
                break;
            }
        }
    });
  }

}

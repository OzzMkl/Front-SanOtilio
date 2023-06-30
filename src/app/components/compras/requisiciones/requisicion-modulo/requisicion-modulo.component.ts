import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import {MessageService} from 'primeng/api';
import { ModulosService } from 'src/app/services/modulos.service';


@Component({
  selector: 'app-requisicion-modulo',
  templateUrl: './requisicion-modulo.component.html',
  styleUrls: ['./requisicion-modulo.component.css'],
  providers:[EmpleadoService,MessageService]  
})
export class RequisicionModuloComponent implements OnInit {

  public page_title: string;
  mReq = this._modulosService.modsRequisicion();
  public userPermisos:  any ;

  constructor(
    private messageService: MessageService,
    private _modulosService:ModulosService,
    public _empleadoService : EmpleadoService,

  ) { this.page_title = 'Modulo de Requisiciones'; }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mReq.idModulo, this.mReq.idSubModulo);
  }

}

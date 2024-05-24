import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import {MessageService} from 'primeng/api';
import { ModulosService } from 'src/app/services/modulos.service';

@Component({
  selector: 'app-compra-modulo',
  templateUrl: './compra-modulo.component.html',
  styleUrls: ['./compra-modulo.component.css'],
  providers:[EmpleadoService,MessageService]
})
export class CompraModuloComponent implements OnInit {

  public page_title: string;
  mComp = this._modulosService.modsCompra();
  public userPermisos:  any ;

  constructor(
    private messageService: MessageService,
    private _modulosService:ModulosService,
    public _empleadoService : EmpleadoService,

  ) { this.page_title = 'Modulo de Compra'; }

  ngOnInit(): void {
    this.loadUser();
  }
  
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mComp.idModulo, this.mComp.idSubModulo);
  }
}

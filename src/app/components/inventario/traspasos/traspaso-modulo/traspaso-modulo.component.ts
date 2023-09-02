import { Component, OnInit } from '@angular/core';

import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-traspaso-modulo',
  templateUrl: './traspaso-modulo.component.html',
  styleUrls: ['./traspaso-modulo.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class TraspasoModuloComponent implements OnInit {

  //PERMISOS
  public userPermisos:  any ;
  public mTras = this._modulosService.modsTraspaso();

  constructor(  private _empleadoService: EmpleadoService,
                private _modulosService: ModulosService) { }

  ngOnInit(): void {
    this.loadUser();
  }
  loadUser(){
    this.userPermisos= this._empleadoService.getPermisosModulo(this.mTras.idModulo, this.mTras.idSubModulo);
  }

}

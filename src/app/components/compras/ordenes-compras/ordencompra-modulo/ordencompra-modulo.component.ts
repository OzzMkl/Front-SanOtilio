import { Component, OnInit } from '@angular/core';
//servicio
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-ordencompra-modulo',
  templateUrl: './ordencompra-modulo.component.html',
  styleUrls: ['./ordencompra-modulo.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class OrdencompraModuloComponent implements OnInit {

  public userPermisos:any;
  //PERMISOS
  public mOrdC = this._modulosService.modsOrdendeCompra();

  constructor( private _empleadoService: EmpleadoService, private _modulosService: ModulosService) { }

  ngOnInit(): void {
    this.loadUser()
  }
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mOrdC.idModulo, this.mOrdC.idSubModulo);
  }
}

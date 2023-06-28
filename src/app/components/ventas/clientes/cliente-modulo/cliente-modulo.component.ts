import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';

@Component({
  selector: 'app-cliente-modulo',
  templateUrl: './cliente-modulo.component.html',
  styleUrls: ['./cliente-modulo.component.css']
})
export class ClienteModuloComponent implements OnInit {

  //PERMISOS
  public userPermisos:  any ;
  public mCli = this._modulosService.modsInventario();

  constructor(private _empleadoService:EmpleadoService, private _modulosService: ModulosService) { }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCli.idModulo, this.mCli.idSubModulo);
  }

}

import { Component, OnInit } from '@angular/core';
//servicio
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-proveedor-modulo',
  templateUrl: './proveedor-modulo.component.html',
  styleUrls: ['./proveedor-modulo.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class ProveedorModuloComponent implements OnInit {

  //PERMISOS
  public userPermisos:  any ;
  public mProv = this._modulosService.modsProveedores();
  
  constructor(private _empleadoService: EmpleadoService, private _modulosService: ModulosService) {}

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mProv.idModulo,this.mProv.idSubModulo);
  }
}
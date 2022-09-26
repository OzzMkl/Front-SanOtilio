import { Component, OnInit } from '@angular/core';
//servicio
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-proveedor-modulo',
  templateUrl: './proveedor-modulo.component.html',
  styleUrls: ['./proveedor-modulo.component.css'],
})
export class ProveedorModuloComponent implements OnInit {

  public userPermisos:any
  
  constructor(private _empleadoService: EmpleadoService) {}

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo();
    console.log(this.userPermisos)
  }
}
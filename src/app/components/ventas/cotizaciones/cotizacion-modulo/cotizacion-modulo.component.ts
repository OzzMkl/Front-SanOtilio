import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-cotizacion-modulo',
  templateUrl: './cotizacion-modulo.component.html',
  styleUrls: ['./cotizacion-modulo.component.css']
})
export class CotizacionModuloComponent implements OnInit {

  public userPermisos:any

  constructor(private _empleadoService:EmpleadoService) { }

  ngOnInit(): void {
    this.loadUser()
  }
  
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo()
  }

}

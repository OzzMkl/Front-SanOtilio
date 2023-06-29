import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';

@Component({
  selector: 'app-cotizacion-modulo',
  templateUrl: './cotizacion-modulo.component.html',
  styleUrls: ['./cotizacion-modulo.component.css']
})
export class CotizacionModuloComponent implements OnInit {

 //PERMISOS
 public userPermisos:  any ;
 public mCoti = this._modulosService.modsCotizaciones();

  constructor( private _empleadoService:EmpleadoService,
               private _modulosService: ModulosService) { }

  ngOnInit(): void {
    this.loadUser()
  }
  
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCoti.idModulo, this.mCoti.idSubModulo);
  }

}

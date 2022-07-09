import { Component, OnInit } from '@angular/core';
//servicio
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-ordencompra-modulo',
  templateUrl: './ordencompra-modulo.component.html',
  styleUrls: ['./ordencompra-modulo.component.css']
})
export class OrdencompraModuloComponent implements OnInit {

  public userPermisos:any;

  constructor(private _empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.loadUser()
  }
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo();
  }
}

import { Component, OnInit } from '@angular/core';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-cliente-modulo',
  templateUrl: './cliente-modulo.component.html',
  styleUrls: ['./cliente-modulo.component.css']
})
export class ClienteModuloComponent implements OnInit {

  public userPermisos:any

  constructor(private _empleadoService:EmpleadoService) { }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo()
  }

}

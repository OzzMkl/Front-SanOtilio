import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-producto-modulo',
  templateUrl: './producto-modulo.component.html',
  styleUrls: ['./producto-modulo.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class ProductoModuloComponent implements OnInit {

  //PERMISOS
  public userPermisos:  any ;

  constructor( private _empleadoService: EmpleadoService ) {}

  permisosModulo = {
    idModulo: 5,
    idSubModulo: 13
  }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.permisosModulo.idModulo, this.permisosModulo.idSubModulo);
  }

}
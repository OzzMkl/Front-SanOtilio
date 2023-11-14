import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-caja-modulo',
  templateUrl: './caja-modulo.component.html',
  styleUrls: ['./caja-modulo.component.css'],
  providers: [EmpleadoService, MessageService]
})
export class CajaModuloComponent implements OnInit {

  // Permisos
  public userPermisos: any;
  public mCaja = this._modulosService.modsCaja();

  constructor(
    private _empleadoService: EmpleadoService,
    private _modulosService:ModulosService
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(
                            this.mCaja.idModulo, 
                            this.mCaja.idSubModulo
                        );
  }

}

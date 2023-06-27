import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
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
  public mInv = this._modulosService.modsInventario();

  constructor( private _empleadoService: EmpleadoService, private _modulosService: ModulosService ) {}


  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mInv.idModulo, this.mInv.idSubModulo);
  }

}
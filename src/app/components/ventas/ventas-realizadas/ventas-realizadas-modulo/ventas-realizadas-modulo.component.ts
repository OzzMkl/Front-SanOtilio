import { Component, OnInit } from '@angular/core';
//servicios
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-ventas-realizadas-modulo',
  templateUrl: './ventas-realizadas-modulo.component.html',
  styleUrls: ['./ventas-realizadas-modulo.component.css']
})
export class VentasRealizadasModuloComponent implements OnInit {

  public userPermisos:any;
  //PERMISOS
  private idModulo: number = 6;
  private idSubmodulo: number = 17;

  constructor(private _empleadoService:EmpleadoService) { }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.idModulo, this.idSubmodulo);
  }

}

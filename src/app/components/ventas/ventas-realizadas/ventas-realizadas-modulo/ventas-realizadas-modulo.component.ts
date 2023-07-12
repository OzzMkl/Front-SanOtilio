import { Component, OnInit } from '@angular/core';
//servicios
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';

@Component({
  selector: 'app-ventas-realizadas-modulo',
  templateUrl: './ventas-realizadas-modulo.component.html',
  styleUrls: ['./ventas-realizadas-modulo.component.css']
})
export class VentasRealizadasModuloComponent implements OnInit {

  //PERMISOS
  public userPermisos:any;
  public mPuV = this._modulosService.modsPuntodeVenta();

  constructor(private _empleadoService:EmpleadoService, private _modulosService: ModulosService) { }

  ngOnInit(): void {
    this.loadUser()
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mPuV.idModulo, this.mPuV.idSubModulo);
  }

}

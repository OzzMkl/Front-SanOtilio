import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';

@Component({
  selector: 'app-empleado-editar',
  templateUrl: './empleado-editar.component.html',
  styleUrls: ['./empleado-editar.component.css']
})
export class EmpleadoEditarComponent implements OnInit {

  public page_title: string;
  public empleado: Empleado;

  constructor() {
    this.page_title = 'Ajustes de usuario';
    this.empleado = new Empleado(1,'','','ROLE_USER','','','','','','','','','','',1,1,1,1,'','',1,1);
   }

  ngOnInit(): void {
  }

}

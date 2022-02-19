import { Component, OnInit } from '@angular/core';
import { DepartamentoVerComponent } from '../clasificaciones/departamentos/departamento-ver/departamento-ver.component';

@Component({
  selector: 'app-clasificacion-modulo',
  templateUrl: './clasificacion-modulo.component.html',
  styleUrls: ['./clasificacion-modulo.component.css'],
})
export class ClasificacionModuloComponent implements OnInit {
  public page_title: string; 

  
  constructor() {
    this.page_title = 'Modulo de Clasificaciones';
    
  }
  
  ngOnInit(): void {
    // Podemos escuchar, también, a los eventos
    // (des de cualquier punto)
  }
  
}

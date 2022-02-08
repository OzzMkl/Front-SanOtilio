import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proveedor-modulo',
  templateUrl: './proveedor-modulo.component.html',
  styleUrls: ['./proveedor-modulo.component.css'],
})
export class ProveedorModuloComponent implements OnInit {

  public page_title: string;
  
  constructor(
  ) { 
    this.page_title = 'Modulo de Proveedores';
    
  }

  ngOnInit(): void {
  }

}
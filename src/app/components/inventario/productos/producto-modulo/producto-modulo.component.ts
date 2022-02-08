import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-producto-modulo',
  templateUrl: './producto-modulo.component.html',
  styleUrls: ['./producto-modulo.component.css']
})
export class ProductoModuloComponent implements OnInit {

  public page_title: string;

  constructor(    
  ) {
      this.page_title = 'Modulo de Productos'

   }

  ngOnInit(): void {
  }

}
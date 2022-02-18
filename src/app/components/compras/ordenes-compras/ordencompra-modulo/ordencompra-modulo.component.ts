import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ordencompra-modulo',
  templateUrl: './ordencompra-modulo.component.html',
  styleUrls: ['./ordencompra-modulo.component.css']
})
export class OrdencompraModuloComponent implements OnInit {

  public page_title: string;

  constructor() {this.page_title='Modulo de Ordenes de compra' }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-compra-modulo',
  templateUrl: './compra-modulo.component.html',
  styleUrls: ['./compra-modulo.component.css']
})
export class CompraModuloComponent implements OnInit {

  public page_title: string;

  constructor() { this.page_title = 'Modulo de Compra'; }

  ngOnInit(): void {
  }

}

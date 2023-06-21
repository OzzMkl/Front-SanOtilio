import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-requisicion-modulo',
  templateUrl: './requisicion-modulo.component.html',
  styleUrls: ['./requisicion-modulo.component.css']
})
export class RequisicionModuloComponent implements OnInit {

  public page_title: string;

  constructor() { this.page_title = 'Modulo de Requisiciones'; }

  ngOnInit(): void {
  }

}

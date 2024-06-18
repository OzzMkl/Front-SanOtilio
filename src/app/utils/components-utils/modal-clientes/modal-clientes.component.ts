import { Component, OnInit } from '@angular/core';
//Interfaces
import { selectBusqueda } from 'src/app/models/interfaces/selectBusqueda';
import { dialogOptionsClientes } from 'src/app/models/interfaces/dialogOptions-clientes';

@Component({
  selector: 'app-modal-clientes',
  templateUrl: './modal-clientes.component.html',
  styleUrls: ['./modal-clientes.component.css']
})
export class ModalClientesComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

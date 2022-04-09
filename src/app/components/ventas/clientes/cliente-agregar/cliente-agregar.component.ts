import { Component, OnInit } from '@angular/core';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
//modelo
import { Cliente } from 'src/app/models/cliente';

@Component({
  selector: 'app-cliente-agregar',
  templateUrl: './cliente-agregar.component.html',
  styleUrls: ['./cliente-agregar.component.css'],
  providers:[ClientesService]
})
export class ClienteAgregarComponent implements OnInit {

  //variables servicios
  public tipocliente :any;
  //variable formulario
  public isCredito: boolean = false;
  //modelo
  public cliente: Cliente;

  constructor( private _clienteService: ClientesService) { 
    this.cliente = new Cliente (0,'','','','','',0,1,0,null);
  }

  ngOnInit(): void {
    this.getTipocliente();
  }
  getTipocliente(){//obtenemos los tipos de clientes para el select
    this._clienteService.getTipocliente().subscribe(
      response =>{
        this.tipocliente = response.tipocliente;
      },error =>{
        console.log(error);
      });
  }
  guardarCliente(){
    console.log(this.cliente);
  }

}

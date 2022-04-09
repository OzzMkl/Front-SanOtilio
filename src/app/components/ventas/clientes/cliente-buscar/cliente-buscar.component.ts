import { Component, OnInit } from '@angular/core';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { global } from 'src/app/services/global';
//router sirve para redireccionar a otra ruta
import { Router } from '@angular/router';


@Component({
  selector: 'app-cliente-buscar',
  templateUrl: './cliente-buscar.component.html',
  styleUrls: ['./cliente-buscar.component.css'],
  providers:[ClientesService]
})
export class ClienteBuscarComponent implements OnInit {

  public clientes:any;

  constructor( private _clienteService: ClientesService ) { }

  ngOnInit(): void {
    this.getClientes();
  }
  getClientes(){
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          console.log(this.clientes);
        }
      },error =>{
      console.log(error);
    });
  }

}

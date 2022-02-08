import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/models/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { global } from 'src/app/services/global';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-proveedor-deshabilitados',
  templateUrl: './proveedor-deshabilitados.component.html',
  styleUrls: ['./proveedor-deshabilitados.component.css'],
  providers: [ProveedorService]
})
export class ProveedorDeshabilitadosComponent implements OnInit {

  public page_title: string;//declaramos titulo de la pagina
  public url:string; //declaramos la url global para las peticiones al backend
  //public proveedores: Array<Proveedor>;//creamos un array de tipo objeto de proveedores
  public proveedores: any;
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  fpv = '';

  constructor(
    private _proveedorService: ProveedorService//se declara el servicio
  ) { 
    this.page_title = 'Proveedores deshabilitados';//asignamos el contenido al titulo
    this.url = global.url;//se asigna la url del servicio global
    this.proveedores = [];//se crea el array
  }

  ngOnInit(): void {
    this.getProve();//inicializamos el metodo
  }

getProve(){
  this._proveedorService.getProveedoresDes().subscribe(//subscribimos el metodo al servicio
    response =>{
      if(response.status == 'success'){
        this.proveedores = response.proveedores;//lenamos el array
        console.log(response.proveedores);
      }
    },
    error =>{
      console.log(error);
    }
  );
}

}

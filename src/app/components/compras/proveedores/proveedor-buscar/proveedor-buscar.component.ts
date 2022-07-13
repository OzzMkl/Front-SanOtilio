import { Component, OnInit } from '@angular/core';
import { Proveedor } from 'src/app/models/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { global } from 'src/app/services/global';
///
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-proveedor-buscar',
  templateUrl: './proveedor-buscar.component.html',
  styleUrls: ['./proveedor-buscar.component.css'],
  providers: [ProveedorService]
})
export class ProveedorBuscarComponent implements OnInit {
  
  public url:string;
  //public proveedores: Array<Proveedor>;
  public proveedores: any;
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  fpv = '';
  datox: any;

  constructor(
    private _proveedorService: ProveedorService,
    private _route: ActivatedRoute,
    private _router: Router
   ) { 
      
      this.url = global.url;
      this.proveedores = [];
      this.datox ='';
    }

  ngOnInit(): void {
    this.getProve();
  }

  getProve(){
    this._proveedorService.getProveedores().subscribe(
      response =>{
        if(response.status == 'success'){
          this.proveedores = response.proveedores;
          //navegacion de paginacion
          this.totalPages = response.proveedores.total;
          
          //console.log(response.proveedores);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  selected(dato:any){
    this.datox = dato;
    this._router.navigate(['./proveedor-modulo/proveedorVer/'+this.datox]);
  }

}

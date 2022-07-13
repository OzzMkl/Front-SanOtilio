import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-deshabilitados',
  templateUrl: './producto-deshabilitados.component.html',
  styleUrls: ['./producto-deshabilitados.component.css'],
  providers: [ProductoService]
})
export class ProductoDeshabilitadosComponent implements OnInit {

  public url:string;
  public productos: any;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  fpd='';
  datox:any;

  constructor(
    private _productoService: ProductoService,
    private _router: Router
  ) {
    this.url = global.url;
    this.productos = [];
    this.datox='';
   }

  ngOnInit(): void {
    this.getProd();
  }
  getProd(){
    this._productoService.getProductosDes().subscribe(
      response =>{
        if(response.status == 'success'){
          this.productos = response.productos;
          //navegacion paginacion
          this.totalPages = response.productos.total;
          console.log(response.productos);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  selected(dato:any){
    this.datox = dato;
    this._router.navigate(['./producto-modulo/producto-ver/'+this.datox]);
  }

}

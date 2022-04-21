import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css'],
  providers: [ProductoService]
})
export class ProductoBuscarComponent implements OnInit {

  public page_title: string;
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
    this.page_title = 'Buscar Productos';
    this.url = global.url;
    this.productos = [];
    this.datox='';
   }

  ngOnInit(): void {
    this.getProd();
  }

  getProd(){
    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.productos = response.productos;
          console.log(this.productos)
          //navegacion paginacion
          this.totalPages = response.productos.total;
          //console.log(response.productos);
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

import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { HttpClient} from '@angular/common/http';
import { global } from 'src/app/services/global';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css'],
  providers: [ProductoService]
})
export class ProductoBuscarComponent implements OnInit {

  
  public url:string;
  public productos: any;
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  fpd='';
  datox:any;

  //spinner
  public isLoading:boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _router: Router,
    private _http: HttpClient
  ) {
    
    this.url = global.url;
    this.productos = [];
    this.datox='';
   }

  ngOnInit(): void {
    this.getProd();
  }

  getProd(){
    this.isLoading = true;
    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.productos = response.productos.data;
          //console.log(this.productos)

          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          this.next_page = response.productos.next_page_url;
          this.path = response.productos.path
          
          
          this.isLoading = false;
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
  getPage(page:any) {
    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        //console.log(response);
        this.productos = response.productos.data;
        //navegacion paginacion
        this.totalPages = response.productos.total;
        this.itemsPerPage = response.productos.per_page;
        this.pageActual = response.productos.current_page;
        this.next_page = response.productos.next_page_url;
        this.path = response.productos.path
        
    })
  }

}

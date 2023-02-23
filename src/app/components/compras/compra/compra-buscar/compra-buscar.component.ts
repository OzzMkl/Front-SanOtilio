import { Component, OnInit } from '@angular/core';
import { CompraService } from 'src/app/services/compra.service';
import { HttpClient} from '@angular/common/http';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-compra-buscar',
  templateUrl: './compra-buscar.component.html',
  styleUrls: ['./compra-buscar.component.css'],
  providers: [CompraService]
})
export class CompraBuscarComponent implements OnInit {

  //public proveedores: Array<Proveedor>;
  public compras: Array<any> = [];
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;

  public tipoBusqueda: number = 1;
  //spinner
  public isLoading:boolean = false;
  //Subscripciones
  private getCompraSub : Subscription = new Subscription;

  constructor(
    private _compraService: CompraService,
    private _router: Router,
    private _http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getComprasR();
  }

  //
  
  getComprasR(){
    //mostramos el spinner
    this.isLoading = true;


    this.getCompraSub = this._compraService.getComprasRecibidas().subscribe(
      response =>{
        if(response.status == 'success'){

          this.compras = response.compra.data;
          //navegacion de paginacion
          this.totalPages = response.compra.total;
          this.itemsPerPage = response.compra.per_page;
          this.pageActual = response.compra.current_page;
          this.next_page = response.compra.next_page_url;
          this.path = response.compra.path;

          //una vez terminado quitamos el spinner
          this.isLoading=false;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  /**
   * 
   * @param page
   * Es el numero de pagina a la cual se va acceder
   * @description
   * De acuerdo al numero de pagina recibido lo concatenamos a
   * la direccion para "ir" a esa direccion y traer la informacion
   * no retornamos ya que solo actualizamos las variables a mostrar
   */
  getPage(page:number) {
    //iniciamos spinner
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        
        this.compras = response.compra.data;
        //navegacion de paginacion
        this.totalPages = response.compra.total;
        this.itemsPerPage = response.compra.per_page;
        this.pageActual = response.compra.current_page;
        this.next_page = response.compra.next_page_url;
        this.path = response.compra.path;

        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }

  

   /**
   * Destruye las subscripciones a los observables de regitro proveedor
   * y obtecion de bancos
   */
   ngOnDestroy(): void {
    this.getCompraSub.unsubscribe();
  }

}

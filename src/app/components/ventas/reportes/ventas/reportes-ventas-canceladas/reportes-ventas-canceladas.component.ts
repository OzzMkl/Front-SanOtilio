import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-reportes-ventas-canceladas',
  templateUrl: './reportes-ventas-canceladas.component.html',
  styleUrls: ['./reportes-ventas-canceladas.component.css']
})
export class ReportesVentasCanceladasComponent implements OnInit {

  //Spinners
  public isLoadingGeneral: boolean = false;
  //variables servicios
  public ventas_canceladas: Array<any> = [];
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;

  constructor(
    private _ventasService:VentasService,
    private _router:Router,
    private _http: HttpClient
  ) { }

  ngOnInit(): void {
    this.getVentasCanceladas();
  }

  getVentasCanceladas(){
    this.isLoadingGeneral = true;
    this._ventasService.getVentasCanceladas().subscribe(
      response =>{
        if(response.code == 200 && response.status == 'success'){
          //datos
          this.ventas_canceladas = response.ventas_canceladas.data;
          //paginacion
          this.totalPages = response.ventas_canceladas.total;
          this.itemsPerPage = response.ventas_canceladas.per_page;
          this.pageActual = response.ventas_canceladas.current_page;
          this.next_page = response.ventas_canceladas.next_page_url;
          this.path = response.ventas_canceladas.path;
          //se quita el spinner
          this.isLoadingGeneral = false;
        }
      }, error =>{
        console.log(error);
      }
    )
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
    //mostramos el spinner
    this.isLoadingGeneral = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        //console.log(response);
        this.ventas_canceladas = response.ventas_canceladas.data;
        //navegacion paginacion
        this.totalPages = response.ventas_canceladas.total;
        this.itemsPerPage = response.ventas_canceladas.per_page;
        this.pageActual = response.ventas_canceladas.current_page;
        this.next_page = response.ventas_canceladas.next_page_url;
        this.path = response.ventas_canceladas.path;
        
        //una vez terminado de cargar quitamos el spinner
        this.isLoadingGeneral = false;
    });
  }

}

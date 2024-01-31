import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  //pipe
  public tipoBusqueda:number = 1;
  buscaFolio=''
  buscaNombreCliente='';
  buscaNombreEmpleado='';

  constructor(
    private _ventasService:VentasService,
    private _router:Router,
  ) { }

  ngOnInit(): void {
    this.getVentasCanceladas();
  }

  getVentasCanceladas(page:number = 1){
    this.isLoadingGeneral = true;
    this._ventasService.getVentasCanceladas(page).subscribe(
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

  //ponemos vacio al cambiar entre tipo de busqueda
  seleccionTipoBusqueda(e:any){
    this.buscaFolio='';
    this.buscaNombreCliente='';
    this.buscaNombreEmpleado='';
  }

}

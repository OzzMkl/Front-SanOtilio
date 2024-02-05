import { Component, OnInit } from '@angular/core';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';

@Component({
  selector: 'app-reportes-ventas-finalizadas',
  templateUrl: './reportes-ventas-finalizadas.component.html',
  styleUrls: ['./reportes-ventas-finalizadas.component.css']
})
export class ReportesVentasFinalizadasComponent implements OnInit {

  //Spinners
  public isLoadingGeneral: boolean = false;
  visible: boolean = false;
  //variables servicios
  public ventas_finalizadas: Array<any> = [];
  public detalles_venta: Array<any> = [];
  public productos_venta: Array<any> = [];
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //pipe
  public tipoBusqueda: string = "uno";
  search='';
  public mpageActual:any;//para el modal

  constructor(
    private _ventasService:VentasService,
  ) { }

  ngOnInit(): void {
    this.getVentasFinalizadas();
  }

  /**
   * 
   * @param page Number Pagina de donde comenzara a traer los datos. Default 1
   * @param type Number Tipo de busqueda. Default 0
   * @param search String Cadena a buscar. Default "null"
   * 
   * @description Trae los datos de las ventas canceladas paginados
   */
  getVentasFinalizadas(page:number = 1,type:number = 0,search:string = "null"){
    this.isLoadingGeneral = true;
    this._ventasService.getVentasFinalizadas(page,type,search).subscribe(
      response =>{
        if(response.code == 200 && response.status == 'success'){
          //datos
          this.ventas_finalizadas = response.ventas_finalizadas.data;
          //paginacion
          this.totalPages = response.ventas_finalizadas.total;
          this.itemsPerPage = response.ventas_finalizadas.per_page;
          this.pageActual = response.ventas_finalizadas.current_page;
          this.next_page = response.ventas_finalizadas.next_page_url;
          this.path = response.ventas_finalizadas.path;
          //se quita el spinner
          this.isLoadingGeneral = false;
        }
      }, error =>{
        console.log(error);
      }
    )
  }

  /**
   * @description
   * Obtiene la informacion del input y busca
   */
  selectBusqueda(){
    
    if(this.search == "" || null){
     
      this.getVentasFinalizadas();
    } else{
     
     switch(this.tipoBusqueda){
       case "uno"://Folio
           this.getVentasFinalizadas(1,1,this.search);
         break;
       case "dos"://cliente
          this.getVentasFinalizadas(1,2,this.search);
         break;
       case "tres"://vendedor
          this.getVentasFinalizadas(1,3,this.search);
         break;
       default:
        //  console.log('default tp'+this.tipoBusqueda)
          break;
      }
    }//finelse
    
  }

  getDetallesVenta(idVenta:number){
    this.isLoadingGeneral = true;
    this._ventasService.getDetallesVentaFinalizada(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){
          // console.log(response)

          this.detalles_venta = response.venta_finalizada;
          this.productos_venta = response.productos_ventasf;

          this.isLoadingGeneral = false;
          this.visible = true;
        }
      }, error =>{
        console.log(error);
      }
    );
  }

}

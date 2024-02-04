import { Component, OnInit } from '@angular/core';
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
  visible: boolean = false;
  //variables servicios
  public ventas_canceladas: Array<any> = [];
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
    this.getVentasCanceladas();
  }

  /**
   * 
   * @param page Number Pagina de donde comenzara a traer los datos. Default 1
   * @param type Number Tipo de busqueda. Default 0
   * @param search String Cadena a buscar. Default "null"
   * 
   * @description Trae los datos de las ventas canceladas paginados
   */
  getVentasCanceladas(page:number = 1,type:number = 0,search:string = "null"){
    this.isLoadingGeneral = true;
    this._ventasService.getVentasCanceladas(page,type,search).subscribe(
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
   * @description
   * Obtiene la informacion del input y busca
   */
  selectBusqueda(){
    
      if(this.search == "" || null){
       
        this.getVentasCanceladas();
     } else{
       
       switch(this.tipoBusqueda){
         case "uno"://Folio
             this.getVentasCanceladas(1,1,this.search);
           break;
         case "dos"://cliente
            this.getVentasCanceladas(1,2,this.search);
           break;
         case "tres"://vendedor
            this.getVentasCanceladas(1,3,this.search);
           break;
          case "cuatro"://empleado cancela
            this.getVentasCanceladas(1,4,this.search);
           break;
         default:
          //  console.log('default tp'+this.tipoBusqueda)
            break;
        }
      }//finelse
      
  }

  getDetallesVenta(idVenta:number){
    this.isLoadingGeneral = true;
    this._ventasService.getDetallesVentaCancelada(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){
          // console.log(response)

          this.detalles_venta = response.venta_cancelada;
          this.productos_venta = response.productos_ventascan;

          this.isLoadingGeneral = false;
          this.visible = true;
        }
      }, error =>{
        console.log(error);
      }
    );
  }

}

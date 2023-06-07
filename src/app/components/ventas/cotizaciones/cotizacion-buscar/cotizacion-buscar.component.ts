import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { global } from 'src/app/services/global';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cotizacion-buscar',
  templateUrl: './cotizacion-buscar.component.html',
  styleUrls: ['./cotizacion-buscar.component.css']
})
export class CotizacionBuscarComponent implements OnInit {

 
  //variable servicios
  public url:string = global.url; //globla import
  public cotizaciones:Array<any> = [];//getCotizaciones
  public detallesCotiza:any;//getDetallesCotiza
  public productosdCotiza:any;//getDetallesCotiza
  public empresa:any;//getDetallesEmpresa
  public userPermisos:any//loadUser
  //paginador
  public totalPages:any;
  public path: any;
  public next_page:any;
  public prev_page:any;
  public itemsPerPage:any;
  public pageActual:any;
  public mpageActual:any;
  //pipe
  tipoBusqueda: number = 1;
  //spinner
  public isLoading: boolean = false;
  
  constructor(  private _ventasService: VentasService,
                private modalService: NgbModal,
                private _empresaService: EmpresaService,
                private _empleadoService: EmpleadoService,
                private _http: HttpClient) {

                 }

  ngOnInit(): void {
    this.getCotizaciones();
    this.getDatosEmpresa();
    this.loadUser()
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo()
  }

  //obtenemos array con todas las cotizaciones
  getCotizaciones(){
    //mostramos spinner
    this.isLoading = true;
    //ejecutamos servicio
    this._ventasService.getIndexCotiza().subscribe( 
      response =>{
        if(response.status == 'success'){
          //asignamos respuesta de datos
          this.cotizaciones = response.Cotizaciones.data;
          //console.log(this.cotizaciones);

          //navegacion de paginacion
          this.totalPages = response.Cotizaciones.total;
          this.itemsPerPage = response.Cotizaciones.per_page;
          this.pageActual = response.Cotizaciones.current_page;
          this.next_page = response.Cotizaciones.next_page_url;
          this.path = response.Cotizaciones.path;

          //Un vez terminado de cargar quitamos el spinner
          this.isLoading = false;
        }
      },error=>{
        console.log(error)
      });
  }
  
  getDatosEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe( 
      response => {
        if(response.status == 'success'){
           this.empresa = response.empresa;
           //console.log(this.empresa)
        }
      },error => {console.log(error)});
  }

  getDetallesCotiza(idCotiza:any){
    this._ventasService.getDetallesCotiza(idCotiza).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.detallesCotiza = response.Cotizacion;
          this.productosdCotiza = response.productos_cotiza; 
        }
      },error=>{
        console.log(error);
      });
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
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        this.cotizaciones = response.Cotizaciones.data;
          //console.log(this.cotizaciones);

          //navegacion de paginacion
          this.totalPages = response.Cotizaciones.total;
          this.itemsPerPage = response.Cotizaciones.per_page;
          this.pageActual = response.Cotizaciones.current_page;
          this.next_page = response.Cotizaciones.next_page_url;
          this.path = response.Cotizaciones.path;

        
        //una vez terminado de cargar quitamos el spinner
        this.isLoading = false;
    })
  }

  generaPDF(idCotiza:number){
    this._ventasService.getPDF(idCotiza).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
  }

  // Metodos del  modal
  open(content:any) {//abrir modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      // this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {//cerrarmodal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}

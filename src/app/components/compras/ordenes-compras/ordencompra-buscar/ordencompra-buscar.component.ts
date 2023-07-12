import { Component, OnInit } from '@angular/core';
//Servicio
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { global } from 'src/app/services/global';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-ordencompra-buscar',
  templateUrl: './ordencompra-buscar.component.html',
  styleUrls: ['./ordencompra-buscar.component.css'],
  providers:[OrdendecompraService]
})
export class OrdencompraBuscarComponent implements OnInit {

  /***** */
  public userPermisos:any
  /***** */
  constructor( private _ordendecompraService: OrdendecompraService,private _empresaService: EmpresaService,
               private modalService: NgbModal,public _empleadoService : EmpleadoService) { }


  public fechaActual : Date = new Date();
  //Variables de servicios
  public ordenesdecompra: any = [];
  public detallesOrdencompra:any;
  public productosDOC:any;
  public empresa:any;//getDetallesEmpresa
  public url: string = global.url;
  /**PAGINATOR */
  // public totalPages: any;
  // public page: any;
  // public next_page: any;
  // public prev_page: any;
  pageActual: number = 1;
  pagina:number =1;
  //Pipes
  tipoBusqueda: number = 1;
  buscarOrdProveedor='';
  buscarOrdId='';
  //modal
  closeResult = '';
  //spinner
  public isLoading: boolean = false;
  //variable para el pdf
  public fecha : Date = new Date();
//PERMISOS
private idModulo: number = 3;
private idSubmodulo: number = 6;



  ngOnInit(): void {
    this.getAllOrdenes();
    this.loadUser();
    //console.log(this.fechaActual.toLocaleDateString());
  }
  getAllOrdenes(){//obtener todas las ordenes de compras
    this.isLoading = true;
    this._ordendecompraService.getAllOrders().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ordenesdecompra = response.ordencompra;
          //console.log(this.ordenesdecompra);
          this.isLoading = false;
        }else{
          console.log('Algo salio mal');
        }
      },error =>{
        console.log(error);
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
  seleccionTipoBusqueda(e:any){//Limpiar input del tipo de busqueda
    this.buscarOrdId='';
    this.buscarOrdProveedor='';
  }
  selected(dato:any){//mandamos el dato seleccionado de la tabla
    this.getDetailsOrder(dato);
  }
  getDetailsOrder(id:any){//recibimos el id y traemos informacion de esa orden
    this._ordendecompraService.getDetailsOrdes(id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesOrdencompra = response.ordencompra;
          this.productosDOC = response.productos;

          //console.log(this.detallesOrdencompra);
          //console.log(this.productosDOC);
        }else{ console.log('Algo salio mal');}
        
      },error => {
        console.log(error);
      });
  }
  
  // Modal
  open(content:any) {//abre modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {//cierra modal con teclado ESC o al picar fuera del modal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  /***** */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.idModulo, this.idSubmodulo);
  }
  /***** */

  generaPDF(){
    
    
  }

}

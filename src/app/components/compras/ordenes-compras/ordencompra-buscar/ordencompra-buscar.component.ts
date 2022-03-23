import { Component, OnInit } from '@angular/core';
//Servicio
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { global } from 'src/app/services/global';
//router
import { Router } from '@angular/router';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ordencompra-buscar',
  templateUrl: './ordencompra-buscar.component.html',
  styleUrls: ['./ordencompra-buscar.component.css'],
  providers:[OrdendecompraService]
})
export class OrdencompraBuscarComponent implements OnInit {

  constructor( private _ordendecompraService: OrdendecompraService, private _router: Router,
               private modalService: NgbModal) { }

  public page_title: string = 'Ordenes de compra por recibir';
  //Variables de servicios
  public ordenesdecompra: any = [];
  public detallesOrdencompra:any;
  public productosDOC:any;
  public url: string = global.url;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  //Pipes
  tipoBusqueda: number = 1;
  buscarOrdProveedor='';
  buscarOrdId='';
  //modal
  closeResult = '';



  ngOnInit(): void {
    this.getAllOrdenes();
  }
  getAllOrdenes(){
    this._ordendecompraService.getAllOrders().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ordenesdecompra = response.ordencompra;
          console.log(this.ordenesdecompra);
        }else{
          console.log('Algo salio mal');
        }
      },error =>{
        console.log(error);
      });
  }
  seleccionTipoBusqueda(e:any){//Limpiar input del tipo de busqueda
    this.buscarOrdId='';
    this.buscarOrdProveedor='';
  }
  selected(dato:any){
    this.getDetailsOrder(dato);
  }
  getDetailsOrder(id:any){
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
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}

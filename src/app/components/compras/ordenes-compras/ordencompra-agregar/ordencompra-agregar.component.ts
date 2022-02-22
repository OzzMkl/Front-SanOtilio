import { Component, OnInit } from '@angular/core';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
//Modelos
import { Ordencompra } from 'src/app/models/orden_compra';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ordencompra-agregar',
  templateUrl: './ordencompra-agregar.component.html',
  styleUrls: ['./ordencompra-agregar.component.css'],
  providers:[ProveedorService]
})
export class OrdencompraAgregarComponent implements OnInit {

  closeResult = '';

  public proveedoresLista:any;
  public proveedorVer:any;
  public orden_compra: Ordencompra;

  constructor( private _proveedorService: ProveedorService,
      private modalService: NgbModal
    ) {
    this.orden_compra = new Ordencompra(0,null,0,'',null,0,0,null);
   }

  ngOnInit(): void {
    this.getProvee();
  }
  onChange(id:any){//evento que muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }
  getProvee(){
    this._proveedorService.getProveedores().subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedoresLista = response.proveedores;
          
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getProveeVer(id:any){
    this._proveedorService.getProveedoresVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedorVer = response.proveedores;
          console.log(this.proveedorVer);
        }
      }, error =>{
          console.log(error);
      }
    );
  }
  // Modal
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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

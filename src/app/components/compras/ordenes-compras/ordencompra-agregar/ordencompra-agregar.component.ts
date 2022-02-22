import { Component, OnInit } from '@angular/core';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
//Modelos
import { Ordencompra } from 'src/app/models/orden_compra';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ordencompra-agregar',
  templateUrl: './ordencompra-agregar.component.html',
  styleUrls: ['./ordencompra-agregar.component.css'],
  providers:[ProveedorService,ProductoService]
})
export class OrdencompraAgregarComponent implements OnInit {

  closeResult = '';

  public proveedoresLista:any;
  public proveedorVer:any;
  public orden_compra: Ordencompra;
  public productos: any;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;

  buscarProducto = '';

  constructor( private _proveedorService: ProveedorService,
      private modalService: NgbModal,
      private _productoService: ProductoService
    ) {
    this.orden_compra = new Ordencompra(0,null,0,'',null,0,0,null);
   }

  ngOnInit(): void {
    this.getProvee();
    this.getAllProducts();
  }
  onChange(id:any){//evento que muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }
  //Servicios
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
  getAllProducts(){
    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.productos = response.productos;
          //navegacion paginacion
          this.totalPages = response.productos.total;
          //console.log(response.productos);
        }
      },
      error =>{
        console.log(error);
      }
    );
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

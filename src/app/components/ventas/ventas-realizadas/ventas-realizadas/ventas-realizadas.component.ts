import { Component, OnInit } from '@angular/core';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ventas-realizadas',
  templateUrl: './ventas-realizadas.component.html',
  styleUrls: ['./ventas-realizadas.component.css']
})
export class VentasRealizadasComponent implements OnInit {

  //variables servicios
  public ventas:any;
  public detallesVenta:any;
  public productosDVenta:any;
  public userPermisos:any//loaduser
  //spinner de carga
  public isLoading:boolean = false;
  //paginator
  public totalPages:any;
  public page:any;
  public next_page:any;
  public prev_page:any;
  public pageActual:any;
  public mpageActual:any;//para el modal
  //pipe
  tipoBusqueda:number = 1;
  buscaFolio=''
  buscaNombreCliente='';
  buscaNombreEmpleado='';
  //cerrar modal
  closeResult = '';

  constructor( private _ventasService: VentasService, private modalService: NgbModal, private _empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.getVentas();
    this.loadUser()
  }
  getVentas(){
    this.isLoading = true;
    this._ventasService.getIndexVentas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ventas = response.Ventas
          this.isLoading = false;
        }
      }, error =>{
        console.log(error);
      }
    )
  }
  getDetallesVenta(idVenta:any){
    this._ventasService.getDetallesVenta(idVenta).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesVenta = response.venta;
          this.productosDVenta = response.productos_ventasg;
        }
      },error =>{
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
  //cargamos permisos
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo()
  }
  // Metodos del  modal
  open(content:any) {//abrir modal
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

import { Component, OnInit } from '@angular/core';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpresaService } from 'src/app/services/empresa.service';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-notas-por-cobrar',
  templateUrl: './notas-por-cobrar.component.html',
  styleUrls: ['./notas-por-cobrar.component.css']
})
export class NotasPorCobrarComponent implements OnInit {

  //variables servicios
  public ventas:any;
  public detallesVenta:any;
  public productosDVenta:any;
  public empresa:any;//getDetallesEmpresa
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
 

  constructor(private _ventasService: VentasService, private modalService: NgbModal, private _empresaService: EmpresaService) { }

  ngOnInit(): void {
    this.getVentas();
    this.getDatosEmpresa();
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
  getDatosEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe( 
      response => {
        if(response.status == 'success'){
           this.empresa = response.empresa;
           console.log(this.empresa)
        }
      },error => {console.log(error)});
  }
  //ponemos vacio al cambiar entre tipo de busqueda
  seleccionTipoBusqueda(e:any){
    this.buscaFolio='';
    this.buscaNombreCliente='';
    this.buscaNombreEmpleado='';
  }
  generaPDF(){
    const doc = new jsPDF;
    //para la tabla de productos
    var cabeceras =["CLAVE EXTERNA","DESCRIPCION","PRECIO","CANTIDAD","DESCUENTO","SUBTOTAL"];
    var rows:any = [];
    var logo = new Image();
    logo.src = "assets/images/logo-solo.png"

    // variable con logo, tipo x1,y1, ancho, largo
    doc.addImage(logo,'PNG',10,9,25,25);
    doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
    //          tipografia       tamaño letra       texto                                        x1,y1
    doc.setFont('Helvetica').setFontSize(18).text('MATERIALES PARA CONSTRUCCION \"SAN OTILIO\"', 40,15);
    doc.setFont('Helvetica').setFontSize(9).text(this.empresa[0]['nombreCorto']+': COLONIA '+this.empresa[0]['colonia']+', CALLE '+ this.empresa[0]['calle']+' #'+this.empresa[0]['numero']+', '+this.empresa[0]['ciudad']+', '+this.empresa[0]['estado'], 45,20);
    doc.setFont('Helvetica').setFontSize(9).text('CORREOS: '+this.empresa[0]['correo1']+', '+this.empresa[0]['correo2'],60,25);
    doc.setFont('Helvetica').setFontSize(9).text('TELEFONOS: '+this.empresa[0]['telefono']+' ó '+this.empresa[0]['telefono2']+'   RFC: '+this.empresa[0]['rfc'],68,30);
    //GUARDAMOS PDF
    doc.save("venta-"+this.detallesVenta[0]['idVenta']+".pdf");

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

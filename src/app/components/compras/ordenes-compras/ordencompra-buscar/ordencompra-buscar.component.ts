import { Component, OnInit } from '@angular/core';
//Servicio
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { global } from 'src/app/services/global';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
    
    const doc = new jsPDF;
    var cabeceras = ["CLAVE EXTERNA","DESCRIPCION","MEDIDA","CANTIDAD"];
    var rows:any = [];
    var logo = new Image();//CREAMOS VARIABLE
    logo.src = 'assets/images/logo-solo.png'//ASIGNAMOS LA UBICACION DE LA IMAGEN
    var nombreE = this.detallesOrdencompra[0]['nombreEmpleado']//concatenamos el nombre completo 
    
    doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS

    //           ancho linea   x1,y1  x2,y2
    doc.setLineWidth(2.5).line(10,10,200,10);//colocacion de linea
    doc.setLineWidth(2.5).line(50,15,160,15);
    //          tipografia       tamaño letra       texto                         x1,y1
    doc.setFont('Helvetica').setFontSize(16).text('MATERIALES PARA CONSTRUCCION', 55,25);
    doc.setFont('Helvetica').setFontSize(16).text(" \"SAN OTILIO\" ", 85,30);
    // variable con logo, tipo x1,y1, ancho, largo
    doc.addImage(logo,'PNG',100,32,10,10);
    doc.setFont('Helvetica').setFontSize(10).text('REPORTE DE ORDEN DE COMPRA', 10,50);
    doc.setLineWidth(2.5).line(10,53,70,53);
    //           tipografia,negrita        tamaño          texto              x1,y1
    doc.setFont('Helvetica','bold').setFontSize(10).text('NO. ORDEN: '+this.detallesOrdencompra[0]['idOrd'], 10,60);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA IMPRESION: '+this.fecha.toLocaleDateString(), 50,65);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA ESTIMADA: '+this.detallesOrdencompra[0]['fecha'].substring(0,10), 115,65);  

    doc.setLineWidth(1).line(10,70,200,70);
    doc.setFont('Helvetica','normal').setFontSize(10).text('REALIZO: '+ nombreE.toUpperCase(), 10,75);
    doc.setFont('Helvetica','normal').setFontSize(10).text('PROVEEDOR: '+this.detallesOrdencompra[0]['nombreProveedor'], 10,80);
    doc.setFont('Helvetica','normal').setFontSize(10).text('OBSERVACIONES: '+this.detallesOrdencompra[0]['observaciones'], 10,85);


    doc.setLineWidth(1).line(10,92,200,92);
    //recorremos los productos con un foreah
    this.productosDOC.forEach((element:any) => {
      var temp = [ element.claveEx,element.descripcion,element.nombreMedida,element.cantidad];//creamos variable "temporal" y asignamos 
      rows.push(temp);//añadimos a fila
    });
    //generamos la tabla
    autoTable(doc,{ head:[cabeceras],
    body:rows, startY:95 })
    //creamos el pdf
    doc.save("ordencompra"+this.detallesOrdencompra[0]['idOrd']+".pdf");
  }

}

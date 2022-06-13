import { Component, OnInit } from '@angular/core';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { MonedaLiteralService } from 'src/app/services/moneda-literal.service';
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
 

  constructor(private _ventasService: VentasService, private modalService: NgbModal, private _empresaService: EmpresaService,
              private _monedaLiteral: MonedaLiteralService) { }

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
          //console.log(this.detallesVenta)
          //console.log(this.productosDVenta)
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
           //console.log(this.empresa)
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
    var cabeceras =["CLAVE EXTERNA","DESCRIPCION","MEDIDA","PRECIO","CANTIDAD","DESCUENTO","SUBTOTAL"];
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
    //           ancho linea   x1,y1  x2,y2
    doc.setLineWidth(2.5).line(10,37,200,37);//colocacion de linea
    doc.setLineWidth(5).line(10,43,55,43);//colocacion de linea
    //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1     
    doc.setFont('Helvetica','bold').setFontSize(12).text('VENTA #'+this.detallesVenta[0]['idVenta'], 12,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('VENDEDOR: '+this.detallesVenta[0]['nombreEmpleado'].toUpperCase(), 60,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('FECHA: '+this.detallesVenta[0]['created_at'].substring(0,10), 170,45);
    doc.setLineWidth(2.5).line(10,50,200,50);//colocacion de linea
    doc.setFont('Helvetica','normal').setFontSize(9).text('CLIENTE: '+this.detallesVenta[0]['nombreCliente'], 10,55);
    doc.setFont('Helvetica','normal').setFontSize(9).text('RFC: '+this.detallesVenta[0]['clienteRFC'], 165,55);
    //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1   PONEMOS TEXTO JUSTIFICADO    ENTRE        ANCHO MAXIMO
    doc.setFont('Helvetica','normal').setFontSize(9).text('DIRECCION: '+this.detallesVenta[0]['cdireccion'], 10,60,{align: 'justify',lineHeightFactor: 1.5,maxWidth:190});
    ///
    //doc.setFont('Helvetica','normal').setFontSize(9).text('TELEFONO: 0000000000', 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('EMAIL: '+this.detallesVenta[0]['clienteCorreo'], 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('TIPO CLIENTE: '+this.detallesVenta[0]['tipocliente'], 60,70);
    doc.setLineWidth(2.5).line(10,75,200,75);//colocacion de linea
    //recorremos los productos
    this.productosDVenta.forEach((element:any) =>{
      var temp = [element.claveEx,element.descripcion,element.nombreMedida,element.precio,element.cantidad,element.descuento,element.total];
      rows.push(temp);
    });
    //generamos la tabla
    autoTable(doc,{ head:[cabeceras],
      body:rows, startY:80 });
      //OBTEMOS DONDE FINALIZA LA TABLA CREADA
      let posY = (doc as any).lastAutoTable.finalY;
      //         TIPOLETRA  NEGRITA O NORMAL     TAMAÑO                                                               X1, POSICION FINAL DE LA TABLA + 10
      doc.setFont('Helvetica','normal').setFontSize(9).text('SUBTOTAL:          $'+this.detallesVenta[0]['subtotal'], 145,posY+10);
      doc.setFont('Helvetica','normal').setFontSize(9).text('DESCUENTO:      $'+this.detallesVenta[0]['descuento'], 145,posY+15);
      doc.setFont('Helvetica','normal').setFontSize(9).text('TOTAL:                 $'+this.detallesVenta[0]['total'], 145,posY+20);
      doc.setFont('Helvetica','normal').setFontSize(9).text('OBSERVACIONES: '+this.detallesVenta[0]['observaciones'], 10,posY+32,{align: 'left',lineHeightFactor: 1.5,maxWidth:180});
      doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
      doc.setLineWidth(1).line(10,posY+47,200,posY+47);//colocacion de linea
      doc.setDrawColor(0, 0, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
      doc.setLineWidth(.3).line(10,posY+48,200,posY+48);//colocacion de linea
      doc.setLineWidth(.3).line(10,posY+48,10,posY+77);//colocacion de linea
      doc.setLineWidth(.3).line(200,posY+48,200,posY+77);//colocacion de linea
      doc.setLineWidth(.3).line(10,posY+77,200,posY+77);//colocacion de linea
      doc.setFont('Helvetica','normal').setFontSize(9).text('Por medio de este pagare me(nos) obligo(amos) a pagar incondicionalmente en este plazo, el dia     de', 15,posY+51);
      doc.setFont('Helvetica','normal').setFontSize(9).text('a nombre de LUNA PEREZ BENJAMIN por la cantidad de : $'+this.detallesVenta[0]['total'], 15,posY+56);
      doc.setFont('Helvetica','normal').setFontSize(9).text(this._monedaLiteral.numeroALetras(this.detallesVenta[0]['total'],''), 15,posY+61);
      doc.setFont('Helvetica','normal').setFontSize(9).text('Valor recibido en mercancias. En caso de no pagar a su vencimiento causara interes moratorio de     % mensual', 15,posY+66);
      doc.setFont('Helvetica','normal').setFontSize(9).text('________________________________', 77,posY+71);
      doc.setFont('Helvetica','normal').setFontSize(9).text('Acepto de conformidad', 89,posY+76);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*TODO CAMBIO CAUSARA UN 10% EN EL IMPORTE TOTAL.', 15,posY+81);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*TODA CANCELACION SE COBRARA 20% DEL IMPORTE TOTAL SIN EXCEPCION.', 15,posY+86);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*LA DESCARGA DE MATERIAL SERA EN UN MAXIMO DE 6m.', 15,posY+91);


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

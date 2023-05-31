import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
//Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { global } from 'src/app/services/global';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  buscarNomC ='';
  buscarFolio='';
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

  //ponemos vacio al cambiar entre tipo de busqueda
  seleccionTipoBusqueda(e:any){
    this.buscarFolio='';
    this.buscarNomC='';
  }

  generaPDF(){
    const doc = new jsPDF;
    //PARA LA TABAL DE PRODUCTOS
    var cabeceras = ["CLAVE EXTERNA","DESCRIPCION","MEDIDA","PRECIO","CANTIDAD","DESCUENTO","SUBTOTAL"];
    var rows:any = [];
    var logo = new Image();//CREAMOS VARIABLE DONDE ASIGNAREMOS LA IMAGEN
    logo.src = 'assets/images/logo-solo.png';//ASIGNAMOS LA UBICACION DE LA IMAGEN

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
    doc.setFont('Helvetica','bold').setFontSize(12).text('COTIZACION #'+this.detallesCotiza[0]['idCotiza'], 12,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('VENDEDOR: '+this.detallesCotiza[0]['nombreEmpleado'].toUpperCase(), 60,45);
    doc.setFont('Helvetica','normal').setFontSize(9).text('FECHA: '+this.detallesCotiza[0]['created_at'].substring(0,10), 170,45);
    doc.setLineWidth(2.5).line(10,50,200,50);//colocacion de linea
    doc.setFont('Helvetica','normal').setFontSize(9).text('CLIENTE: '+this.detallesCotiza[0]['nombreCliente'], 10,55);
    doc.setFont('Helvetica','normal').setFontSize(9).text('RFC: '+this.detallesCotiza[0]['clienteRFC'], 165,55);
    //          TIPOGRAFIA  NEGRITA O NORMAL  TAMAÑO        TEXTO      CONCATENAMOS                          X1,Y1   PONEMOS TEXTO JUSTIFICADO    ENTRE        ANCHO MAXIMO
    doc.setFont('Helvetica','normal').setFontSize(9).text('DIRECCION: '+this.detallesCotiza[0]['cdireccion'], 10,60,{align: 'justify',lineHeightFactor: 1.5,maxWidth:190});
    ///
    //doc.setFont('Helvetica','normal').setFontSize(9).text('TELEFONO: 0000000000', 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('EMAIL: '+this.detallesCotiza[0]['clienteCorreo'], 10,70);
    doc.setFont('Helvetica','normal').setFontSize(9).text('TIPO CLIENTE: '+this.detallesCotiza[0]['tipocliente'], 100,70);
    doc.setLineWidth(2.5).line(10,75,200,75);//colocacion de linea
    //recorremos los productos
    this.productosdCotiza.forEach((element:any) =>{
      var temp = [element.claveEx,element.descripcion,element.nombreMedida,element.precio,element.cantidad,element.descuento,element.subtotal];
      rows.push(temp);
    });
    //generamos la tabla
    autoTable(doc,{ head:[cabeceras],
      body:rows, startY:80 });
      //OBTEMOS DONDE FINALIZA LA TABLA CREADA
      let posY = (doc as any).lastAutoTable.finalY;
      //         TIPOLETRA  NEGRITA O NORMAL     TAMAÑO                                                               X1, POSICION FINAL DE LA TABLA + 10
      doc.setFont('Helvetica','normal').setFontSize(9).text('SUBTOTAL:          $'+this.detallesCotiza[0]['subtotal'], 145,posY+10);
      doc.setFont('Helvetica','normal').setFontSize(9).text('DESCUENTO:      $'+this.detallesCotiza[0]['descuento'], 145,posY+15);
      doc.setFont('Helvetica','normal').setFontSize(9).text('TOTAL:                 $'+this.detallesCotiza[0]['total'], 145,posY+20);
      doc.setFont('Helvetica','bold').setFontSize(9).text('*** TODOS LOS PRECIOS SON NETOS ***', 140,posY+25);

      doc.setFont('Helvetica','normal').setFontSize(9).text('OBSERVACIONES: '+this.detallesCotiza[0]['observaciones'], 10,posY+32,{align: 'left',lineHeightFactor: 1.5,maxWidth:180});
      doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS
      doc.setLineWidth(5).line(10,posY+47,200,posY+47);//colocacion de linea
      doc.setFont('Helvetica','bold').setFontSize(9).text('*** PRECIOS SUJETOS A CAMBIOS SIN PREVIO AVISO ***', 60,posY+48);
    //doc.autoPrint();
    //GUARDAMOS PDF
    doc.save("cotizacion-"+this.detallesCotiza[0]['idCotiza']+".pdf");
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

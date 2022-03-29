import { Component, OnInit } from '@angular/core';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//Modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//pdf
//import jsPDF from 'jspdf';
//import 'jspdf-autotable';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-ordencompra-agregar',
  templateUrl: './ordencompra-agregar.component.html',
  styleUrls: ['./ordencompra-agregar.component.css'],
  providers:[ProveedorService,ProductoService, OrdendecompraService, EmpleadoService]
})
export class OrdencompraAgregarComponent implements OnInit {
//cerrar modal
  closeResult = '';

  public proveedoresLista:any;
  public proveedorVer:any;
  public orden_compra: Ordencompra;
  public producto_orden: Producto_orden;
  public Lista_compras: Array<Producto_orden>;
  public productos: any;
  public isSearch: boolean = true;
  public idUser:any;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  pageActual2: number = 1;
//Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar = '';
  //variables servicios
  public dato:any;
  public productoVer: any;
  public url:any;
  public identity: any;
  public ultimaOrden: any;
  public detailOrd: any;
  public productosdetailOrd: any;
  //modelode bootstrap
  //modelode bootstrap
  model!: NgbDateStruct;
  //variable para el pdf
  public fecha : Date = new Date();

  constructor( private _proveedorService: ProveedorService,
      private modalService: NgbModal,
      private _productoService: ProductoService,
      public toastService: ToastService,
      private _ordencompraService: OrdendecompraService,
      public _empleadoService : EmpleadoService
    ) {
    this.orden_compra = new Ordencompra(0,null,0,'',null,0,1,null);
    this.producto_orden = new Producto_orden(0,0,0,null,null,null,null);
    this.Lista_compras = [];
    this.url = global.url;
    
   }

  ngOnInit(): void {
    this.getProvee();
    this.getAllProducts();
    this.loadUser();
    //this.createPDF();
    //this.getDetailsOrd();
  }
  
  //
  onChange(id:any){//evento que muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }
  capturar(datos:any){//Agregar a lista de compras
    if(this.producto_orden.cantidad == 0){
      this.toastService.show('No se pueden agregar productos con cantidad: 0',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.producto_orden.idProducto == 0){
      this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000})
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_orden.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this.Lista_compras.push({...this.producto_orden});
      this.isSearch=true;
    }
    
    //console.log(this.Lista_compras);
  } 
  consultarProducto(event:any){//mostrar informacion del producto al dar enter
      //alert('you just pressed the enter key'+event);
      this.dato=event.target.value;
      //console.log(this.dato)
      this.getProd(this.dato);
      this.isSearch = false;
      //console.log(this.producto_orden);
  }
  consultarProductoModal(dato:any){
    this.getProd(dato);
    this.isSearch = false;
  }
  agregarOrdCompra(form:any){//Enviar Form insertar en DB
    this.orden_compra.idEmpleado = this.identity['sub'];//asginamos id de Empleado
    this.orden_compra.fecha = this.model.year+'-'+this.model.month+'-'+this.model.day;//concatenamos la fecha del datepicker

   this._ordencompraService.registerOrdencompra(this.orden_compra).subscribe(
     response =>{
       if(response.status == 'Success!'){
        // console.log(response)       
        //   this.toastService.show(' ⚠ Orden creada', { classname: 'bg-warning  text-bold', delay: 5000 });
          this._ordencompraService.registerProductoscompra(this.Lista_compras).subscribe(
            res =>{
                //console.log(res);
                this.toastService.show(' ⚠ Orden creada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                this.getDetailsOrd();
                //this.createPDF();
            },error =>{
              console.log(<any>error);
              this.toastService.show('Ups... Fallo al agregar los productos a la orden de  compra', { classname: 'bg-danger text-light', delay: 15000 });
            });
       }else{
        console.log('fallo');  
        console.log(response);
       }
     },error =>{
      console.log(<any>error);
      this.toastService.show('Ups... Fallo al crear la Orden de compra', { classname: 'bg-danger text-light', delay: 15000 });
     });
  }
  //
  public createPDF():void{
    //this.getDetailsOrd();
    const doc = new jsPDF;
    var cabeceras = ["CLAVE EXTERNA","DESCRIPCION","MEDIDA","CANTIDAD"];
    var rows:any = [];
    var logo = new Image();//CREAMOS VARIABLE
    logo.src = 'assets/images/logo-solo.png'//ASIGNAMOS LA UBICACION DE LA IMAGEN
    var nombreE = this.detailOrd[0]['nombreEmpleado']//concatenamos el nombre completo 
    
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
    doc.setFont('Helvetica','bold').setFontSize(10).text('NO. ORDEN: '+this.detailOrd[0]['idOrd'], 10,60);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA IMPRESION: '+this.fecha.toLocaleDateString(), 50,65);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA ESTIMADA: '+this.detailOrd[0]['fecha'], 115,65);  

    doc.setLineWidth(1).line(10,70,200,70);
    doc.setFont('Helvetica','normal').setFontSize(10).text('REALIZO: '+ nombreE.toUpperCase(), 10,75);
    doc.setFont('Helvetica','normal').setFontSize(10).text('PROVEEDOR: '+this.detailOrd[0]['nombreProveedor'], 10,80);
    doc.setFont('Helvetica','normal').setFontSize(10).text('OBSERVACIONES: '+this.detailOrd[0]['observaciones'], 10,85);


    doc.setLineWidth(1).line(10,92,200,92);
    //recorremos los productos con un foreah
    this.productosdetailOrd.forEach((element:any) => {
      var temp = [ element.claveexterna,element.descripcion,element.nombreMedida,element.cantidad];//creamos variable "temporal" y asignamos 
      rows.push(temp);//añadimos a fila
    });
    //generamos la tabla
    autoTable(doc,{ head:[cabeceras],
    body:rows, startY:95 })
    //creamos el pdf
    doc.save('a.pdf')
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
          //console.log(this.proveedorVer);
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
  getProd(id:any){
    this._productoService.getProdclaveex(id).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.producto_orden.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_orden.claveEx = this.productoVer[0]['claveEx'];
        this.producto_orden.idProducto = this.productoVer[0]['idProducto'];
        this.producto_orden.nombreMedida = this.productoVer[0]['nombreMedida'];
        //console.log(this.productoVer);
      },error => {
        console.log(error);
      }
    );
  }
  loadUser(){
    this.identity = this._empleadoService.getIdentity();
  }
  getDetailsOrd(){
    this._ordencompraService.getLastOrd().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ultimaOrden = response.ordencompra;
          this._ordencompraService.getDetailsOrdes(this.ultimaOrden['idOrd']).subscribe(
            response => {
              this.detailOrd = response.ordencompra;
              this.productosdetailOrd = response.productos;
              this.createPDF();
            },error =>{
              console.log(error);
            });
        }else{
          console.log('fallo');
        }
        
      },error =>{
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
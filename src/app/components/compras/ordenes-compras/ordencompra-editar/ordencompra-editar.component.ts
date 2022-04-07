import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
//modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
//Modal
import { NgbDateStruct, NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-ordencompra-editar',
  templateUrl: './ordencompra-editar.component.html',
  styleUrls: ['./ordencompra-editar.component.css'],
  providers:[ProveedorService,ProductoService, OrdendecompraService, EmpleadoService]
})
export class OrdencompraEditarComponent implements OnInit {

//variables servicios
public url: string = global.url;

public orden_compra: Ordencompra;
public productosOrden: Producto_orden;
public lista_productosorden: Array<Producto_orden>;

public detallesProveedor:any;
public proveedoresLista:any;
public productos: any;
public productoVer: any;
public identity: any;
//variables de detalles de la orden
public detailOrd: any;
public productosdetailOrd: any;
public fecha : Date = new Date();
//variable para el cambio de fecha
public isSearch: boolean = true;
//date!: Date;
public test: boolean = false;
//modelode bootstrap datapicker
  model!: NgbDateStruct;
//paginador
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  pageActual2: number = 1;
  //cerrar modal
  closeResult = '';
  //Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar = '';

  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _productoService: ProductoService,
    public toastService: ToastService,
    private _ordencompraService: OrdendecompraService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.orden_compra = new Ordencompra (0,null,0,'',null,0,null,null);
    this.productosOrden = new Producto_orden(0,0,0,null,null,null,null);
    this.lista_productosorden = [];
    
   }

  ngOnInit(): void {
    this.getOrdencompra();
    this.getAllProveedores();
    this.getAllProducts();
    this.loadUser();
  }
  editarOrdCompra(form:any){//registrar edicion de la orden
    this.orden_compra.idEmpleado = this.identity['sub'];//asginamos id de Empleado

    if(this.test == true){//revisamos si el usuario quiso cambiar de fecha
      this.orden_compra.fecha = this.model.year+'-'+this.model.month+'-'+this.model.day;//concatenamos la fecha del datepicke
    }
    //console.log(this.orden_compra);
    //console.log(this.lista_productosorden);
    this._route.params.subscribe( params =>{
      let id =+ params['idOrd'];
      this._ordencompraService.updateOrdenCompra(id,this.orden_compra).subscribe( 
        response =>{
          if(response.status == 'success'){
            //console.log(response);
             this._ordencompraService.updateProductosOrderC(id,this.lista_productosorden).subscribe( 
               response=>{
                 if(response.status == 'success'){
                  this.toastService.show('Orden editada correcta,emte',{classname: 'bg-success text-light', delay: 3000});
                  this.getOrderModificada();
                   //console.log(response);
                 }else{
                  this.toastService.show('Algo salio mal con la lista de productos',{classname: 'bg-danger text-light', delay: 6000});
                   //console.log('Algo salio mal con la lista de productos');
                 }
            
               },error=>{
                this.toastService.show('Algo salio mal',{classname: 'bg-danger text-light', delay: 6000})
               console.log(error);
             });
          }else{
            console.log('Algo salio mal con la orden');
          }
          
        },error =>{ 
          console.log(error);
        });
    });
    
  }
  editarProducto(dato:any){//metodo para editar la lista de compras
    this.lista_productosorden = this.lista_productosorden.filter((item) => item.claveEx !== dato);//eliminamos el producto
    //consultamos la informacion para motrar el producto nuevamente
    this.getProd(dato);
    this.isSearch = false;
  }
  capturar(datos:any){//Agregar a lista de compras
    if(this.productosOrden.cantidad <= 0){
      this.toastService.show('No se pueden agregar productos con cantidad 0 ó menor a 0',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.productosOrden.idProducto == 0){
      this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000})
    }else if( this.lista_productosorden.find( x => x.idProducto == this.productosOrden.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this.lista_productosorden.push({...this.productosOrden});
      this.isSearch=true;
    }
    
    //console.log(this.Lista_compras);
  } 
  getOrdencompra(){//traemos la informacion de la orden seleccionada
    //Nos suscribimos al url para extraer el id
    this._route.params.subscribe( params =>{
      let id = + params['idOrd'];//la asignamos en una variable
      //Mandamos a traer la informacion de la orden de compra
      this._ordencompraService.getDetailsOrdes(id).subscribe(
        response =>{
          if(response.status  == 'success' && response.ordencompra.length > 0 && response.productos.length > 0){

            //asignamos de uno en uno las propiedades de la orden
            this.orden_compra.idProveedor = response.ordencompra[0]['idProveedor'];
            this.orden_compra.fecha = response.ordencompra[0]['fecha'];
            //this.date = new Date(response.ordencompra[0]['fecha']);
            this.orden_compra.idEmpleado = response.ordencompra[0]['idEmpleado'];
            this.orden_compra.idOrd = response.ordencompra[0]['idOrd'];
            this.orden_compra.idReq = response.ordencompra[0]['idReq'];
            this.orden_compra.idStatus = response.ordencompra[0]['idStatus'];
            this.orden_compra.observaciones = response.ordencompra[0]['observaciones'];
            this.orden_compra.updated_at = response.ordencompra[0]['updated_at'];
            //llenamos la lista con la respuesta obtenida
            this.lista_productosorden = response.productos;
            console.log(this.orden_compra.fecha);
          }
          //console.log(response.productos);
        },error =>{
          console.log(error);
      });
    });
  }
  getAllProveedores(){//Rellenamos el select de proveedores
    this._proveedorService.getProveedores().subscribe(
      response =>{
        this.proveedoresLista = response.proveedores;
      },error =>{
        console.log(error);
        
      });
  }
  seleccionaProveedor(id:any){//traemos informacion de acuerdo al proveedor seleccionado
    this._proveedorService.getProveedoresVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.detallesProveedor = response.proveedores;
        }
    },error =>{
      console.error(error);
    });
  }
  consultarProductoModal(dato:any){//traemos la informacion del producto seleccionado y lo mostramos
    this.getProd(dato);
    this.isSearch = false;
  }
  getAllProducts(){//traemos la informacion de todos los productos para el modal
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
  getProd(id:any){//servicio para obtener detalles del producto a traves de su claveexterna
    this._productoService.getProdclaveex(id).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.productosOrden.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.productosOrden.claveEx = this.productoVer[0]['claveEx'];
        this.productosOrden.idProducto = this.productoVer[0]['idProducto'];
        this.productosOrden.nombreMedida = this.productoVer[0]['nombreMedida'];
        //console.log(this.productoVer);
      },error => {
        console.log(error);
      }
    );
  }
  loadUser(){//traemos la informacion del usuario
    this.identity = this._empleadoService.getIdentity();
  }
  createPDF():void{//creamos el pdf
    const doc = new jsPDF
    var logo = new Image();//CREAMOS VARIABLE
    logo.src = 'assets/images/logo-solo.png';//ASIGNAMOS LA UBICACION DE LA IMAGEN
    var nombreE = this.detailOrd[0]['nombreEmpleado'];//concatenamos el nombre completo
    var cabeceras = ["CLAVE EXTERNA","DESCRIPCION","MEDIDA","CANTIDAD"];
    var rows:any = [];
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
      var temp = [ element.claveEx,element.descripcion,element.nombreMedida,element.cantidad];//creamos variable "temporal" y asignamos 
      rows.push(temp);//añadimos a fila
    });
    //generamos la tabla
    autoTable(doc,{ head:[cabeceras],
    body:rows, startY:95 })
    //creamos el pdf
    doc.save("OrdenModificada-"+this.detailOrd[0]['idOrd']+".pdf");
    //doc.save('a.pdf')
  }
  getOrderModificada(){//reconsultamos la informacion de la orden modificada
    this._route.params.subscribe( params => {
      let id =+ params['idOrd'];
      this._ordencompraService.getDetailsOrdes(id).subscribe( 
        response =>{
              this.detailOrd = response.ordencompra;
              this.productosdetailOrd = response.productos;
              this.createPDF();
        },error => {
        console.log(error);
      });
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
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }

}

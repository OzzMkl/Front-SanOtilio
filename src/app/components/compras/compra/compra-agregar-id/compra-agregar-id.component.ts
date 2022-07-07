import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MedidaService } from 'src/app/services/medida.service';
import { ImpuestoService } from 'src/app/services/impuesto.service';
import { CompraService } from 'src/app/services/compra.service';
//modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
import { Compra } from 'src/app/models/compra'
import { Producto_compra } from 'src/app/models/producto_compra';
//Modal
import { NgbDateStruct, NgbModal,ModalDismissReasons, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-compra-agregar-id',
  templateUrl: './compra-agregar-id.component.html',
  styleUrls: ['./compra-agregar-id.component.css'],
  providers:[ProveedorService,MedidaService,ProductoService,ImpuestoService,OrdendecompraService, EmpleadoService,CompraService]
})
export class CompraAgregarIdComponent implements OnInit {

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
//modelo de bootstrap datapicker
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



  public proveedorVer: any;
  public medidas: any;
  public impuestos: any;
  public impuestoVer: any;
  public idUser:any;

  //variables servicios
  public dato:any;
  public ultimaCompra: any;
  public detailComp: any;
  //modelo de bootstrap
  today = this.calendar.getToday();

  public compra: Compra;
  public Lista_compras: Array<Producto_compra>;
  public producto_compra: Producto_compra;



  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _productoService: ProductoService,
    public toastService: ToastService,
    private _ordencompraService: OrdendecompraService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
    private modalService: NgbModal,

    private _medidaService: MedidaService,
    private _impuestoService: ImpuestoService,
    public _compraService : CompraService,
    private calendar: NgbCalendar


  ) {
    this.orden_compra = new Ordencompra (0,null,0,'',null,0,null,null);
    this.productosOrden = new Producto_orden(0,0,0,'','','');
    this.lista_productosorden = [];

    this.compra = new Compra(0,null,null,0,0,0,0,0,0,null,'',null);
    this.producto_compra = new Producto_compra(0,0,0,0,1,null,null,null,null,null,null,0,null);
    this.Lista_compras = [];
    this.url = global.url;
  }

  ngOnInit(): void {
    this.getOrdencompra();
    this.getAllProveedores();
    this.getAllProducts();
    this.loadUser();
    this.getImpuesto();
  }

  getAllProveedores(){//Rellenamos el select de proveedores
    this._proveedorService.getProveedores().subscribe(
      response =>{
        this.proveedoresLista = response.proveedores;
      },error =>{
        console.log(error);
        
      });
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

  loadUser(){//traemos la informacion del usuario
    this.identity = this._empleadoService.getIdentity();
  }

  /*************** */

   /*Eventos*/
   onChange(id:any){//Muestra los datos del proveedor al seleccionarlo
    this.getProveeVer(id);
  }

  onChangeI(id:any){//Muestra los datos del impuesto al seleccionarlo
    this.getImpuestoVer(id);    
    // console.log(id);
  }

  onChangeT(subtotal:any){//Recalcula el subtotal al hacer un cambio
    this.producto_compra.subtotal = this.producto_compra.cantidad * this.producto_compra.precio;
    this.producto_compra.subtotal = this.producto_compra.subtotal + (this.producto_compra.subtotal * (this.producto_compra.valorImpuesto / 100)); 
  }

  cambioSeleccionado(e:any){//Limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = '';
  }

  capturar(datos:any){//Agregar a lista de compras
    if(this.producto_compra.cantidad <= 0 || this.producto_compra.precio <= 0 || this.producto_compra.subtotal <= 0){
      this.toastService.show('No se pueden agregar productos con cantidad, precio o importe menor o igual a 0',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.producto_compra.idProducto == 0){
      this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000})
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_compra.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this.Lista_compras.push({...this.producto_compra});
      this.isSearch=true;
    }
    console.log(this.Lista_compras);
  }

  consultarProductoModal(dato:any){
    let cantidad: any;
    cantidad = 0;
    this.getProd(dato,cantidad);
    this.isSearch = false;
  }

  consultarProducto(event:any){//Mostrar informacion del producto al dar enter
    //alert('you just pressed the enter key'+event);
    this.dato=event.target.value;
    //console.log(this.dato)
    let cantidad: any;
    cantidad = 0;
    this.getProd(this.dato,cantidad);
    this.isSearch = false;
    //console.log(this.producto_orden);
  
  }
  
  public createPDF():void{//Crear PDF
    //this.getDetailsOrd();
    const doc = new jsPDF;

    //Formateamos la fecha
    console.log(this.detailComp[0]['fechaRecibo']);
    
    

    var logo = new Image();//CREAMOS VARIABLE
    logo.src = 'assets/images/logo-solo.png'//ASIGNAMOS LA UBICACION DE LA IMAGEN
    var nombreE = this.identity['nombre']+' '+this.identity['apellido']+' '+this.identity['amaterno']//concatenamos el nombre completo 
    
    doc.setDrawColor(255, 145, 0);//AGREGAMOS COLOR NARANJA A LAS LINEAS

    //           ancho linea   x1,y1  x2,y2
    doc.setLineWidth(2.5).line(10,10,200,10);//colocacion de linea
    doc.setLineWidth(2.5).line(50,15,160,15);
    //          tipografia       tamaño letra       texto                         x1,y1
    doc.setFont('Helvetica').setFontSize(16).text('MATERIALES PARA CONSTRUCCION', 55,25);
    doc.setFont('Helvetica').setFontSize(16).text(" \"SAN OTILIO\" ", 85,30);
    // variable con logo, tipo x1,y1, ancho, largo
    doc.addImage(logo,'PNG',100,32,10,10);
    doc.setFont('Helvetica').setFontSize(10).text('REPORTE DE COMPRA', 10,50);
    doc.setLineWidth(2.5).line(10,53,70,53);
    //           tipografia,negrita        tamaño          texto              x1,y1
    doc.setFont('Helvetica','bold').setFontSize(10).text('NO. COMPRA: '+this.detailComp[0]['idCompra'], 10,60);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA IMPRESION: '+this.fecha.toLocaleDateString(), 50,65);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA DE RECEPCION: '+this.detailComp[0]['fechaRecibo'], 115,65);

    doc.setLineWidth(1).line(10,70,200,70);
    doc.setFont('Helvetica','normal').setFontSize(10).text('REALIZO: '+ nombreE.toUpperCase(), 10,75);
    doc.setFont('Helvetica','normal').setFontSize(10).text('PROVEEDOR: '+this.detailComp[0]['nombreProveedor'], 10,80);
    doc.setFont('Helvetica','normal').setFontSize(10).text('OBSERVACIONES: '+this.detailComp[0]['observaciones'], 10,85);


    doc.setLineWidth(1).line(10,92,200,92);
    autoTable(doc,{html: '#table_productos',startY:95})
    doc.save('a.pdf')
  } 

  getOrdencompra(){//traemos la informacion de la orden seleccionada
    //Nos suscribimos al url para extraer el id
    this._route.params.subscribe( params =>{
      let id = + params['idOrd'];//la asignamos en una variable
      //console.log(id);
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
            //console.log(this.orden_compra.fecha);
            
            //Asignar propiedades a la compra
            this.compra.idProveedor = response.ordencompra[0]['idProveedor'];
            this.compra.idOrd = response.ordencompra[0]['idOrd'];

          }
          console.log('---ORDEN DE COMPRA---');
          console.log(response.productos);
          console.log(this.compra);
        },error =>{
          console.log(error);
      });
    });
  }


/**SERVICIOS */
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

  getMedida(){
    this._medidaService.getMedidas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.medidas = response.medidas
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getProd(id:any,cantidad:any){
    this._productoService.getProdclaveex(id).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.producto_compra.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_compra.claveEx = this.productoVer[0]['claveEx'];
        this.producto_compra.idProducto = this.productoVer[0]['idProducto'];
        this.producto_compra.nombreMedida = this.productoVer[0]['nombreMedida'];
        this.producto_compra.cantidad = cantidad;
        //console.log(this.productoVer);
      },error => {
        console.log(error);
      }
    );
  }


  getDetailsOrd(){
    this._compraService.getLastCompra().subscribe(
      response =>{
        if(response.status == 'success'){
          this.ultimaCompra = response.compra;
          this._compraService.getDetailsCompra(this.ultimaCompra['idCompra']).subscribe(
            response => {
              this.detailComp = response.compra;
              console.log(this.detailComp);
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

  getImpuesto(){
    this._impuestoService.getImpuestos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.impuestos = response.impuestos
          console.log(this.impuestos);
        }
      },
      error => {
        console.log(error);
      }
    );
  }
  
  getImpuestoVer(id:any){
    //console.log(id);
    this._impuestoService.getImpuestoVer(id).subscribe(
      response => {
        if(response.status == 'success'){
          this.impuestoVer = response.impuesto;
          this.producto_compra.NombreImpuesto = response.impuesto[0]['nombre'];
          this.producto_compra.valorImpuesto = response.impuesto[0]['valor'];
          if(this.producto_compra.valorImpuesto > 0){
            // subtotal = subtotal + ( subtotal *( valorImpuesto /100));
            this.producto_compra.subtotal = this.producto_compra.cantidad * this.producto_compra.precio;
            this.producto_compra.subtotal = this.producto_compra.subtotal + (this.producto_compra.subtotal * (this.producto_compra.valorImpuesto / 100)); 
          }
          // console.log('Nombreimpuesto: ',this.producto_compra.NombreImpuesto);
          // console.log('valorImpuesto: ',this.producto_compra.valorImpuesto);
        }
      }, error =>{
          console.log(error);
      }
    );
  }

  agregarCompra(form:any){//Enviar Form insertar en DB
    this.compra.idEmpleadoR = this.identity['sub'];//asginamos id de Empleado
    this.compra.fechaRecibo = this.model.year+'-'+this.model.month+'-'+this.model.day;//concatenamos la fecha del datepicker
    this.compra.idStatus = 1;
    //console.log(this.compra);
    this._compraService.registrerCompra(this.compra).subscribe(
    response =>{
      if(response.status == 'Success!'){
        // console.log(response)       
        //   this.toastService.show(' ⚠ Orden creada', { classname: 'bg-warning  text-bold', delay: 5000 });
          this._compraService.registerProductoscompra(this.Lista_compras).subscribe(
            res =>{
                console.log(res);
                this.toastService.show(' ⚠ Compra creada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                this.getDetailsOrd();
                //this.createPDF();
            },error =>{
              console.log(<any>error);
              this.toastService.show('Ups... Fallo al agregar los productos a la compra', { classname: 'bg-danger text-light', delay: 15000 });
            });
        //Agregar a PELOTE
          this._compraService.updateExistencia(this.Lista_compras).subscribe(
            res =>{
                console.log(res);
                this.toastService.show(' ⚠ Producto-Existencia-Lote agregado exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                //this.getDetailsOrd();
                //this.createPDF();
            },error =>{
              console.log(<any>error);
              this.toastService.show('Ups... Fallo al agregar los productos a Producto-Existencia-Lote', { classname: 'bg-danger text-light', delay: 15000 });
            });

      }else{
        console.log('fallo');  
        console.log(response);
      }
    },error =>{
      console.log(<any>error);
      this.toastService.show('Ups... Fallo al crear la compra', { classname: 'bg-danger text-light', delay: 15000 });
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

  editarProducto(dato:any,cantidad:any){//metodo para editar la lista de compras
    console.log(dato,cantidad);
    this.lista_productosorden = this.lista_productosorden.filter((item) => item.claveEx !== dato);//eliminamos el producto
    //consultamos la informacion para motrar el producto nuevamente
    this.getProd(dato,cantidad);
    this.isSearch = false;
  }



}

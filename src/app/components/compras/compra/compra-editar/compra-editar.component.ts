import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { MedidaService } from 'src/app/services/medida.service';
import { ImpuestoService } from 'src/app/services/impuesto.service';
import { CompraService } from 'src/app/services/compra.service';
//modelos
import { Compra } from 'src/app/models/compra'
import { Producto_compra } from 'src/app/models/producto_compra';
//Modal
import { NgbDateStruct, NgbModal,ModalDismissReasons, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-compra-editar',
  templateUrl: './compra-editar.component.html',
  styleUrls: ['./compra-editar.component.css'],
  providers:[ProveedorService,MedidaService,ProductoService,ImpuestoService,EmpleadoService,CompraService]
})
export class CompraEditarComponent implements OnInit {

  //variables servicios
  public url: string = global.url;

  public compra: Compra;
  public producto_compra: Producto_compra;
  public Lista_compras: Array<Producto_compra>;

  public detallesProveedor:any;
  public proveedoresLista:any;
  public productos: any;
  public productoVer: any;
  public productoVerM: any;
  public identity: any;
  public impuestos: any;
  public proveedorVer: any;
  public medidas: any;
  public impuestoVer: any;
  public idUser:any;
  public fecha : Date = new Date();
  public test: boolean = false;
  public facturableCheck: boolean = false;  


  //Paginacion Lista de compras
  public totalPages2: any;
  public path2: any;
  public next_page2: any;
  public prev_page2: any;
  public itemsPerPage2:number=0;
  pageActual2: number = 0;

  //Paginacion modal
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;

  //cerrar modal
  closeResult = '';

  //Spinner
  public isSearch: boolean = true;

  //Variables para actualizar medida
  public medidaActualizada:any;

  //Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar = '';

  //variables servicios
  public dato:any;
  public ultimaCompra: any;
  public detailComp: any;

  //modelo de bootstrap datapicker
  model!: NgbDateStruct;
  modelP!: NgbDateStruct;
  today = this.calendar.getToday();
  public dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };



  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _productoService: ProductoService,
    public toastService: ToastService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
    private modalService: NgbModal,

    private _medidaService: MedidaService,
    private _impuestoService: ImpuestoService,
    public _compraService : CompraService,
    private calendar: NgbCalendar
  ) {
      this.compra = new Compra(0,null,0,0,0,0,0,0,null,'',false,null); 
      this.producto_compra = new Producto_compra(0,0,0,0,0,0,null,null,null,null,null,null,0,null);
      this.Lista_compras = [];
      this.url = global.url;
    
   }

  ngOnInit(): void {
    this.getCompra();
    this.getAllProveedores();
    this.getAllProducts();
    this.loadUser();
    this.getImpuesto();
  }

  /**ngOnInit */
    getCompra(){
      this._route.params.subscribe( params =>{
        let id = + params['idCompra'];//la asignamos en una variable
        //console.log('id',id);
        //Mandamos a traer la informacion de la orden de compra
        this._compraService.getDetailsCompra(id).subscribe(
          response =>{
            if(response.status  == 'success' && response.compra.length > 0 && response.productos.length > 0){
              // console.log('---INFORMACION DE COMPRA---');
              // console.log('response.compra',response.compra);
              // console.log('response.productos',response.productos);
              // console.log('---------------------------------');
              //Asignacion en variables para poder editar
              //asignamos de uno en uno las propiedades de la compra
              this.Lista_compras = response.productos;

              this.compra.idCompra = response.compra[0]['idCompra'];
              this.compra.idOrd = response.compra[0]['idOrd'];
              this.compra.idProveedor = response.compra[0]['idProveedor'];
              this.compra.folioProveedor = response.compra[0]['folioProveedor'];
              this.compra.subtotal = response.compra[0]['subtotal'];
              this.compra.total = response.compra[0]['total'];
              this.compra.idEmpleadoR = response.compra[0]['idEmpleadoR'];
              this.compra.idStatus = response.compra[0]['idStatus'];
              this.compra.fechaRecibo = response.compra[0]['fechaRecibo'];
              this.compra.observaciones = response.compra[0]['observaciones'];

            }
            

          },error =>{
            console.log(error);
        });
      });
    }

    getAllProveedores(){//Rellenamos el select de proveedores
      this._proveedorService.getProveedoresSelect().subscribe(
        response =>{
          this.proveedoresLista = response.provedores;
          //console.log(this.proveedoresLista);
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

    getImpuesto(){//traemos los impuestos
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
  /** */

  editarProductoC(p_d:any){//metodo para editar la lista de compras
    console.log('p_d',p_d);
    this.Lista_compras = this.Lista_compras.filter((item) => item.idProducto !== p_d.idProducto);//eliminamos el producto
    //consultamos la informacion para motrar el producto nuevamente
    this.getProd(p_d);

    //Calculo de subtotal y total de la compra
    this.compra.subtotal=this.compra.subtotal-(p_d.cantidad*p_d.precio);
    this.compra.total=this.compra.total-p_d.subtotal;
    console.log('Subtotal: ',this.compra.subtotal);
    console.log('Total: ',this.compra.total);

    this.isSearch = false;
  }  


  /**Servicios */
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

    getProd(lpo:any){//consultar producto y rellenar el formulario de producto
      console.log('getProd(lpo)',lpo);
      this._productoService.getProdverDos(lpo.idProducto).subscribe(
        response =>{
          this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
          console.log('productoVer',this.productoVer);
          this.producto_compra.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
          this.producto_compra.claveEx = this.productoVer[0]['claveEx'];
          this.producto_compra.idProducto = this.productoVer[0]['idProducto'];
          this.producto_compra.cantidad = lpo.cantidad;
          this.productoVerM = response.productos_medidas;//informacion completa de productos_medidas para recorrerlo atraves del html
          console.log('productoVerM',this.productoVerM);
          //obtener idProdMedida actualizado y asignarlo
          //buscar lpo.nombreMedida en productoVerM, regresar y asignar this.producto_compra.idProdMedida, this.producto_compra.nombreMedida
          this.medidaActualizada = this.productoVerM.find( (x:any) => x.nombreMedida == lpo.nombreMedida);
          console.log('medidaActualizada',this.medidaActualizada);
          this.producto_compra.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
          this.producto_compra.nombreMedida = this.medidaActualizada.nombreMedida;
          console.log('producto_compra',this.producto_compra)
          
        },error => {
          //console.log(error);
        }
      );
    }


    getLastCompra(){
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

    getImpuestoVer(id:any){
      //console.log(id);
      this._impuestoService.getImpuestoVer(id).subscribe(
        response => {
          if(response.status == 'success'){
            this.impuestoVer = response.impuesto;
            this.producto_compra.NombreImpuesto = response.impuesto[0]['nombre'];
            this.producto_compra.valorImpuesto = response.impuesto[0]['valor'];
            this.producto_compra.idImpuesto = response.impuesto[0]['idImpuesto'];
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

      if(this.model == undefined){
        this.toastService.show('Falta ingresar la fecha de recepción',{classname: 'bg-danger text-light', delay: 6000});
      }
      else if(this.compra.folioProveedor == 0){
        this.toastService.show('Falta ingresar el folio del proveedor',{classname: 'bg-danger text-light', delay: 6000});
      }
      else 
      {
        this.compra.fechaRecibo = this.model.year+'-'+this.model.month+'-'+this.model.day;//concatenamos la fecha del datepicker
        this.compra.idStatus = 1;
        //console.log(this.compra);
        this._compraService.registrerCompra(this.compra).subscribe(
        response =>{
          console.log('response',response)
          console.log('response.status',response.status)
          if(response.status == 'success'){
            console.log(response)       
            //   this.toastService.show(' ⚠ Orden creada', { classname: 'bg-warning  text-bold', delay: 5000 });
              this._compraService.registerProductoscompra(this.Lista_compras).subscribe(
                res =>{
                    console.log(res);
                    this.toastService.show(' ⚠ Compra creada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                    this.getLastCompra();
                    //this.createPDF();
                },error =>{
                  console.log(<any>error);
                  this.toastService.show('Ups... Fallo al agregar los productos a la compra', { classname: 'bg-danger text-light', delay: 15000 });
                });
            //Registro de lote
            // this._compraService.registerLote().subscribe( res =>{
            //   console.log(res)
            // });
            //SUMAR EXISTENCIAG
              this._compraService.updateExistencia(this.Lista_compras).subscribe(
                res =>{
                    console.log(res);
                    this.toastService.show(' ⚠ Existencia actualizada exitosamente!', { classname: 'bg-success  text-light', delay: 5000 });
                    //this.getLastCompra();
                    //this.createPDF();
                },error =>{
                  console.log(<any>error);
                  this.toastService.show('Ups... Fallo al agregar los productos', { classname: 'bg-danger text-light', delay: 15000 });
                });

          }
        },error =>{
          console.log(<any>error);
          this.toastService.show('Ups... Fallo al crear la compra', { classname: 'bg-danger text-light', delay: 15000 });
        });

      }
    }

    capturar(datos:any){//Agrega un producto a lista de compras
      // if(this.producto_compra.caducidad)
      if(this.test == true){
        this.producto_compra.caducidad = this.modelP.year+'-'+this.modelP.month+'-'+this.modelP.day;//concatenamos la fecha del datepicker
      }
      console.log('capturar',datos.idProdMedida);
      console.log('Caducidad: ',this.producto_compra.caducidad);
  
      //Asignar idProdMedida y nombreMedida antes de capturar
      this.medidaActualizada = this.productoVerM.find( (x:any) => x.idProdMedida == datos.idProdMedida);
      this.producto_compra.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
      this.producto_compra.nombreMedida = this.medidaActualizada.nombreMedida;
  
      
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
  
        //Calculo de subtotal y total de la compra
        this.compra.subtotal=(this.producto_compra.cantidad*this.producto_compra.precio)+this.compra.subtotal;
        this.compra.total=this.producto_compra.subtotal+this.compra.total;
        this.compra.total = Math.round((this.compra.total + Number.EPSILON) * 100 ) / 100 ;
        console.log('Subtotal: ',this.compra.subtotal);
        console.log('Total: ',this.compra.total);
  
        //Reset variables 
        this.productoVer=[];
        this.productoVerM=[];
        this.producto_compra.claveEx = '';
        this.producto_compra.cantidad = 0 ;
        this.producto_compra.precio = 0 ;
        this.producto_compra.idImpuesto = 0 ;
        this.producto_compra.valorImpuesto = 0 ;
        this.producto_compra.subtotal = 0 ;
        this.producto_compra.caducidad = '' ;
        this.producto_compra.idProdMedida = 0;
        if(this.test == true){
          this.modelP.day = 0;
          this.modelP.month = 0;
          this.modelP.year = 0;
          this.test = false;
        }
  
      }
  
  
  
      console.log('lista de compras',this.Lista_compras);
      
    }

  /** */

  /*Modal*/
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

    consultarProductoModal(dato:any){
      let cantidad: any;
      cantidad = 0;
      this.getProd(dato);
      this.isSearch = false;
    }
  
    consultarProducto(event:any){//Mostrar informacion del producto al dar enter
      //alert('you just pressed the enter key'+event);
      this.dato=event.target.value;
      //console.log(this.dato)
      let cantidad: any;
      cantidad = 0;
      this.getProd(this.dato);
      this.isSearch = false;
      //console.log(this.producto_orden);
    
    }


  /** */

  /**Eventos */
    onChange(id:any){//Muestra los datos del proveedor al seleccionarlo
      this.getProveeVer(id);
    }

    onChangeI(id:any){//Muestra los datos del impuesto al seleccionarlo
      this.getImpuestoVer(id);    
      // console.log(id);
    }

    onChangeT(subtotal:any){//Recalcula el subtotal al hacer un cambio dentro del formulario de productos
      this.producto_compra.subtotal = this.producto_compra.cantidad * this.producto_compra.precio;
      this.producto_compra.subtotal = this.producto_compra.subtotal + (this.producto_compra.subtotal * (this.producto_compra.valorImpuesto / 100)); 
    }

    cambioSeleccionado(e:any){//Limpiamos los inputs del modal
      this.buscarProducto = '';
      this.buscarProductoCE = '';
      this.buscarProductoCbar = '';
    }
  /** */

  public createPDF():void{//Crear PDF
    //this.getLastCompra();
    const doc = new jsPDF;

    //Formateamos la fecha
    // console.log(this.detailComp[0]['fechaRecibo']);
    
    

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
    doc.setFont('Helvetica','bold').setFontSize(10).text('FOLIO DEL PROVEEDOR: '+this.detailComp[0]['folioProveedor'], 10,65);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA IMPRESION: '+this.fecha.toLocaleDateString('es-ES', this.dateOptions), 115,60);
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA DE RECEPCION: '+this.detailComp[0]['fecha_format'].substring(0,10), 115,65);

    doc.setLineWidth(1).line(10,70,200,70);
    doc.setFont('Helvetica','normal').setFontSize(10).text('REALIZO: '+ nombreE.toUpperCase(), 10,75);
    doc.setFont('Helvetica','normal').setFontSize(10).text('PROVEEDOR: '+this.detailComp[0]['nombreProveedor'], 10,80);
    doc.setFont('Helvetica','normal').setFontSize(10).text('OBSERVACIONES: '+this.detailComp[0]['observaciones'], 10,85);


    doc.setLineWidth(1).line(10,92,200,92);
    autoTable(doc,{html: '#table_productos',startY:95})
    doc.save('compra.pdf')
  } 

}

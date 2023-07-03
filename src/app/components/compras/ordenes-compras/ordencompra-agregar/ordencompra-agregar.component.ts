import { Component, OnInit } from '@angular/core';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { MessageService } from 'primeng/api';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { HttpClient} from '@angular/common/http';
//Modelos
import { Ordencompra } from 'src/app/models/orden_compra';
import { Producto_orden } from 'src/app/models/producto_orden';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//pdf
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


@Component({
  selector: 'app-ordencompra-agregar',
  templateUrl: './ordencompra-agregar.component.html',
  styleUrls: ['./ordencompra-agregar.component.css'],
  providers:[ProveedorService,ProductoService, OrdendecompraService, EmpleadoService, MessageService]
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
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
/**Paginador lista de productos */
  public totalPages2: any;
  public path2: any;
  public next_page2: any;
  public prev_page2: any;
  public itemsPerPage2:number=0;
  pageActual2: number = 0;

  //spinner
  public isLoading:boolean = false;

//Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar : number = 0;
  //variables servicios
  public dato:any;
  public productoVer: any;
  public url:any;
  public identity: any;
  public ultimaOrden: any;
  public detailOrd: any;
  public productosdetailOrd: any;
  public medidasLista:any; //Lista de medidas de un producto en especifico
  //modelode bootstrap
  //modelode bootstrap
  model!: NgbDateStruct;
  //variable para el pdf
  public fecha : Date = new Date();
  //contadores para los text area
  conta: number =0;

  constructor( private _proveedorService: ProveedorService,
      private _http: HttpClient,
      private modalService: NgbModal,
      private _productoService: ProductoService,
      private messageService: MessageService,
      private _ordencompraService: OrdendecompraService,
      public _empleadoService : EmpleadoService
    ) {
    this.orden_compra = new Ordencompra(0,null,0,'',null,0,1,null);
    this.producto_orden = new Producto_orden(0,0,0,0,'','','');
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
    this.buscarProductoCbar = 0;
  }
  capturar(datos:any){//Agregar a lista de compras
    if(this.producto_orden.cantidad <= 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se pueden agregar productos con cantidad igual o menor a 0'});
    }else if(this.producto_orden.idProducto == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto no existe'});
    }else if( this.Lista_compras.find( x => x.idProducto == this.producto_orden.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      this.messageService.add({severity:'error', summary:'Error', detail:'Ese producto ya esta en la lista'});
    }else if(this.producto_orden.idProdMedida <= 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'Falta ingresar medida'});
    }else{
      this.Lista_compras.push({...this.producto_orden});
      this.isSearch=true;
    }
    this.producto_orden.idProdMedida = 0;
    
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
    
    if(this.Lista_compras.length == 0){
      this.messageService.add({severity:'error', summary:'Error', detail:'No se puede crear la orden de compra si no tiene productos'});
    }else{
      this._ordencompraService.registerOrdencompra(this.orden_compra).subscribe(
        response =>{
          if(response.status == 'Success!'){
           // console.log(response)       
            this.messageService.add({severity:'success', summary:'Éxito', detail:'Orden de compra creada'});
             this._ordencompraService.registerProductosOrdenCompra(this.Lista_compras).subscribe(
               res =>{
                   //console.log(res);
                  this.messageService.add({severity:'success', summary:'Éxito', detail:'Productos agregados'});
                   this.getDetailsOrd();
                   //this.createPDF();
               },error =>{
                 console.log(<any>error);
                this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al agregar los productos a la orden de compra'});
               });
          }else{
           console.log('fallo');  
           console.log(response);
          }
        },error =>{
         console.log(<any>error);
         this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al crear la orden de compra'});
        });
    }
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
    doc.setFont('Helvetica','normal').setFontSize(10).text('FECHA ESTIMADA: '+this.detailOrd[0]['fecha'].substring(0,10), 115,65);  

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
    doc.save("ordencompra"+this.detailOrd[0]['idOrd']+".pdf");
  }
  //Servicios
  getProvee(){
    this._proveedorService.getProveedoresSelect().subscribe(
      response => {
        if(response.status == 'success'){
          this.proveedoresLista = response.provedores;
          console.log(response.provedores);
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
    //mostramos el spinner
    this.isLoading = true;

    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
          //asignamos datos a varibale para poder mostrarla en la tabla
          this.productos = response.productos.data;
          //navegacion de paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          this.next_page = response.productos.next_page_url;
          this.path = response.productos.path;

          //una vez terminado quitamos el spinner
          this.isLoading=false;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getProd(idProducto:any){
    this._productoService.getProdverDos(idProducto).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.producto_orden.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.producto_orden.claveEx = this.productoVer[0]['claveEx'];
        this.producto_orden.idProducto = this.productoVer[0]['idProducto'];
        //this.producto_orden.nombreMedida = this.productoVer[0]['nombreMedida'];
        this.medidasLista = response.productos_medidas;
        console.log(this.productoVer);
        console.log(this.medidasLista);
        //Si el producto tiene una sola medida se asigna directo
        //if(this.medidasLista.length == 1){ this.producto_orden.idProdMedida = this.medidasLista[0].idProdMedida }
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
    this.getAllProducts();
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

  /**
   * PAGINACION 
   * @param page
   * Es el numero de pagina a la cual se va acceder
   * @description
   * De acuerdo al numero de pagina recibido lo concatenamos a
   * la direccion para "ir" a esa direccion y traer la informacion
   * no retornamos ya que solo actualizamos las variables a mostrar
   */
  getPage(page:number) {
    //iniciamos spinner
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        
        //asignamos datos a varibale para poder mostrarla en la tabla
        this.productos = response.productos.data;
        //navegacion de paginacion
        this.totalPages = response.productos.total;
        this.itemsPerPage = response.productos.per_page;
        this.pageActual = response.productos.current_page;
        this.next_page = response.productos.next_page_url;
        this.path = response.productos.path;

        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }
  capturaNombreMedida(idProdMedida:any){
    console.log(idProdMedida);
    var pm = this.medidasLista.find((x:any) => x.idProdMedida == idProdMedida)!;
    this.producto_orden.nombreMedida = pm.nombreMedida;
    console.log(this.producto_orden.nombreMedida);
  }

  /**
  * 
  * @param descripcion 
  * Recibimos el evento del input
  * @description
  * Recibe los valores del Keyup, luego buscamos y actualizamos
  * los datos que se muestran en la tabla
  */
  getSearchDescripcion(descripcion:any){
   
    //mostramos el spinner
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion que trae todo
    if(descripcion.target.value == ''){
      this.getAllProducts();
    }

    //componemos el codigo a buscar
    this.buscarProducto = descripcion.target.value;

    //llamamos al servicio
    this._productoService.searchDescripcion(this.buscarProducto).subscribe(
      response =>{
          if(response.status == 'success'){
            //asignamos datos a varibale para poder mostrarla en la tabla
            this.productos = response.productos.data;
            //console.log(this.productos)

            //navegacion paginacion
            this.totalPages = response.productos.total;
            this.itemsPerPage = response.productos.per_page;
            this.pageActual = response.productos.current_page;
            this.next_page = response.productos.next_page_url;
            this.path = response.productos.path
            
            //una ves terminado de cargar quitamos el spinner
            this.isLoading = false;
          }
      }, error => {
        console.log(error)
      }
    )
 }
  
   /**
  * 
  * @param codbar 
  * Recibimos el evento del input
  * @description
  * Recibe los valores del evento keyup, luego busca y actualiza
  * los datos que se muestran en la tabla
  */
 getSearchCodbar(codbar:any){

   //mostramos el spinner
   this.isLoading = true;

   //si es vacio volvemos a llamar la primera funcion que trae todo
   if(codbar.target.value == ''){
     this.getAllProducts();
   }

   //componemos el codigo a buscar
   this.buscarProductoCbar = codbar.target.value;

   //llamamos al servicio
   this._productoService.searchCodbar(this.buscarProductoCbar).subscribe(
     response =>{
         if(response.status == 'success'){
           //asignamos datos a varibale para poder mostrarla en la tabla
           this.productos = response.productos.data;
           //console.log(this.productos)

           //navegacion paginacion
           this.totalPages = response.productos.total;
           this.itemsPerPage = response.productos.per_page;
           this.pageActual = response.productos.current_page;
           this.next_page = response.productos.next_page_url;
           this.path = response.productos.path
           
           //una ves terminado de cargar quitamos el spinner
           this.isLoading = false;
         }
     }, error => {
       console.log(error)
     }
   )
 }

 /**
  * 
  * @param claveExterna 
  * Recibimos el evento del input
  * @description
  * Recibe los valores del evento keyUp, luego busca y actualiza
  * los datos de la tabla
  */
 getSearch(claveExterna:any){

   //mostramos el spinner 
   this.isLoading = true;

   //si es vacio volvemos a llamar la primera funcion
   if(claveExterna.target.value == ''){
     this.getAllProducts();
   }
   //componemos la palabra
   this.buscarProducto = claveExterna.target.value;

   //generamos consulta
   this._productoService.searchClaveExterna(this.buscarProducto).subscribe(
     response =>{
         if(response.status == 'success'){

           //asignamos datos a varibale para poder mostrarla en la tabla
           this.productos = response.productos.data;
           //console.log(this.productos)

           //navegacion paginacion
           this.totalPages = response.productos.total;
           this.itemsPerPage = response.productos.per_page;
           this.pageActual = response.productos.current_page;
           this.next_page = response.productos.next_page_url;
           this.path = response.productos.path
           
           //una ves terminado de cargar quitamos el spinner
           this.isLoading = false;
       }
     }, error =>{
         console.log(error)
     }
   )
 }

 editarProductoO(p_d:any){//metodo para editar la lista de compras
  console.log('p_d',p_d);
  this.Lista_compras = this.Lista_compras.filter((item) => item.idProducto !== p_d.idProducto);//eliminamos el producto
  //consultamos la informacion para motrar el producto nuevamente
  this.getProd(p_d.idProducto);



  this.isSearch = false;
} 

  /**
   * Omite el salto de linea del textarea de descripcion
   * cuenta el numero de caracteres insertados
   * @param event 
   * omitimos los eventes de "enter""
   */
  omitirEnter(event:any){
    this.conta = event.target.value.length;
    if(event.which === 13){
      event.preventDefault();
      //console.log('prevented');
    }
  }


}
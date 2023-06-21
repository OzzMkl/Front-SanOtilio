import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { ToastService } from 'src/app/services/toast.service';
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { HttpClient} from '@angular/common/http';
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
public productoVerM: any;
public medidaActualizada:any;
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
//paginador Lista de productos
public totalPages2: any;
public path2: any;
public next_page2: any;
public prev_page2: any;
public itemsPerPage2:number=0;
pageActual2: number = 0;
//cerrar modal
  closeResult = '';
//Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar : number = 0;
/**PAGINATOR modal*/
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;

//spinner
  public isLoading:boolean = false;

//contadores para los text area
  conta: number =0;

  constructor(
    //declaracion de servicios
    private _proveedorService: ProveedorService,
    private _http: HttpClient,
    private _productoService: ProductoService,
    public toastService: ToastService,
    private _ordencompraService: OrdendecompraService,
    public _empleadoService : EmpleadoService,
    private _route: ActivatedRoute,
    private modalService: NgbModal
  ) {
    this.orden_compra = new Ordencompra (0,null,0,'',null,0,null,null);
    this.productosOrden = new Producto_orden(0,0,0,0,'','','');
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
    
    if(this.lista_productosorden.length == 0){
      // this.toastService.show('La lista de productos está vacía ',{classname: 'bg-danger text-light', delay: 6000});
    }else{
      console.log(this.orden_compra);
      console.log(this.lista_productosorden);
      this._route.params.subscribe( params =>{
        let id =+ params['idOrd'];
        this._ordencompraService.updateOrdenCompra(id,this.orden_compra).subscribe( 
          response =>{
            if(response.status == 'success'){
              //console.log(response);
              this._ordencompraService.updateProductosOrderC(id,this.lista_productosorden).subscribe( 
                response=>{
                  if(response.status == 'success'){
                    // this.toastService.show('Orden editada correctamente',{classname: 'bg-success text-light', delay: 3000});
                    this.getOrderModificada();
                    //console.log(response);
                  }else{
                    // this.toastService.show('Algo salio mal con la lista de productos',{classname: 'bg-danger text-light', delay: 6000});
                    //console.log('Algo salio mal con la lista de productos');
                  }
              
                },error=>{
                  // this.toastService.show('Algo salio mal',{classname: 'bg-danger text-light', delay: 6000})
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

    
    
  }
  editarProducto(lpo:any){//metodo para editar la lista de compras
    console.log(lpo);
    this.lista_productosorden = this.lista_productosorden.filter((item) => item.idProducto !== lpo.idProducto);//eliminamos el producto
    //consultamos la informacion para motrar el producto nuevamente
    this.getProd(lpo);
    this.isSearch = false;
  }
  capturar(datos:any){//Agregar a lista de compras
    console.log(datos);

    //Asignar idProdMedida y nombreMedida antes de capturar
    this.medidaActualizada = this.productoVerM.find( (x:any) => x.idProdMedida == datos.idProdMedida);
    this.productosOrden.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
    this.productosOrden.nombreMedida = this.medidaActualizada.nombreMedida;

    if(this.productosOrden.cantidad <= 0){
      // this.toastService.show('No se pueden agregar productos con cantidad 0 ó menor a 0',{classname: 'bg-danger text-light', delay: 6000})
    }else if(this.productosOrden.idProducto == 0){
      // this.toastService.show('Ese producto no existe',{classname: 'bg-danger text-light', delay: 6000})
    }else if( this.lista_productosorden.find( x => x.idProducto == this.productosOrden.idProducto)){
      //verificamos si la lista de compras ya contiene el producto buscandolo por idProducto
      // this.toastService.show('Ese producto ya esta en la lista',{classname: 'bg-danger text-light', delay: 6000})
    }else{
      this.lista_productosorden.push({...this.productosOrden});
      this.isSearch=true;
    }
    
    //console.log(this.Lista_compras);

    //Reset variables 
    this.productoVer=[];
    this.productoVerM=[];
    this.productosOrden.cantidad = 0;
    this.productosOrden.claveEx = '';
    this.productosOrden.descripcion = '';
    this.productosOrden.idOrd = 0;
    this.productosOrden.idProdMedida = 0;
    this.productosOrden.idProducto = 0;
    this.productosOrden.nombreMedida = '';
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
            //console.log(this.orden_compra.fecha);
          }
          //console.log(response.productos);
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
        //console.log(response.provedores);
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
    let combinado = {...dato, nombreMedida: ''};
    console.log(combinado);
    this.getProd(combinado);
    this.isSearch = false;
  }
  getAllProducts(){//traemos la informacion de todos los productos para el modal
    this._productoService.getProductos().subscribe(
      response =>{
        if(response.status == 'success'){
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
  getProd(lpo:any){//servicio para obtener detalles del producto a traves de su id
    console.log(lpo);
    this._productoService.getProdverDos(lpo.idProducto).subscribe(
      response =>{
        this.productoVer = response.producto;//informacion completa del producto para recorrerlo atraves del html
        this.productosOrden.descripcion = this.productoVer[0]['descripcion'];//asignamos variables
        this.productosOrden.claveEx = this.productoVer[0]['claveEx'];
        this.productosOrden.idProducto = this.productoVer[0]['idProducto'];
        this.productoVerM = response.productos_medidas;//informacion completa de productos_medidas para recorrerlo atraves del html
        this.productosOrden.cantidad = lpo.cantidad;
        console.log('productoVer',this.productoVer);
        console.log('productoVerM',this.productoVerM);

        //obtener idProdMedida actualizado y asignarlo
        //buscar lpo.nombreMedida en productoVerM, regresar y asignar this.producto_compra.idProdMedida, this.producto_compra.nombreMedida
        this.medidaActualizada = this.productoVerM.find( (x:any) => x.nombreMedida == lpo.nombreMedida);
        if(this.medidaActualizada == undefined ){

        }else{
          console.log('medidaActualizada',this.medidaActualizada);
          this.productosOrden.idProdMedida = parseInt(this.medidaActualizada.idProdMedida);
          this.productosOrden.nombreMedida = this.medidaActualizada.nombreMedida;
        }
        
        
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
  cambioSeleccionado(e:any){//limpiamos los inputs del modal
    this.buscarProducto = '';
    this.buscarProductoCE = '';
    this.buscarProductoCbar = 0;
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

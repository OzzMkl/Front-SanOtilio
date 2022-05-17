import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
//servicios
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastService } from 'src/app/services/toast.service';
import { ProductoService } from 'src/app/services/producto.service';
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { EmpresaService } from 'src/app/services/empresa.service';
//modelos
import { Ventag } from 'src/app/models/ventag';
import { Producto_ventasg } from 'src/app/models/productoVentag';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cotizacion-editar',
  templateUrl: './cotizacion-editar.component.html',
  styleUrls: ['./cotizacion-editar.component.css'],
  providers:[ProductoService]
})
export class CotizacionEditarComponent implements OnInit {
  //variables servicios
  public cotizacion_editada: Ventag;//getDetallesCotiza
  public productos_cotizacion_e: Array<Producto_ventasg>;//getDetallesCotiza
  public empresa:any;//getDatosempresa
  public clientes:any;
  public cliente:any;//getDetallesCliente
  public listaDireccionesC:any;
  public tipocliente :any;//gettipocliente
  //Variables html
  public seEnvia: boolean = false
  //spinners
  public isLoadingClientes: boolean = false;
  public isLoadingDatos: boolean = false;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pagePV: number = 1;
  pageActual: number =1;//modal clientes
  //cerrar modal
  closeResult ='';
  //pipes
  buscarCliente ='';

  constructor( private _clienteService: ClientesService, public toastService: ToastService,
               private _productoService: ProductoService, private _ventasService: VentasService,
               private _empleadoService: EmpleadoService, private _empresaService: EmpresaService,
               private _route: ActivatedRoute, private modalService: NgbModal ) {
                 this.cotizacion_editada = new Ventag(0,0,2,'',1,null,0,0,0,0,'','');
                 this.productos_cotizacion_e = [];
               }

  ngOnInit(): void {
    this.getDatosEmpresa();
    this.getDetallesCotiza();
  }
  //TRAEMOS LOS DATOS DE LA COTIZACION
  getDetallesCotiza(){
    this.isLoadingDatos=true;
    this._route.params.subscribe( params =>{
      let id = + params['idCotiza'];
      //
      this._ventasService.getDetallesCotiza(id).subscribe(
        response =>{
          if(response.status == 'success'){
            this.cotizacion_editada.idCliente = response.Cotizacion[0]['idCliente'];
            this.cotizacion_editada.dirCliente = response.Cotizacion[0]['cdireccion'];
            this.cotizacion_editada.observaciones = response.Cotizacion[0]['observaciones'];
            this.cotizacion_editada.subtotal = response.Cotizacion[0]['subtotal'];
            this.cotizacion_editada.descuento = response.Cotizacion[0]['descuento'];
            this.cotizacion_editada.total = response.Cotizacion[0]['total'];
            //cargamos los productos
            this.productos_cotizacion_e = response.productos_cotiza;

            this.seleccionarCliente(this.cotizacion_editada.idCliente);
            
            this.isLoadingDatos = false;
            this.seEnvia== true
            
          }
          console.log(this.cotizacion_editada);
          //console.log(this.productos_cotizacion_e);
        },error =>{
          console.log(error);
        }
      )
    });
  }
  //TRAEMOS LA INFORMACION DE LA EMPRESA / SUCURSAL
  getDatosEmpresa(){
    this._empresaService.getDatosEmpresa().subscribe( 
      response => {
        if(response.status == 'success'){
           this.empresa = response.empresa;
           //console.log(this.empresa)
        }
      },error => {console.log(error)});
  }
  //traemos informacion de todos los clientes
  getClientes(){
    this.isLoadingClientes = true;
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          this.isLoadingClientes = false;
        }
      }, error =>{
        console.log(error);
      });
  }
  //obtenemos los tipos de clientes para el select del modal para agregar nuevos clientes
  getTipocliente(){
    this._clienteService.getTipocliente().subscribe(
      response =>{
        this.tipocliente = response.tipocliente;
      },error =>{
        console.log(error);
      });
  }
   //cargamos la informacion selccionada a la propiedad de venta.dirCliente direccion del cliente
   seleccionarDireccion(direccion:any){
    this.cotizacion_editada.dirCliente=direccion;
  }
   //obtener direcciones del cliente si es que se envia la venta
   getDireccionCliente(idCliente:any){
    this._clienteService.getDireccionCliente(idCliente).subscribe( 
      response => {
        if(response.status == 'success'){
          this.listaDireccionesC = response.direccion;
        }
        //this.listaDireccionesC = response.
      },error =>{
        console.log(error);
      });
    }
  //traemos la informacion del cliente seleccionado del modal o el cliente que ya trae la cotizacion
  seleccionarCliente(idCliente:any){
    this._clienteService.getDetallesCliente(idCliente).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.cliente = response.cliente;
          this.cotizacion_editada.nombreCliente = this.cliente[0]['nombre']+' '+this.cliente[0]['aPaterno']+' '+this.cliente[0]['aMaterno'];
          //this.cotizacion_editada.dirCliente = '';
        }else{
          console.log('Algo salio mal '+response);
        }
      }, error =>{
        console.log( error);
      });
  }
  //evitamod que den enter en el textarea de observaciones
  omitirEnter(event:any){
    if(event.which === 13 && !event.shiftKey){
      event.preventDefault();
      console.log('prevented');
      
    }
  }
  //modales
  open(content:any) {//abrir modal
    this.getClientes();
    this.getTipocliente();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  modalSeEnvia(content:any){//abre modal para seleccionaar direccion del cliente
    //si el chek de se envia es true abrimos modal
    if(this.seEnvia == true){
      this.getClientes();
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
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

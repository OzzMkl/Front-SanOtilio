import { Component, OnInit } from '@angular/core';
//Servicio
import { OrdendecompraService } from 'src/app/services/ordendecompra.service';
import { global } from 'src/app/services/global';
import { EmpresaService } from 'src/app/services/empresa.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { HttpClient} from '@angular/common/http'
import { Router } from '@angular/router';
//NGBOOTSTRAP
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'app-ordencompra-buscar',
  templateUrl: './ordencompra-buscar.component.html',
  styleUrls: ['./ordencompra-buscar.component.css'],
  providers:[OrdendecompraService,ConfirmationService,MessageService]
})
export class OrdencompraBuscarComponent implements OnInit {

  /***** */
  
  /***** */
  constructor( private _ordendecompraService: OrdendecompraService,
               private _http: HttpClient,
               private _empresaService: EmpresaService,
               private modalService: NgbModal,
               public _empleadoService : EmpleadoService,
               public _modulosService: ModulosService,
               private messageService: MessageService,
               private _confirmationService: ConfirmationService,
               private _router: Router,
  ) { }


  public identity: any;
  public motivo:string = '';

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
  public userPermisos:any;
  public mOrdC = this._modulosService.modsOrdendeCompra();
  counter:number = 1;
  timerId:any;

  //Paginacion lista de ordenes
  public totalPagesL: any;
  public pathL: any;
  public next_pageL: any;
  public prev_pageL: any;
  public itemsPerPageL:number=0;
  pageActualL: number = 0;



  ngOnInit(): void {
    this.loadUser();
    //console.log(this.fechaActual.toLocaleDateString());
  }
  getAllOrdenes(){//obtener todas las ordenes de compras
    this.isLoading = true;
    this._ordendecompraService.getAllOrders().subscribe(
      response =>{
        console.log(response)
        if(response.status == 'success'){
          this.ordenesdecompra = response.ordencompra.data;
          console.log(this.ordenesdecompra);
          //navegacion de paginacion
          this.totalPagesL = response.ordencompra.total;
          this.itemsPerPageL = response.ordencompra.per_page;
          this.pageActualL = response.ordencompra.current_page;
          this.next_pageL = response.ordencompra.next_page_url;
          this.pathL = response.ordencompra.path;

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

          console.log(this.detallesOrdencompra);
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
    
    this.motivo = '';
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  resetVariables(){
    this.detallesOrdencompra = '';
    this.productosDOC = '';
    this.pagina = 1;
    this.motivo = '';


  }

  /***** */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mOrdC.idModulo, this.mOrdC.idSubModulo);
    //revisamos si el permiso del modulo esta activo si no redireccionamos
    if( this.userPermisos.ver != 1 ){
      this.timerId = setInterval(()=>{
        this.counter--;
        if(this.counter === 0){
          clearInterval(this.timerId);
          this._router.navigate(['./']);
        }
        this.messageService.add({severity:'error', summary:'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'});
      },1000);
    } else{
      this.getAllOrdenes();
      this.identity = this._empleadoService.getIdentity();
    }
  }
  /***** */

  generaPDF(idOrd:number){
    this._ordendecompraService.getPDF(idOrd, this.identity['sub']).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
    
  }

  getPage(page:number) {
    //iniciamos spinner
    this.isLoading = true;

    this._http.get(this.pathL+'?page='+page).subscribe(
      (response:any) => {
        
        //asignamos datos a varibale para poder mostrarla en la tabla
        this.ordenesdecompra = response.ordencompra.data;
        console.log('getOrden',response.ordencompra.data);
        //navegacion de paginacion
        this.totalPagesL = response.ordencompra.total;
        this.itemsPerPageL = response.ordencompra.per_page;
        this.pageActualL = response.ordencompra.current_page;
        this.next_pageL = response.ordencompra.next_page_url;
        this.pathL = response.ordencompra.path;

        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }

  searchIdOrden(idOrd:any){
    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(idOrd.target.value == '' || idOrd.target.value == null ){
      this.getAllOrdenes();
    }
    else{
      //componemos la palabra
      let idOrden = idOrd.target.value;

      //generamos consulta
      this._ordendecompraService.searchIdOrden(idOrden).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.ordenesdecompra = response.orden.data;
              //navegacion de paginacion
              this.totalPagesL = response.orden.total;
              this.itemsPerPageL = response.orden.per_page;
              this.pageActualL = response.orden.current_page;
              this.next_pageL = response.orden.next_page_url;
              this.pathL = response.orden.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }
  }

  searchNombreProveedor(nombreProveedor:any){
    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(nombreProveedor.target.value == '' || nombreProveedor.target.value == null ){
      this.getAllOrdenes();
    }
    else{
      //componemos la palabra
      let nombreProv = nombreProveedor.target.value;

      //generamos consulta
      this._ordendecompraService.searchNombreProveedor(nombreProv).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.ordenesdecompra = response.orden.data;
              //navegacion de paginacion
              this.totalPagesL = response.orden.total;
              this.itemsPerPageL = response.orden.per_page;
              this.pageActualL = response.orden.current_page;
              this.next_pageL = response.orden.next_page_url;
              this.pathL = response.orden.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }
  }

  /**CANCELACION DE ORDEN DE COMPRA */
  confirmCan() {
    if(this.motivo.length < 10){
      this.messageService.add({severity:'error', summary:'Advertencia', detail: 'El motivo de la cancelación tiene que contener minimo 10 caracteres.'});
    }
    else{
      this._confirmationService.confirm({
        message: '¿Está seguro(a) que desea cancelar la compra?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            //this.messageService.add({severity:'info', summary:'Confirmado', detail:'Compra'});
            this.cancelarOrden();
        },
        reject: (type:any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Cancelación de orden de compra cancelada.'});
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Cancelación de orden de compra cancelada.'});
                break;
            }
        }
      });
    }
  }

  public cancelarOrden(){
    console.log(this.detallesOrdencompra[0]['idOrd']);
    console.log(this.motivo);
    console.log(this.identity['sub']);

    this._ordendecompraService.cancelarOrden(this.detallesOrdencompra[0]['idOrd'],this.motivo,this.identity['sub']).subscribe(
      response =>{
        if(response.status == 'success'){
          console.log(response);
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Orden de compra cancelada'});
          this.modalService.dismissAll();
          this.getAllOrdenes();
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al cancelar la orden de compra'});
        }
      },
      error =>{
        this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al cancelar la orden de compra'});
        console.log(error);
      }
    )
  }

}

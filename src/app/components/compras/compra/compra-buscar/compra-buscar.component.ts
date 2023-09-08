import { Component, OnInit } from '@angular/core';
import { CompraService } from 'src/app/services/compra.service';
import { HttpClient} from '@angular/common/http';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { EmpleadoService } from 'src/app/services/empleado.service';

//primeng
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';


@Component({
  selector: 'app-compra-buscar',
  templateUrl: './compra-buscar.component.html',
  styleUrls: ['./compra-buscar.component.css'],
  providers: [CompraService,ConfirmationService,MessageService]
})
export class CompraBuscarComponent implements OnInit {
  public userPermisos:any

  //public proveedores: Array<Proveedor>;
  public compras: Array<any> = [];
  public facturableCheck: boolean = false;

  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  
  public detallesCompra:any;
  public productosDC:any;

  public tipoBusqueda: number = 1;
  //modal
  closeResult = '';
  //spinner
  public isLoading:boolean = false;
  //Subscripciones
  private getCompraSub : Subscription = new Subscription;
  public fecha : Date = new Date();
  public dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  };

  public identity: any;
  public motivo:string = '';

  constructor(
    private _compraService: CompraService,
    private _router: Router,
    private _http: HttpClient,
    private _modalService: NgbModal,
    private _empleadoService:EmpleadoService,
    private _confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.getComprasR();
    this.loadUser();
  }

  //
  
  getComprasR(){
    //mostramos el spinner
    this.isLoading = true;


    this.getCompraSub = this._compraService.getComprasRecibidas().subscribe(
      response =>{
        if(response.status == 'success'){

          this.compras = response.compra.data;
          //navegacion de paginacion
          this.totalPages = response.compra.total;
          this.itemsPerPage = response.compra.per_page;
          this.pageActual = response.compra.current_page;
          this.next_page = response.compra.next_page_url;
          this.path = response.compra.path;

          //una vez terminado quitamos el spinner
          this.isLoading=false;
        }
      },
      error =>{
        console.log(error);
      }
    );
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
    //iniciamos spinner
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        
        //asignamos datos a varibale para poder mostrarla en la tabla
        this.compras = response.compra.data;
        //navegacion de paginacion
        this.totalPages = response.compra.total;
        this.itemsPerPage = response.compra.per_page;
        this.pageActual = response.compra.current_page;
        this.next_page = response.compra.next_page_url;
        this.path = response.compra.path;

        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }

  getSearchIdCompra(idCompra:any){

    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(idCompra.target.value == '' || idCompra.target.value == null ){
      this.getComprasR();
    }
    else{
      //componemos la palabra
      let idCom = idCompra.target.value;

      //generamos consulta
      this._compraService.getSearchIdCompra(idCom).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.compras = response.compra.data;
              //navegacion de paginacion
              this.totalPages = response.compra.total;
              this.itemsPerPage = response.compra.per_page;
              this.pageActual = response.compra.current_page;
              this.next_page = response.compra.next_page_url;
              this.path = response.compra.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }

  }

  getSearchNombreProveedor(nombreProveedor:any){

    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(nombreProveedor.target.value == '' || nombreProveedor.target.value == null ){
      this.getComprasR();
    }
    else{
      //componemos la palabra
      let nomPro = nombreProveedor.target.value;

      //generamos consulta
      this._compraService.getSearchNombreProveedor(nomPro).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.compras = response.compra.data;
              //navegacion de paginacion
              this.totalPages = response.compra.total;
              this.itemsPerPage = response.compra.per_page;
              this.pageActual = response.compra.current_page;
              this.next_page = response.compra.next_page_url;
              this.path = response.compra.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }

  }

  getSearchFolioProveedor(folioProveedor:any){

      //mostramos el spinner 
      this.isLoading = true;

      //si es vacio volvemos a llamar la primera funcion
      if(folioProveedor.target.value == '' || folioProveedor.target.value == null ){
        this.getComprasR();
      }
      else{
        //componemos la palabra
        let folioProv = folioProveedor.target.value;

        //generamos consulta
        this._compraService.getSearchFolioProveedor(folioProv).subscribe(
          response =>{
              if(response.status == 'success'){

                //asignamos datos a varibale para poder mostrarla en la tabla
                this.compras = response.compra.data;
                //navegacion de paginacion
                this.totalPages = response.compra.total;
                this.itemsPerPage = response.compra.per_page;
                this.pageActual = response.compra.current_page;
                this.next_page = response.compra.next_page_url;
                this.path = response.compra.path;
                
                //una ves terminado de cargar quitamos el spinner
                this.isLoading = false;
              }
          }, error =>{
              console.log(error)
          }
        )
      }

  }

  getSearchTotal(total:any){

    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(total.target.value == '' || total.target.value == null ){
      this.getComprasR();
    }
    else{
      //componemos la palabra
      let tot = total.target.value;

      //generamos consulta
      this._compraService.getSearchTotal(tot).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.compras = response.compra.data;
              //navegacion de paginacion
              this.totalPages = response.compra.total;
              this.itemsPerPage = response.compra.per_page;
              this.pageActual = response.compra.current_page;
              this.next_page = response.compra.next_page_url;
              this.path = response.compra.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }

  }

  selected(idCompra:any){
    console.log('selected:' ,idCompra);
    this.getDetailsCompra(idCompra);
  }

  getDetailsCompra(idCompra:any){//recibimos el id y traemos informacion de esa compra
    this._compraService.getDetailsCompra(idCompra).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesCompra = response.compra; 
          this.productosDC = response.productos;
          console.log('response',response);
          console.log('compra',this.detallesCompra);
          console.log('productos',this.productosDC);

          if(this.detallesCompra[0]['facturable'] == 1){
            this.facturableCheck = true;
          }
          else{
            this.facturableCheck = false;
          }
        }else{ console.log('Algo salio mal');}
        
      },error => {

        console.log(error);
      });
  }

  // Modal
  open(content:any) {//abre modal
      this._modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  private getDismissReason(reason: any): string {//cierra modal con teclado ESC o al picar fuera del modal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  loadUser(){
    this.identity = this._empleadoService.getIdentity();
  }

   /**
   * Destruye las subscripciones a los observables de regitro proveedor
   * y obtecion de bancos
   */
   ngOnDestroy(): void {
    this.getCompraSub.unsubscribe();
  }


  public createPDF(idCompra:number):void{//Crear PDF
    this._compraService.getPDF(idCompra, this.identity['sub']).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );

  } 

  
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
            this.cancelarCompra();
        },
        reject: (type:any) => {
            switch(type) {
                case ConfirmEventType.REJECT:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Cancelación de compra cancelada.'});
                break;
                case ConfirmEventType.CANCEL:
                    this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Cancelación de compra cancelada.'});
                break;
            }
        }
      });
    }
  }

  public cancelarCompra(){
    // console.log(this.detallesCompra[0]['idCompra']);
    // console.log(this.motivo);
    // console.log(this.identity['sub']);

    this._compraService.cancelarCompra(this.detallesCompra[0]['idCompra'],this.motivo,this.identity['sub']).subscribe(
      response =>{
        if(response.status == 'success'){
          console.log(response);
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Compra cancelada'});
          this._modalService.dismissAll();
          this.getComprasR();
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al cancelar la compra'});
        }
      },
      error =>{
        this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al cancelar la compra'});
        console.log(error);
      }
    )
  }

  public editarCompra(compra:any){
    //console.log(compra.created_at);
    const resultado = new Date(compra.created_at);
    resultado.setDate(resultado.getDate()+15);
    //console.log(resultado);
    const fechaActual = new Date();
    //console.log(fechaActual);
    if(resultado>fechaActual){
      //this.messageService.add({severity:'success', summary:'Éxito', detail:'Si se puede'});
      this._modalService.dismissAll('Cross click');
      this._router.navigate(['../compra-modulo/compra-editar/',compra.idCompra]);
    }else{
      this.messageService.add({severity:'warn', summary:'Aviso', detail:'No se puede modificar una compra con más de 15 días de antiguedad'});
    }

  }

}

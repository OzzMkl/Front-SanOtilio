import { Component, OnInit } from '@angular/core';
//Servicios
import { ProductoService } from 'src/app/services/producto.service';
import { MessageService } from 'primeng/api';
import { RequisicionService } from 'src/app/services/requisicion.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { HttpClient} from '@angular/common/http'
import { Subscription } from 'rxjs';
import { handleRedirect } from 'src/app/utils/fnUtils';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//Router
import { Router } from '@angular/router';

@Component({
  selector: 'app-requisicion-buscar',
  templateUrl: './requisicion-buscar.component.html',
  styleUrls: ['./requisicion-buscar.component.css'],
  providers:[ProductoService, RequisicionService, EmpleadoService,MessageService]
})
export class RequisicionBuscarComponent implements OnInit {

  //Lista de requisiciones
  public requisiciones: Array<any> = [];

  //Usuario
  public idUser:any;
  mReq = this._modulosService.modsRequisicion();
  public userPermisos:any;
  //Modal
  //Cerrar modal
  closeResult = ''; 
  //Paginacion en modal
  pageActualMod: number = 0;  
  //spinner
  public isLoading:boolean = false;
  //Modelos de pipes
  seleccionado:number = 1;//para cambiar entre pipes
  buscarProducto = '';
  buscarProductoCE = '';
  buscarProductoCbar : number = 0;

  //Paginacion lista de requisiciones
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;

  //variables servicios
  public url:any;
  public identity: any;
  public ultimaReq: any;
  public detailReq: any;
  public productosdetailReq: any;

  //contador para el text area
  conta: number =0;

  //Subscripciones
  private getReqSub : Subscription = new Subscription;

  //Buscador
  public tipoBusqueda: string = 'Recibidas';
  public search: string = '';

  //controla botones
  public pdfB:boolean = false;
  public editarB:boolean = false;
  public cancelarB:boolean = false;
  public aceptarB:boolean = false;
  public rechazarB:boolean = false;

  constructor(
    private _http: HttpClient,
    private _modalService: NgbModal,
    private messageService: MessageService,
    private _requisicionservice: RequisicionService,
    public _empleadoService : EmpleadoService,
    public _router: Router,
    private _modulosService: ModulosService,
  ) {}

  ngOnInit(): void {
    this.loadUser();
    
  }

  /**
   * @description
   * Cargar los datos del usuario al iniciar el componente
   */
  loadUser(){


    this.userPermisos = this._empleadoService.getPermisosModulo(this.mReq.idModulo, this.mReq.idSubModulo);
    console.log(this.userPermisos)
    //revisamos si el permiso del modulo esta activo si no redireccionamos
    if( this.userPermisos.ver == 1 ){
        this.getRequisiciones();
    } else{
      handleRedirect(5, this._router, this.messageService);
    }
    this.identity = this._empleadoService.getIdentity();
  }

     /**
   * @description
   * Obtiene la informacion del input y busca
   */
     selectBusqueda(){
      
      if(this.search == "" || null){
      
        this.getRequisiciones();
    } else{
      this.getRequisiciones();
      }//finelse
  }//finFunction

  generaPDF(idReq:number){
    this._requisicionservice.getPDF(idReq, this.identity['sub']).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
      }
    );
  }

  getRequisiciones(){
    //mostramos el spinner
    this.isLoading = true;


    this.getReqSub = this._requisicionservice.getReq(this.tipoBusqueda,this.search).subscribe(
      response =>{
        if(response.status == 'success'){

           this.requisiciones = response.requisicion.data;
           console.log('getReq',response.requisicion.data);
           //navegacion de paginacion
           this.totalPages = response.requisicion.last_page;
           this.itemsPerPage = response.requisicion.per_page;
           this.pageActual = response.requisicion.current_page;
           this.next_page = response.requisicion.next_page_url;
           this.path = response.requisicion.path;

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
   * Destruye las subscripciones a los observables
   */
  ngOnDestroy(): void {
      this.getReqSub.unsubscribe();
  }


  //Modal
  open(content:any) {//abre modal
    this._modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {//cierra modal con teclado ESC o al picar fuera del modal
    this.pageActualMod = 0;
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  getPage(page:number) {
    //iniciamos spinner
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        
        //asignamos datos a varibale para poder mostrarla en la tabla
        this.requisiciones = response.requisicion.data;
        console.log('getReq',response.requisicion.data);
        //navegacion de paginacion
        this.totalPages = response.requisicion.last_page;
        this.itemsPerPage = response.requisicion.per_page;
        this.pageActual = response.requisicion.current_page;
        this.next_page = response.requisicion.next_page_url;
        this.path = response.requisicion.path;

        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }

  selected(idReq:any){
    console.log('selected:' ,idReq);
    this.getDetailsReq(idReq);
  }

  getDetailsReq(idReq:any){//recibimos el id y traemos informacion de esa compra
    this._requisicionservice.getDetailsReq(idReq).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detailReq = response.requisicion; 
          this.productosdetailReq = response.productos;
          console.log('response',response);
          // console.log('requisicion',this.detailReq);
          // console.log('productos',this.productosdetailReq);
          
        }else{ console.log('Algo salio mal');}
        
      },error => {

        console.log(error);
      });
  }

  deshabilitarReq(idReq:any){
    console.log('deshabilitarReq ',idReq);
    var identity = this._empleadoService.getIdentity();
    this._requisicionservice.deshabilitarReq(idReq,identity['sub']).subscribe(
    response =>{
      if(response.status == 'success'){
        this.messageService.add({severity:'success', summary:'Requisición cancelada'});
        //this._router.navigate(['./requisicion-modulo/requisicion-buscar']);
        window.location.reload();
        
      }else{ this.messageService.add({severity:'success', summary:'Requisición cancelada'});}
    }, error =>{
      console.log(error);
    });
  }

  generarOrden(requisiicones:any){
    console.log(requisiicones);

  }

  aceptarReq(idReq:number){
    console.log('aceptarReq ',idReq);
    var identity = this._empleadoService.getIdentity();
    this._requisicionservice.aceptarReq(idReq,identity['sub']).subscribe(
    response =>{
      if(response.status == 'success'){
        this.messageService.add({severity:'success', summary:'Requisición aceptada'});
        //this._router.navigate(['./requisicion-modulo/requisicion-buscar']);
        window.location.reload();
        
      }else{ this.messageService.add({severity:'success', summary:'Requisición aceptada'});}
    }, error =>{
      console.log(error);
    });

  }

  rechazarReq(idReq:number){
    console.log('rechazarReq ',idReq);
    var identity = this._empleadoService.getIdentity();
    this._requisicionservice.rechazarReq(idReq,identity['sub']).subscribe(
    response =>{
      if(response.status == 'success'){
        this.messageService.add({severity:'success', summary:'Requisición rechazada'});
        //this._router.navigate(['./requisicion-modulo/requisicion-buscar']);
        window.location.reload();
        
      }else{ this.messageService.add({severity:'success', summary:'Requisición rechazada'});}
    }, error =>{
      console.log(error);
    });

  }
}

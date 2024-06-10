/**
 *  @fileoverview Logica del componente cliente-buscar
 *                muestra campo para buscar clientes
 *                muestra tabla con los clientes paginados
 * 
 *  @version 1.0
 * 
 *  @autor Oziel pacheco<ozielpacheco.m@gmail.com>
 *  @copyright Materiales San Otilio
 * 
 *  @History
 * 
 *  -Primera version escrita por Oziel Pacheco
 *  -Se agrega paginacion a la tabla de clientes (21/02/2023 - Oziel)
 * 
 */
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { HttpClient} from '@angular/common/http';
import { SharedMessage } from 'src/app/services/sharedMessage';
//ngbootstrap
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-cliente-buscar',
  templateUrl: './cliente-buscar.component.html',
  styleUrls: ['./cliente-buscar.component.css'],
  providers:[ClientesService,MessageService]
})
export class ClienteBuscarComponent implements OnInit {

  //variable de servicio
  public clientes : Array<any> = [];
  public cliente:any;
  public dirCliente:any;
  /**PAGINATOR */
  public totalPages: any;
  public path: string = '';
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 1;
  //cerrar mdal
  closeResult='';
  //spinner
  public isLoading: boolean = false;
  //Subscripciones
  private getClienteSub : Subscription = new Subscription;
  //PERMISOS
  public userPermisos:any = [];
  public mCli = this._modulosService.modsClientes();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;


  constructor( 
                private _clienteService: ClientesService, 
                private _empleadoService:EmpleadoService,
                private _modulosService: ModulosService,
                private modalService: NgbModal, 
                private messageService: MessageService,
                private _http: HttpClient,
                private _router: Router,
                private _sharedMessage: SharedMessage, ) { }

  ngOnInit(): void {
    this.loadUser();
    setTimeout(()=>{
      this._sharedMessage.messages$.subscribe(
        messages =>{
          if(messages){
            this.messageService.add(messages[0]); // Agregar el mensaje al servicio de mensajes de PrimeNG
          }
        }
      )
    },500);
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCli.idModulo, this.mCli.idSubModulo);
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
          this.getClientes();
        }
  }

  seleccionarCliente(idCliente:any){
    this._clienteService.getDetallesCliente(idCliente).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.cliente = response.cliente;
          this.dirCliente= response.cdireccion;
        }else{
          console.log('algo salio mal')
        }
        //console.log(response.cliente);
        //console.log(response.cdireccion);
      },error=>{
        console.log(error);
      });
  }

  /**
   * Trae la informacion de los clientes paginados
   * se muestran en la tabla
   */
  getClientes(){
    //iniciamos spinner
    this.isLoading = true;
    //ejecutamos servicio
    this.getClienteSub = this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          //asignamos la lista de clientes
          this.clientes = response.clientes.data;
          //console.log(this.clientes);

          //navegacion de paginacion
          this.totalPages = response.clientes.total;
          this.itemsPerPage = response.clientes.per_page;
          this.pageActual = response.clientes.current_page;
          this.next_page = response.clientes.next_page_url;
          this.path = response.clientes.path;

          //una vez terminado quitamos el spinner
          this.isLoading=false;
        }
      },error =>{
      console.log(error);
    });
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
        //console.log(response);
        this.clientes = response.clientes.data;
        //navegacion paginacion
        this.totalPages = response.clientes.total;
        this.itemsPerPage = response.clientes.per_page;
        this.pageActual = response.clientes.current_page;
        this.next_page = response.clientes.next_page_url;
        this.path = response.clientes.path

        //una vez terminado quitamos el spinner
        this.isLoading=false;
        
    })
  }

  getSearchNombreCliente(nombreCliente:any){
    //iniciamos spinner
    this.isLoading = true;
    //si es vacio volvemos a llamar la primera funcion que trae todo
    if(nombreCliente.target.value == '' || nombreCliente.target.value == null){
      this.getClientes();
    } else{

        let nomCliente = nombreCliente.target.value;
        //ejecutamos servicio
        this.getClienteSub = this._clienteService.searchNombreCliente(nomCliente).subscribe( 
        response =>{
          if(response.status == 'success'){
            //asignamos la lista de clientes
            this.clientes = response.clientes.data;
            //console.log(this.clientes);

            //navegacion de paginacion
            this.totalPages = response.clientes.total;
            this.itemsPerPage = response.clientes.per_page;
            this.pageActual = response.clientes.current_page;
            this.next_page = response.clientes.next_page_url;
            this.path = response.clientes.path;

            //una vez terminado quitamos el spinner
            this.isLoading=false;

            
          }
        },error =>{
        console.log(error);
      });
    }
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
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  /**
   * Destruye las subscripciones a los observables
   */
  ngOnDestroy(): void {
    this.getClienteSub.unsubscribe();
  }
}

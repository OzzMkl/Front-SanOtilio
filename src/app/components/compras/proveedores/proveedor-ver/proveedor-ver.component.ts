import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { BancoService } from 'src/app/services/banco.service';
//Modelos
import { Banco } from 'src/app/models/banco';
import { Proveedor } from 'src/app/models/proveedor';
//ngboostrap
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-proveedor-ver',
  templateUrl: './proveedor-ver.component.html',
  styleUrls: ['./proveedor-ver.component.css'],
  providers:[ProveedorService,BancoService,EmpleadoService,MessageService]  
})
export class ProveedorVerComponent implements OnInit {

  public proveedor: Array<Proveedor>;
  public contacto: Array<any> = [];
  public ncp: Array<any> = [];
  public banco: Array<Banco> = [];
  public status: string = '';
  public token:any;
  public closeModal: string = '';
  //PERMISOS
  public userPermisos:any = [];
  public mProv = this._modulosService.modsProveedores();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;

  constructor(

    private _proveedorService: ProveedorService,
    private _empleadoService: EmpleadoService,
    private _bancoService: BancoService,
    private messageService: MessageService,
    private _modulosService: ModulosService,
    private _router: Router,
    private _route: ActivatedRoute,
    private modalService: NgbModal,

  ) { 

    this.proveedor =[];// new Proveedor (0,'','','','','','','','','','',0,0,1,'','','','','','','','','');
    this.token = this._empleadoService.getToken();

  }

  ngOnInit(): void {
    this.loadUser();
  }

  /**
   * Funcion que carga los permisos
   */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mProv.idModulo, this.mProv.idSubModulo);
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
          this.getBanco();
          this.getidProv();
          this.getContacto();
          this.getNCP();
        }
  }
  //Obtener una lista de todos los bancos para rellenar el select
  getBanco(){
    //console.log(this.banco);
    this._bancoService.getBancos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.banco = response.proveedores;
          //console.log(response.proveedores);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  getidProv(){

    //Obtener el id del proveedor de la URL
    this._route.params.subscribe(params => {
        let id = + params['idProveedor'];
        //console.log(id);

        //Peticion ajax para obtener los datos con base en el id del proveedor
      this._proveedorService.getProveedoresVer(id).subscribe(
        response =>{
          if(response.status == 'success'){
            this.proveedor = response.proveedores;
            //console.log(this.proveedor);
          }
        },
        error =>{
          console.log(error);
        }
      );

    });
  }

  /*Obtener lista de los contactos de un proveedor*/
  getContacto(){
    //Obtener el id del proveedor de la URL
    this._route.params.subscribe(params => {
      let id = + params['idProveedor'];

      //Peticion ajax para obtener los datos con base en el id del proveedor
    this._proveedorService.getContactos(id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.contacto = response.contactos;
          //console.log(response.contactos);
        }
      },
      error =>{
        console.log(error);
      }
    );

  });
  }

  /*Obtener lista de los contactos de un proveedor*/
  getNCP(){
    //Obtener el id del proveedor de la URL
    this._route.params.subscribe(params => {
      let id = + params['idProveedor'];

      //Peticion ajax para obtener los datos con base en el id del proveedor
    this._proveedorService.getNcps(id).subscribe(
      response =>{
        if(response.status == 'success'){
          this.ncp = response.ncp;
          //console.log(response.ncp);
        }
      },
      error =>{
        console.log(error);
      }
    );

  });
  }

  /***MODALES */
  triggerModal(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
      this.closeModal = `Closed with: ${res}`;
    }, (res) => {
      this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
    });
  }
  
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }
  //Metodo para habilitar el proveedor
  onSubmit(){
   
    this._route.params.subscribe(params => {
      let id = + params['idProveedor'];
      let idUsuario = this._empleadoService.getIdentity();

    this._proveedorService.updateStatus( id,idUsuario).subscribe(
      response =>{
        if(response.status == 'success'){
          //console.log(response);
          this._router.navigate(['./proveedor-modulo/proveedorBuscar']);
          // this.toastService.show('Estatus cambiado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
        }
      },
      error =>{
        console.log(error);
        // this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
      }
    )
  });
  }
  
}

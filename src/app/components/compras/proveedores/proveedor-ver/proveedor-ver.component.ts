import { Component, OnInit } from '@angular/core';
import { Banco } from 'src/app/models/banco';
import { BancoService } from 'src/app/services/banco.service';
import { Proveedor } from 'src/app/models/proveedor';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Contacto } from 'src/app/models/contacto';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from 'src/app/services/toast.service';
import { FormGroup, FormControl} from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';


@Component({
  selector: 'app-proveedor-ver',
  templateUrl: './proveedor-ver.component.html',
  styleUrls: ['./proveedor-ver.component.css'],
  providers:[ProveedorService,BancoService,EmpleadoService]  
})
export class ProveedorVerComponent implements OnInit {

  public closeModal: string;
  public proveedor: Array<Proveedor>;
  public contacto: Array<any>;
  public ncp: Array<any>;
  public banco: Array<Banco>;
  public page_contacto: string;
  public page_cuenta: string;
  public page_title: string;
  public status: string;
  public token:any;
  public prove: Proveedor;
  public provee: Proveedor;


  // upst = new FormGroup({
  //   idProveedor: new FormControl(''),
  //   idStatus: new FormControl(''),
  // });

  constructor(

    private _proveedorService: ProveedorService,
    private _bancoService: BancoService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _empleadoService: EmpleadoService,
    private modalService: NgbModal,
    public toastService: ToastService

  ) { 

    this.proveedor =[];// new Proveedor (0,'','','','','','','','','','',0,0,1,'','','','','','','','','');
    this.prove = new Proveedor (0,'','','','','','','','','','',0,0,1,'','','','','','','','','');
    this.provee = new Proveedor (0,'','','','','','','','','','',0,0,2,'','','','','','','','','');
    this.contacto = [];
    this.ncp=[];
    this.banco = [];
    this.page_title = 'Ver proveedor';
    this.page_contacto = 'Contactos';
    this.page_cuenta = 'Cuentas';
    this.status = '';
    this.closeModal ='';
    this.token = this._empleadoService.getToken();

  }

  ngOnInit(): void {
    this.getBanco();
    this.getidProv();
    this.getContacto();
    this.getNCP();
    
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
  onSubmit(form:any){
   
    this._route.params.subscribe(params => {
      let id = + params['idProveedor'];

    this._proveedorService.updateStatus(this.prove, id).subscribe(
      response =>{
        //console.log(response);
        this._router.navigate(['./proveedor-modulo/proveedorBuscar']);
        this.toastService.show('Proveedor habilitado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
      },
      error =>{
        console.log(this.prove);
        console.log(<any>error);
        this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
      }
    )
  });
  }
  //Metodo para inhabilitar el proveedor
  onSubmitt(form:any){
   
    this._route.params.subscribe(params => {
      let id = + params['idProveedor'];

    this._proveedorService.updateStatus(this.provee, id).subscribe(
      response =>{
        //console.log(response);
        this._router.navigate(['./proveedor-modulo/proveedorDeshabilitado']);
        this.toastService.show('Proveedor inhabilitado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
      },
      error =>{
        console.log(this.prove);
        console.log(<any>error);
        this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
      }
    )
  });
  }
  
  
}

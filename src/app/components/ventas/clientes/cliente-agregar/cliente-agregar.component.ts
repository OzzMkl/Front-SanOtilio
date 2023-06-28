import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//modelo
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion} from 'src/app/models/cdireccion'
//ngbootstrap
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-cliente-agregar',
  templateUrl: './cliente-agregar.component.html',
  styleUrls: ['./cliente-agregar.component.css'],
  providers:[ClientesService, MessageService]
})
export class ClienteAgregarComponent implements OnInit {

  //variables servicios
  public tipocliente :any;
  //variable formulario
  public isCompany: boolean = false;
  public isCredito: boolean = false;
  public isRFC: boolean = false;
  public checkDireccion: boolean = false;
  //modelo
  public cliente: Cliente;
  public cdireccion: Cdireccion;
  //cerrar modal
  closeResult ='';
  //PERMISOS
  public userPermisos:any = [];
  public mCli = this._modulosService.modsInventario();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;
  

  constructor( private _clienteService: ClientesService,
               private _empleadoService: EmpleadoService,
               private _modulosService: ModulosService,
               private modalService:NgbModal,
               private messageService: MessageService,
               private _router: Router ) { 

    this.cliente = new Cliente (0,'','','','','',0,1,1);
    this.cdireccion = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
    
  }

  ngOnInit(): void {
    this.loadUser();
    
  }

  /**
   * Funcion que carga los permisos
   */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mCli.idModulo, this.mCli.idSubModulo);
        //revisamos si el permiso del modulo esta activo si no redireccionamos
        if( this.userPermisos.agregar != 1 ){
          this.timerId = setInterval(()=>{
            this.counter--;
            if(this.counter === 0){
              clearInterval(this.timerId);
              this._router.navigate(['./']);
            }
            this.messageService.add({severity:'error', summary:'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'});
          },1000);
        } else{
          this.getTipocliente();
        }
  }

  getTipocliente(){//obtenemos los tipos de clientes para el select
    this._clienteService.getTipocliente().subscribe(
      response =>{
        this.tipocliente = response.tipocliente;
      },error =>{
        console.log(error);
      });
  }

  guardarCliente(form:any){//guardamos la informacion capturada del cliente

    var identity = this._empleadoService.getIdentity();
    
    if(this.isCompany == true ){
      this.cliente.aMaterno ='';
      this.cliente.aPaterno='';
    }
    if(this.isRFC == false){
      this.cliente.rfc ='XAXX010101000';
    }
    
    this._clienteService.postCliente(this.cliente,identity).subscribe( 
      response =>{

        //console.log(this.cliente)
        if(response.status == 'success'){
          this.messageService.add({severity:'success', summary:'Registro exitoso', detail: 'Cliente registrado correctamente', sticky: true});

          if(this.checkDireccion == true && this.cdireccion.ciudad != '' && this.cdireccion.colonia != '' && this.cdireccion.calle != ''
          && this.cdireccion.numExt != '' && this.cdireccion.cp != 0 && this.cdireccion.referencia != '' && this.cdireccion.telefono != 0){

            this._clienteService.postCdireccion(this.cdireccion,identity).subscribe( 
              response=>{
                //console.log(response);
                this.messageService.add({severity:'success', summary:'Registro exitoso', detail:'La direccion se registro correctamente', sticky: true});
              },error=>{
                console.log(error);
                this.messageService.add({severity:'error', summary:'Algo salio mal', detail:error.error.message, sticky: true});
              });
          } else{
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:'No se registro ninguna direccion', sticky: true});
          }
            
        }else{
          console.log('Algo salio mal');
        }
      },error=>{
        this.messageService.add({severity:'error', summary:'Algo salio mal', detail:error.message, sticky: true});
        console.log(error);
    });
  }

  capturarDireccion(){
    //console.log(this.cdireccion);
  }

  // Modal
  open(content:any) {//abre modal
    if(this.checkDireccion == true){
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
    
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
}
/*** */
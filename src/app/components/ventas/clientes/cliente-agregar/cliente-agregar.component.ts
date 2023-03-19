import { Component, OnInit } from '@angular/core';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
//modelo
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion} from 'src/app/models/cdireccion'
//ngbootstrap
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
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
  // //variable para asginar fecha
  // hoy : Date= new Date();

  constructor( private _clienteService: ClientesService,
               private modalService:NgbModal,
               private messageService: MessageService) { 
    this.cliente = new Cliente (0,'','','','','',0,1,1);
    this.cdireccion = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
  }

  ngOnInit(): void {
    this.getTipocliente();
    
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
    
    if(this.isCompany == true ){
      this.cliente.aMaterno ='';
      this.cliente.aPaterno='';
    }
    if(this.isRFC == false){
      this.cliente.rfc ='XAXX010101000';
    }
    
    this._clienteService.postCliente(this.cliente).subscribe( 
      response =>{

        //console.log(this.cliente)
        if(response.status == 'success'){
          this.messageService.add({severity:'success', summary:'Registro exitoso', detail: 'El cliente se registrado correctamente', sticky: true});

          if(this.checkDireccion == true && this.cdireccion.ciudad != '' && this.cdireccion.colonia != '' && this.cdireccion.calle != ''
          && this.cdireccion.numExt != '' && this.cdireccion.cp != 0 && this.cdireccion.referencia != '' && this.cdireccion.telefono != 0){

            this._clienteService.postCdireccion(this.cdireccion).subscribe( 
              response=>{
                //console.log(response);
                this.messageService.add({severity:'success', summary:'Registro exitoso', detail:'La direccion se registro correctamente', sticky: true});
              },error=>{
                console.log(error);
                this.messageService.add({severity:'error', summary:'Algo salio mal', detail:error.error.message, sticky: true});
              });
          } else{
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:'Si agrego una direccion esta no se registro', sticky: true});
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
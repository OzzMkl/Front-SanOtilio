import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { MessageService } from 'primeng/api';
import { EmpleadoService } from 'src/app/services/empleado.service';
//modelo
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion} from 'src/app/models/cdireccion'
//ngbootstrap
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: ['./cliente-editar.component.css'],
  providers:[MessageService]
})
export class ClienteEditarComponent implements OnInit {

  //variables servicios
  public tipocliente :any;
  //variable formulario
  public isCompany: boolean = false;
  public isCredito: boolean = false;
  public isRFC: boolean = false;
  //cerrar modal
  closeResult ='';
  //Modelos 
  public clienteEditado: Cliente;
  public dirEditada: Cdireccion;
  public listaDirecciones: Array<Cdireccion>;

  constructor(  private _clienteService: ClientesService,
                private _empleadoService: EmpleadoService,
                private modalService:NgbModal,
                public messageService: MessageService,
                private _route: ActivatedRoute) {

      this.clienteEditado = new Cliente (0,'','','','','',0,1,0);
      this.dirEditada = new Cdireccion (0,'Mexico','Puebla','','','','','','',0,'',0,1,'');
      this.listaDirecciones = [];
     }

  ngOnInit(): void {
    this.getIdCliente();
    this.getTipocliente();
  }

  getIdCliente(){//obtenemos informacion del cliente de acuerdo a su id
    //cogemos el id desde el link
    this._route.params.subscribe( params => {
      let id = + params['idCliente'];

      this._clienteService.getDetallesCliente(id).subscribe( response =>{
        if(response.status = 'success'){
          //asignamos uno por uno sus caracteristicas al modelo
          this.clienteEditado.idCliente = response.cliente[0]['idCliente'];
          this.clienteEditado.nombre = response.cliente[0]['nombre'];
          this.clienteEditado.aMaterno = response.cliente[0]['aMaterno'];
          this.clienteEditado.aPaterno = response.cliente[0]['aPaterno'];
          this.clienteEditado.rfc = response.cliente[0]['rfc'];
          this.clienteEditado.correo = response.cliente[0]['correo'];
          this.clienteEditado.credito = response.cliente[0]['credito'];
          this.clienteEditado.idStatus = response.cliente[0]['idStatus'];
          this.clienteEditado.idTipo = response.cliente[0]['idTipo'];
          //se asigna la direcciones
          this.listaDirecciones = response.cdireccion;
          //Si cuenta con credito habilitamos el check
          if(this.clienteEditado.credito > 0){
            this.isCredito = true;
          }
          //si el campo Ama o aPa tiene longitud cero habilitamos el chek de empresa
          if(this.clienteEditado.aPaterno.length == 0 && this.clienteEditado.aMaterno.length == 0){
            this.isCompany = true;
          }
          if(this.clienteEditado.rfc != 'XAXX010101000'){
            this.isRFC = true;
          }
        }else{
          console.log('algo salio mal');
        }
      },error =>{
        console.log(error);
      });
    });
  }
  getTipocliente(){//obtenemos los tipos de clientes para el select
    this._clienteService.getTipocliente().subscribe(
      response =>{
        this.tipocliente = response.tipocliente;
      },error =>{
        console.log(error);
      });
  }
  capturarDireccion(){//agregamos la direccion a la lista de direcciones
    this.listaDirecciones.push({...this.dirEditada});
  }
  editarDireccion(direccion:any,content:any){//edcion de la direccion al dar click
    //creamos variable
    let k;
    //buscamos dentro del array el nombre de la colonia y ya encontrado
    //asignamos todo el objeto a la variable que creamos
    k = this.listaDirecciones.find((item) => item.colonia+item.calle+item.numExt == direccion);
    //asignamos una por una a las propiedades del modelo dirEditada
    this.dirEditada.idCliente = k!.idCliente;
    this.dirEditada.pais = k!.pais;
    this.dirEditada.estado = k!.estado;
    this.dirEditada.ciudad = k!.ciudad;
    this.dirEditada.colonia = k!.colonia;
    this.dirEditada.calle = k!.calle;
    this.dirEditada.entreCalles = k!.entreCalles;
    this.dirEditada.numExt = k!.numExt;
    this.dirEditada.numInt = k!.numInt;
    this.dirEditada.cp = k!.cp;
    this.dirEditada.referencia = k!.referencia;
    this.dirEditada.telefono = k!.telefono;
    this.dirEditada.idZona = k!.idZona;
    //eliminamos de la lista la direccion seleccionada
    this.listaDirecciones = this.listaDirecciones.filter((item) => item.colonia+item.calle+item.numExt !== direccion);
    //mandammos a abrir el modal para editar la direccion
    this.open(content);
  }
  /**
   * Actualiza la informacion del cliente
   * junto con su direccion
   */
  actualizarCliente(){

    var identity = this._empleadoService.getIdentity();

    if(this.isCompany == true ){
      this.clienteEditado.aMaterno ='';
      this.clienteEditado.aPaterno='';
    }
    if(this.isRFC == false){
      this.clienteEditado.rfc ='XAXX010101000';
    }
    //console.log(this.listaDirecciones);
    this._clienteService.updateCliente(this.clienteEditado,this.clienteEditado.idCliente,identity).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.messageService.add({severity:'success', summary:'Actualizacion exitosa', detail: 'Cliente actualizado correctamente', sticky: true});

          if(this.listaDirecciones.length > 0){

            this._clienteService.updateCdireccion(this.listaDirecciones,this.clienteEditado.idCliente).subscribe(
              response =>{
                if(response.status == 'success'){
                  this.messageService.add({severity:'success', summary:'Actualizacion exitosa', detail:'La direccion se actualizo correctamente', sticky: true});
                }
                //console.log(response)
              },error=>{
                this.messageService.add({severity:'error', summary:'Algo salio mal', detail:error.error.message, sticky: true});
                console.log(error);
              });

          } else{
            this.messageService.add({severity:'warn', summary:'Advertencia', detail:'No se actualizo ninguna direccion', sticky: true});
          }
          
        }else{
          //this.toastService.show('Algo salio mal al actualizar el cliente',{classname: 'bg-danger text-light', delay: 6000});
        }
        //console.log(response);
      },error=>{
        this.messageService.add({severity:'error', summary:'Algo salio mal', detail:error.message, sticky: true});
        console.log(error);
      });
  }

// Modal
open(content:any) {//abre modal
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
    this.messageService.add({severity:'warn', summary:'Advertencia1', sticky: true});
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    //this.messageService.add({severity:'warn', summary:'Advertencia2 ->'+this.closeResult, sticky: true});
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
}

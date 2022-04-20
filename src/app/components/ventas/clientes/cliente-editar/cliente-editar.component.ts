import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { ToastService } from 'src/app/services/toast.service';
//modelo
import { Cliente } from 'src/app/models/cliente';
import { Cdireccion} from 'src/app/models/cdireccion'
//ngbootstrap
import { NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cliente-editar',
  templateUrl: './cliente-editar.component.html',
  styleUrls: ['./cliente-editar.component.css']
})
export class ClienteEditarComponent implements OnInit {

  //variables servicios
  public tipocliente :any;
  //variable formulario
  public isCompany: boolean = false;
  public isCredito: boolean = false;
  //cerrar modal
  closeResult ='';
  //Modelos 
  public clienteEditado: Cliente;
  public dirEditada: Array<Cdireccion>;

  constructor(private _clienteService: ClientesService, private modalService:NgbModal,
    public toastService: ToastService, private _route: ActivatedRoute) {

      this.clienteEditado = new Cliente (0,'','','','','',0,1,0);
      this.dirEditada = [];
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
          this.dirEditada = response.cdireccion;
          //Si cuenta con credito habilitamos el check
          if(this.clienteEditado.credito > 0){
            this.isCredito = true;
          }
          //si el campo Ama o aPa tiene longitud cero habilitamos el chek de empresa
          if(this.clienteEditado.aPaterno.length == 0 && this.clienteEditado.aMaterno.length == 0){
            this.isCompany = true;
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
}

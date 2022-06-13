import { Component, OnInit } from '@angular/core';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
import { global } from 'src/app/services/global';
//router sirve para redireccionar a otra ruta
import { Router } from '@angular/router';
//ngbootstrap
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-cliente-buscar',
  templateUrl: './cliente-buscar.component.html',
  styleUrls: ['./cliente-buscar.component.css'],
  providers:[ClientesService]
})
export class ClienteBuscarComponent implements OnInit {

  //variable de servicio
  public clientes:any;
  public cliente:any;
  public dirCliente:any;
  /**PAGINATOR */
  public totalPages: any;
  public page: any;
  public next_page: any;
  public prev_page: any;
  pageActual: number = 1;
  //pipe
  buscarCliente ='';
  //cerrar mdal
  closeResult='';
  //modelo para buscar
  //spinner
  public isLoading: boolean = false;

  constructor( private _clienteService: ClientesService, private modalService: NgbModal ) { }

  ngOnInit(): void {
    this.getClientes();
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
  getClientes(){
    this.isLoading = true;
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          //console.log(this.clientes);
          this.isLoading=false;
        }
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

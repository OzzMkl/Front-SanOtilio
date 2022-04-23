import { Component, OnInit } from '@angular/core';
//servicio
import { ClientesService } from 'src/app/services/clientes.service';
//modelos
import { Ventag } from 'src/app/models/ventag';
//NGBOOTSTRAP-modal
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-punto-de-venta',
  templateUrl: './punto-de-venta.component.html',
  styleUrls: ['./punto-de-venta.component.css']
})
export class PuntoDeVentaComponent implements OnInit {
  //cerrar modal
  closeResult = '';
  //variable de servicios
  public clientes:any;//getClientes
  public cliente:any;//seleccionarCliente
  public dirCliente:any;//seleccionarCliente
   /**PAGINATOR */
   public totalPages: any;
   public page: any;
   public next_page: any;
   public prev_page: any;
   pageActual: number = 1;
   //pipe de busqueda en modal
   buscarCliente ='';
   //modelo de venta
   public ventag: Ventag;
   //
   public seEnvia: boolean = false;


  constructor( private modalService: NgbModal, private _clienteService: ClientesService) {
    this.ventag = new Ventag(0,0,0,0,'',0,null,0,'','');
   }

  ngOnInit(): void {
  }
  //traemos todos los clientes
  getClientes(){
    this._clienteService.getAllClientes().subscribe( 
      response =>{
        if(response.status == 'success'){
          this.clientes = response.clientes;
          //console.log(this.clientes);
        }
      },error =>{
      console.log(error);
    });
  }
  getDireccionCliente(){
  
  }
  //traemos la informacion del cliente seleccionado
  seleccionarCliente(idCliente:any){
    this._clienteService.getDetallesCliente(idCliente).subscribe( 
      response =>{
        if(response.status == 'success'){
          this.cliente = response.cliente;
          this.dirCliente= response.cdireccion;
          this.ventag.nombreCliente = this.cliente[0]['nombre']+' '+this.cliente[0]['aPaterno']+' '+this.cliente[0]['aMaterno'];
          this.ventag.idCliente = this.cliente[0]['idCliente'];
        }else{
          console.log('algo salio mal'+response);
        }
        //console.log(response.cliente);
        //console.log(response.cdireccion);
      },error=>{
        console.log(error);
      });
  }
  // Modal
  open(content:any) {
    this.getClientes();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  modalSeEnvia(content:any){
    if(this.seEnvia == true){
      this.getClientes();
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }
}

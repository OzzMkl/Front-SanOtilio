import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subscription } from 'rxjs';
//servicios
import { ClientesService } from 'src/app/services/clientes.service';
import { MdlClienteService } from 'src/app/services/mdlClienteService';
import { SharedMessage } from 'src/app/services/sharedMessage';
//Interfaces
import { selectBusqueda } from 'src/app/models/interfaces/selectBusqueda';
import { dialogOptionsClientes } from 'src/app/models/interfaces/dialogOptions-clientes';

@Component({
  selector: 'app-modal-clientes',
  templateUrl: './modal-clientes.component.html',
  styleUrls: ['./modal-clientes.component.css']
})
export class ModalClientesComponent implements OnInit, OnDestroy {

  //Spinner
  public isLoadingGeneral: boolean = false;
  //Modelos
  public clientes: Array<any> = [];
  public optionsSelect: selectBusqueda[] = [];
  public selectedOpt: selectBusqueda | any;
  public valSearch: string = '';
  public selectedCliente: any;
  //modal
  public mdlClientes: boolean = false;
  //Paginator
  public totalPages: number = 0;
  public per_page: number = 100;
  public pageActual: number = 1;
  //variables
  public currentRowIndex: number = 0;
  //subscriptions
  private sub_mdlClienteService: Subscription = new Subscription();
  private sub_clienteService: Subscription = new Subscription();

  constructor(
    private _clientesService: ClientesService,
    private _mdlClienteService: MdlClienteService,
    private _sharedMessage: SharedMessage,
  ) { }

  ngOnInit(): void {
    this.sub_mdlClienteService = this._mdlClienteService.openMdlClientesDialog$.subscribe(
      (dialogOptions: dialogOptionsClientes) =>{
        this.mdlClientes = true;
        this.setOptionsSelect();
        this.getClientes();
      });
  }

  /**
  * @description
  * Carga el array a mostrar del dropdown
  */
  setOptionsSelect(){
    this.optionsSelect = [
      {id:1, name:'Nombre cliente'},
      // {id:2, name:'Descripcion'},
      // {id:3, name:'Codigo de barras'},
    ];
    //Seleccionamos por defecto la primera opcion
    this.selectedOpt = this.optionsSelect[0];
  }

  getClientes(page: number = 1, type: number = 1, search: string = ''){
    this.isLoadingGeneral = true;

    this.sub_clienteService = this._clientesService.getClientesNewIndex(page,type,search).subscribe(
      response =>{
        if(response.status == 'success' && response.code == 200){

          this.clientes = response.clientes.data;

          this.totalPages = response.clientes.total;
          this.pageActual = response.clientes.current_page;
          this.per_page = response.clientes.per_page;

          this.isLoadingGeneral = false;
        }
      }, error =>{
        console.log(error);
        this.isLoadingGeneral = false;
      }
    )
  }

  /**
  * 
  * @param event 
  * @description
  * Cambio de pagina
  */
  onPageChange(event:any) {
    this.pageActual = event.page + 1;
    this.per_page = event.rows;
    this.onSearch(event.page + 1, event.rows);
  }

  /**
  * Busqueda
  */
  onSearch(page: number = 1, rows: number = 100 ):void{
    if(this.selectedOpt){
      if(this.valSearch == "" || this.valSearch == null){
        this.getClientes(page,0,'null');
      } else{
          this.getClientes(page,this.selectedOpt.id,this.valSearch);
      }
    } else{
      //cargamos mensaje
      let message = {severity:'warn', summary:'Alerta', detail:'Favor de seleccionar una opcion para buscar'};
      this._sharedMessage.addMessages(message);
    }
  }

  /**
  * 
  * @param product any
  * 
  * @description
  * Manejador del evento de doble clic en una fila de la tabla.
  * Realiza la acción deseada con el producto seleccionado.
  */
  onRowDoubleClick(cliente: any) {
    this.selectedCliente = cliente;
    this.onSelect();
  }

  /**
  * @description
  * Cierra modales y manda el valor seleccionado
  */
  onSelect():void{
    this._mdlClienteService.sendSelectedValue(this.selectedCliente);
    this.mdlClientes = false;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowDown' && this.mdlClientes == true) {
      this.navigateTable('down');
    } else if (event.key === 'ArrowUp' && this.mdlClientes == true) {
      this.navigateTable('up');
    } else if(event.key === 'Enter' && this.mdlClientes == true){
      event.preventDefault();
      if (this.currentRowIndex >= 0 && this.currentRowIndex < this.clientes.length) {
        this.selectedCliente = this.clientes[this.currentRowIndex];
        this.onSelect();
      }
    }
  }

  navigateTable(direction: string) {
    if (direction === 'down' && this.currentRowIndex < this.clientes.length - 1) {
      this.currentRowIndex++;
    } else if (direction === 'up' && this.currentRowIndex > 0) {
      this.currentRowIndex--;
    }
    this.selectedCliente = this.clientes[this.currentRowIndex];
    this.scrollToRow(this.currentRowIndex);
  }

  scrollToRow(index: number) {
    const row = document.querySelector(`.ui-table-scrollable-body table tbody tr:nth-child(${index + 1})`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onRowSelect(event: any): void {
    const selectedClienteId = event.data.idCliente;
    this.currentRowIndex = this.clientes.findIndex(cliente => cliente.idCliente === selectedClienteId);
  }

  ngOnDestroy(): void {
    this.sub_clienteService.unsubscribe();
    this.sub_mdlClienteService.unsubscribe();
  }
  
}

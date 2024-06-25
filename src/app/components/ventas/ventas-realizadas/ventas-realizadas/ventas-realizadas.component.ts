import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';
// Servicios
import { VentasService } from 'src/app/services/ventas.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { MdlVentaService } from 'src/app/services/mdl-venta-service.service';
// PrimeNG
import { MessageService } from 'primeng/api';
// Modelos
import { dialogOptionsVentas } from 'src/app/models/interfaces/dialogOptions-ventas';
import { Subscription } from 'rxjs';
import { selectBusqueda } from 'src/app/models/interfaces/selectBusqueda';

@Component({
  selector: 'app-ventas-realizadas',
  templateUrl: './ventas-realizadas.component.html',
  styleUrls: ['./ventas-realizadas.component.css'],
  providers: [MessageService]
})
export class VentasRealizadasComponent implements OnInit, OnDestroy {

  public ventas: any[] = [];
  public userPermisos: any;
  public identity: any;
  optionsSelect!: selectBusqueda[];
  selectedOpt!: selectBusqueda;
  optionsSelect2!: selectBusqueda[];
  selectedOpt2!: selectBusqueda;
  valSearch?: string;
  selectedVenta: any;
  currentRowIndex: number = 0;
  //spinner
  public isLoadingGeneral: boolean = true;
  //
  private idModulo: number = 6;
  private idSubmodulo: number = 17;
  counter: number = 5;
  timerId: any;
  public dialogOpt?: dialogOptionsVentas;
  private actualizaVentasSubscription?: Subscription;

  constructor(private _ventasService: VentasService,
              private _empleadoService: EmpleadoService,
              private messageService: MessageService,
              private _router: Router,
              private _sharedMessage: SharedMessage,
              private _mdlVentaService: MdlVentaService) { }

  ngOnInit(): void {
    this.loadUser();

    this.actualizaVentasSubscription = this._mdlVentaService.actualizaListaVentas$.subscribe(
      () => {
        this.getVentas();
      }
    );

    setTimeout(() => {
      this._sharedMessage.messages$.subscribe(
        messages => {
          if (messages) {
            this.messageService.add(messages[0]); // Agregar el mensaje al servicio de mensajes de PrimeNG
          }
        }
      );
    }, 500);
    
  }

  ngOnDestroy(): void {
    this.actualizaVentasSubscription?.unsubscribe();
  }

  loadUser() {
    this.userPermisos = this._empleadoService.getPermisosModulo(this.idModulo, this.idSubmodulo);
    if (this.userPermisos.ver != 1) {
      this.timerId = setInterval(() => {
        this.counter--;
        if (this.counter === 0) {
          clearInterval(this.timerId);
          this._router.navigate(['./']);
        }
        this.messageService.add({ severity: 'error', summary: 'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en ' + this.counter + ' segundos' });
      }, 1000);
    } else {
      this.identity = this._empleadoService.getIdentity();
      this.getVentas();
      this.setOptionsSelect();
    }
  }

  getVentas(search: string = '', type: number = 1, isCredito: number = 1) {
    this._ventasService.getIndexVentas(search,type,isCredito).subscribe(
      response => {
        if (response.status == 'success') {
          this.ventas = response.Ventas;
          this.isLoadingGeneral = false;
          if (this.ventas.length > 0) {
            this.selectedVenta = this.ventas[this.currentRowIndex];
          }
        }
      }, error => {
        this.isLoadingGeneral = false;
        console.log(error);
      }
    );
  }

  setOptionsSelect() {
    this.optionsSelect = [
      { id: 1, name: '# Folio' },
      { id: 2, name: 'Cliente' },
      { id: 3, name: 'Vendedor' },
    ];
    this.optionsSelect2 = [
      { id: 1, name: 'Ver todas las ventas' },
      { id: 2, name: 'Ver ventas sin credito' },
      { id: 3, name: 'Ver ventas a credito' },
    ];
    this.selectedOpt = this.optionsSelect[0];
    this.selectedOpt2 = this.optionsSelect2[0];
  }

  onSearch(): void {
    if (this.selectedOpt && this.selectedOpt2) {
      
      this.getVentas(this.valSearch, this.selectedOpt.id, this.selectedOpt2.id);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Alerta',
        detail: 'Favor de seleccionar una opcion para buscar'
      });
    }
  }

  openMdlVenta(venta:any):void{
    this.selectedVenta = venta;
    this.dialogOpt = {
      idVenta: this.selectedVenta.idVenta,
      modulo: 'ventas',
      submodulo: this.selectedVenta.isCredito ? 'ventas-credito' : 'ventas-realizadas-buscar',
    }
    this._mdlVentaService.openMdlVentaDialog(this.dialogOpt);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.navigateTable('down');
    } else if (event.key === 'ArrowUp') {
      this.navigateTable('up');
    } else if(event.key === 'Enter'){
      event.preventDefault();
      if (this.currentRowIndex >= 0 && this.currentRowIndex < this.ventas.length) {
        this.selectedVenta = this.ventas[this.currentRowIndex];
        this.openMdlVenta(this.selectedVenta);
      }
    }
  }

  navigateTable(direction: string) {
    if (direction === 'down' && this.currentRowIndex < this.ventas.length - 1) {
      this.currentRowIndex++;
    } else if (direction === 'up' && this.currentRowIndex > 0) {
      this.currentRowIndex--;
    }
    this.selectedVenta = this.ventas[this.currentRowIndex];
    this.scrollToRow(this.currentRowIndex);
  }

  scrollToRow(index: number) {
    const row = document.querySelector(`.ui-table-scrollable-body table tbody tr:nth-child(${index + 1})`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onRowSelect(event: any): void {
    const selectedVentaId = event.data.idVenta;
    this.currentRowIndex = this.ventas.findIndex(venta => venta.idVenta === selectedVentaId);
  }
}

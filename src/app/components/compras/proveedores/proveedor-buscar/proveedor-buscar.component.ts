import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router} from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
//SERVICIOS
import { ProveedorService } from 'src/app/services/proveedor.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService } from 'primeng/api';
import { selectBusqueda } from 'src/app/models/interfaces/selectBusqueda';
import { handleRedirect } from 'src/app/utils/fnUtils';

@Component({
  selector: 'app-proveedor-buscar',
  templateUrl: './proveedor-buscar.component.html',
  styleUrls: ['./proveedor-buscar.component.css'],
  providers: [ProveedorService,EmpleadoService, MessageService]
})
export class ProveedorBuscarComponent implements OnInit, OnDestroy {

  //Spinner
  public isLoadingGeneral: boolean = false;
 
  //Variable donde almacenaremos la data del api
  public proveedores: Array<any> = [];
  public selectedProveedor: any;
  public optionsSelect!: selectBusqueda[];
  public optionsSelectStatus!: selectBusqueda[];
  public selectedOpt!: selectBusqueda;
  public selectedOptStatus!: selectBusqueda;
  public valSearch: string = '';
  public currentRowIndex: number = 0;
  /**PAGINATOR */
  public totalPages: any;
  public per_page: any;
  public pageActual: number = 0;
  //subscription
  private getProveedorSub : Subscription = new Subscription;
  private sub_searchTerms: Subscription = new Subscription;
  private searchTerms = new Subject<string>();
  //PERMISOS
  public userPermisos:any = [];
  public mProv = this._modulosService.modsProveedores();

  constructor(
    private _proveedorService: ProveedorService,
    private _empleadoService:EmpleadoService,
    private _modulosService: ModulosService,
    private messageService: MessageService,
    private _router: Router ) { }

  ngOnInit(): void {
    this.loadUser();

    this.sub_searchTerms = this.searchTerms.pipe(debounceTime(300)).subscribe(
          term =>{
            if (this.selectedOpt && this.selectedOptStatus) {
                this.getProve(1, this.selectedOpt.id, term, this.selectedOptStatus.valueExtra, 100);
            } 
            else {
              this.messageService.add({
                severity:'warn', 
                summary:'Alerta', 
                detail:'Favor de seleccionar una opcion para buscar'
              });
            }
      });
  }

  /**
  * Funcion que carga los permisos
  */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mProv.idModulo, this.mProv.idSubModulo);
        //revisamos si el permiso del modulo esta activo si no redireccionamos
        if( this.userPermisos.ver == 1 ){
          this.getProve();
          this.setOptionsSelect();
        } else{
          handleRedirect(5,this._router,this.messageService);
        }
  }

  /**
  * @description
  * Carga el array a mostrar del dropdown de busqueda
  */
  setOptionsSelect(){
    this.optionsSelect = [
      {id:1, name:'Nombre'},
      {id:2, name:'RFC'}
    ];
    this.optionsSelectStatus = [
      {id:1, name:'Mostrar activos e incativos', valueExtra: [55,56]},
      {id:2, name:'Mosotrar solo activos', valueExtra: [55]},
      {id:3, name:'Mostrar solo inactivos', valueExtra: [56]},
    ];

    //Seleccionamos por defecto la primera opcion
    this.selectedOpt = this.optionsSelect[0];
    this.selectedOptStatus = this.optionsSelectStatus[1];
  }

  /**
   * Lista de proveedores habilidatos
   */
  getProve(page:number = 1, type:number = 1, search:string = '', status:Array<any> = [55],rows:number = 100){
    //mostramos el spinner
    this.isLoadingGeneral = true;
    //ejecutamas servicio
    this.getProveedorSub = this._proveedorService.getProveedores(type,search,status,page).subscribe(
      response =>{
        if(response.status == 'success'){

          //asignamos a varibale para mostrar
          this.proveedores = response.proveedores.data;

          //navegacion paginacion
          this.totalPages = response.proveedores.total;
          this.per_page = response.proveedores.per_page;
          this.pageActual = response.proveedores.current_page;
          
          //una vez terminado de cargar quitamos el spinner
          this.isLoadingGeneral = false;
          //console.log(response.proveedores);
        }
      },
      error =>{
        this.isLoadingGeneral = false;
        this.messageService.add({
          severity:'error',
          summary: 'Error',
          detail:'Ocurrio un error al buscar los datos.'
        })
        console.log(error);
      }
    );
  }

  /**
  * Busqueda
  */
  onSearch():void{
    this.searchTerms.next(this.valSearch);
  }

  /**
   * 
   * @param event KeyboardEvent
   * @description
   * Escucha los eventos relacionados a la tecla precionada, y realiza desplazamiento
   * entre los datos, con enter ingresamos al valor seleccionado
   */
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.navigateTable('down');
    } else if (event.key === 'ArrowUp') {
      this.navigateTable('up');
    } else if(event.key === 'Enter'){
      event.preventDefault();
      if (this.currentRowIndex >= 0 && this.currentRowIndex < this.proveedores.length) {
        this.selectedProveedor = this.proveedores[this.currentRowIndex];
        this.onSelect();
      }
    }
  }

  /**
   * 
   * @param direction string
   * @description
   * Recibe a donde se movera y pinta la seleccion
   */
  navigateTable(direction: string) {
    if (direction === 'down' && this.currentRowIndex < this.proveedores.length - 1) {
      this.currentRowIndex++;
    } else if (direction === 'up' && this.currentRowIndex > 0) {
      this.currentRowIndex--;
    }
    this.selectedProveedor = this.proveedores[this.currentRowIndex];
    this.scrollToRow(this.currentRowIndex);
  }

  scrollToRow(index: number) {
    const row = document.querySelector(`.ui-table-scrollable-body table tbody tr:nth-child(${index + 1})`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onRowSelect(event: any): void {
    const selectedProveedorId = event.data.idProveedor;
    this.currentRowIndex = this.proveedores.findIndex(proveedor => proveedor.idProveedor === selectedProveedorId);
  }

  /**
  * 
  * @param proveedor any
  * 
  * @description
  * Manejador del evento de doble clic en una fila de la tabla.
  * Realiza la acción deseada con el proveedor seleccionado.
  */
  onRowDoubleClick(proveedor: any) {
    this.selectedProveedor = proveedor;
    this.onSelect();
  }

  /**
  * @description
  * Cierra modales y manda el valor seleccionado
  */
  onSelect():void{
    this._router.navigate(['./proveedor-modulo/proveedorVer/'+this.selectedProveedor.idProveedor]);
  }

  /**
   * Destruye las subscripciones a los observables
   */
  ngOnDestroy(): void {
    this.getProveedorSub.unsubscribe();
    this.sub_searchTerms.unsubscribe();
  }

}

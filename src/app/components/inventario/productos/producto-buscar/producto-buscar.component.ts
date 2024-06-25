import { Component, OnInit, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
//Servicios propios
import { global } from 'src/app/services/global';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { ModulosService } from 'src/app/services/modulos.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ProductoService } from 'src/app/services/producto.service';
//primeng
import { MenuItem, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
//interfaces
import { Producto } from 'src/app/models/producto';
import { selectBusqueda } from 'src/app/models/interfaces/selectBusqueda';
import { Productos_medidas_new } from 'src/app/models/productos_medidas_new';
import { handleRedirect } from 'src/app/utils/fnUtils';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css'],
  providers: [ProductoService, EmpleadoService, MessageService, ConfirmationService]
})
export class ProductoBuscarComponent implements OnInit, OnDestroy, AfterViewInit {

  fechasHistorial: any;
  //Spinners
  public isLoadingPrecios:boolean = false;//mostrarPrecios
  public isLoadingGeneral:boolean = false;//selectedOptEdit
  //Servicios
  //paginator
  //Models
  public identity: any;
  optionsSelect!: selectBusqueda[];
  selectedOpt!: selectBusqueda;
  public optionsSelectStatus!: selectBusqueda[];
  public selectedOptStatus!: selectBusqueda;
  valSearch: string = '';
  selectedProduct:any;
  selectedMedida:any;
  currentRowIndex: number = 0;
  public viewProducto?: Producto;
  public viewProductoMedidas?: Array<Productos_medidas_new>;
  public tblHeadersNUBE: Array<any> = [];
  public tblHeaders: Array<any> = [];
  public url:string = global.url;
  public productos: Array<any> = [];
  // public productosMedida: Array<any> = [];
  public existenciasPorMed: Array<any> = [];
  public imagenPM: string = "1650558444no-image.png";
  public claveExt: string ='';
  public isShow: boolean = false;
  public valRadioButton: string = 'nube';
  public arrHistorialProducto?: Array<any>;
  public arrHistorialPrecio: any=[];
  /**PAGINATOR */
  public totalPages: number = 0;
  public per_page: number = 100;
  pageActual: number = 1;
  //PERMISOS
  public userPermisos:any = [];
  public mInv = this._modulosService.modsInventario();
  public sucursal_now: any = this._empleadoService.getSucursalSesion();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;
  //Menu
  public menuItems: MenuItem[] =[];
  public idProductoMenu?: number;
  //subscriptions
  private sub_producto?: Subscription;
  private sub_searchTerms?: Subscription;
  private sub_sharedMessage?: Subscription;
  private searchTerms = new Subject<string>();
  //Modales
  public mdl_update: boolean = false;
  public mdl_viewProduct: boolean = false;
  public mdl_historialProducto: boolean = false;
  public mdl_historialProductoPrecio: boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _empleadoService:EmpleadoService,
    private messageService: MessageService,
    private _modulosService: ModulosService,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _sharedMessage: SharedMessage,
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  ngAfterViewInit(): void {
    this._sharedMessage.messages$.subscribe(
      messages =>{
        if(messages){
          this.messageService.add(messages[0]); // Agregar el mensaje al servicio de mensajes de PrimeNG
        }
      }
    )

    this.sub_searchTerms = this.searchTerms.pipe(debounceTime(300)).subscribe(
      term =>{
        if(this.selectedOpt && this.selectedOptStatus){
          this.pageActual=1;
          this.getProductos(this.pageActual,this.selectedOpt.id,term,100,this.selectedOptStatus.valueExtra);
        } else{
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
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mInv.idModulo, this.mInv.idSubModulo);
        //revisamos si el permiso del modulo esta activo si no redireccionamos
        if( this.userPermisos.ver == 1 ){
          this.identity = this._empleadoService.getIdentity();
          this.setOptionsSelect();
          this.getProductos();
          this.add_optMenu();
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
      {id:1, name:'Clave externa'},
      {id:2, name:'Descripcion'},
      {id:3, name:'Codigo de barras'},
    ];

    this.optionsSelectStatus = [
      {id:1, name:'Mostrar activos e incativos', valueExtra: [31,32]},
      {id:2, name:'Mosotrar solo activos', valueExtra: [31]},
      {id:3, name:'Mostrar solo inactivos', valueExtra: [32]},
    ];
    //Seleccionamos por defecto la primera opcion
    this.selectedOpt = this.optionsSelect[1];
    this.selectedOptStatus = this.optionsSelectStatus[1];
  }

  /**
   * 
   * @param page number default 1
   * @param type number default 0
   * @param search string default null
   * 
   * @description
   * Servicio trae la informacion de los productos paginados por la api
   * Tambien busca la informacion
   */
  getProductos(page:number = 1, type:number = 1, search:string = '',rows:number = 100,status:string = '31'){

    //mostramos el spinner
    this.isLoadingGeneral = true;

    //ejecutamos el servicio
    this.sub_producto = this._productoService.getProductosNewIndex(page,type,search,rows,status).subscribe(
      response =>{
        if(response.status == 'success' && response.code == 200){

          //asignamos a varibale para mostrar
          this.productos = response.productos.data;

          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.pageActual = response.productos.current_page;
          this.per_page = response.productos.per_page;
          
          //una vez terminado de cargar quitamos el spinner
          this.isLoadingGeneral = false;
        }
      },
      error =>{
        this.isLoadingGeneral = false
        console.log(error);
      }
    );
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
    if(this.selectedOpt && this.selectedOptStatus){
      this.getProductos(this.pageActual,this.selectedOpt.id,this.valSearch,100,this.selectedOptStatus.valueExtra);
    } else{
      this.messageService.add({
        severity:'warn', 
        summary:'Alerta', 
        detail:'Favor de seleccionar una opcion para buscar'
      });
    }
  }

  /**
   * Busqueda
   */
  onSearch():void{
    this.searchTerms.next(this.valSearch);
  }

  /**
   * @description
   * Agrega los elementos al menu deacuerdo a los permisos del usuario
   */
  add_optMenu(){
    // Inicializa el arreglo si está vacío
    if (this.menuItems.length === 0) {
      this.menuItems.push({ label: 'Opciones', items: [] });
    }

    if(this.userPermisos.ver == 1){
      this.menuItems[0].items?.push({
          label: 'Ver',
          icon: 'pi pi-eye ',
          command: () => {
            this._router.navigate(['./producto-modulo/producto-ver/'+this.idProductoMenu]);
          }
      })
    }

    if(this.userPermisos.editar == 1){
      this.menuItems[0].items?.push({
          label: 'Editar',
          icon: 'pi pi-file-edit ',
          command: () => {
            if(this.sucursal_now && this.sucursal_now.idSuc == 1){
              
              return this._router.navigate(['./producto-modulo/producto-editar/'+this.idProductoMenu]);
            } else{
              return this.mdl_update = true;
            }
          }
      })
    }

    this.menuItems[0].items?.push(
      {
        label: 'Historial',
        icon: 'pi pi-history ',
        command: () => {
          this.getHistorialProducto();
        }
    },
    {
      label:'Historial Precio',
      icon: 'pi pi-history',
        command: () => {
          this.getHistorialPrecios();
        }
    }
  );
  }

  /**
   * De acuerdo a la actualizacion seleccionada
   * rutemos a componente de edicion o actualizamos desde el catalago en la nube
   */
  selectedOptEdit() {
    switch(this.valRadioButton){
      case 'manual':
          this.mdl_update = false;
          this._router.navigate(['./producto-modulo/producto-editar/local/'+this.idProductoMenu]);
        break;
      case 'nube':
          //Activamos el spinner
          this.isLoadingGeneral = true;
          //Reseteamos variables
          this.tblHeadersNUBE = [];
          this.viewProducto = undefined;
          this.viewProductoMedidas = undefined;
          //Ejecutamos el servicio
          this.sub_producto = this._productoService.getProductoNUBE(this.idProductoMenu!).subscribe(
            response => {
              // console.log(response);
              if(response.status == 'success' && response.code == 200){
                //asginamos daatos
                this.viewProducto = response.producto;
                this.viewProductoMedidas = response.producto_medidas;
                this.mdl_update = false;//oculta moldal de radio button
                this.mdl_viewProduct = true;//mostramos modal de detalles del producto
                //Creamos cabeceras de los precios
                for(let i = 1; i <= 5; i++){
                  const precioKey = `precio${i}`;
                  if(this.viewProductoMedidas && (this.viewProductoMedidas[0] as any)[precioKey] != null){
                    this.tblHeadersNUBE.push(`P${i}`);
                  }
                }
                this.isLoadingGeneral = false;//ocultamos el spinner
                
              }
            }, errors =>{
              this.mdl_update = false;
              this.messageService.add({severity:'error',summary:'Error',detail:'Ocurrio un error al intentar obtener los datos.'});
              console.log(errors);
            }
          )
        break;
    }
  }

  /**
   * Mandamos la actualizacion del producto
   */
  confirmUpdateByNUBE(){
    
    this._confirmationService.confirm({
      message:'¿Esta seguro(a) que desea actualizar el producto?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      accept: () =>{
        this.mdl_viewProduct = false;//ocultamos el modal
        this.sub_producto = this._productoService.updateProducto(this.viewProducto,this.viewProductoMedidas, this.identity.sub,[],true).subscribe(
          response =>{
            if(response.status == 'success' && response.code == 200){
              this.messageService.add({
                severity:'success',
                detail:'Producto actualizado correctamente.'
              });
            }
          }, error =>{
            this.messageService.add({
              severity:'error',
              summary:'Error',
              detail:'Ocurrio un error al actualizar el producto.'
            });
            console.log(error);
          }
        )
      },
      reject: (type:any) =>{
        switch(type) {
          case ConfirmEventType.REJECT:
              this.mdl_viewProduct = false;
              this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de actualizacion de producto cancelada.'});
            break;
          case ConfirmEventType.CANCEL:
              this.mdl_viewProduct = false;
              this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Confirmacion de actualizacion de producto cancelada.'});
            break;
        }
      }
    });
  }

  getHistorialProducto(){
    this.isLoadingGeneral = true;
    this.sub_producto = this._productoService.getHistorialProducto(this.idProductoMenu!).subscribe(
      response =>{
        if(response.code == 200 && response.status == 'success'){
          this.mdl_historialProducto = true;
          this.arrHistorialProducto = response.historial_producto;
          this.isLoadingGeneral = false;
        }
      }, error =>{
        this.isLoadingGeneral = false;
        this.messageService.add({
          severity:'error',
          summary:'Error',
          detail:'Ocurrio un error al buscar el producto.'
        })
        console.log(error)
      }
    );
  }

  getHistorialPrecios(){
    this.isLoadingGeneral = true;
    this.sub_producto = this._productoService.getHistorialProductoPrecio(this.idProductoMenu!).subscribe(
      response =>{
        if(response.code == 200 && response.status == 'success'){
          console.log(response)
          this.arrHistorialPrecio = response.historial_producto_precio;

           // Recorrer el objeto historial_producto_precio
           this.fechasHistorial = Object.keys(this.arrHistorialPrecio);
           console.log(this.fechasHistorial)



          this.mdl_historialProductoPrecio = true;
          this.isLoadingGeneral = false;
        }
      }, error =>{
        this.isLoadingGeneral = false;
        this.messageService.add({
          severity:'error',
          summary:'Error',
          detail:'Ocurrio un error al buscar el producto.'
        })
        console.log(error)
      }
    );
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.navigateTable('down');
    } else if (event.key === 'ArrowUp') {
      this.navigateTable('up');
    } else if(event.key === 'Enter'){
      event.preventDefault();
      if (this.currentRowIndex >= 0 && this.currentRowIndex < this.productos.length) {
        this.selectedProduct = this.productos[this.currentRowIndex];
        // this.onSelect();
      }
    }
  }

  navigateTable(direction: string) {
    if (direction === 'down' && this.currentRowIndex < this.productos.length - 1) {
      this.currentRowIndex++;
    } else if (direction === 'up' && this.currentRowIndex > 0) {
      this.currentRowIndex--;
    }
    this.selectedProduct = this.productos[this.currentRowIndex];
    this.scrollToRow(this.currentRowIndex);
    if(this.selectedProduct){
      this.onSelectionChange();
    }
  }

  scrollToRow(index: number) {
    const row = document.querySelector(`.ui-table-scrollable-body table tbody tr:nth-child(${index + 1})`);
    if (row) {
      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  onRowSelect(event: any): void {
    const selectedVentaId = event.data.idProducto;
    this.currentRowIndex = this.productos.findIndex(prod => prod.idProducto === selectedVentaId);

    if(event.originalEvent.type === 'click'){
      this.onSelectionChange();
    }
  }

  onSelectionChange() {
      //Mostramos spinner
      this.isLoadingGeneral = true;
      this.idProductoMenu = this.selectedProduct.idProducto;
      this.tblHeaders = [];

      this.sub_producto = this._productoService.searchProductoMedida(this.selectedProduct.idProducto).subscribe(
        response =>{
          // console.log(response);
          if(response.code == 200 && response.status == 'success'){
            //Asignamos valores
            this.existenciasPorMed = response.existencia_por_med;
            // this.productosMedida = response.productoMedida;
            this.imagenPM = response.imagen ? response.imagen : "1650558444no-image.png";
            
            //Ocultamos spinner
            this.isLoadingGeneral = false;
          }
        }, error =>{
          this.isLoadingGeneral = false;
          console.log(error);
        }
      )
    
  }

  ngOnDestroy(): void {
    this.sub_producto?.unsubscribe();
    this.sub_searchTerms?.unsubscribe();
    this.sub_sharedMessage?.unsubscribe();
  }

  setIdProductoMenu(idProducto:number){
    this.idProductoMenu = idProducto;
  }
}

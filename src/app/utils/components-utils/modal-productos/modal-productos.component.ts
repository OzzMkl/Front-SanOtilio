import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { MdlProductoService } from 'src/app/services/mdlProductoService';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { Productos_medidas_new } from 'src/app/models/productos_medidas_new';
import { dialogOptionsProductos } from 'src/app/models/interfaces/dialogOptions-productos';
import { Router } from '@angular/router';

interface selectBusqueda {
  id: number;
  name: string;
}

@Component({
  selector: 'app-modal-productos',
  templateUrl: './modal-productos.component.html',
  styleUrls: ['./modal-productos.component.css'],
  providers: [ProductoService]
})
export class ModalProductosComponent implements OnInit, OnDestroy {

  //Spinner
  public isLoadingGeneral: boolean = false;
  public isLoadingExistencia: boolean = false;
  //Servicios
  public productos:Array<any> = [];//getProductos
  public existencias:Array<any> = [];//onSelectionChange
  public medidas:Array<any> = [];//onSelectionChange

  public sucursales:Array<any> = [];//onSelectionChange
  public existenciaSucursales:Array<any> = [];//onSelectionChange

  public tblHeadersNUBE: Array<any> = [];
  public viewProducto?: Producto;
  public viewProductoMedidas?: Array<Productos_medidas_new>;
  public mdl_viewProduct: boolean = false;
  //Paginator
  public totalPages: number = 0;
  public per_page:number = 100;
  public pageActual: number = 1;
  //Modelos
  optionsSelect: selectBusqueda[] = [];
  selectedOpt: selectBusqueda | any;
  valSearch: string = '';
  selectedProduct:any;
  selectedMedida:any;
  public url:string = global.url;//
  public img: string = '';//
  public tblHeaders: Array<any> = []
  //modales
  public mdlMedidas: boolean = false;
  public mdlProductos: boolean = false;
  isOpenMdlMedidas: boolean = false;
  isCatalagoNube: boolean = false;
  isAgregarProducto: boolean = false;
  @ViewChild('panelMedidasMultiSuc') panelMedidasMultiSuc!: OverlayPanel;

  timeoutId: any;
  isKeyPressed: boolean = false;
  stopMovement: boolean = false;
  movementStartTime?: number;


  //Subscriptions
  private sub_mdlProductoService: Subscription = new Subscription();
  private sub_productoService: Subscription = new Subscription();

  constructor(
    private _productoService:ProductoService,
    private _mdlProductoService: MdlProductoService,
    private _sharedMessage: SharedMessage,
    private _router: Router
  ) { }

  ngOnInit(): void {
    
    this.sub_mdlProductoService = this._mdlProductoService.openMdlProductosDialog$.subscribe((dialogOptions: dialogOptionsProductos) => {
      this.isOpenMdlMedidas = dialogOptions.openMdlMedidas ?? false;
      this.isCatalagoNube = dialogOptions.isCatalogoNube ?? false;
      this.isAgregarProducto = dialogOptions.isAgregarProducto ?? false;
      this.mdlProductos = true;
      this.setOptionsSelect();
      if(this.isCatalagoNube){
        this.getProductosNUBE();
      } else{
        this.getProductos();
      }
    });
    
  }

  /**
   * @description
   * Carga el array a mostrar del dropdown
   */
  setOptionsSelect(){
    this.optionsSelect = [
      {id:1, name:'Clave externa'},
      {id:2, name:'Descripcion'},
      {id:3, name:'Codigo de barras'},
    ];

    //Seleccionamos por defecto la primera opcion
    this.selectedOpt = this.optionsSelect[1];
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
  getProductos(page:number = 1, type:number = 0, search:string = 'null', rows:number = 100){
    //mostramos el spinner
    this.isLoadingGeneral=true;
    //Ejecutamos servicio
    this.sub_productoService = this._productoService.getProductosNewIndex(page,type,search,rows).subscribe(
      response =>{
        // console.log(response);
        if(response.code == 200 && response.status == 'success'){
          this.productos = response.productos.data;
          //Paginacion
          this.totalPages = response.productos.total;
          this.pageActual = response.productos.current_page;
          this.per_page = response.productos.per_page;

          this.isLoadingGeneral=false;
        }

      }, error =>{
        console.log(error);
        this.isLoadingGeneral = false;
      }
    )
  }

  /**
   * 
   * @param page Number numero de pagina a buscar (paginacion)
   * @param type Number tipo de busqueda
   * @param search String palabra a buscar
   * @description
   * Servicio trae la informacion de los productos paginados por la api
   * desde el catalago de la nube actualmente Hostinger
   */
  getProductosNUBE(page:number = 1, type:number = 0, search:string = 'null'){
    this.isLoadingGeneral = true;
    this.sub_productoService = this._productoService.getAllProductosNUBE(page, type, search).subscribe(
      response =>{
        // console.log(response);
        if( response.code == 200 && response.status == 'success'){
          this.productos = response.catalogo_nube.data;
          //Paginacion
          this.totalPages = response.catalogo_nube.total;
          this.pageActual = response.catalogo_nube.current_page;
          this.isLoadingGeneral=false;
        }
      }, error =>{
        this.isLoadingGeneral = false;
        console.log(error);
      }
    )
  }

  getProductoNUBE(idProducto:number){
    this.isLoadingGeneral = true;
    //Reseteamos variables
    this.tblHeadersNUBE = [];
    this.viewProducto = undefined;
    this.viewProductoMedidas = undefined;
    this.sub_productoService = this._productoService.getProductoNUBE(idProducto).subscribe(
      response =>{
        // console.log(response);
        if(response.status == 'success' && response.code == 200){
          //asginamos daatos
          this.viewProducto = response.producto;
          this.viewProductoMedidas = response.producto_medidas;
          //Creamos cabeceras de los precios
          for(let i = 1; i <= 5; i++){
            const precioKey = `precio${i}`;
            if(this.viewProductoMedidas && (this.viewProductoMedidas[0] as any)[precioKey] != null){
              this.tblHeadersNUBE.push(`P${i}`);
            }
          }
          this.mdl_viewProduct = true;
          this.isLoadingGeneral = false;//ocultamos el spinner
          
        }
      }, error =>{
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
    this.onSearch(event.page + 1, event.rows);
  }
  

  /**
   * 
   * @param event 
   * @description
   * Detectamos el elemento seleccionado y mandamos a traer sus medidas
   * exitencia calculada e imagen
   */
  onSelectionChange() {
    if(this.isOpenMdlMedidas){
      //Mostramos spinner
      this.isLoadingGeneral = true;
      this.tblHeaders = [];

      this.sub_productoService = this._productoService.searchProductoMedida(this.selectedProduct.idProducto).subscribe(
        response =>{
          // console.log(response);
          if(response.code == 200 && response.status == 'success'){
            //Asignamos valores
            this.existencias = response.existencia_por_med;
            this.medidas = response.productoMedida;
            this.img = response.imagen ? response.imagen : "1650558444no-image.png";
            //Mostramos modal
            // this.mdlMedidas = true;
            // this.panelPreciosProducto.show(event);
            
            for(let i = 1; i <= 5; i++){
              const precioKey = `precio${i}`;
              if(this.medidas[0][precioKey] != null){
                this.tblHeaders.push(`P${i}`);
              }
            }
            // console.log(this.tblHeaders);
            //Ocultamos spinner
            this.isLoadingGeneral = false;
          }
        }, error =>{
          this.isLoadingGeneral = false;
          console.log(error);
        }
      )
    } else if(this.isCatalagoNube){
      this.getProductoNUBE(this.selectedProduct.idProducto);
    } else{
      this.onSelect();
    }
    
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.code === "ArrowDown" || event.code === "ArrowUp") {
        // Evitar el comportamiento predeterminado del navegador para las teclas de flecha
        event.preventDefault();

        // Verificar si ya está presionada la tecla
        if (!this.isKeyPressed) {
            this.isKeyPressed = true;
            this.movementStartTime = Date.now();
        }

        // Configurar el temporizador para detener el movimiento después de 2 segundos
        if (!this.timeoutId) {
            this.timeoutId = setTimeout(() => {
                this.stopMovement = true;
            }, 800);
        }

        // Si se ha alcanzado el tiempo límite, no hacer nada
        if (this.stopMovement) return;

        // Obtener todas las filas de la tabla
        const rows = document.querySelectorAll('.p-datatable .p-datatable-tbody tr');
        
        // Verificar si hay filas en la tabla
        if (rows.length === 0) return;

        // Obtener la fila seleccionada actualmente
        const selectedRowIndex = Array.from(rows).findIndex(row => row.classList.contains('p-highlight'));

        // Calcular el índice de la siguiente fila a seleccionar
        let nextRowIndex = 0;
        if (event.code === "ArrowDown") {
            nextRowIndex = (selectedRowIndex === rows.length - 1 || selectedRowIndex === -1) ? 0 : selectedRowIndex + 1;
        } else if (event.code === "ArrowUp") {
            nextRowIndex = (selectedRowIndex === 0 || selectedRowIndex === -1) ? rows.length - 1 : selectedRowIndex - 1;
        }

        // Eliminar la selección de la fila actual si hay una seleccionada
        if (selectedRowIndex !== -1) {
            rows[selectedRowIndex].classList.remove('p-highlight');
        }

        // Seleccionar la siguiente fila
        rows[nextRowIndex].classList.add('p-highlight');

        // Despachar el evento "Enter" a la siguiente fila seleccionada
        const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
        rows[nextRowIndex].dispatchEvent(enterEvent);
    }
  }

  onKeyUp(event: KeyboardEvent) {
    if (event.code === "ArrowDown" || event.code === "ArrowUp") {
        this.isKeyPressed = false;
        this.stopMovement = false;

        // Limpiar el temporizador
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
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
  onRowDoubleClick(product: any) {
    this.selectedProduct = product;
    this.onSelect();
  }

  /**
   * @description
   * Cierra modales y manda el valor seleccionado
   */
  onSelect():void{
    if(this.isCatalagoNube){
      const data = {
        'Producto': this.viewProducto,
        'Producto_medidas': this.viewProductoMedidas
      }
      this._mdlProductoService.sendSelectedValue(data);
    } else{
      this._mdlProductoService.sendSelectedValue(this.selectedProduct)
    }
    this.mdlMedidas = false;
    this.mdlProductos = false;
    this.mdl_viewProduct = false;
  }

  /**
   * Busqueda
   */
  onSearch(page: number = 1, rows: number = 100):void{
    if(this.selectedOpt){
      if(this.valSearch == "" || this.valSearch == null){
        this.getProductos(page,0,'null',rows);
      } else{
        if(this.isCatalagoNube){
          this.getProductosNUBE(page,this.selectedOpt.id,this.valSearch);
        } else{
          this.getProductos(page,this.selectedOpt.id,this.valSearch,rows);
        }
      }
    } else{
      //cargamos mensaje
      let message = {severity:'warn', summary:'Alerta', detail:'Favor de seleccionar una opcion para buscar'};
      this._sharedMessage.addMessages(message);
    }
  }

  /**
   * 
   * @param event 
   * Obtiene las existencias de las sucursales disponibles
   * y crea las tablas de acuerdo a la cantidad de sucursales
   */
  getExistenciaMultiSucursal(event:any){
    //Iniciamos spinner
    this.isLoadingExistencia = true;
    //Abrimos el panel
    this.panelMedidasMultiSuc.show(event);
    //Vaciaoms el array
    this.existenciaSucursales = [];
    //iniciamos servicio
    this.sub_productoService = this._productoService.getExistenciaMultiSucursal(this.selectedProduct.idProducto).subscribe(
      response =>{
        // console.log(response);
        if(response.code == 200 && response.status == 'success'){
          //asignamos a variable
          this.sucursales = response.sucursales
          //recorremos y creamos nuevo array
          this.sucursales.forEach(sucursal => {
            const existencias = response.existencias[sucursal.connection]?.original.existencia_por_med;
            if (existencias) {
              this.existenciaSucursales[sucursal.connection] = existencias;
            }
          });

          this.isLoadingExistencia = false;
        }
      });
  }

  cancelarAgregar(){
    if(this.isAgregarProducto){
      // let message = {severity:'warn', summary:'Advertencia', detail:'Se cancelo el agregar producto'};
      //       this._sharedMessage.addMessages(message);
      this._router.navigate(['producto-modulo/producto-buscar']);
    }
  }

  ngOnDestroy(): void {
    this.sub_mdlProductoService.unsubscribe();
    this.sub_productoService.unsubscribe();
  }
}

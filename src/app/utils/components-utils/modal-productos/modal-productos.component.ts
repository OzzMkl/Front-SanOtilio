import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { MdlProductoService } from 'src/app/services/mdlProductoService';
import { SharedMessage } from 'src/app/services/sharedMessage';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Subscription } from 'rxjs';

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
  //Paginator
  public totalPages: any;
  pageActual: number = 1;
  //Modelos
  optionsSelect: selectBusqueda[] | any;
  selectedOpt: selectBusqueda | any;
  valSearch: string = '';
  selectedProduct:any;
  public url:string = global.url;//
  public img: string = '';//
  //modales
  public mdlMedidas: boolean = false;
  public mdlProductos: boolean = false;
  isOpenMdlMedidas: boolean = false;
  @ViewChild('panelMedidasMultiSuc') panelMedidasMultiSuc!: OverlayPanel;

  //Subscriptions
  private sub_mdlProductoService!: Subscription;
  private sub_productoService!: Subscription;

  constructor(
    private _productoService:ProductoService,
    private _mdlProductoService: MdlProductoService,
    private _sharedMessage: SharedMessage,
  ) { }

  ngOnInit(): void {
    
    this.sub_mdlProductoService = this._mdlProductoService.openMdlProductosDialog$.subscribe((openMdlMedidas: boolean) => {
      this.isOpenMdlMedidas = openMdlMedidas;
      this.mdlProductos = true;
      this.setOptionsSelect();
      this.getProductos();
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
    this.selectedOpt = this.optionsSelect[0];
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
  getProductos(page:number = 1, type:number = 0, search:string = 'null'){
    //mostramos el spinner
    this.isLoadingGeneral=true;
    //Ejecutamos servicio
    this.sub_productoService = this._productoService.getProductosNewIndex(page,type,search).subscribe(
      response =>{
        // console.log(response);
        if(response.code == 200 && response.status == 'success'){
          this.productos = response.productos.data;
          //Paginacion
          this.totalPages = response.productos.total;
          this.pageActual = response.productos.current_page;

          this.isLoadingGeneral=false;
        }

      }, error =>{
        console.log(error);
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
    this.getProductos(event.page + 1);
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

      this.sub_productoService = this._productoService.searchProductoMedida(this.selectedProduct.idProducto).subscribe(
        response =>{
          // console.log(response);
          if(response.code == 200 && response.status == 'success'){
            //Asignamos valores
            this.existencias = response.existencia_por_med;
            this.medidas = response.productoMedida;
            this.img = response.imagen ? response.imagen : "1650558444no-image.png";
            //Mostramos modal
            this.mdlMedidas = true;
            //Ocultamos spinner
            this.isLoadingGeneral = false;
          }
        }, error =>{
          console.log(error);
        }
      )
    } else{
      this.onSelect();
    }
    
  }

  /**
   * @description
   * Cierra modales y manda el valor seleccionado
   */
  onSelect():void{
    this._mdlProductoService.sendSelectedValue(this.selectedProduct);
    this.mdlMedidas = false;
    this.mdlProductos = false;
  }

  /**
   * Busqueda
   */
  onSearch(){
    if(this.selectedOpt){
      if(this.valSearch == "" || null){
        this.getProductos();
      } else{
        switch(this.selectedOpt.id){
          case 1 : //ClaveExter
            this.getProductos(1,this.selectedOpt.id,this.valSearch);
            break;
          case 2 ://Descripcion
            this.getProductos(1,this.selectedOpt.id,this.valSearch);
            break;
          case 3 : //codigodebarras
            this.getProductos(1,this.selectedOpt.id,this.valSearch);
            break;
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

  ngOnDestroy(): void {
    this.sub_mdlProductoService.unsubscribe();
    this.sub_productoService.unsubscribe();
  }
}

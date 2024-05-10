import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MenuItem, MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';
//interfaces
import { selectBusqueda } from 'src/app/models/interfaces/selectBusqueda';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/models/producto';
import { Productos_medidas_new } from 'src/app/models/productos_medidas_new';

@Component({
  selector: 'app-producto-buscar',
  templateUrl: './producto-buscar.component.html',
  styleUrls: ['./producto-buscar.component.css'],
  providers: [ProductoService, EmpleadoService, MessageService, ConfirmationService]
})
export class ProductoBuscarComponent implements OnInit, OnDestroy {

  //Spinners
  public isLoading:boolean = false;//table
  public isLoadingPrecios:boolean = false;//mostrarPrecios
  public isLoadingGeneral:boolean = false;//selectedOptEdit
  //Servicios
  //paginator
  //Models
  public identity: any;
  optionsSelect!: selectBusqueda[];
  selectedOpt!: selectBusqueda;
  valSearch: string = '';
  public viewProducto?: Producto;
  public viewProductoMedidas?: Array<Productos_medidas_new>;
  public tblHeadersNUBE: Array<any> = [];
  public tblHeaders: Array<any> = [];
  public url:string = global.url;
  public productos: Array<any> = [];
  public productosMedida: Array<any> = [];
  public existenciasPorMed: Array<any> = [];
  public imagenPM: string = "1650558444no-image.png";
  public claveExt: string ='';
  public isShow: boolean = false;
  public valRadioButton: string = 'nube';
  public arrHistorialProducto?: Array<any>;
  public arrHistorialPrecio?: Array<any>;
  /**PAGINATOR */
  public totalPages: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
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
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

  /**
   * Funcion que carga los permisos
   */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mInv.idModulo, this.mInv.idSubModulo);
    
        //revisamos si el permiso del modulo esta activo si no redireccionamos
        if( this.userPermisos.ver != 1 ){
          this.timerId = setInterval(()=>{
            this.counter--;
            if(this.counter === 0){
              clearInterval(this.timerId);
              this._router.navigate(['./']);
            }
            this.messageService.add({severity:'error', summary:'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'});
          },1000);
        } else{
          this.identity = this._empleadoService.getIdentity();
          this.setOptionsSelect();
          this.getProductos();
          this.add_optMenu();
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
    this.isLoading = true;

    //ejecutamos el servicio
    this.sub_producto = this._productoService.getProductosNewIndex(page,type,search).subscribe(
      response =>{
        if(response.status == 'success' && response.code == 200){

          //asignamos a varibale para mostrar
          this.productos = response.productos.data;

          //navegacion paginacion
          this.totalPages = response.productos.total;
          this.itemsPerPage = response.productos.per_page;
          this.pageActual = response.productos.current_page;
          
          //una vez terminado de cargar quitamos el spinner
          this.isLoading = false;
        }
      },
      error =>{
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
    this.getProductos(event);
  }

  /**
   * Recinimos el id y lo buscamos en el sewrvicio
   * @param idProducto
   * 
   * retornamos la consulta con las medias e imagen del producto
   */
  mostrarPrecios(idProducto:number){
    if(idProducto != this.idProductoMenu){
      this.isLoadingPrecios = true;
      this.idProductoMenu = idProducto;
      this.tblHeaders = [];
      this.sub_producto = this._productoService.searchProductoMedida(idProducto).subscribe(
        response =>{
          if(response.status == 'success'){
            this.claveExt = response.Producto_cl;
            this.productosMedida = response.productoMedida;
            this.existenciasPorMed = response.existencia_por_med;
            this.imagenPM = response.imagen ? response.imagen : "1650558444no-image.png";
            //creamos lista de headers de la tabla de precios
            for(let i = 1; i <= 5; i++){
              const precioKey = `precio${i}`;
              if(this.productosMedida[0][precioKey] != null){
                this.tblHeaders.push(`P${i}`);
              }
            }

            this.isLoadingPrecios = false;
          }
      }, error =>{
        console.log(error);
      });
    }
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
      this.messageService.add({
        severity:'warn', 
        summary:'Alerta', 
        detail:'Favor de seleccionar una opcion para buscar'
      });
    }
  }
  /**
   * @description
   * Agrega los elementos al menu deacuerdo a los permisos del usuario
   */
  add_optMenu(){
    // Inicializa el arreglo si está vacío
    if (this.menuItems.length === 0) {
      this.menuItems.push({ label: 'Opciones', styleClass:'text-white', items: [] });
    }

    if(this.userPermisos.ver == 1){
      this.menuItems[0].items?.push({
          label: 'Ver',
          styleClass: 'text-white',
          icon: 'pi pi-eye text-white',
          command: () => {
            this._router.navigate(['./producto-modulo/producto-ver/'+this.idProductoMenu]);
          }
      })
    }

    if(this.userPermisos.editar == 1){
      this.menuItems[0].items?.push({
          label: 'Editar',
          styleClass: 'text-white',
          icon: 'pi pi-file-edit text-white',
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
        styleClass: 'text-white',
        icon: 'pi pi-history text-white',
        command: () => {
          this.getHistorialProducto();
        }
    },
    {
      label:'Historial Precio',
      styleClass:'text-white',
      icon: 'pi pi-history text-white',
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

  ngOnDestroy(): void {
    this.sub_producto?.unsubscribe();
  }
}

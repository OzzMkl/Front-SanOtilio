import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { global } from 'src/app/services/global';

/*****SERVICIOS*/
import { MedidaService } from 'src/app/services/medida.service';
import { MarcaService } from 'src/app/services/marca.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { ProductoService } from 'src/app/services/producto.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { MessageService, ConfirmationService, ConfirmEventType } from 'primeng/api';

/*NGBOOTSTRAP */
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
/*MODELOS */
import { Producto} from 'src/app/models/producto';
import { Productos_medidas_new } from 'src/app/models/productos_medidas_new';
import { SucursalService } from 'src/app/services/sucursal.service';


@Component({
  selector: 'app-producto-agregar',
  templateUrl: './producto-agregar.component.html',
  styleUrls: ['./producto-agregar.component.css'],
  providers: [
    MedidaService, 
    MarcaService, 
    DepartamentoService, 
    ProductoService, 
    MessageService, 
    ConfirmationService
  ]
})
export class ProductoAgregarComponent implements OnInit {

  //PERMISOS
  public userPermisos:any = [];
  public mInv = this._modulosService.modsInventario();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;
  
  //variables para cargar informacion en los select
  public medidas: Array<any> = [];
  public marca: Array<any> = [];
  public departamentos: Array<any> = [];
  public identity: any;
  public producto: Producto;
  //
  public url: string = global.url;
  //contadores para los text area
  conta: number =0;
  // contaUbi: number =0;
  //CERRAR MODAL
  public closeResult: string = '';
  //Para mostrar y ocultar las tablas de precios
  public noMedida: number = 0;

  public preciosIncorrectos: { [key: string]: string } = {};

  //Spinner
  public isLoadingGeneral: boolean = false;

  public tabsPrice: Productos_medidas_new[] = [];
  public precioCompraForm: number = 0;
  public arrChecksPrecios: { nivel: number, nombre: string }[] = [];
  public isPrecioCorrecto: boolean = true;
  public mdl_SubmitProd: boolean = false;
  public sucursales_guardadas: Array<any> = [];
  public sucursales_fallidas: Array<any> = [];

  public modoEdicion: boolean = false;
  public isUpdateLocal: boolean = false;
  public mdl_Mantener: boolean = false;
  public accionModificacionPrecio: string = "mantenerPrecio";
  public inputAmount: number | null = null;
  public mdl_ConfirmSucursales: boolean = false;
  public sucursales: Array<any> = [];
  public empresa:any;
  public isAllSuc: boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _medidaService: MedidaService,
    private _marcaService: MarcaService,
    private _departamentosService: DepartamentoService,
    public _empleadoService : EmpleadoService,
    private _modulosService: ModulosService,
    private modalService: NgbModal,
    public _router: Router,
    private messageService: MessageService,
    private _confirmationService: ConfirmationService,
    private _route: ActivatedRoute,
    private _sucursalService: SucursalService,

  ) {
    this.producto = new Producto(0,0,0,1,'',0,'',0,0,'',0,'','',null,1,0);
   }

  ngOnInit(): void {
    this.loadUser();
  }

  /**
  * Funcion que carga los permisos
  */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mInv.idModulo, this.mInv.idSubModulo);
        //revisamos si el permiso del modulo esta activo si no redireccionamos
        if( this.userPermisos.agregar != 1 ){
          this.timerId = setInterval(()=>{
            this.counter--;
            if(this.counter === 0){
              clearInterval(this.timerId);
              this._router.navigate(['./']);
            }
            this.messageService.add({severity:'error', summary:'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios, redirigiendo en '+this.counter+' segundos'});
          },1000);
        } else{
          this._route.params.subscribe( params =>{
            if(params['idProducto']){
              this.getDatosProducto(params['idProducto']);
              this.modoEdicion = true;
            }
            if(params['strLocal'] == 'local'){
              this.isUpdateLocal = true;
            }
          });
          this.getMedida();
          this.getMarca();
          this.getDepartamentos();
          this.identity = this._empleadoService.getIdentity();
        }
  }

  /**
   * @description
   * Verifica los precios adentro del submit
   * Ocupa la funcion propia de la clase de Productos_medida
   * Devuelve un true si algun precio es erroneo y en preciosIncorrectos se agrega el id del input de la tabla al que pertenece
   * @returns boolean
   */
  verificaPreciosSubmit(): boolean {
    let isCheck: boolean = true;
    const currentLength = this.tabsPrice.length;
    const currLengthCheksPrice = this.arrChecksPrecios.length;

    if(this.precioCompraForm <= 0){
      this.messageService.add({severity:'error', summary:'Alerta', detail:'El precio compra no puede ser cero.'});
      this.paintInput('precioCompraPrincipal','error');
      return isCheck;
    }
  
    //Revisamos que por lo menos ete ingresada una medida y Un precio activado
    if (currentLength > 0 && currLengthCheksPrice > 0) {

      if(currLengthCheksPrice == 1){
        let propName = this.arrChecksPrecios[0].nombre;
        let propNamePercentage = 'porcentaje' + this.arrChecksPrecios[0].nivel;

        for (let j = 0; j < currentLength; j++) {

          const currentPrice = (this.tabsPrice[j] as any)[propName];
          const currentPercentage = (this.tabsPrice[j] as any)[propNamePercentage];

          //Verificamos que el porcentaje exista
          if(currentPercentage == null || currentPercentage == undefined){
            this.messageService.add({severity:'error', summary:'Alerta', detail:'El porcentaje no puede estar vacio'});
            this.paintInput('tab'+this.tabsPrice[j].noTab+currentPercentage,'error');
            return isCheck;
          }

          //Verificamos que el precio exista
          if(currentPrice == null || currentPrice == undefined){
            this.messageService.add({severity:'error', summary:'Alerta', detail:'El precio no puede estar vacio'});
            this.paintInput('tab'+this.tabsPrice[j].noTab+propName,'error');
            return isCheck;
          }

          //Verificamos que contenga una medida seleccionada
          if(this.tabsPrice[j].idMedida === 0 || this.tabsPrice[j].idMedida === null){
            this.messageService.add({severity:'error', summary:'Alerta', detail:'Selecciona el nombre de la medida'});
            this.paintInput('medida'+this.tabsPrice[j].noTab,'error');
            return isCheck;
          }

          //Verificamos que la unidad no sea cero
          if(this.tabsPrice[j].unidad <= 0){
            this.messageService.add({severity:'error', summary:'Alerta', detail:'La unidad de medida no puede ser cero.'});
            this.paintInput('unidad'+this.tabsPrice[j].noTab,'error');
            return isCheck;
          }

          if(currentPrice < this.tabsPrice[j].preciocompra){
            this.messageService.add({severity:'error', summary:'Alerta', detail:'El precio ingresado no puede ser menor al precio compra'});
            this.paintInput('tab'+this.tabsPrice[j].noTab+propName,'error');
            return isCheck;
          }

        }
        return isCheck = false;
      } else{
        //Recorremos los precios activos
        for (let i = 0; i < currLengthCheksPrice; i++) {
            //asignamos el nombre de la propiedad a veerificar
            const propertyName = this.arrChecksPrecios[i].nombre;
            const propNamePercentage = 'porcentaje' + this.arrChecksPrecios[i].nivel;
            //Ahora vamos a recorrer las medidas
            for (let j = 0; j < currentLength; j++) {

                const currentPercentage = (this.tabsPrice[j] as any)[propNamePercentage];

              //verificacion de medida
                if(this.tabsPrice[j].idMedida === 0 || this.tabsPrice[j].idMedida === null){
                  this.messageService.add({severity:'error', summary:'Alerta', detail:'Selecciona el nombre de la medida'});
                  this.paintInput('medida'+this.tabsPrice[j].noTab,'error');
                  return isCheck;
                }
                //verificacion de unidad de medida
                if(this.tabsPrice[j].unidad <= 0){
                  this.messageService.add({severity:'error', summary:'Alerta', detail:'La unidad de medida no puede ser cero.'});
                  this.paintInput('unidad'+this.tabsPrice[j].noTab,'error');
                  return isCheck;
                }
                //verificacion de porcentaje
                if(currentPercentage == null || currentPercentage == undefined){
                  this.messageService.add({severity:'error', summary:'Alerta', detail:'El porcentaje no puede estar vacio'});
                  this.paintInput('tab'+this.tabsPrice[j].noTab+propNamePercentage,'error');
                  return isCheck;
                }

                //asginamos el primer precio a comparar
                const currentPrice = (this.tabsPrice[j] as any)[propertyName];
                //segundo precio a comparar
                const previousPrice = (i + 1 < currLengthCheksPrice) ? (this.tabsPrice[j] as any)[this.arrChecksPrecios[i + 1].nombre] : null;

                if(currentPrice == null || currentPrice == undefined){
                  this.messageService.add({severity:'error', summary:'Alerta', detail:'El precio no puede estar vacio'});
                  this.paintInput('tab'+this.tabsPrice[j].noTab+this.arrChecksPrecios[i].nombre,'error');
                  return isCheck;
                }
                //verificacion de precio compra
                if(currentPrice < this.tabsPrice[j].preciocompra){
                  this.messageService.add({severity:'error', summary:'Alerta', detail:'El precio ingresado no puede ser menor al precio compra'});
                  this.paintInput('tab'+this.tabsPrice[j].noTab+this.arrChecksPrecios[i].nombre,'error');
                  return isCheck;
                }

                //Si el precio actual es mayor al anterior detenemos el ciclo y mandamos el false
                if (currentPrice <= previousPrice) {
                    // Si el precio actual es menor que el precio anterior,
                    // establecemos isCheck en false y salimos de la función.
                    this.paintInput('tab'+this.tabsPrice[j].noTab+this.arrChecksPrecios[i+1].nombre,'error');
                    return isCheck;
                }
            }
        }
        return isCheck = false;
      }
    }
    return isCheck;
  }

  /**
   * cuenta el numero de caracteres insertados
   * @param event 
   */
  omitirEnter(event:Event){
    const element = (event.target as HTMLInputElement).id;
    switch(element){
      case 'descripcion':
          this.conta = ((event.target as HTMLInputElement).value).length;
          break;
      // case 'ubicacion':
      //     this.contaUbi = ((event.target as HTMLInputElement).value).length;
      //     break;
    }
  }

  /**
   * 
   * @param form 
   */
  submit(){
    this.isLoadingGeneral = true;

    // Validamos precios antes de enviar
    if(this.verificaPreciosSubmit()){
      this.isLoadingGeneral = false;
      this.messageService.add({
          severity:'error', 
          summary:'Alerta', 
          detail:'Favor de verificar los precios', 
      });
    } else{
      //Limpiamos variables
      this.sucursales_guardadas = [];
      this.sucursales_fallidas = [];
      //Creamos identity
      let identityMod = {
        'sub': this.identity.sub,
        'permisos': this.userPermisos
      }

      this._productoService.registerProducto(this.producto,this.tabsPrice,identityMod).subscribe(
        response =>{
           if(response.status == 'success'){
            //  this.messageService.add({severity:'success', summary:'Alerta', detail:'Producto guardado correctamente', sticky:true});
            this.sucursales_guardadas = response.data_producto_multi.sucursales_guardadas;
            this.sucursales_fallidas = response.data_producto_multi.sucursales_fallidas;
             this.producto.claveEx =  '';
             this.isLoadingGeneral = false;
             this.mdl_SubmitProd = true;
           }
         },
         error =>{
           this.messageService.add({severity:'error', summary:'Alerta', detail:'Algo salio mal: '+error});
           this.isLoadingGeneral = false;
         });



    }
  }

  /**
   * Asigna el nombre de la imagen cargada a la propiedad de
   * producto.imagen
   * @param datos 
   */
  productImage(datos:any){
    //console.log(datos.originalEvent.body.image);
    this.producto.imagen = datos.originalEvent.body.image;
  }


  /*    SERVICIOS 
   * Todos estos metodos traen la informacion de su nombre
   * ejemplo getMedida() trae las medidas que se muestran
   * en el select del html
   */
  getMedida(){
    this._medidaService.getMedidas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.medidas = response.medidas;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getMarca(){
    this._marcaService.getMarcas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.marca = response.marca;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getDepartamentos(){
    this._departamentosService.getDepartamentos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.departamentos = response.departamentos;
          
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getSucursales(){
    this._sucursalService.getSucursales().subscribe(
      response =>{
        if(response.status == 'success'){
          this.sucursales = response.sucursales;
          this.empresa = response.empresa;
          //Filtrar la lista para eliminar elementos con propiedad connection vacia
          this.sucursales = this.sucursales.filter(sucursal => sucursal.connection !== null);
          //Eliminamos a la misma sucursal para que no salga en la lista
          this.sucursales = this.sucursales.filter(sucursal => sucursal.idSuc !== this.empresa.idSuc);
        }
      }, error =>{
        console.log(error);
      }
    )
  }

  //MODAL
  // Metodos del  modal
  open(content:any) {//abrir modal
    
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'lg'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {//cerrarmodal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

   /**
   * Funcion para el select de no. de medidas
   * @param model 
   * recibimos el numero de medidas a ingresar
   * y mostramos y ocultamos las tablas
   */
  seleccionaNoMedidas(model:any){
    let currentLength = this.tabsPrice.length;

    if(model < currentLength){
      //Eliminamos el ultimo elemento
      this.tabsPrice.splice(model);
    } else if(model > currentLength){
      //Agregamos elementos faltantes
      for(let i=currentLength+1; i <= model; i++){
        this.tabsPrice.push(
          new Productos_medidas_new(i)
        );
      }
    }

    // console.log(this.tabsPrice)
  }

  /**
   * 
   * @param event 
   * @description
   * Inserta el precio compra a los modelos de las tabs
   * Este preciocompra es el base
   */
  asignaPrecioCompra(event: Event){
    /**
     * Verificamos que el precio compra general sea mayor a cero
     * Y que tengamos asignadas tablas en la cual trabajar
     */
    if(this.precioCompraForm > 0 && this.tabsPrice.length > 0){
      //Asignamos 1 para poder trabajar
      let totalUnidad = 1;
      //recorremos las tablas
      for(let i=0; i < this.tabsPrice.length; i++){

        //verificamos que la unidad ingresada sea mayor a cero
        if(this.tabsPrice[i].unidad > 0){
          //Multiplicamos por si mismo la unidad
          totalUnidad *= this.tabsPrice[i].unidad;
          //asignamos precio compra
          this.tabsPrice[i].preciocompra =  this.precioCompraForm/totalUnidad;
          //redondeamos elprecio compra
          this.tabsPrice[i].preciocompra =  Math.round((this.tabsPrice[i].preciocompra + Number.EPSILON) * 100 ) / 100 ;
          //Pintamos el input
          this.paintInput('unidad'+this.tabsPrice[i].noTab,'normal');
        } else{
          //pintamos el input de error
          this.paintInput('unidad'+this.tabsPrice[i].noTab,'error');
          //mandamos mensaje de error
          this.messageService.add({
            severity:'warn', 
            summary:'Advertencia', 
            detail: 'No se puede asignar precio compra si no se cuenta con unidad de medida.'
          });
          //detemos el for
          break;
        }//finelse
      }//finfor
    }//fin if
  }

  /**
   * 
   * @param idInput 
   * @param severety 
   * @description
   * Busca el id recibido en el dom si lo encuentra pinta el background-color
   * de acuerdo al severety. 'error' = rojo claro, 'warn' = amarillo claro y 'normal' = sin color
   */
  paintInput(idInput:string,severety:string){
    var stylePrecio = document.getElementById(idInput);

    // Verificamos que al obtener el input este no sea vacio (undefined)
    if(stylePrecio){

      switch(severety){
        case 'error':
            stylePrecio.style.backgroundColor = "#FFB2B2";
          break;
        case 'warn':
            stylePrecio.style.backgroundColor = "#FFF2CC";
          break;
        case 'normal':
            stylePrecio.style.backgroundColor = "";
          break;
      }
    }
  }

  /**
   * 
   * @param tab 
   * @param precioIndex 
   * @description
   * Se recibe el precio ingresado y se calculo su porcentaje de ganancia en base
   * al precio VENTA ingresado en la tabsPrice[1], aplica unicamente para las medidas
   * que no sean la principal
   */
  calcularPorcentajeGanancia(tab: any, precioIndex: number) {
    const precioIngresado = tab['precio' + precioIndex];
    const precioCompra = this.asignaPrecioCompraEnCalculo(tab,precioIndex);
  
    if (precioIngresado > precioCompra) {

      if(precioCompra == 0){
        if(tab.unidad == 0){
          this.messageService.add({severity:'error', summary:'Alerta', detail:'No es posible realizar el calculo ya que la unidad es cero.'});
          this.paintInput('unidad'+tab.noTab,'error');
        } else{
          this.messageService.add({severity:'error', summary:'Alerta', detail:'No es posible realizar el calculo ya que el precio compra es cero o la unidad de medida es cero.'});
          this.paintInput('precioCompraPrincipal','error');
        }
      } else{
        const porcentaje = ((precioIngresado - precioCompra) / precioCompra) * 100;
        this.paintInput('tab' + tab.noTab + 'precio' + precioIndex, 'normal');
    
        var tabFind = this.tabsPrice.find(x => x.noTab == tab.noTab);
        if (tabFind) {
          (tabFind as any)['porcentaje' + precioIndex] = Math.round((porcentaje + Number.EPSILON) * 100 ) / 100 ;
          this.isPrecioCorrecto = false;
        }
      }
  
    } else {
      this.paintInput('tab' + tab.noTab + 'precio' + precioIndex, 'error');
      this.isPrecioCorrecto = true;
    }
  }

  /**
   * 
   * @param tab 
   * @param porcentajeIndex 
   * @description
   * Recib el porcentaje ingresado y calcula el precio en base
   * al precio VENTA ingresado en la tabsPrice[1], aplica unicamente para las
   * medidas que no sea la principal
   */
  calcularPrecio(tab:any, porcentajeIndex: number){
    //asginamos el valor ingresado en el porcentaje
    let porcentajeIngresado = tab['porcentaje' + porcentajeIndex];
    //Calculamos el precio compra
    const precioCompra = this.asignaPrecioCompraEnCalculo(tab, porcentajeIndex);
    //Verificamos que la unidad y el porcentajeingresado sea mayor a cero
    if(tab.unidad > 0){
      //Dividimosel porcentaje entre 100
      porcentajeIngresado = porcentajeIngresado / 100;
      //Busvamos la tab en donde se asignara el precio
      var tabFind = this.tabsPrice.find(x => x.noTab == tab.noTab);
      //Si se encuentra
      if(tabFind){
        //Asignamos el precio calculado
        (tabFind as any)['precio'+porcentajeIndex] = precioCompra * ( 1 + porcentajeIngresado);
        //redondeamos el precio
        (tabFind as any)['precio'+porcentajeIndex] = Math.round(((tabFind as any)['precio'+porcentajeIndex] + Number.EPSILON) * 100) / 100;
        //pintamos el input
        this.paintInput('tab'+tabFind.noTab+'precio'+porcentajeIndex,'normal');
        this.isPrecioCorrecto = false;
      }
    } else{
        this.messageService.add({severity:'error', summary:'Alerta', detail:'No es posible realizar el calculo ya que la unidad es cero.'});
        this.paintInput('unidad'+tab.noTab,'error');
        this.isPrecioCorrecto = true;
    }
  }

  /**
   * 
   * @param tab 
   * @param index 
   * @returns 
   * @description
   * Unicamente para realizar los calculos de precios ya que el precio compra
   * se basa en el precio ingresado en la primera medida
   */
  asignaPrecioCompraEnCalculo(tab:any, index:number){
    //Verificamos que la tabla no sea la primera
    if(tab.noTab == 1){
      return tab.preciocompra;
    } else{

      let unidadMenor = 1;
      //calculamos la unidad de medida menor
      for(let i=0; i < tab.noTab; i++){
        unidadMenor *= this.tabsPrice[i].unidad;
      }
      //buscamos la tab en donde extraeremos el preciocompra
      let tab1 = this.tabsPrice.find(x => x.noTab == 1);
      //Si existe
      if(tab1){
          return (tab1 as any)['precio'+index] / unidadMenor;
      }
    }
  }

  /**
   * 
   * @param check boolean: Valor del check
   * @param idInput string: nombre de la propiedad de la tab
   * @param nivel number: numero del input
   * @description
   * Agrega y elimina del array y por ultimo los ordena
   */
  guardaCheckPrecio(check:boolean,idInput:string,nivel:number){
    if(check){
      //Agregar alarray
      this.arrChecksPrecios.push({nivel: nivel,nombre:idInput});
    } else{
      // Eliminar del array arrChecksPrecios si existe
      this.arrChecksPrecios = this.arrChecksPrecios.filter(item => item.nombre !== idInput);
    }

    // Ordenar el array por nivel
    this.arrChecksPrecios.sort((a, b) => a.nivel - b.nivel);
    // console.log(this.arrChecksPrecios)
  }

  /**
   * 
   * @param isUpdate 
   * Abre modal de confirmacion de guardado de producto
   */
  confirmSubmit(isUpdate: boolean = false){
    if(isUpdate){
      if(this.isUpdateLocal){
        this.confirmSubmit();
      } else{
        this.confirmUpdate();
      }
    } else {
      this._confirmationService.confirm({
        message: '¿Esta seguro(a) que desea guardar el producto?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          if(this.modoEdicion){
            this.updateProducto();
          } else{
            this.submit();
          }
        },
        reject: (type:any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({
                      severity:'warn', 
                      summary:'Cancelado', 
                      detail:'Confirmacion cancelada.'
                  });
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({
                      severity:'warn', 
                      summary:'Cancelado', 
                      detail:'Confirmacion cancelada.'
                  });
              break;
          }
      }
      });
    }
  }

  /**
   * 
   * @param event 
   * @description
   * toma los porcentajes de los precios activos y los asigna a la tabla en cuestion
   * Si el input tiene el atributo 'asigna' entonces tomara el porcentaje del input
   * y lo asignara a todos los precios activos
   */
  igualarPorcentajes_asignaPorcentaje(event: any){
    //Creamos el boton
    let btn = event.currentTarget as HTMLButtonElement;
    //Obtenemos el atributo personalizado
    let btnNoTab = btn.getAttribute('data-noTab');
    //Obtenos atributo para saber que hara
    let btnType = btn.getAttribute('data-type');
    //Obtemos la longitud del array de precios activos
    let currLengthCheksPrice = this.arrChecksPrecios.length;
    
    //Verificamos que el atributo disabled no este en true, Que exista el atributo notab y no sea igual a 1
    if(btn.getAttribute('ng-reflect-disabled') == 'false' && btnNoTab != null && btnNoTab != '1'){
      //Revisamos que el por lo menos haya un precio activo
      if(currLengthCheksPrice > 0){
        //Convertimos la porpiedad del notab a numero
        const indexTab = parseInt(btnNoTab);

        if(btnType == "asigna"){
          let idElment = 'inpAsignaPorcentaje' + indexTab;
          //obtemos el valor el porcentaje del input a asignar
          let inpValue = document.getElementById(idElment) as HTMLInputElement;
          if(inpValue){
            this.paintInput(idElment,'normal');
            //recorremos los precios activos
            for(let i = 0; i < currLengthCheksPrice; i++){
              let propNamePercentage: string = 'porcentaje' + this.arrChecksPrecios[i].nivel;
              //recorremos la lista de precios
              this.tabsPrice.forEach( tab =>{
                //cuando coincida la tabla a asignar
                if(tab.noTab == indexTab){
                  //asignamos el porcentaje el porcentaje
                  (tab as any)[propNamePercentage]  = (inpValue.value == "" ) ? 0 : parseFloat(inpValue.value);
                  //calculamos el precio
                  this.calcularPrecio(tab, this.arrChecksPrecios[i].nivel);
                }
              });
            }
          }
          
        } else{
          //Buscamos la tabla donde copiaremos los porcentajes
          let tabFind = this.tabsPrice.find(x => x.noTab == (indexTab -1))
          //recorremos los precios activos
          for(let i = 0; i < currLengthCheksPrice; i++){
            //obtenemos el nombre de la pripiedad a buscar y asignar
            let propNamePercentage: string = 'porcentaje' + this.arrChecksPrecios[i].nivel;
            //recorremos la lista de precios
            this.tabsPrice.forEach( tab =>{
              //cuando coincida la tabla a asignar y esta tenga algun valor
              if(tab.noTab == indexTab && (tabFind as any)[propNamePercentage]){
                //copiamos el porcentaje
                (tab as any)[propNamePercentage]  = (tabFind as any)[propNamePercentage];
                //calculamos el precio
                this.calcularPrecio(tab, this.arrChecksPrecios[i].nivel);
              }
            });
          }
        }
      }
    }

  }

  /**
   * 
   * @param motivo 
   * @description
   * Suma o resta a la tabla 1 el numero ingresado
   * Calcula sobre la primera tabla por el precio y en las restantes por el porcentaje
   */
  aumentar_disminuir_precio(motivo:string){
    //Verificamos que estamos en modo edicion y que el valor ingresado no sea null y que sea mayor a cero
    if(this.modoEdicion && this.inputAmount != null && this.inputAmount > 0){
      //recorremos el array de precios activos
      for(let i = 0; i < this.arrChecksPrecios.length; i++){
        //Asignamos la propiedad a buscar
        const propertyName = this.arrChecksPrecios[i].nombre;
        //asignamos el monto ingresado
        let amount = this.inputAmount
        //verificamos si el motivo es restar convertirmos el valor ingresado en negativo
        if(motivo == "restar" ){
          amount = -amount;
        }
        //Unicamente a nuestra tabla1 realizamos la suma del valor ingresado
        (this.tabsPrice[0] as any)[propertyName] = parseFloat((this.tabsPrice[0] as any)[propertyName]) + amount ; 

        //Recorremos las tablas para recalcular porcentajes y precios de ganancia
        for(let j = 0; j < this.tabsPrice.length; j++){
          //Unicamente para la tabla1 se realiza calculo por precio
          if(j == 0){
            this.calcularPorcentajeGanancia(this.tabsPrice[j], this.arrChecksPrecios[i].nivel)
          } else{
            //En las restantes calculamos por el porcentaje que tienen
            this.calcularPrecio(this.tabsPrice[j],this.arrChecksPrecios[i].nivel);
          }
        }
        
      }
    } else{
      this.messageService.add({
        severity:'warn', 
        detail:'La cantidad a sumar o restar no puede cero o vacio.'
    });
    }
  }
  
  /**
   * 
   * @param idProducto 
   * @description
   * Obtiene la ingormacion del producto de la url
   */
  getDatosProducto(idProducto:number){
    this.isLoadingGeneral = true;
    
    this._productoService.getProdverDos(idProducto).subscribe(
      response =>{
        this.isLoadingGeneral = false;
        this.producto = response.producto[0];
        this.noMedida = response.productos_medidas.length;
        
        //Limpiamos a tabsPrice
        this.tabsPrice = [];

        if(this.noMedida > 0){
          //asignamos precio compra
          this.precioCompraForm = response.productos_medidas[0].preciocompra;
          //Iteramos sobre el response de productos_medidas para asignarlos a tabsPrice
          for(let i = 0; i < this.noMedida; i++){
            const prodMedida = response.productos_medidas[i];
            const produtoMedidaNew = new Productos_medidas_new(
              i+1,
              prodMedida.idProdMedida,
              prodMedida.idProducto,
              prodMedida.idMedida,
              prodMedida.unidad,
              prodMedida.precioCompra,

              prodMedida.porcentaje1,
              prodMedida.precio1,
              (prodMedida.precio1 && prodMedida.porcentaje1) ? true : false,
              
              prodMedida.porcentaje2,
              prodMedida.precio2,
              (prodMedida.precio2 && prodMedida.porcentaje2) ? true : false,
              
              prodMedida.porcentaje3,
              prodMedida.precio3,
              (prodMedida.precio3 && prodMedida.porcentaje1) ? true : false,
              
              prodMedida.porcentaje4,
              prodMedida.precio4,
              (prodMedida.precio4 && prodMedida.porcentaje4) ? true : false,
              
              prodMedida.porcentaje5,
              prodMedida.precio5,
              (prodMedida.precio5 && prodMedida.porcentaje1) ? true : false,

              prodMedida.idStatus,
            );
            this.tabsPrice.push(produtoMedidaNew);
          }
          //Recorremos el primer elemento para obtener los checks de los precios
          for(let i = 0; i < 1; i++ ){
            //Recorremos los 5 cheks de los precios
            for(let j = 1; j <= 5; j++){
              //Creamos la propiedad a buscar
              const isSelected = (this.tabsPrice[i] as any)['isSelected_precio'+j];
              //Si el resultado es true
              if(isSelected){
                //asignamos objeto al array
                this.arrChecksPrecios.push({ nivel: j, nombre: 'precio' + j });
              }
            }
          }
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
   * Nos permite visualizar el modal el cual pregunta que hacer cuando el precio
   * a sido modificado
   */
  mdlMantenerPrecio_MantenerPorcentaje(event: Event){
    if(this.modoEdicion){
      this.mdl_Mantener = true;
    }
  }

  /**
   * @description
   * - Recalcula todos los precios de las tablas activos cuando se modifica el precio compra en modo edicion
   * 
   */
  fnMantenerPrecio_MantenerPorcentaje(){
    this.mdl_Mantener = false;
    if(this.precioCompraForm > 0){
      switch(this.accionModificacionPrecio){
        //Recalculamos todos los porcentajes de todas las tablas con el nuevo
        //precio compra ingresado y los precios ya registrados
        case "mantenerPrecio":
            for(let i = 0; i < this.arrChecksPrecios.length; i++){
              for(let j = 0; j < this.tabsPrice.length; j++){
                this.calcularPorcentajeGanancia(this.tabsPrice[j], this.arrChecksPrecios[i].nivel)
              }
            }
          break;
        
        //Recalculamos todos los precios de todas las tablas con el nuevo
        //precio compra ingresado y los porcentajes que ya tiene ingresado
        case "mantenerPorcentaje":
            for(let i = 0; i < this.arrChecksPrecios.length; i++){
              for(let j = 0; j < this.tabsPrice.length; j++){
                this.calcularPrecio(this.tabsPrice[j], this.arrChecksPrecios[i].nivel);
              }
            }
          break;

      }
    } else{
      this.messageService.add({
                    severity:'warn', 
                    detail:'El precio compra no pueeder ser cero.'
                });
    }
  }

  /**
   * Abre modal de seleccion de sucursales en donde se actualizara el producto
   */
  confirmUpdate(){
    this.getSucursales();
    this.mdl_ConfirmSucursales = true;
  }

  /**
   * @description
   * Submit de actualizacion del producto
   */
  updateProducto(){
    this.isLoadingGeneral = true;
    this.sucursales_guardadas = [];
    this.sucursales_fallidas = [];

    if(this.verificaPreciosSubmit()){
      this.isLoadingGeneral = false;
      this.messageService.add({
          severity:'error', 
          summary:'Alerta', 
          detail:'Favor de verificar los precios', 
      });
    } else{
      this._productoService.updateProducto(this.producto,this.tabsPrice,this.identity.sub,this.sucursales,this.isUpdateLocal).subscribe(
        response =>{
          if(response.status =='success'){
            this.sucursales_guardadas = response.data_productosMulti.sucursales_guardadas;
            this.sucursales_fallidas = response.data_productosMulti.sucursales_fallidas;
            
            this.isLoadingGeneral = false;
            this.mdl_ConfirmSucursales = false;

            if(this.isUpdateLocal){
              this.messageService.add({
                severity:'success',
                summary:'Actualizacion exitosa',
                detail:response.message,
            })
            } else{
              this.mdl_SubmitProd =true;
            }
          }
          // console.log(response);
        }, error =>{
          this.messageService.add({
            severity:'error', 
            summary:'Alerta', 
            detail:'Algo salio mal: '+error
          });
          console.log(error);
        }
      )
    }
  }

  /**
   * @description
   * Marca todas los check de las sucursales a actualizar
   */
  toggleAllSuc(){
    for(let suc of this.sucursales){
      suc.isSelected = this.isAllSuc;
    }
  }

  /**
   * @description
   * Al desmarcar algun check de la tabla, desmarcamos el check del header
   */
  toggleSucursalSelection() {
    this.isAllSuc = this.sucursales.every(suc => suc.isSelected);
  }

  
}
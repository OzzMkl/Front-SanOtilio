/**
 *  @fileoverview Logica del componente producto-agregar
 * 
 *  @version 1.0
 * 
 *  @autor Oziel pacheco<ozielpacheco.m@gmail.com>
 *  @copyright Materiales San Otilio
 * 
 *  @History
 * 
 *  -Primera version escrita por Oziel Pacheco
 * 
 */
import { Component, OnInit } from '@angular/core';
import { global } from 'src/app/services/global';

/*****SERVICIOS*/
import { MedidaService } from 'src/app/services/medida.service';
import { MarcaService } from 'src/app/services/marca.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SubCategoriaService } from 'src/app/services/subcategoria.service';
import { AlmacenService } from 'src/app/services/almacen.service';
import { ProductoService } from 'src/app/services/producto.service';
import { ToastService } from 'src/app/services/toast.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
/*NGBOOTSTRAP */
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
/*MODELOS */
import { Producto} from 'src/app/models/producto';
import { Productos_medidas } from 'src/app/models/productos_medidas';
import { Router } from '@angular/router';


@Component({
  selector: 'app-producto-agregar',
  templateUrl: './producto-agregar.component.html',
  styleUrls: ['./producto-agregar.component.css'],
  providers: [MedidaService, MarcaService,DepartamentoService,
  CategoriaService, SubCategoriaService, AlmacenService,
  ProductoService]
})
export class ProductoAgregarComponent implements OnInit {
  
  //variables para cargar informacion en los select
  public medidas: Array<any> = [];
  public marca: Array<any> = [];
  public departamentos: Array<any> = [];
  public categoria: Array<any> = [];
  public identity: any;
  public almacenes: Array<any> = [];
  public producto: Producto;
  //
  public url: string = global.url;
  //contadores para los text area
  conta: number =0;
  contaUbi: number =0;
  //spinner
  public isLoading: boolean = false;
  //PAGINATOR
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //CERRAR MODAL
  public closeResult: string = '';
  //Para mostrar y ocultar las tablas de precios
  public noMedida: number = 1;
  public tab2: boolean = true;
  public tab3: boolean = true;
  public tab4: boolean = true;
  public tab5: boolean = true;
  //Para recoger la informacion de las tablas de precios
  public listaProdMedida: Array<Productos_medidas> = [];
  public datosTab1: Productos_medidas;
  public datosTab2: Productos_medidas;
  public datosTab3: Productos_medidas;
  public datosTab4: Productos_medidas;
  public datosTab5: Productos_medidas;
  //checks de  las tablas para la igualacion de porcentajes
  public checkTab2: boolean = false;
  public checkTab3: boolean = false;
  public checkTab4: boolean = false;
  public checkTab5: boolean = false;

  constructor(
    private _productoService: ProductoService,
    private _medidaService: MedidaService,
    private _marcaService: MarcaService,
    private _departamentosService: DepartamentoService,
    private _categoriaService: CategoriaService,
    private _almacenService: AlmacenService,
    public _empleadoService : EmpleadoService,
    private modalService: NgbModal,
    public toastService: ToastService,
    public _router: Router

  ) {
    this.producto = new Producto(0,0,0,0,'',0,'',0,0,'',0,'','',null,0,0);
    this.datosTab1 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab2 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab3 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab4 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab5 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
   }

  ngOnInit(): void {
    this.getMedida();
    this.getMarca();
    this.getDepartamentos();
    this.getCategoria();
    this.getAlmacen();
  }

  

  /**
   * Omite el salto de linea del textarea de descripcion
   * cuenta el numero de caracteres insertados
   * @param event 
   * omitimos los eventes de "enter" y "shift + enter"
   */
  omitirEnter(event:any){
    this.conta = event.target.value.length;
    if(event.which === 13 || event.shiftKey){
      event.preventDefault();
      //console.log('prevented');
    }
  }

  /**
   * Omite el salto de linea del textarea de ubicacion
   * cuenta el numero de caracteres insertados
   * @param event 
   * omitimos los eventes de "enter" y "shift + enter"
   */
  omitirEnterUbicacion(event:any){
    this.contaUbi = event.target.value.length;
    if(event.which === 13 || event.shiftKey){
      event.preventDefault();
      //console.log('prevented');  
    }
  }

  /**
   * 
   * @param form 
   */
  submit(form:any){
    this.loadUser();
    this.insertaListaProdM();
//    console.log(this.producto, this.listaProdMedida)
      this._productoService.registerProducto(this.producto,this.listaProdMedida,this.identity).subscribe(
        response =>{
          //console.log('asdasdasd :',response);
          if(response.status == 'success'){
            
            this._router.navigate(['./producto-modulo/producto-buscar']);
            this.toastService.show('Producto guardado correctamente', { classname: 'bg-success text-light', delay: 5000 });
          }
        },
        error =>{
          //console.log(this.producto);
          //console.log('error ',error);
          this.toastService.show(error, { classname: 'bg-danger text-light', delay: 15000 });
        });
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

  /**
   * Funcion para el select de no. de medidas
   * @param model 
   * recibimos el numero de medidas a ingresar
   * y mostramos y ocultamos las tablas
   */
  seleccionaNoMedidas(model:any){
    
    let no = model;
    switch( no ){
      case "1":
          this.tab2 = true;
          this.tab3 = true;
          this.tab4 = true;
          this.tab5 = true;
          this.noMedida =1;
        break;

      case "2":
          this.tab2 = false;
          this.tab3 = true;
          this.tab4 = true;
          this.tab5 = true;
          this.noMedida =2;
        break;

      case "3":
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = true;
          this.tab5 = true;
          this.noMedida =3;
        break;

      case "4":
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = true;
          this.noMedida =4;
        break;

      case "5":
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = false;
          this.noMedida =5;
        break;
    }
  }
  /***
   * ingresa a la lista de Productos_medidas
   * el numero de medidas que se seleccionaron
   */
  insertaListaProdM(){
    //Ponemos la lista vacia antes de ingresar
    this.listaProdMedida=[];
    //deacuerdo al valor de noMedida que lo proporciona el select
    //guardaremos las tablas de medidas en la lista
    switch(this.noMedida){
      case 1:
            this.datosTab1.idStatus = 31;
            this.listaProdMedida.push({...this.datosTab1});
          break;
      case 2:
          this.datosTab1.idStatus = 31;
          this.datosTab2.idStatus = 31;
            this.listaProdMedida.push({...this.datosTab1},
                                      {...this.datosTab2});
          break;
      case 3:
            this.datosTab1.idStatus = 31;
            this.datosTab2.idStatus = 31;
            this.datosTab3.idStatus = 31;
            this.listaProdMedida.push({...this.datosTab1},
                                      {...this.datosTab2},
                                      {...this.datosTab3});
          break;
      case 4:
            this.datosTab1.idStatus = 31;
            this.datosTab2.idStatus = 31;
            this.datosTab3.idStatus = 31;
            this.datosTab4.idStatus = 31;
            this.listaProdMedida.push({...this.datosTab1},
                                      {...this.datosTab2},
                                      {...this.datosTab3},
                                      {...this.datosTab4}); 
          break;
      case 5:
            this.datosTab1.idStatus = 31;
            this.datosTab2.idStatus = 31;
            this.datosTab3.idStatus = 31;
            this.datosTab4.idStatus = 31;
            this.datosTab5.idStatus = 31;
            this.listaProdMedida.push({...this.datosTab1},
                                      {...this.datosTab2},
                                      {...this.datosTab3},
                                      {...this.datosTab4},
                                      {...this.datosTab5}); 
          break;
    }
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
  getCategoria(){
    this._categoriaService.getCategorias().subscribe(
      response =>{
        if(response.status == 'success'){
          this.categoria = response.categoria;
          
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  getAlmacen(){
    this._almacenService.getAlmacenes().subscribe(
      response =>{
        if(response.status == 'success'){
          this.almacenes = response.almacenes;
         
        }
      },
      error =>{
        console.log(error);
      }
    );
  }
  loadUser(){
    this.identity = this._empleadoService.getIdentity();
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
   * Capturamos el id del check si es true
   * llamalos la funcion de calcularPorcentaje
   * Si es false ponemos todas los precios de la
   * tabla en ceros
   * @param e event
   */
  igualaPorcentaje(e:any){

    switch(e.target.id){
      case 'checkTab2':
          if(this.checkTab2){
            this.datosTab2.porcentaje5 = this.datosTab1.porcentaje5; this.tab2calculaMontoCheck('tab2porcentaje5');
            this.datosTab2.porcentaje4 = this.datosTab1.porcentaje4; this.tab2calculaMontoCheck('tab2porcentaje4');
            this.datosTab2.porcentaje3 = this.datosTab1.porcentaje3; this.tab2calculaMontoCheck('tab2porcentaje3');
            this.datosTab2.porcentaje2 = this.datosTab1.porcentaje2; this.tab2calculaMontoCheck('tab2porcentaje2');
            this.datosTab2.porcentaje1 = this.datosTab1.porcentaje1; this.tab2calculaMontoCheck('tab2porcentaje1');
          } else{
            this.datosTab2.porcentaje5 = 0; this.tab2calculaMontoCheck('tab2porcentaje5');
            this.datosTab2.porcentaje4 = 0; this.tab2calculaMontoCheck('tab2porcentaje4');
            this.datosTab2.porcentaje3 = 0; this.tab2calculaMontoCheck('tab2porcentaje3');
            this.datosTab2.porcentaje2 = 0; this.tab2calculaMontoCheck('tab2porcentaje2');
            this.datosTab2.porcentaje1 = 0; this.tab2calculaMontoCheck('tab2porcentaje1');
          }
      break;
      case 'checkTab3':
          if(this.checkTab3){
            this.datosTab3.porcentaje5 = this.datosTab2.porcentaje5; this.tab3calculaMontoCheck('tab3porcentaje5');
            this.datosTab3.porcentaje4 = this.datosTab2.porcentaje4; this.tab3calculaMontoCheck('tab3porcentaje4');
            this.datosTab3.porcentaje3 = this.datosTab2.porcentaje3; this.tab3calculaMontoCheck('tab3porcentaje3');
            this.datosTab3.porcentaje2 = this.datosTab2.porcentaje2; this.tab3calculaMontoCheck('tab3porcentaje2');
            this.datosTab3.porcentaje1 = this.datosTab2.porcentaje1; this.tab3calculaMontoCheck('tab3porcentaje1');
          } else{
            this.datosTab3.porcentaje5 = 0; this.tab3calculaMontoCheck('tab3porcentaje5');
            this.datosTab3.porcentaje4 = 0; this.tab3calculaMontoCheck('tab3porcentaje4');
            this.datosTab3.porcentaje3 = 0; this.tab3calculaMontoCheck('tab3porcentaje3');
            this.datosTab3.porcentaje2 = 0; this.tab3calculaMontoCheck('tab3porcentaje2');
            this.datosTab3.porcentaje1 = 0; this.tab3calculaMontoCheck('tab3porcentaje1');
          }
      break;
      case 'checkTab4':
        if(this.checkTab4){
          this.datosTab4.porcentaje5 = this.datosTab3.porcentaje5; this.tab4calculaMontoCheck('tab4porcentaje5');
          this.datosTab4.porcentaje4 = this.datosTab3.porcentaje4; this.tab4calculaMontoCheck('tab4porcentaje4');
          this.datosTab4.porcentaje3 = this.datosTab3.porcentaje3; this.tab4calculaMontoCheck('tab4porcentaje3');
          this.datosTab4.porcentaje2 = this.datosTab3.porcentaje2; this.tab4calculaMontoCheck('tab4porcentaje2');
          this.datosTab4.porcentaje1 = this.datosTab3.porcentaje1; this.tab4calculaMontoCheck('tab4porcentaje1');
        } else{
          this.datosTab4.porcentaje5 = 0; this.tab4calculaMontoCheck('tab4porcentaje5');
          this.datosTab4.porcentaje4 = 0; this.tab4calculaMontoCheck('tab4porcentaje4');
          this.datosTab4.porcentaje3 = 0; this.tab4calculaMontoCheck('tab4porcentaje3');
          this.datosTab4.porcentaje2 = 0; this.tab4calculaMontoCheck('tab4porcentaje2');
          this.datosTab4.porcentaje1 = 0; this.tab4calculaMontoCheck('tab4porcentaje1');
        }
      break;
      case 'checkTab5':
        if(this.checkTab5){
          this.datosTab5.porcentaje5 = this.datosTab4.porcentaje5; this.tab5calculaMontoCheck('tab5porcentaje5');
          this.datosTab5.porcentaje4 = this.datosTab4.porcentaje4; this.tab5calculaMontoCheck('tab5porcentaje4');
          this.datosTab5.porcentaje3 = this.datosTab4.porcentaje3; this.tab5calculaMontoCheck('tab5porcentaje3');
          this.datosTab5.porcentaje2 = this.datosTab4.porcentaje2; this.tab5calculaMontoCheck('tab5porcentaje2');
          this.datosTab5.porcentaje1 = this.datosTab4.porcentaje1; this.tab5calculaMontoCheck('tab5porcentaje1');
        } else{
          this.datosTab5.porcentaje5 = 0; this.tab5calculaMontoCheck('tab5porcentaje5');
          this.datosTab5.porcentaje4 = 0; this.tab5calculaMontoCheck('tab5porcentaje4');
          this.datosTab5.porcentaje3 = 0; this.tab5calculaMontoCheck('tab5porcentaje3');
          this.datosTab5.porcentaje2 = 0; this.tab5calculaMontoCheck('tab5porcentaje2');
          this.datosTab5.porcentaje1 = 0; this.tab5calculaMontoCheck('tab5porcentaje1');
        }
      break;
    }
  }

  /**
   * Asigna el mismo porcentaje para todos los precios
   * @param e Event
   */
  asignaPorcentaje(e:any){
    switch(e.target.id){
      case 'aplicaPorcentaje2':
          var inputValue  = parseFloat((<HTMLInputElement>document.getElementById('aplicaValue2')).value);
          this.datosTab2.porcentaje5 = inputValue; this.tab2calculaMontoCheck('tab2porcentaje5');
          this.datosTab2.porcentaje4 = inputValue; this.tab2calculaMontoCheck('tab2porcentaje4');
          this.datosTab2.porcentaje3 = inputValue; this.tab2calculaMontoCheck('tab2porcentaje3');
          this.datosTab2.porcentaje2 = inputValue; this.tab2calculaMontoCheck('tab2porcentaje2');
          this.datosTab2.porcentaje1 = inputValue; this.tab2calculaMontoCheck('tab2porcentaje1');
        break;
      case 'aplicaPorcentaje3':
          var inputValue  = parseFloat((<HTMLInputElement>document.getElementById('aplicaValue3')).value);
          this.datosTab3.porcentaje5 = inputValue; this.tab3calculaMontoCheck('tab3porcentaje5');
          this.datosTab3.porcentaje4 = inputValue; this.tab3calculaMontoCheck('tab3porcentaje4');
          this.datosTab3.porcentaje3 = inputValue; this.tab3calculaMontoCheck('tab3porcentaje3');
          this.datosTab3.porcentaje2 = inputValue; this.tab3calculaMontoCheck('tab3porcentaje2');
          this.datosTab3.porcentaje1 = inputValue; this.tab3calculaMontoCheck('tab3porcentaje1');
        break;
      case 'aplicaPorcentaje4':
          var inputValue  = parseFloat((<HTMLInputElement>document.getElementById('aplicaValue4')).value);
          this.datosTab4.porcentaje5 = inputValue; this.tab4calculaMontoCheck('tab4porcentaje5');
          this.datosTab4.porcentaje4 = inputValue; this.tab4calculaMontoCheck('tab4porcentaje4');
          this.datosTab4.porcentaje3 = inputValue; this.tab4calculaMontoCheck('tab4porcentaje3');
          this.datosTab4.porcentaje2 = inputValue; this.tab4calculaMontoCheck('tab4porcentaje2');
          this.datosTab4.porcentaje1 = inputValue; this.tab4calculaMontoCheck('tab4porcentaje1');
        break;
      case 'aplicaPorcentaje5':
          var inputValue  = parseFloat((<HTMLInputElement>document.getElementById('aplicaValue5')).value);
          this.datosTab5.porcentaje5 = inputValue; this.tab5calculaMontoCheck('tab5porcentaje5');
          this.datosTab5.porcentaje4 = inputValue; this.tab5calculaMontoCheck('tab5porcentaje4');
          this.datosTab5.porcentaje3 = inputValue; this.tab5calculaMontoCheck('tab5porcentaje3');
          this.datosTab5.porcentaje2 = inputValue; this.tab5calculaMontoCheck('tab5porcentaje2');
          this.datosTab5.porcentaje1 = inputValue; this.tab5calculaMontoCheck('tab5porcentaje1');
        break;

    }
  }


  /******************** TAB1 ********************/

  /**
   * Calcula el porcentaje del precio ingresado
   * @param e 
   * Recibimos el evento (change) y accedemos a sus propiedades
   * para extraer el id y saber que input modificamos
   */
  calculaPorcentaje(e:any){
    //capturamos el id
    let inputId = e.target.id;

    //Antes de ingresar verificamos el precio esta permitido
    //Si es verdadero continuamos y que el campo unidad sea mayor a 0
    if(this.revisaPreciosventa(e) && this.datosTab1.unidad > 0){
      /**
     * De acuerdo al valor obtenido del input, ingresamos
     * al caso correspondiente
     */
      switch (inputId){

        case "precio5" : {
              /**
               * Realizamos el calculo del porcentaje : le restamos al precio nuevo (precio5) el precio anterior (precio compra)
               * y el resultado lo dividimos entre el precio  anterior (precio compra)
               * Por ultimo lo multiplicamos por 100
               */
              this.datosTab1.porcentaje5 = ((this.datosTab1.precio5 - (this.datosTab1.preciocompra / this.datosTab1.unidad)) / this.datosTab1.preciocompra) * 100 ;
              //Redondeamos el resultado a 2 decimales
              this.datosTab1.porcentaje5 = Math.round((this.datosTab1.porcentaje5 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab1.porcentaje5 < 0){
                //recreamos los parametros del evento
                let x = {target:{id:'porcentaje5'}}
                //mandamos a la funcion calcula monto
                this.calculaMonto(x);
              }
              break;
        }
        case "precio4" : {
              this.datosTab1.porcentaje4 = ((this.datosTab1.precio4 - (this.datosTab1.preciocompra / this.datosTab1.unidad)) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje4 = Math.round((this.datosTab1.porcentaje4 + Number.EPSILON) * 100 ) / 100 ;

              if(this.datosTab1.porcentaje4 < 0){
                let x = {target:{id:'porcentaje4'}}
                this.calculaMonto(x);
              }
          break;
        }
        case "precio3" : {
              this.datosTab1.porcentaje3 = ((this.datosTab1.precio3 - (this.datosTab1.preciocompra / this.datosTab1.unidad)) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje3 = Math.round((this.datosTab1.porcentaje3 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab1.porcentaje3 < 0){
                let x = {target:{id:'porcentaje3'}}
                this.calculaMonto(x);
              }
          break;
        }
        case "precio2" : {
              this.datosTab1.porcentaje2 = ((this.datosTab1.precio2 - (this.datosTab1.preciocompra / this.datosTab1.unidad)) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje2 = Math.round((this.datosTab1.porcentaje2 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab1.porcentaje2 < 0){
                let x = {target:{id:'porcentaje2'}}
                this.calculaMonto(x);
              }
          break;
        }
        case "precio1" : {
              this.datosTab1.porcentaje1 = ((this.datosTab1.precio1 - (this.datosTab1.preciocompra / this.datosTab1.unidad)) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje1 = Math.round((this.datosTab1.porcentaje1 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab1.porcentaje1 < 0){
                let x = {target:{id:'porcentaje1'}}
                this.calculaMonto(x);
              }
          break;
        }
      }
    }//fin if
  }

  /**
   * Revisa los precios ingresados desde precio5 a precio1
   * y manda una alerta si el precio ingresado es menor al anterior
   * @param e 
   * Recibimos evento de un (change)
   */
  revisaPreciosventa(e:any){
    /**
     * Tomamos del evento change el id del input modificado
     */
    let inputId = e.target.id;
    
    if(this.datosTab1.unidad <= 0){
      this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      return false;
    } else{
      switch (inputId) {
        case "precio5": {

            /**
             * Comparamos el precio ingresdo con el precio anterior
             * en este caso precio compra y si es menor mandamos una alerta
             */
            if(this.datosTab1.precio5 < (this.datosTab1.preciocompra / this.datosTab1.unidad)){
              this.toastService.show('El precio 5 no pueder ser menor al precio de compra', { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab1.precio5 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
              this.datosTab1.precio5 = Math.round((this.datosTab1.precio5 + Number.EPSILON) * 100 ) / 100 ;
              this.datosTab1.porcentaje5 = 0;
              return false;
              //this.ksks= true;
            } //else { this.ksks = false;}
            return true;
            break;
        }

        case "precio4": {

            if(this.datosTab1.precio4 < this.datosTab1.precio5){
              this.toastService.show('El precio 4 no pueder ser menor que el precio 5', { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab1.precio4 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
              this.datosTab1.precio4 = Math.round((this.datosTab1.precio4 + Number.EPSILON) * 100 ) / 100 ;
              this.datosTab1.porcentaje4 = 0;
              return false;
            }
              return true;
            break;
        }

        case "precio3": {

          if(this.datosTab1.precio3 < this.datosTab1.precio4){
            this.toastService.show('El precio 3 no pueder ser menor que el precio 4', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab1.precio3 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
            this.datosTab1.precio3 = Math.round((this.datosTab1.precio3 + Number.EPSILON) * 100 ) / 100 ;
            this.datosTab1.porcentaje3 = 0;
              return false;
          }
            return true;
          break;

        }
        case "precio2": {

          if(this.datosTab1.precio2 < this.datosTab1.precio3){
            this.toastService.show('El precio 2 no pueder ser menor que el precio 3', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab1.precio2 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
            this.datosTab1.precio2 = Math.round((this.datosTab1.precio2 + Number.EPSILON) * 100 ) / 100 ;
            this.datosTab1.porcentaje2 = 0;
              return false;
          }
            return true;
          break;

        }
        case "precio1": {

          if(this.datosTab1.precio1 < this.datosTab1.precio2){
            this.toastService.show('El precio 1 no pueder ser menor que el precio 2', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab1.precio1 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
            this.datosTab1.precio2 = Math.round((this.datosTab1.precio2 + Number.EPSILON) * 100 ) / 100 ;
            this.datosTab1.porcentaje1 = 0;
              return false;
          } 
            return true;
          break;
        }
        default:{
          return false;
          break;
        }
      }
    }//fin else
  }

  /**
   * Calcula el monto (precioX) de acuerdo
   * al porcentaje ingresado
   * @param e 
   * Recibimos el evento de un (keyup)
   */
  calculaMonto(e:any){
    let inputId = e.target.id
    /**
    * Obtenemos el valor del input y lo convertimos a Float
    * luego lo dividimos entre 100 para obtener su porcentaje
    */
    var inputValue  = parseFloat((<HTMLInputElement>document.getElementById(inputId)).value) / 100;

    /**
     * revisamos que el porcentaje no sea menor o igual a cero
     * Si es asi mandamos una alerta
     */
    if(inputValue <= 0){

      this.toastService.show('No puedes ingresar porcentajes negativos ', { classname: 'bg-danger text-light',delay: 5000 });
      switch(inputId){
        case "porcentaje5":
              this.datosTab1.precio5 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
              this.datosTab1.precio5 = Math.round((this.datosTab1.precio5 + Number.EPSILON) * 100 ) / 100 ;
              this.datosTab1.porcentaje5 = 0;
          break;
        case "porcentaje4":
              this.datosTab1.precio4 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
              this.datosTab1.precio4 = Math.round((this.datosTab1.precio4 + Number.EPSILON) * 100 ) / 100 ;
              this.datosTab1.porcentaje4 = 0;
          break;
        case "porcentaje3":
              this.datosTab1.precio3 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
              this.datosTab1.precio3 = Math.round((this.datosTab1.precio3 + Number.EPSILON) * 100 ) / 100 ;
              this.datosTab1.porcentaje3 = 0;
          break;
        case "porcentaje2":
            this.datosTab1.precio2 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
            this.datosTab1.precio2 = Math.round((this.datosTab1.precio2 + Number.EPSILON) * 100 ) / 100 ;
            this.datosTab1.porcentaje2 = 0;
          break;
        case "porcentaje1":
            this.datosTab1.precio1 = (this.datosTab1.preciocompra / this.datosTab1.unidad);
            this.datosTab1.precio1 = Math.round((this.datosTab1.precio1 + Number.EPSILON) * 100 ) / 100 ;
            this.datosTab1.porcentaje1 = 0;
          break;
      }

    } else{

      if(this.datosTab1.unidad <= 0){
        this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      } else{
        switch (inputId){
          case "porcentaje5" : {
                /**
                 * Dividimos el preciocompra entre la unidad
                 * Luego multiplicamos el resultado y por el valor del inputValue mas 1
                 * ejem: inputValue = .03 , preciocompra = 150 , unidad = 2
                 *  (150 / 2) * (1 + .03) -> (75)*(1.03) = 77.25
                 * Nota: .03 por la division entre 100 que se realiza antes
                 */
                this.datosTab1.precio5 =  (this.datosTab1.preciocompra / this.datosTab1.unidad) * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab1.precio5 = Math.round((this.datosTab1.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'precio5'}}
                this.revisaPreciosventa(x);
    
                break;
          }
  
          case "porcentaje4" : {
                
                this.datosTab1.precio4 =  (this.datosTab1.preciocompra / this.datosTab1.unidad) * (1+inputValue);
                this.datosTab1.precio4 = Math.round((this.datosTab1.precio4 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'precio4'}}
                this.revisaPreciosventa(x);
            break;
          }
  
          case "porcentaje3" : {
                this.datosTab1.precio3 =  (this.datosTab1.preciocompra / this.datosTab1.unidad) * (1+inputValue);
                this.datosTab1.precio3 = Math.round((this.datosTab1.precio3 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'precio3'}}
                this.revisaPreciosventa(x);
            break;
          }
  
          case "porcentaje2" : {
                this.datosTab1.precio2 =  (this.datosTab1.preciocompra / this.datosTab1.unidad) * (1+inputValue);
                this.datosTab1.precio2 = Math.round((this.datosTab1.precio2 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'precio2'}}
                this.revisaPreciosventa(x);
            break;
          }
  
          case "porcentaje1" : {
                this.datosTab1.precio1 =  (this.datosTab1.preciocompra / this.datosTab1.unidad) * (1+inputValue);
                this.datosTab1.precio1 = Math.round((this.datosTab1.precio1 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'precio1'}}
                this.revisaPreciosventa(x);
            break;
          }
  
        }//fin switch
      }//fin else datosTab1.unidad <=0
    }//fin else inputValue <= 0
  }//fin calculaMonto()

  /******************** TAB2 ********************/

  /**
   * Calcula el porcentaje del precio ingresado
   * @param e 
   * Recibimos el evento (change) y accedemos a sus propiedades
   * para extraer el id y saber que input modificamos
   */
  tab2calculaPorcentaje(e:any){
    //capturamos el id
    let inputId = e.target.id;

    //Antes de ingresar verificamos el precio esta permitido
    //Si es verdadero continuamos y que el campo unidad sea mayor a 0
    if(this.tab2revisaPreciosventa(e) && this.datosTab1.unidad > 0 && this.datosTab2.unidad > 0){
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20
       * medidaMenor = 1*20 -> medidaMenor = 20
       * datosTab2.preciocompra = 500/20  -> datosTab2.preciocompra = 25
       * 
       * 25 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab2.preciocompra = this.datosTab1.preciocompra / medidaMenor;
      this.datosTab2.preciocompra = Math.round((this.datosTab2.preciocompra + Number.EPSILON) * 100 ) / 100 ;
      /**
       * De acuerdo al valor obtenido del input, ingresamos
       * al caso correspondiente
       */
      switch (inputId){

        case "tab2precio5" : {
              /**
               * Realizamos el calculo del porcentaje : le restamos al precio nuevo (precio5) el precio anterior (precio compra)
               * y el resultado lo dividimos entre el precio  anterior (precio compra)
               * Por ultimo lo multiplicamos por 100
               */
              this.datosTab2.porcentaje5 = ((this.datosTab2.precio5 - this.datosTab2.preciocompra) / this.datosTab2.preciocompra) * 100 ;
              //Redondeamos el resultado a 2 decimales
              this.datosTab2.porcentaje5 = Math.round((this.datosTab2.porcentaje5 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab2.porcentaje5 < 0){
                //recreamos los parametros del evento
                let x = {target:{id:'tab2porcentaje5'}}
                //mandamos a la funcion calcula monto
                this.tab2calculaMonto(x);
              }
              break;
        }
        case "tab2precio4" : {
              this.datosTab2.porcentaje4 = ((this.datosTab2.precio4 - this.datosTab2.preciocompra) / this.datosTab2.preciocompra) * 100 ;
              
              this.datosTab2.porcentaje4 = Math.round((this.datosTab2.porcentaje4 + Number.EPSILON) * 100 ) / 100 ;

              if(this.datosTab2.porcentaje4 < 0){
                let x = {target:{id:'tab2porcentaje4'}}
                this.tab2calculaMonto(x);
              }
          break;
        }
        case "tab2precio3" : {
              this.datosTab2.porcentaje3 = ((this.datosTab2.precio3 - this.datosTab2.preciocompra) / this.datosTab2.preciocompra) * 100 ;
              
              this.datosTab2.porcentaje3 = Math.round((this.datosTab2.porcentaje3 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab2.porcentaje3 < 0){
                let x = {target:{id:'tab2porcentaje3'}}
                this.tab2calculaMonto(x);
              }
          break;
        }
        case "tab2precio2" : {
              this.datosTab2.porcentaje2 = ((this.datosTab2.precio2 - this.datosTab2.preciocompra) / this.datosTab2.preciocompra) * 100 ;
              
              this.datosTab2.porcentaje2 = Math.round((this.datosTab2.porcentaje2 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab2.porcentaje2 < 0){
                let x = {target:{id:'tab2porcentaje2'}}
                this.tab2calculaMonto(x);
              }
          break;
        }
        case "tab2precio1" : {
              this.datosTab2.porcentaje1 = ((this.datosTab2.precio1 - this.datosTab2.preciocompra) / this.datosTab2.preciocompra) * 100 ;
              
              this.datosTab2.porcentaje1 = Math.round((this.datosTab2.porcentaje1 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab2.porcentaje1 < 0){
                let x = {target:{id:'tab2porcentaje1'}}
                this.tab2calculaMonto(x);
              }
          break;
        }
      }
    }//fin if
  }

  /**
   * Revisa los precios ingresados desde precio5 a precio1
   * y manda una alerta si el precio ingresado es menor al anterior
   * @param e 
   * Recibimos evento de un (change)
   */
  tab2revisaPreciosventa(e:any){
    /**
     * Tomamos del evento change el id del input modificado
     */
    let inputId = e.target.id;
    
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0){
      this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      return false;
    } else{
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20
       * medidaMenor = 1*20 -> medidaMenor = 20
       * datosTab2.preciocompra = 500/20  -> datosTab2.preciocompra = 25
       * 
       * 25 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab2.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab2.preciocompra = Math.round((this.datosTab2.preciocompra + Number.EPSILON) * 100 ) / 100 ;
      switch (inputId) {
        case "tab2precio5": {

            /**
             * Comparamos el precio ingresdo con el precio anterior
             * en este caso precio compra y si es menor mandamos una alerta
             */
            if(this.datosTab2.precio5 < this.datosTab2.preciocompra){
              this.toastService.show('El precio 5 no pueder ser menor al precio de compra: '+this.datosTab2.preciocompra, { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab2.precio5 = this.datosTab2.preciocompra;
              this.datosTab2.porcentaje5 = 0;
              return false;
            } 
            return true;
            break;
        }

        case "tab2precio4": {

            if(this.datosTab2.precio4 < this.datosTab2.precio5){
              this.toastService.show('El precio 4 no pueder ser menor que el precio 5', { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab2.precio4 = this.datosTab2.preciocompra;
              this.datosTab2.porcentaje4 = 0;
              return false;
            }
              return true;
            break;
        }

        case "tab2precio3": {

          if(this.datosTab2.precio3 < this.datosTab2.precio4){
            this.toastService.show('El precio 3 no pueder ser menor que el precio 4', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab2.precio3 = this.datosTab2.preciocompra;
            this.datosTab2.porcentaje3 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab2precio2": {

          if(this.datosTab2.precio2 < this.datosTab2.precio3){
            this.toastService.show('El precio 2 no pueder ser menor que el precio 3', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab2.precio2 = this.datosTab1.preciocompra;
            this.datosTab2.porcentaje2 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab2precio1": {

          if(this.datosTab2.precio1 < this.datosTab2.precio2){
            this.toastService.show('El precio 1 no pueder ser menor que el precio 2', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab2.precio1 = this.datosTab1.preciocompra;
            this.datosTab2.porcentaje1 = 0;
              return false;
          } 
            return true;
          break;
        }
        default:{
          return false;
          break;
        }
      }
    }//fin else
  }

  /**
   * Calcula el monto (precioX) de acuerdo
   * al porcentaje ingresado
   * @param e 
   * Recibimos el evento de un (keyup)
   */
  tab2calculaMonto(e:any){
    let inputId = e.target.id
    /**
    * Obtenemos el valor del input y lo convertimos a Float
    * luego lo dividimos entre 100 para obtener su porcentaje
    */
    var inputValue  = parseFloat((<HTMLInputElement>document.getElementById(inputId)).value) / 100;

    //Obtenemos medida menor multiplicando las unidades
    var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad;
    /**
     * obtenemos precio compra de la medida dividiendo el precio compra
     * de la primera medida entre el valor de la medidaMenor
     * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20
     * medidaMenor = 1*20 -> medidaMenor = 20
     * datosTab2.preciocompra = 500/20  -> datosTab2.preciocompra = 25
     * 
     * 25 es el preciocompra de esta medida
     * 
     */
    
    this.datosTab2.preciocompra = this.datosTab1.preciocompra / medidaMenor
    this.datosTab2.preciocompra = Math.round((this.datosTab2.preciocompra + Number.EPSILON) * 100 ) / 100 ;

    /**
     * revisamos que el porcentaje no sea menor o igual a cero
     * Si es asi mandamos una alerta
     */
    if(inputValue <= 0){

      this.toastService.show('No puedes ingresar porcentajes negativos ', { classname: 'bg-danger text-light',delay: 5000 });
      switch(inputId){
        case "tab2porcentaje5":
              this.datosTab2.precio5 = this.datosTab2.preciocompra;
              this.datosTab2.porcentaje5 = 0;
          break;
        case "tab2porcentaje4":
              this.datosTab2.precio4 = this.datosTab2.preciocompra;
              this.datosTab2.porcentaje4 = 0;
          break;
        case "tab2porcentaje3":
              this.datosTab2.precio3 = this.datosTab2.preciocompra;
              this.datosTab2.porcentaje3 = 0;
          break;
        case "tab2porcentaje2":
            this.datosTab2.precio2 = this.datosTab2.preciocompra;
            this.datosTab2.porcentaje2 = 0;
          break;
        case "tab2porcentaje1":
            this.datosTab2.precio1 = this.datosTab2.preciocompra;
            this.datosTab2.porcentaje1 = 0;
          break;
      }

    } else{

      if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0){
        this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      } else{
        switch (inputId){
          case "tab2porcentaje5" : {
                /**
                 * Dividimos el preciocompra entre la unidad
                 * Luego multiplicamos el resultado y por el valor del inputValue mas 1
                 * ejem: inputValue = .03 , preciocompra = 150 , unidad = 2
                 *  (150 / 2) * (1 + .03) -> (75)*(1.03) = 77.25
                 * Nota: .03 por la division entre 100 que se realiza antes
                 */
                this.datosTab2.precio5 =  this.datosTab2.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab2.precio5 = Math.round((this.datosTab2.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab2precio5'}}
                this.tab2revisaPreciosventa(x);
    
                break;
          }
  
          case "tab2porcentaje4" : {
                
                this.datosTab2.precio4 =  this.datosTab2.preciocompra * (1+inputValue);
                this.datosTab2.precio4 = Math.round((this.datosTab2.precio4 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab2precio4'}}
                this.tab2revisaPreciosventa(x);
            break;
          }
  
          case "tab2porcentaje3" : {
                this.datosTab2.precio3 =  this.datosTab2.preciocompra * (1+inputValue);
                this.datosTab2.precio3 = Math.round((this.datosTab2.precio3 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab2precio3'}}
                this.tab2revisaPreciosventa(x);
            break;
          }
  
          case "tab2porcentaje2" : {
                this.datosTab2.precio2 =  this.datosTab2.preciocompra * (1+inputValue);
                this.datosTab2.precio2 = Math.round((this.datosTab2.precio2 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab2precio2'}}
                this.tab2revisaPreciosventa(x);
            break;
          }
  
          case "tab2porcentaje1" : {
                this.datosTab2.precio1 =  this.datosTab2.preciocompra * (1+inputValue);
                this.datosTab2.precio1 = Math.round((this.datosTab2.precio1 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab2precio1'}}
                this.tab2revisaPreciosventa(x);
            break;
          }
  
        }//fin switch
      }//fin else datosTab1.unidad <=0
    }//fin else inputValue <= 0
  }//fin calculaMonto()

  /**
   * Copia los porcentajes de la tabla anterior
   * y los ingresa en la tabla del check y calcula su porcentaje
   * @param nomPorcentaje string
   */
  tab2calculaMontoCheck(nomPorcentaje:string){
    //Revisamos si las unidades no sean iguales o menores a cero
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0){
      //Si es correcto mandamos alerta y no hacemos nada
      this.toastService.show('Las unidades no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
    } else{
      //Si las unidades estan bien Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20
       * medidaMenor = 1*20 -> medidaMenor = 20
       * datosTab2.preciocompra = 500/20  -> datosTab2.preciocompra = 25
       * 
       * 25 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab2.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab2.preciocompra = Math.round((this.datosTab2.preciocompra + Number.EPSILON) * 100 ) / 100 ;
      // revisamos que porcentaje vamos a calcular
      switch(nomPorcentaje){
        case 'tab2porcentaje5':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab2.porcentaje5 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab2.porcentaje5 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 5 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab2.precio5 = this.datosTab2.preciocompra;
                this.datosTab2.porcentaje5 = 0;
            } else{
                /**  Si todo es correcto realizamos  operacion
                   * Multiplicamos el precioCompra por el valor del inputValue mas 1
                   * ejem: inputValue = .03 , preciocompra = 150
                   *  (150) * (1 + .03) -> (150)*(1.03) = 154.5
                   * Nota: .03 por la division entre 100 que se realiza al inputValue
                   */
                let inputValue = this.datosTab2.porcentaje5/100;
                this.datosTab2.precio5 =  this.datosTab2.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab2.precio5 = Math.round((this.datosTab2.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab2precio5'}}
                this.tab2revisaPreciosventa(x);
            }
          break;
        case 'tab2porcentaje4':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab2.porcentaje4 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab2.porcentaje4 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 4 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab2.precio4 = this.datosTab2.preciocompra;
                this.datosTab2.porcentaje4 = 0;
            } else{
                let inputValue = this.datosTab2.porcentaje4/100;
                this.datosTab2.precio4 =  this.datosTab2.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab2.precio4 = Math.round((this.datosTab2.precio4 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab2precio4'}}
                this.tab2revisaPreciosventa(x);
            }
          break;
        case 'tab2porcentaje3':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab2.porcentaje3 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab2.porcentaje3 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 3 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab2.precio3 = this.datosTab2.preciocompra;
                this.datosTab2.porcentaje3 = 0;
            } else{
                let inputValue = this.datosTab2.porcentaje3/100;
                this.datosTab2.precio3 =  this.datosTab2.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab2.precio3 = Math.round((this.datosTab2.precio3 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab2precio3'}}
                this.tab2revisaPreciosventa(x);
            }
          break;
        case 'tab2porcentaje2':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab2.porcentaje2 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab2.porcentaje2 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 2 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab2.precio2 = this.datosTab2.preciocompra;
                this.datosTab2.porcentaje2 = 0;
            } else{
                let inputValue = this.datosTab2.porcentaje2/100;
                this.datosTab2.precio2 =  this.datosTab2.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab2.precio2 = Math.round((this.datosTab2.precio2 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab2precio2'}}
                this.tab2revisaPreciosventa(x);
            }
          break;
        case 'tab2porcentaje1':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab2.porcentaje1 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab2.porcentaje1 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 1 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab2.precio1 = this.datosTab2.preciocompra;
                this.datosTab2.porcentaje1 = 0;
            } else{
                let inputValue = this.datosTab2.porcentaje1/100;
                this.datosTab2.precio1 =  this.datosTab2.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab2.precio1 = Math.round((this.datosTab2.precio1 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab2precio1'}}
                this.tab2revisaPreciosventa(x);
            }
          break;
      }
    }
  }

  /******************** TAB3 ********************/

  /**
   * Calcula el porcentaje del precio ingresado
   * @param e 
   * Recibimos el evento (change) y accedemos a sus propiedades
   * para extraer el id y saber que input modificamos
   */
  tab3calculaPorcentaje(e:any){
    //capturamos el id
    let inputId = e.target.id;

    //Antes de ingresar verificamos el precio esta permitido
    //Si es verdadero continuamos y que el campo unidad sea mayor a 0
    if(this.tab3revisaPreciosventa(e) && this.datosTab1.unidad > 0 && this.datosTab2.unidad > 0
                                      && this.datosTab3.unidad > 0){
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
       * medidaMenor = 1*20*50 -> medidaMenor = 1000
       * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
       * 
       * 4 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab3.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab3.preciocompra = Math.round((this.datosTab3.preciocompra + Number.EPSILON) * 100 ) / 100;
      /**
       * De acuerdo al valor obtenido del input, ingresamos
       * al caso correspondiente
       */
      switch (inputId){

        case "tab3precio5" : {
              /**
               * Realizamos el calculo del porcentaje : le restamos al precio nuevo (precio5) el precio anterior (precio compra)
               * y el resultado lo dividimos entre el precio  anterior (precio compra)
               * Por ultimo lo multiplicamos por 100
               */
              this.datosTab3.porcentaje5 = ((this.datosTab3.precio5 - this.datosTab3.preciocompra) / this.datosTab3.preciocompra) * 100 ;
              //Redondeamos el resultado a 2 decimales
              this.datosTab3.porcentaje5 = Math.round((this.datosTab3.porcentaje5 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab3.porcentaje5 < 0){
                //recreamos los parametros del evento
                let x = {target:{id:'tab3porcentaje5'}}
                //mandamos a la funcion calcula monto
                this.tab3calculaMonto(x);
              }
              break;
        }
        case "tab3precio4" : {
              this.datosTab3.porcentaje4 = ((this.datosTab3.precio4 - this.datosTab3.preciocompra) / this.datosTab3.preciocompra) * 100 ;
              
              this.datosTab3.porcentaje4 = Math.round((this.datosTab3.porcentaje4 + Number.EPSILON) * 100 ) / 100 ;

              if(this.datosTab3.porcentaje4 < 0){
                let x = {target:{id:'tab3porcentaje4'}}
                this.tab3calculaMonto(x);
              }
          break;
        }
        case "tab3precio3" : {
              this.datosTab3.porcentaje3 = ((this.datosTab3.precio3 - this.datosTab3.preciocompra) / this.datosTab3.preciocompra) * 100 ;
              
              this.datosTab3.porcentaje3 = Math.round((this.datosTab3.porcentaje3 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab3.porcentaje3 < 0){
                let x = {target:{id:'tab3porcentaje3'}}
                this.tab3calculaMonto(x);
              }
          break;
        }
        case "tab3precio2" : {
              this.datosTab3.porcentaje2 = ((this.datosTab3.precio2 - this.datosTab3.preciocompra) / this.datosTab3.preciocompra) * 100 ;
              
              this.datosTab3.porcentaje2 = Math.round((this.datosTab3.porcentaje2 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab3.porcentaje2 < 0){
                let x = {target:{id:'tab3porcentaje2'}}
                this.tab3calculaMonto(x);
              }
          break;
        }
        case "tab3precio1" : {
              this.datosTab3.porcentaje1 = ((this.datosTab3.precio1 - this.datosTab3.preciocompra) / this.datosTab3.preciocompra) * 100 ;
              
              this.datosTab3.porcentaje1 = Math.round((this.datosTab3.porcentaje1 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab3.porcentaje1 < 0){
                let x = {target:{id:'tab3porcentaje1'}}
                this.tab3calculaMonto(x);
              }
          break;
        }
      }
    }//fin if
  }

  /**
   * Revisa los precios ingresados desde precio5 a precio1
   * y manda una alerta si el precio ingresado es menor al anterior
   * @param e 
   * Recibimos evento de un (change)
   */
  tab3revisaPreciosventa(e:any){
    /**
     * Tomamos del evento change el id del input modificado
     */
    let inputId = e.target.id;
    
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0){
      this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      return false;
    } else{
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
       * medidaMenor = 1*20*50 -> medidaMenor = 1000
       * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
       * 
       * 4 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab3.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab3.preciocompra = Math.round((this.datosTab3.preciocompra + Number.EPSILON) * 100 ) / 100;
      switch (inputId) {
        case "tab3precio5": {

            /**
             * Comparamos el precio ingresdo con el precio anterior
             * en este caso precio compra y si es menor mandamos una alerta
             */
            if(this.datosTab3.precio5 < this.datosTab3.preciocompra){
              this.toastService.show('El precio 5 no pueder ser menor al precio de compra: '+this.datosTab3.preciocompra, { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab3.precio5 = this.datosTab3.preciocompra;
              this.datosTab3.porcentaje5 = 0;
              return false;
            } 
            return true;
            break;
        }

        case "tab3precio4": {

            if(this.datosTab3.precio4 < this.datosTab3.precio5){
              this.toastService.show('El precio 4 no pueder ser menor que el precio 5', { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab3.precio4 = this.datosTab3.preciocompra;
              this.datosTab3.porcentaje4 = 0;
              return false;
            }
              return true;
            break;
        }

        case "tab3precio3": {

          if(this.datosTab3.precio3 < this.datosTab3.precio4){
            this.toastService.show('El precio 3 no pueder ser menor que el precio 4', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab3.precio3 = this.datosTab3.preciocompra;
            this.datosTab3.porcentaje3 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab3precio2": {

          if(this.datosTab3.precio2 < this.datosTab3.precio3){
            this.toastService.show('El precio 2 no pueder ser menor que el precio 3', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab3.precio2 = this.datosTab3.preciocompra;
            this.datosTab3.porcentaje2 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab3precio1": {

          if(this.datosTab3.precio1 < this.datosTab3.precio2){
            this.toastService.show('El precio 1 no pueder ser menor que el precio 2', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab3.precio1 = this.datosTab3.preciocompra;
            this.datosTab3.porcentaje1 = 0;
              return false;
          } 
            return true;
          break;
        }
        default:{
          return false;
          break;
        }
      }
    }//fin else
  }

  /**
   * Calcula el monto (precioX) de acuerdo
   * al porcentaje ingresado
   * @param e 
   * Recibimos el evento de un (keyup)
   */
  tab3calculaMonto(e:any){
    let inputId = e.target.id
    /**
    * Obtenemos el valor del input y lo convertimos a Float
    * luego lo dividimos entre 100 para obtener su porcentaje
    */
    var inputValue  = parseFloat((<HTMLInputElement>document.getElementById(inputId)).value) / 100;

    //Obtenemos medida menor multiplicando las unidades
    var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad;
    /**
     * obtenemos precio compra de la medida dividiendo el precio compra
     * de la primera medida entre el valor de la medidaMenor
     * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
     * medidaMenor = 1*20*50 -> medidaMenor = 1000
     * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
     * 
     * 4 es el preciocompra de esta medida
     * 
     */
    
    this.datosTab3.preciocompra = this.datosTab1.preciocompra / medidaMenor
    this.datosTab3.preciocompra = Math.round((this.datosTab3.preciocompra + Number.EPSILON) * 100 ) / 100;

    /**
     * revisamos que el porcentaje no sea menor o igual a cero
     * Si es asi mandamos una alerta
     */
    if(inputValue <= 0){

      this.toastService.show('No puedes ingresar porcentajes negativos ', { classname: 'bg-danger text-light',delay: 5000 });
      switch(inputId){
        case "tab3porcentaje5":
              this.datosTab3.precio5 = this.datosTab3.preciocompra;
              this.datosTab3.porcentaje5 = 0;
          break;
        case "tab3porcentaje4":
              this.datosTab3.precio4 = this.datosTab3.preciocompra;
              this.datosTab3.porcentaje4 = 0;
          break;
        case "tab3porcentaje3":
              this.datosTab3.precio3 = this.datosTab3.preciocompra;
              this.datosTab3.porcentaje3 = 0;
          break;
        case "tab3porcentaje2":
            this.datosTab3.precio2 = this.datosTab3.preciocompra;
            this.datosTab3.porcentaje2 = 0;
          break;
        case "tab3porcentaje1":
            this.datosTab3.precio1 = this.datosTab3.preciocompra;
            this.datosTab3.porcentaje1 = 0;
          break;
      }

    } else{

      if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0){
        this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      } else{
        switch (inputId){
          case "tab3porcentaje5" : {
                /**
                 * Dividimos el preciocompra entre la unidad
                 * Luego multiplicamos el resultado y por el valor del inputValue mas 1
                 * ejem: inputValue = .03 , preciocompra = 150 , unidad = 2
                 *  (150 / 2) * (1 + .03) -> (75)*(1.03) = 77.25
                 * Nota: .03 por la division entre 100 que se realiza antes
                 */
                this.datosTab3.precio5 =  this.datosTab3.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab3.precio5 = Math.round((this.datosTab3.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab3precio5'}}
                this.tab3revisaPreciosventa(x);
    
                break;
          }
  
          case "tab3porcentaje4" : {
                
                this.datosTab3.precio4 =  this.datosTab3.preciocompra * (1+inputValue);
                this.datosTab3.precio4 = Math.round((this.datosTab3.precio4 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab3precio4'}}
                this.tab3revisaPreciosventa(x);
            break;
          }
  
          case "tab3porcentaje3" : {
                this.datosTab3.precio3 =  this.datosTab3.preciocompra * (1+inputValue);
                this.datosTab3.precio3 = Math.round((this.datosTab3.precio3 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab3precio3'}}
                this.tab3revisaPreciosventa(x);
            break;
          }
  
          case "tab3porcentaje2" : {
                this.datosTab3.precio2 =  this.datosTab3.preciocompra * (1+inputValue);
                this.datosTab3.precio2 = Math.round((this.datosTab3.precio2 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab3precio2'}}
                this.tab3revisaPreciosventa(x);
            break;
          }
  
          case "tab3porcentaje1" : {
                this.datosTab3.precio1 =  this.datosTab3.preciocompra * (1+inputValue);
                this.datosTab3.precio1 = Math.round((this.datosTab3.precio1 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab3precio1'}}
                this.tab3revisaPreciosventa(x);
            break;
          }
  
        }//fin switch
      }//fin else datosTab1.unidad <=0
    }//fin else inputValue <= 0
  }//fin calculaMonto()

  /**
   * Copia los porcentajes de la tabla anterior
   * y los ingresa en la tabla del check y calcula su porcentaje
   * @param nomPorcentaje string
   */
  tab3calculaMontoCheck(nomPorcentaje:string){
    //Revisamos si las unidades no sean iguales o menores a cero
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0){
      //Si es correcto mandamos alerta y no hacemos nada
      this.toastService.show('Las unidades no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
    } else{
      //Si las unidades estan bien Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20
       * medidaMenor = 1*20 -> medidaMenor = 20
       * datosTab2.preciocompra = 500/20  -> datosTab2.preciocompra = 25
       * 
       * 25 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab3.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab3.preciocompra = Math.round((this.datosTab3.preciocompra + Number.EPSILON) * 100 ) / 100 ;
      // revisamos que porcentaje vamos a calcular
      switch(nomPorcentaje){
        case 'tab3porcentaje5':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab3.porcentaje5 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab3.porcentaje5 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 5 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab3.precio5 = this.datosTab3.preciocompra;
                this.datosTab3.porcentaje5 = 0;
            } else{
                /**  Si todo es correcto realizamos  operacion
                   * Multiplicamos el precioCompra por el valor del inputValue mas 1
                   * ejem: inputValue = .03 , preciocompra = 150
                   *  (150) * (1 + .03) -> (150)*(1.03) = 154.5
                   * Nota: .03 por la division entre 100 que se realiza al inputValue
                   */
                let inputValue = this.datosTab3.porcentaje5/100;
                this.datosTab3.precio5 =  this.datosTab3.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab3.precio5 = Math.round((this.datosTab3.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab3precio5'}}
                this.tab3revisaPreciosventa(x);
            }
          break;
        case 'tab3porcentaje4':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab3.porcentaje4 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab3.porcentaje4 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 4 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab3.precio4 = this.datosTab3.preciocompra;
                this.datosTab3.porcentaje4 = 0;
            } else{
                let inputValue = this.datosTab3.porcentaje4/100;
                this.datosTab3.precio4 =  this.datosTab3.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab3.precio4 = Math.round((this.datosTab3.precio4 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab3precio4'}}
                this.tab3revisaPreciosventa(x);
            }
          break;
        case 'tab3porcentaje3':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab3.porcentaje3 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab3.porcentaje3 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 3 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab3.precio3 = this.datosTab3.preciocompra;
                this.datosTab3.porcentaje3 = 0;
            } else{
                let inputValue = this.datosTab3.porcentaje3/100;
                this.datosTab3.precio3 =  this.datosTab3.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab3.precio3 = Math.round((this.datosTab3.precio3 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab3precio3'}}
                this.tab3revisaPreciosventa(x);
            }
          break;
        case 'tab3porcentaje2':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab3.porcentaje2 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab3.porcentaje2 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 2 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab3.precio2 = this.datosTab3.preciocompra;
                this.datosTab3.porcentaje2 = 0;
            } else{
                let inputValue = this.datosTab3.porcentaje2/100;
                this.datosTab3.precio2 =  this.datosTab3.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab3.precio2 = Math.round((this.datosTab3.precio2 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab3precio2'}}
                this.tab3revisaPreciosventa(x);
            }
          break;
        case 'tab3porcentaje1':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab3.porcentaje1 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab3.porcentaje1 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 1 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab3.precio1 = this.datosTab3.preciocompra;
                this.datosTab3.porcentaje1 = 0;
            } else{
                let inputValue = this.datosTab3.porcentaje1/100;
                this.datosTab3.precio1 =  this.datosTab3.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab3.precio1 = Math.round((this.datosTab3.precio1 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab3precio1'}}
                this.tab3revisaPreciosventa(x);
            }
          break;
      }//Fin switch
    }//fin else
  }

  /******************** TAB4 ********************/

  /**
   * Calcula el porcentaje del precio ingresado
   * @param e 
   * Recibimos el evento (change) y accedemos a sus propiedades
   * para extraer el id y saber que input modificamos
   */
  tab4calculaPorcentaje(e:any){
    //capturamos el id
    let inputId = e.target.id;

    //Antes de ingresar verificamos el precio esta permitido
    //Si es verdadero continuamos y que el campo unidad sea mayor a 0
    if(this.tab4revisaPreciosventa(e) && this.datosTab1.unidad > 0 && this.datosTab2.unidad > 0
                                      && this.datosTab3.unidad > 0 && this.datosTab4.unidad > 0){
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
       * medidaMenor = 1*20*50 -> medidaMenor = 1000
       * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
       * 
       * 4 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab4.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab4.preciocompra = Math.round((this.datosTab4.preciocompra + Number.EPSILON) * 100 ) / 100;
      /**
       * De acuerdo al valor obtenido del input, ingresamos
       * al caso correspondiente
       */
      switch (inputId){

        case "tab4precio5" : {
              /**
               * Realizamos el calculo del porcentaje : le restamos al precio nuevo (precio5) el precio anterior (precio compra)
               * y el resultado lo dividimos entre el precio  anterior (precio compra)
               * Por ultimo lo multiplicamos por 100
               */
              this.datosTab4.porcentaje5 = ((this.datosTab4.precio5 - this.datosTab4.preciocompra) / this.datosTab4.preciocompra) * 100 ;
              //Redondeamos el resultado a 2 decimales
              this.datosTab4.porcentaje5 = Math.round((this.datosTab4.porcentaje5 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab4.porcentaje5 < 0){
                //recreamos los parametros del evento
                let x = {target:{id:'tab4porcentaje5'}}
                //mandamos a la funcion calcula monto
                this.tab4calculaMonto(x);
              }
              break;
        }
        case "tab4precio4" : {
              this.datosTab4.porcentaje4 = ((this.datosTab4.precio4 - this.datosTab4.preciocompra) / this.datosTab4.preciocompra) * 100 ;
              
              this.datosTab4.porcentaje4 = Math.round((this.datosTab4.porcentaje4 + Number.EPSILON) * 100 ) / 100 ;

              if(this.datosTab4.porcentaje4 < 0){
                let x = {target:{id:'tab4porcentaje4'}}
                this.tab4calculaMonto(x);
              }
          break;
        }
        case "tab4precio3" : {
              this.datosTab4.porcentaje3 = ((this.datosTab4.precio3 - this.datosTab4.preciocompra) / this.datosTab4.preciocompra) * 100 ;
              
              this.datosTab4.porcentaje3 = Math.round((this.datosTab4.porcentaje3 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab4.porcentaje3 < 0){
                let x = {target:{id:'tab4porcentaje3'}}
                this.tab4calculaMonto(x);
              }
          break;
        }
        case "tab4precio2" : {
              this.datosTab4.porcentaje2 = ((this.datosTab4.precio2 - this.datosTab4.preciocompra) / this.datosTab4.preciocompra) * 100 ;
              
              this.datosTab4.porcentaje2 = Math.round((this.datosTab4.porcentaje2 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab4.porcentaje2 < 0){
                let x = {target:{id:'tab4porcentaje2'}}
                this.tab4calculaMonto(x);
              }
          break;
        }
        case "tab4precio1" : {
              this.datosTab4.porcentaje1 = ((this.datosTab4.precio1 - this.datosTab4.preciocompra) / this.datosTab4.preciocompra) * 100 ;
              
              this.datosTab4.porcentaje1 = Math.round((this.datosTab4.porcentaje1 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab4.porcentaje1 < 0){
                let x = {target:{id:'tab4porcentaje1'}}
                this.tab4calculaMonto(x);
              }
          break;
        }
      }
    }//fin if
  }

  /**
   * Revisa los precios ingresados desde precio5 a precio1
   * y manda una alerta si el precio ingresado es menor al anterior
   * @param e 
   * Recibimos evento de un (change)
   */
  tab4revisaPreciosventa(e:any){
    /**
     * Tomamos del evento change el id del input modificado
     */
    let inputId = e.target.id;
    
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0 || this.datosTab4.unidad <= 0){
      this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      return false;
    } else{
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
       * medidaMenor = 1*20*50 -> medidaMenor = 1000
       * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
       * 
       * 4 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab4.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab4.preciocompra = Math.round((this.datosTab4.preciocompra + Number.EPSILON) * 100 ) / 100;
      switch (inputId) {
        case "tab4precio5": {

            /**
             * Comparamos el precio ingresdo con el precio anterior
             * en este caso precio compra y si es menor mandamos una alerta
             */
            if(this.datosTab4.precio5 < this.datosTab4.preciocompra){
              this.toastService.show('El precio 5 no pueder ser menor al precio de compra: '+this.datosTab4.preciocompra, { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab4.precio5 = this.datosTab4.preciocompra;
              this.datosTab4.porcentaje5 = 0;
              return false;
            } 
            return true;
            break;
        }

        case "tab4precio4": {

            if(this.datosTab4.precio4 < this.datosTab4.precio5){
              this.toastService.show('El precio 4 no pueder ser menor que el precio 5', { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab4.precio4 = this.datosTab4.preciocompra;
              this.datosTab4.porcentaje4 = 0;
              return false;
            }
              return true;
            break;
        }

        case "tab4precio3": {

          if(this.datosTab4.precio3 < this.datosTab4.precio4){
            this.toastService.show('El precio 3 no pueder ser menor que el precio 4', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab4.precio3 = this.datosTab4.preciocompra;
            this.datosTab4.porcentaje3 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab4precio2": {

          if(this.datosTab4.precio2 < this.datosTab4.precio3){
            this.toastService.show('El precio 2 no pueder ser menor que el precio 3', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab4.precio2 = this.datosTab4.preciocompra;
            this.datosTab4.porcentaje2 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab4precio1": {

          if(this.datosTab4.precio1 < this.datosTab4.precio2){
            this.toastService.show('El precio 1 no pueder ser menor que el precio 2', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab4.precio1 = this.datosTab4.preciocompra;
            this.datosTab4.porcentaje1 = 0;
              return false;
          } 
            return true;
          break;
        }
        default:{
          return false;
          break;
        }
      }
    }//fin else
  }

  /**
   * Calcula el monto (precioX) de acuerdo
   * al porcentaje ingresado
   * @param e 
   * Recibimos el evento de un (keyup)
   */
  tab4calculaMonto(e:any){
    let inputId = e.target.id
    /**
    * Obtenemos el valor del input y lo convertimos a Float
    * luego lo dividimos entre 100 para obtener su porcentaje
    */
    var inputValue  = parseFloat((<HTMLInputElement>document.getElementById(inputId)).value) / 100;

    //Obtenemos medida menor multiplicando las unidades
    var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad;
    /**
     * obtenemos precio compra de la medida dividiendo el precio compra
     * de la primera medida entre el valor de la medidaMenor
     * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
     * medidaMenor = 1*20*50 -> medidaMenor = 1000
     * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
     * 
     * 4 es el preciocompra de esta medida
     * 
     */
    
    this.datosTab4.preciocompra = this.datosTab1.preciocompra / medidaMenor
    this.datosTab4.preciocompra = Math.round((this.datosTab4.preciocompra + Number.EPSILON) * 100 ) / 100;

    /**
     * revisamos que el porcentaje no sea menor o igual a cero
     * Si es asi mandamos una alerta
     */
    if(inputValue <= 0){

      this.toastService.show('No puedes ingresar porcentajes negativos ', { classname: 'bg-danger text-light',delay: 5000 });
      switch(inputId){
        case "tab4porcentaje5":
              this.datosTab4.precio5 = this.datosTab4.preciocompra;
              this.datosTab4.porcentaje5 = 0;
          break;
        case "tab4porcentaje4":
              this.datosTab4.precio4 = this.datosTab4.preciocompra;
              this.datosTab4.porcentaje4 = 0;
          break;
        case "tab4porcentaje3":
              this.datosTab4.precio3 = this.datosTab4.preciocompra;
              this.datosTab4.porcentaje3 = 0;
          break;
        case "tab4porcentaje2":
            this.datosTab4.precio2 = this.datosTab4.preciocompra;
            this.datosTab4.porcentaje2 = 0;
          break;
        case "tab4porcentaje1":
            this.datosTab4.precio1 = this.datosTab4.preciocompra;
            this.datosTab4.porcentaje1 = 0;
          break;
      }

    } else{

      if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0 || this.datosTab4.unidad <=0 ){
        this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      } else{
        switch (inputId){
          case "tab4porcentaje5" : {
                /**
                 * Dividimos el preciocompra entre la unidad
                 * Luego multiplicamos el resultado y por el valor del inputValue mas 1
                 * ejem: inputValue = .03 , preciocompra = 150 , unidad = 2
                 *  (150 / 2) * (1 + .03) -> (75)*(1.03) = 77.25
                 * Nota: .03 por la division entre 100 que se realiza antes
                 */
                this.datosTab4.precio5 =  this.datosTab4.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab4.precio5 = Math.round((this.datosTab4.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab4precio5'}}
                this.tab4revisaPreciosventa(x);
    
                break;
          }
  
          case "tab4porcentaje4" : {
                
                this.datosTab4.precio4 =  this.datosTab4.preciocompra * (1+inputValue);
                this.datosTab4.precio4 = Math.round((this.datosTab4.precio4 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab4precio4'}}
                this.tab4revisaPreciosventa(x);
            break;
          }
  
          case "tab4porcentaje3" : {
                this.datosTab4.precio3 =  this.datosTab4.preciocompra * (1+inputValue);
                this.datosTab4.precio3 = Math.round((this.datosTab4.precio3 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab4precio3'}}
                this.tab4revisaPreciosventa(x);
            break;
          }
  
          case "tab4porcentaje2" : {
                this.datosTab4.precio2 =  this.datosTab4.preciocompra * (1+inputValue);
                this.datosTab4.precio2 = Math.round((this.datosTab4.precio2 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab4precio2'}}
                this.tab4revisaPreciosventa(x);
            break;
          }
  
          case "tab4porcentaje1" : {
                this.datosTab4.precio1 =  this.datosTab4.preciocompra * (1+inputValue);
                this.datosTab4.precio1 = Math.round((this.datosTab4.precio1 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab4precio1'}}
                this.tab4revisaPreciosventa(x);
            break;
          }
  
        }//fin switch
      }//fin else datosTab1.unidad <=0
    }//fin else inputValue <= 0
  }//fin calculaMonto()

  /**
   * Copia los porcentajes de la tabla anterior
   * y los ingresa en la tabla del check y calcula su porcentaje
   * @param nomPorcentaje string
   */
  tab4calculaMontoCheck(nomPorcentaje:string){
    //Revisamos si las unidades no sean iguales o menores a cero
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0 || this.datosTab4.unidad <= 0){
      //Si es correcto mandamos alerta y no hacemos nada
      this.toastService.show('Las unidades no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
    } else{
      //Si las unidades estan bien Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20
       * medidaMenor = 1*20 -> medidaMenor = 20
       * datosTab2.preciocompra = 500/20  -> datosTab2.preciocompra = 25
       * 
       * 25 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab4.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab4.preciocompra = Math.round((this.datosTab4.preciocompra + Number.EPSILON) * 100 ) / 100 ;
      // revisamos que porcentaje vamos a calcular
      switch(nomPorcentaje){
        case 'tab4porcentaje5':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab4.porcentaje5 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab4.porcentaje5 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 5 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab4.precio5 = this.datosTab4.preciocompra;
                this.datosTab4.porcentaje5 = 0;
            } else{
                /**  Si todo es correcto realizamos  operacion
                   * Multiplicamos el precioCompra por el valor del inputValue mas 1
                   * ejem: inputValue = .03 , preciocompra = 150
                   *  (150) * (1 + .03) -> (150)*(1.03) = 154.5
                   * Nota: .03 por la division entre 100 que se realiza al inputValue
                   */
                let inputValue = this.datosTab4.porcentaje5/100;
                this.datosTab4.precio5 =  this.datosTab4.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab4.precio5 = Math.round((this.datosTab4.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab4precio5'}}
                this.tab4revisaPreciosventa(x);
            }
          break;
        case 'tab4porcentaje4':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab4.porcentaje4 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab4.porcentaje4 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 4 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab4.precio4 = this.datosTab4.preciocompra;
                this.datosTab4.porcentaje4 = 0;
            } else{
                let inputValue = this.datosTab4.porcentaje4/100;
                this.datosTab4.precio4 =  this.datosTab4.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab4.precio4 = Math.round((this.datosTab4.precio4 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab4precio4'}}
                this.tab4revisaPreciosventa(x);
            }
          break;
        case 'tab4porcentaje3':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab4.porcentaje3 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab4.porcentaje3 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 3 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab4.precio3 = this.datosTab4.preciocompra;
                this.datosTab4.porcentaje3 = 0;
            } else{
                let inputValue = this.datosTab4.porcentaje3/100;
                this.datosTab4.precio3 =  this.datosTab4.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab4.precio3 = Math.round((this.datosTab4.precio3 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab4precio3'}}
                this.tab4revisaPreciosventa(x);
            }
          break;
        case 'tab4porcentaje2':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab4.porcentaje2 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab4.porcentaje2 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 2 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab4.precio2 = this.datosTab4.preciocompra;
                this.datosTab4.porcentaje2 = 0;
            } else{
                let inputValue = this.datosTab4.porcentaje2/100;
                this.datosTab4.precio2 =  this.datosTab4.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab4.precio2 = Math.round((this.datosTab4.precio2 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab4precio2'}}
                this.tab4revisaPreciosventa(x);
            }
          break;
        case 'tab4porcentaje1':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab4.porcentaje1 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab4.porcentaje1 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 1 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab4.precio1 = this.datosTab4.preciocompra;
                this.datosTab4.porcentaje1 = 0;
            } else{
                let inputValue = this.datosTab4.porcentaje1/100;
                this.datosTab4.precio1 =  this.datosTab4.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab4.precio1 = Math.round((this.datosTab4.precio1 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab4precio1'}}
                this.tab4revisaPreciosventa(x);
            }
          break;
      }//Fin switch
    }//fin else
  }

  /******************** TAB5 ********************/

  /**
   * Calcula el porcentaje del precio ingresado
   * @param e 
   * Recibimos el evento (change) y accedemos a sus propiedades
   * para extraer el id y saber que input modificamos
   */
  tab5calculaPorcentaje(e:any){
    //capturamos el id
    let inputId = e.target.id;

    //Antes de ingresar verificamos el precio esta permitido
    //Si es verdadero continuamos y que el campo unidad sea mayor a 0
    if(this.tab4revisaPreciosventa(e) && this.datosTab1.unidad > 0 && this.datosTab2.unidad > 0
                                      && this.datosTab3.unidad > 0 && this.datosTab4.unidad > 0 && this.datosTab5.unidad > 0){
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad * this.datosTab5.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
       * medidaMenor = 1*20*50 -> medidaMenor = 1000
       * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
       * 
       * 4 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab5.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab5.preciocompra = Math.round((this.datosTab5.preciocompra + Number.EPSILON) * 100 ) / 100;
      /**
       * De acuerdo al valor obtenido del input, ingresamos
       * al caso correspondiente
       */
      switch (inputId){

        case "tab5precio5" : {
              /**
               * Realizamos el calculo del porcentaje : le restamos al precio nuevo (precio5) el precio anterior (precio compra)
               * y el resultado lo dividimos entre el precio  anterior (precio compra)
               * Por ultimo lo multiplicamos por 100
               */
              this.datosTab5.porcentaje5 = ((this.datosTab5.precio5 - this.datosTab5.preciocompra) / this.datosTab5.preciocompra) * 100 ;
              //Redondeamos el resultado a 2 decimales
              this.datosTab5.porcentaje5 = Math.round((this.datosTab5.porcentaje5 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab5.porcentaje5 < 0){
                //recreamos los parametros del evento
                let x = {target:{id:'tab5porcentaje5'}}
                //mandamos a la funcion calcula monto
                this.tab5calculaMonto(x);
              }
              break;
        }
        case "tab5precio4" : {
              this.datosTab5.porcentaje4 = ((this.datosTab5.precio4 - this.datosTab5.preciocompra) / this.datosTab5.preciocompra) * 100 ;
              
              this.datosTab5.porcentaje4 = Math.round((this.datosTab5.porcentaje4 + Number.EPSILON) * 100 ) / 100 ;

              if(this.datosTab5.porcentaje4 < 0){
                let x = {target:{id:'tab5porcentaje4'}}
                this.tab5calculaMonto(x);
              }
          break;
        }
        case "tab5precio3" : {
              this.datosTab5.porcentaje3 = ((this.datosTab5.precio3 - this.datosTab5.preciocompra) / this.datosTab5.preciocompra) * 100 ;
              
              this.datosTab5.porcentaje3 = Math.round((this.datosTab5.porcentaje3 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab5.porcentaje3 < 0){
                let x = {target:{id:'tab5porcentaje3'}}
                this.tab5calculaMonto(x);
              }
          break;
        }
        case "tab5precio2" : {
              this.datosTab5.porcentaje2 = ((this.datosTab5.precio2 - this.datosTab5.preciocompra) / this.datosTab5.preciocompra) * 100 ;
              
              this.datosTab5.porcentaje2 = Math.round((this.datosTab5.porcentaje2 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab5.porcentaje2 < 0){
                let x = {target:{id:'tab5porcentaje2'}}
                this.tab5calculaMonto(x);
              }
          break;
        }
        case "tab5precio1" : {
              this.datosTab5.porcentaje1 = ((this.datosTab5.precio1 - this.datosTab5.preciocompra) / this.datosTab5.preciocompra) * 100 ;
              
              this.datosTab5.porcentaje1 = Math.round((this.datosTab5.porcentaje1 + Number.EPSILON) * 100 ) / 100 ;
              if(this.datosTab5.porcentaje1 < 0){
                let x = {target:{id:'tab5porcentaje1'}}
                this.tab5calculaMonto(x);
              }
          break;
        }
      }
    }//fin if
  }

  /**
   * Revisa los precios ingresados desde precio5 a precio1
   * y manda una alerta si el precio ingresado es menor al anterior
   * @param e 
   * Recibimos evento de un (change)
   */
  tab5revisaPreciosventa(e:any){
    /**
     * Tomamos del evento change el id del input modificado
     */
    let inputId = e.target.id;
    
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0 || this.datosTab4.unidad <= 0 || this.datosTab5.unidad <= 0){
      this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      return false;
    } else{
      //Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad * this.datosTab5.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
       * medidaMenor = 1*20*50 -> medidaMenor = 1000
       * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
       * 
       * 4 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab5.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab5.preciocompra = Math.round((this.datosTab5.preciocompra + Number.EPSILON) * 100 ) / 100;
      switch (inputId) {
        case "tab5precio5": {

            /**
             * Comparamos el precio ingresdo con el precio anterior
             * en este caso precio compra y si es menor mandamos una alerta
             */
            if(this.datosTab5.precio5 < this.datosTab5.preciocompra){
              this.toastService.show('El precio 5 no pueder ser menor al precio de compra: '+this.datosTab5.preciocompra, { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab5.precio5 = this.datosTab5.preciocompra;
              this.datosTab5.porcentaje5 = 0;
              return false;
            } 
            return true;
            break;
        }

        case "tab5precio4": {

            if(this.datosTab5.precio4 < this.datosTab5.precio5){
              this.toastService.show('El precio 4 no pueder ser menor que el precio 5', { classname: 'bg-danger text-light',delay: 5000 });
              this.datosTab5.precio4 = this.datosTab5.preciocompra;
              this.datosTab5.porcentaje4 = 0;
              return false;
            }
              return true;
            break;
        }

        case "tab5precio3": {

          if(this.datosTab5.precio3 < this.datosTab5.precio4){
            this.toastService.show('El precio 3 no pueder ser menor que el precio 4', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab5.precio3 = this.datosTab5.preciocompra;
            this.datosTab5.porcentaje3 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab5precio2": {

          if(this.datosTab5.precio2 < this.datosTab5.precio3){
            this.toastService.show('El precio 2 no pueder ser menor que el precio 3', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab5.precio2 = this.datosTab5.preciocompra;
            this.datosTab5.porcentaje2 = 0;
              return false;
          }
            return true;
          break;

        }
        case "tab5precio1": {

          if(this.datosTab5.precio1 < this.datosTab5.precio2){
            this.toastService.show('El precio 1 no pueder ser menor que el precio 2', { classname: 'bg-danger text-light',delay: 5000 });
            this.datosTab5.precio1 = this.datosTab5.preciocompra;
            this.datosTab5.porcentaje1 = 0;
              return false;
          } 
            return true;
          break;
        }
        default:{
          return false;
          break;
        }
      }
    }//fin else
  }

  /**
   * Calcula el monto (precioX) de acuerdo
   * al porcentaje ingresado
   * @param e 
   * Recibimos el evento de un (keyup)
   */
  tab5calculaMonto(e:any){
    let inputId = e.target.id
    /**
    * Obtenemos el valor del input y lo convertimos a Float
    * luego lo dividimos entre 100 para obtener su porcentaje
    */
    var inputValue  = parseFloat((<HTMLInputElement>document.getElementById(inputId)).value) / 100;

    //Obtenemos medida menor multiplicando las unidades
    var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad * this.datosTab5.unidad;
    /**
     * obtenemos precio compra de la medida dividiendo el precio compra
     * de la primera medida entre el valor de la medidaMenor
     * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20, datosTab3.unidad = 50
     * medidaMenor = 1*20*50 -> medidaMenor = 1000
     * datosTab2.preciocompra = 4000/1000  -> datosTab3.preciocompra = 4
     * 
     * 4 es el preciocompra de esta medida
     * 
     */
    
    this.datosTab5.preciocompra = this.datosTab1.preciocompra / medidaMenor
    this.datosTab5.preciocompra = Math.round((this.datosTab5.preciocompra + Number.EPSILON) * 100 ) / 100;

    /**
     * revisamos que el porcentaje no sea menor o igual a cero
     * Si es asi mandamos una alerta
     */
    if(inputValue <= 0){

      this.toastService.show('No puedes ingresar porcentajes negativos ', { classname: 'bg-danger text-light',delay: 5000 });
      switch(inputId){
        case "tab5porcentaje5":
              this.datosTab5.precio5 = this.datosTab5.preciocompra;
              this.datosTab5.porcentaje5 = 0;
          break;
        case "tab5porcentaje4":
              this.datosTab5.precio4 = this.datosTab5.preciocompra;
              this.datosTab5.porcentaje4 = 0;
          break;
        case "tab5porcentaje3":
              this.datosTab5.precio3 = this.datosTab5.preciocompra;
              this.datosTab5.porcentaje3 = 0;
          break;
        case "tab5porcentaje2":
            this.datosTab5.precio2 = this.datosTab5.preciocompra;
            this.datosTab5.porcentaje2 = 0;
          break;
        case "tab5porcentaje1":
            this.datosTab5.precio1 = this.datosTab5.preciocompra;
            this.datosTab5.porcentaje1 = 0;
          break;
      }

    } else{

      if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0 || this.datosTab4.unidad <= 0 || this.datosTab5.unidad <= 0){
        this.toastService.show('La unidad no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
      } else{
        switch (inputId){
          case "tab5porcentaje5" : {
                /**
                 * Dividimos el preciocompra entre la unidad
                 * Luego multiplicamos el resultado y por el valor del inputValue mas 1
                 * ejem: inputValue = .03 , preciocompra = 150 , unidad = 2
                 *  (150 / 2) * (1 + .03) -> (75)*(1.03) = 77.25
                 * Nota: .03 por la division entre 100 que se realiza antes
                 */
                this.datosTab5.precio5 =  this.datosTab5.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab5.precio5 = Math.round((this.datosTab5.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab5precio5'}}
                this.tab5revisaPreciosventa(x);
    
                break;
          }
  
          case "tab5porcentaje4" : {
                
                this.datosTab5.precio4 =  this.datosTab5.preciocompra * (1+inputValue);
                this.datosTab5.precio4 = Math.round((this.datosTab5.precio4 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab5precio4'}}
                this.tab5revisaPreciosventa(x);
            break;
          }
  
          case "tab5porcentaje3" : {
                this.datosTab5.precio3 =  this.datosTab5.preciocompra * (1+inputValue);
                this.datosTab5.precio3 = Math.round((this.datosTab5.precio3 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab5precio3'}}
                this.tab5revisaPreciosventa(x);
            break;
          }
  
          case "tab5porcentaje2" : {
                this.datosTab5.precio2 =  this.datosTab5.preciocompra * (1+inputValue);
                this.datosTab5.precio2 = Math.round((this.datosTab5.precio2 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab5precio2'}}
                this.tab5revisaPreciosventa(x);
            break;
          }
  
          case "tab5porcentaje1" : {
                this.datosTab5.precio1 =  this.datosTab5.preciocompra * (1+inputValue);
                this.datosTab5.precio1 = Math.round((this.datosTab5.precio1 + Number.EPSILON) * 100 ) / 100;

                let x = {target:{id:'tab5precio1'}}
                this.tab5revisaPreciosventa(x);
            break;
          }
  
        }//fin switch
      }//fin else datosTab1.unidad <=0
    }//fin else inputValue <= 0
  }//fin calculaMonto()

  /**
   * Copia los porcentajes de la tabla anterior
   * y los ingresa en la tabla del check y calcula su porcentaje
   * @param nomPorcentaje string
   */
  tab5calculaMontoCheck(nomPorcentaje:string){
    //Revisamos si las unidades no sean iguales o menores a cero
    if(this.datosTab1.unidad <= 0 || this.datosTab2.unidad <= 0 || this.datosTab3.unidad <= 0 || this.datosTab4.unidad <= 0 || this.datosTab5.unidad <= 0){
      //Si es correcto mandamos alerta y no hacemos nada
      this.toastService.show('Las unidades no puede ser menor o igual a 0', { classname: 'bg-danger text-light',delay: 5000 });
    } else{
      //Si las unidades estan bien Obtenemos medida menor multiplicando las unidades
      var medidaMenor = this.datosTab1.unidad * this.datosTab2.unidad * this.datosTab3.unidad * this.datosTab4.unidad * this.datosTab5.unidad;
      /**
       * obtenemos precio compra de la medida dividiendo el precio compra
       * de la primera medida entre el valor de la medidaMenor
       * Ejem: datosTab1.preciocompra = 500, datosTab1.unidad = 1, datosTab2.unidad = 20
       * medidaMenor = 1*20 -> medidaMenor = 20
       * datosTab2.preciocompra = 500/20  -> datosTab2.preciocompra = 25
       * 
       * 25 es el preciocompra de esta medida
       * 
       */
      
      this.datosTab5.preciocompra = this.datosTab1.preciocompra / medidaMenor
      this.datosTab5.preciocompra = Math.round((this.datosTab5.preciocompra + Number.EPSILON) * 100 ) / 100 ;
      // revisamos que porcentaje vamos a calcular
      switch(nomPorcentaje){
        case 'tab5porcentaje5':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab5.porcentaje5 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab5.porcentaje5 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 5 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab5.precio5 = this.datosTab5.preciocompra;
                this.datosTab5.porcentaje5 = 0;
            } else{
                /**  Si todo es correcto realizamos  operacion
                   * Multiplicamos el precioCompra por el valor del inputValue mas 1
                   * ejem: inputValue = .03 , preciocompra = 150
                   *  (150) * (1 + .03) -> (150)*(1.03) = 154.5
                   * Nota: .03 por la division entre 100 que se realiza al inputValue
                   */
                let inputValue = this.datosTab5.porcentaje5/100;
                this.datosTab5.precio5 =  this.datosTab5.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab5.precio5 = Math.round((this.datosTab5.precio5 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab5precio5'}}
                this.tab5revisaPreciosventa(x);
            }
          break;
        case 'tab5porcentaje4':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab5.porcentaje4 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab5.porcentaje4 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 4 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab5.precio4 = this.datosTab5.preciocompra;
                this.datosTab5.porcentaje4 = 0;
            } else{
                let inputValue = this.datosTab5.porcentaje4/100;
                this.datosTab5.precio4 =  this.datosTab5.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab5.precio4 = Math.round((this.datosTab5.precio4 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab5precio4'}}
                this.tab5revisaPreciosventa(x);
            }
          break;
        case 'tab5porcentaje3':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab5.porcentaje3 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab5.porcentaje3 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 3 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab5.precio3 = this.datosTab5.preciocompra;
                this.datosTab5.porcentaje3 = 0;
            } else{
                let inputValue = this.datosTab5.porcentaje3/100;
                this.datosTab5.precio3 =  this.datosTab5.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab5.precio3 = Math.round((this.datosTab5.precio3 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab5precio3'}}
                this.tab5revisaPreciosventa(x);
            }
          break;
        case 'tab5porcentaje2':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab5.porcentaje2 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab5.porcentaje2 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 2 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab5.precio2 = this.datosTab5.preciocompra;
                this.datosTab5.porcentaje2 = 0;
            } else{
                let inputValue = this.datosTab5.porcentaje2/100;
                this.datosTab5.precio2 =  this.datosTab5.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab5.precio2 = Math.round((this.datosTab5.precio2 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab5precio2'}}
                this.tab5revisaPreciosventa(x);
            }
          break;
        case 'tab5porcentaje1':
            //revisamos que nuestro porcentaje no sea menor o igual a cero
            if(this.datosTab5.porcentaje1 <= 0){
              //si el porcentaje si menor a cero mandamos alerta
              if(this.datosTab5.porcentaje1 < 0){
                //Si resulta cierto enviamos alerta
                this.toastService.show('El porcentaje 1 no puede ser menor a 0', { classname: 'bg-danger text-light',delay: 5000 });
              } //si no solo igualamos al precio compra
                this.datosTab5.precio1 = this.datosTab5.preciocompra;
                this.datosTab5.porcentaje1 = 0;
            } else{
                let inputValue = this.datosTab5.porcentaje1/100;
                this.datosTab5.precio1 =  this.datosTab5.preciocompra * (1+inputValue);
                //Redondeamos el resultado a 2 decimales
                this.datosTab5.precio1 = Math.round((this.datosTab5.precio1 + Number.EPSILON) * 100 ) / 100;
                
                let x = {target:{id:'tab5precio1'}}
                this.tab5revisaPreciosventa(x);
            }
          break;
      }//Fin switch
    }//fin else
  }
}



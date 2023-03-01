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
/*NGBOOTSTRAP */
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
/*MODELOS */
import { Producto} from 'src/app/models/producto';
import { Productos_medidas } from 'src/app/models/productos_medidas';


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
  public datosTab1: Productos_medidas;
  public datosTab2: Productos_medidas;
  public datosTab3: Productos_medidas;
  public datosTab4: Productos_medidas;
  public datosTab5: Productos_medidas;
  //
  public readOn: boolean = false;

  constructor(
    
    private _medidaService: MedidaService,
    private _marcaService: MarcaService,
    private _departamentosService: DepartamentoService,
    private _categoriaService: CategoriaService,
    private _almacenService: AlmacenService,
    private modalService: NgbModal,
    public toastService: ToastService,

  ) {
    this.producto = new Producto(0,0,0,0,'',0,'',0,0,'',0,'','',null,0,0);
    this.datosTab1 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab2 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab3 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab4 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    this.datosTab5 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
    
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
    console.log(this.producto, this.datosTab1)

    // this._productoService.registerProducto(this.producto,this.datosTab1).subscribe(
    //   response =>{
    //     if(response.status == 'success'){
    //       //console.log(response);
    //       this._router.navigate(['./producto-modulo/producto-buscar']);
    //       this.toastService.show('Producto guardado correctamente', { classname: 'bg-success text-light', delay: 5000 });
    //     }
    //   },
    //   error =>{
    //     //console.log(this.producto);
    //     console.log(error);
    //     this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
    //   }
    // )
  }

  /**
   * Asigna el nombre de la imagen cargada a la propiedad de
   * producto.imagen
   * @param datos 
   */
  productImage(datos:any){
    //console.log(datos.originalEvent.body.image);
    this.producto.imagen = datos.originalEvent.body.image
  }

  /**
   * Calcula el porcentaje entre 2 precios del apartado 
   * PRECIOS VENTA
   * @param e 
   * Recibimos el evento (keyup) y accedemos a sus propiedades
   * para extraer el id y saber que input modificamos
   */
  calculaPorcentaje(e:any){

    let inputId = e.target.id;

    /**
     * De acuerdo al valor obtenido del input, ingresamos
     * al caso correspondiente
     */
    switch (inputId){
        case "monto5" : {
              /**
               * Realizamos el calculo del porcentaje : le restamos al precio nuevo (precio5) el precio anterior (precio compra)
               * y el resultado lo dividimos entre el precio  anterior (precio compra)
               * Por ultimo lo multiplicamos por 100
               */
              this.datosTab1.porcentaje5 = ((this.datosTab1.precio5 - this.datosTab1.preciocompra) / this.datosTab1.preciocompra) * 100 ;
              //Redondeamos el resultado a 2 decimales
              this.datosTab1.porcentaje5 = Math.round((this.datosTab1.porcentaje5 + Number.EPSILON) * 100 ) / 100 ;
              break;
        }
        case "monto4" : {
              this.datosTab1.porcentaje4 = ((this.datosTab1.precio4 - this.datosTab1.preciocompra) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje4 = Math.round((this.datosTab1.porcentaje4 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
        case "monto3" : {
              this.datosTab1.porcentaje3 = ((this.datosTab1.precio3 - this.datosTab1.preciocompra) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje3 = Math.round((this.datosTab1.porcentaje3 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
        case "monto2" : {
              this.datosTab1.porcentaje2 = ((this.datosTab1.precio2 - this.datosTab1.preciocompra) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje2 = Math.round((this.datosTab1.porcentaje2 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
        case "monto1" : {
              this.datosTab1.porcentaje1 = ((this.datosTab1.precio1 - this.datosTab1.preciocompra) / this.datosTab1.preciocompra) * 100 ;
              
              this.datosTab1.porcentaje1 = Math.round((this.datosTab1.porcentaje1 + Number.EPSILON) * 100 ) / 100 ;
          break;
        }
    }
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

      this.toastService.show('No puedes ingresar porcentajes negativos ', { classname: 'bg-danger text-light', delay: 1500 });

    } else{

      switch (inputId){
        case "porcentaje5" : {
              /**
               * Multiplicamos el precio compra por 1. y el valor del inputValue
               * ejem: inputValue = 3    la operacion seria   preciocompra * 1.03
               */
              this.datosTab1.precio5 =  this.datosTab1.preciocompra * (1+inputValue);
              //Redondeamos el resultado a 2 decimales
              this.datosTab1.precio5 = Math.round((this.datosTab1.precio5 + Number.EPSILON) * 100 ) / 100;
  
              break;
        }

        case "porcentaje4" : {
              
              this.datosTab1.precio4 =  this.datosTab1.preciocompra * (1+inputValue);
              this.datosTab1.precio4 = Math.round((this.datosTab1.precio4 + Number.EPSILON) * 100 ) / 100;
          break;
        }

        case "porcentaje3" : {
              this.datosTab1.precio3 =  this.datosTab1.preciocompra * (1+inputValue);
              this.datosTab1.precio3 = Math.round((this.datosTab1.precio3 + Number.EPSILON) * 100 ) / 100;
          break;
        }

        case "porcentaje2" : {
              this.datosTab1.precio2 =  this.datosTab1.preciocompra * (1+inputValue);
              this.datosTab1.precio2 = Math.round((this.datosTab1.precio2 + Number.EPSILON) * 100 ) / 100;
          break;
        }

        case "porcentaje1" : {
              this.datosTab1.precio1 =  this.datosTab1.preciocompra * (1+inputValue);
              this.datosTab1.precio1 = Math.round((this.datosTab1.precio1 + Number.EPSILON) * 100 ) / 100;
          break;
        }

      }//fin switch
    }//fin else
  }//fin calculaMonto()

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
          console.log('model '+model);
          this.tab2 = true;
          this.tab3 = true;
          this.tab4 = true;
          this.tab5 = true;
        break;

      case "2":
          console.log('model '+model);
          this.tab2 = false;
          this.tab3 = true;
          this.tab4 = true;
          this.tab5 = true;
        break;

      case "3":
        console.log('model '+model);
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = true;
          this.tab5 = true;
        break;

      case "4":
        console.log('model '+model);
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = true;
        break;

      case "5":
        console.log('model '+model);
          this.tab2 = false;
          this.tab3 = false;
          this.tab4 = false;
          this.tab5 = false;
        break;
    }
  }
  revisaPrecioCompra(){
    if(this.datosTab1.preciocompra <= 0){
      this.readOn= false;
    } else{
      this.readOn = true;
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

}



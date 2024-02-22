import { Component, OnInit } from '@angular/core';
import { ProductoService } from 'src/app/services/producto.service';
import { global } from 'src/app/services/global';
import { MdlProductoService } from 'src/app/services/mdlProductoService';

interface selectBusqueda {
  id: number;
  name: string;
}
interface RowData {
  MED: string;
  [key: string]: string | number; // Permitimos cualquier clave que sea string y su valor puede ser string o número
}


@Component({
  selector: 'app-modal-productos',
  templateUrl: './modal-productos.component.html',
  styleUrls: ['./modal-productos.component.css'],
  providers: [ProductoService]
})
export class ModalProductosComponent implements OnInit {

  //Spinner
  public isLoadingGeneral: boolean = false;
  //Servicios
  public productos:Array<any> = [];//getProductos
  public existencias:Array<any> = [];//onSelectionChange
  public medidas:Array<any> = [];//onSelectionChange
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

  constructor(
    private _productoService:ProductoService,
    private _mdlProductoService: MdlProductoService,
  ) { }

  ngOnInit(): void {
    
    this._mdlProductoService.openMdlProductosDialog$.subscribe(() => {
      this.mdlProductos = true;
      this.setOptionsSelect();
      this.getProductos();
    });
  }

  setOptionsSelect(){
    this.optionsSelect = [
      {id:1, name:'Clave externa'},
      {id:2, name:'Descripcion'},
      {id:3, name:'Codigo de barras'},
    ];

    this.selectedOpt = this.optionsSelect[0];
  }

  getProductos(page:number = 1, type:number = 0, search:string = 'null'){
    //mostramos el spinner
    this.isLoadingGeneral=true;
    //Ejecutamos servicio
    this._productoService.getProductosNewIndex(page,type,search).subscribe(
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
    //Mostramos spinner
    this.isLoadingGeneral = true;

    this._productoService.searchProductoMedida(this.selectedProduct.idProducto).subscribe(
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
  }  
}

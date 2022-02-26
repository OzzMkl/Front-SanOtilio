import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { Router, ActivatedRoute } from '@angular/router';
import { global } from 'src/app/services/global';

/**IMPORTACIONS DE LOS MODULOS DE SERVICIO */
import { ProductoService } from 'src/app/services/producto.service';
import { ToastService } from 'src/app/services/toast.service';

import { MedidaService } from 'src/app/services/medida.service';
import { MarcaService } from 'src/app/services/marca.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SubCategoriaService } from 'src/app/services/subcategoria.service';
import { AlmacenService } from 'src/app/services/almacen.service';


@Component({
  selector: 'app-producto-editar',
  templateUrl: './producto-editar.component.html',
  styleUrls: ['./producto-editar.component.css'],
  providers: [MedidaService, MarcaService,DepartamentoService,
    CategoriaService, SubCategoriaService, AlmacenService,
    ProductoService]
})
export class ProductoEditarComponent implements OnInit {

  //encabezados
  public page_title: string;
  public page_clasificacion: string;
  public page_precios: string;
  public producto: Array<any>;
  public ptt:Array<Producto>;
  public productos: any;
  /** */
  public value: any;
  public url:any;
  public productoModificado: Producto;
  /**Array de servicios */
  public medidas: any;
  public marca: any;
  public departamentos: any;
  public categoria: any;
  public subcategoria: any;
  public almacenes: any;

  constructor(
    private _medidaService: MedidaService,
    private _marcaService: MarcaService,
    private _departamentosService: DepartamentoService,
    private _categoriaService: CategoriaService,
    private _subcategoriaService: SubCategoriaService,
    private _almacenService: AlmacenService,
    private _productoService: ProductoService,
    private _router: Router,
    private _route: ActivatedRoute,
    public toastService: ToastService
  ){
    this.page_title = 'Detalles del producto' ;
    this.page_clasificacion = 'Clasificación';
    this.page_precios = 'Precios';
    this.producto = [];
    this.ptt = [];
    
    this.url = global.url;
    this.productoModificado = new Producto(0,0,0,0,0,0,'',0,'',0,0,'null',1,'','','',0,0,0,null,0,0);

    this.medidas= [];
    this.marca=[];
    this.departamentos=[];
    this.categoria = [];
    this.subcategoria =[];
    this.almacenes = [];
    this.productos = [];
    
  
   }

  ngOnInit(): void {
    this.getIdProduct();
    this.getMedida();
    this.getMarca();
    this.getDepartamentos();
    this.getCategoria();
    this.getSubcategoria();
    this.getAlmacen();
    //this.getAllProduts();
  }

  getIdProduct(){//obtenemos informacion del producto que queremos modificar
    //Obtener el id del producto a modificar de la URL
    this._route.params.subscribe(params => {
     let id = + params['idProducto'];
     //console.log(id);

     //Peticion ajax para obtener los datos con base en el id del proveedor
   this._productoService.getProdver(id).subscribe(//traemos el servicio
     response =>{//asignamos la respuesta
       if(response.status == 'success' && response.producto.length > 0){//si es el statuss es OK y el array del producto mayor a 0 asignamops variables
         this.producto = response.producto;
         //console.log(this.producto);
         //Se asignan las variables una por una ya que de momento no encontre otra forma xd
         this.productoModificado.idProducto = this.producto[0]['idProducto'];
         this.productoModificado.idMedida = this.producto[0]['idMedida'];
         this.productoModificado.idMarca = this.producto[0]['idMarca'];
         this.productoModificado.idDep = this.producto[0]['idDep'];
         this.productoModificado.idCat = this.producto[0]['idCat'];
         this.productoModificado.idSubCat = this.producto[0]['idSubCat'];
         this.productoModificado.claveEx = this.producto[0]['claveEx'];
         this.productoModificado.descripcion = this.producto[0]['descripcion'];
         this.productoModificado.stockMin = this.producto[0]['stockMin'];
         this.productoModificado.stockMax = this.producto[0]['stockMax'];
         this.productoModificado.statuss = this.producto[0]['statuss'];
         this.productoModificado.ubicacion = this.producto[0]['ubicacion'];
         this.productoModificado.claveSat = this.producto[0]['claveSat'];
         this.productoModificado.tEntrega = this.producto[0]['tEntrega'];
         this.productoModificado.idAlmacen = this.producto[0]['idAlmacen'];
         this.productoModificado.precioR = this.producto[0]['precioR'];
         this.productoModificado.precioS = this.producto[0]['precioS'];
         this.productoModificado.idProductoS = this.producto[0]['idProductoS'];
         this.productoModificado.factorConv = this.producto[0]['factorConv'];
         this.productoModificado.cbarras = this.producto[0]['cbarras'];
         //para asi asignar el valor del codigo de barras a la variable value
         //esto con la finalidad de poder mostrar el contenido
         this.value = this.producto[0]['cbarras'];
         //console.log( );
         //this.value = this.ptt;
       }else{//si la primera comprobacion fallo traemos el segundo servicio que cuenta con un join menos
         this._productoService.getProdverDos(id).subscribe(
          response=>{//a la respuesta que se recibe volvemos a asignar los valos a modificar
            this.producto = response.producto;
            this.productoModificado.idProducto = this.producto[0]['idProducto'];
            this.productoModificado.idMedida = this.producto[0]['idMedida'];
            this.productoModificado.idMarca = this.producto[0]['idMarca'];
            this.productoModificado.idDep = this.producto[0]['idDep'];
            this.productoModificado.idCat = this.producto[0]['idCat'];
            this.productoModificado.idSubCat = this.producto[0]['idSubCat'];
            this.productoModificado.claveEx = this.producto[0]['claveEx'];
            this.productoModificado.descripcion = this.producto[0]['descripcion'];
            this.productoModificado.stockMin = this.producto[0]['stockMin'];
            this.productoModificado.stockMax = this.producto[0]['stockMax'];
            this.productoModificado.statuss = this.producto[0]['statuss'];
            this.productoModificado.ubicacion = this.producto[0]['ubicacion'];
            this.productoModificado.claveSat = this.producto[0]['claveSat'];
            this.productoModificado.tEntrega = this.producto[0]['tEntrega'];
            this.productoModificado.idAlmacen = this.producto[0]['idAlmacen'];
            this.productoModificado.precioR = this.producto[0]['precioR'];
            this.productoModificado.precioS = this.producto[0]['precioS'];
            this.productoModificado.idProductoS = this.producto[0]['idProductoS'];
            this.productoModificado.factorConv = this.producto[0]['factorConv'];
            this.productoModificado.cbarras = this.producto[0]['cbarras'];
            this.value = this.producto[0]['cbarras'];
            //console.log(this.producto);
          },
            error =>{
              console.log(error);
            }
         );
       }
     },
     error =>{
       console.log(error);
     }
   );

 });
 }

 //Envio de datos del formulario para la actualizacion del producto
 onSubmit(form:any){
   //obtenemos primero el id del prodycto a modificar y dentro de el
  this._route.params.subscribe(params => {
    let id = + params['idProducto'];

//ejecutamos el servicio de actualizacion del producto mando el objeto con los datos junto con el id obteniedo en el paso anterior
  this._productoService.updateProducto(this.productoModificado, id).subscribe(
    response =>{
      //console.log(response);
      //lo mandamos al modulo buscar
      this._router.navigate(['./producto-modulo/producto-buscar']);
      //mostramos mensaje de que la modificacion salio correctamente
       this.toastService.show('Producto '+this.productoModificado.claveEx+' modificado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
     
    },
    error =>{
     // console.log(this.productoModificado);//muestra lo que se mando
      console.log(<any>error);//muestra el error
      this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });//mensaje de que salio mal la operacion
    
    }
  )
});
 }

 /***SERVICIOS */
 getMedida(){
  this._medidaService.getMedidas().subscribe(
    response =>{
      if(response.status == 'success'){
        this.medidas = response.medidas;
        //console.log(this.medidas);
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
        //console.log(this.marca);
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
        //console.log(this.departamentos);
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
        //console.log(this.categoria);
      }
    },
    error =>{
      console.log(error);
    }
  );
}
getSubcategoria(){
  this._subcategoriaService.getSubCategorias().subscribe(
    response =>{
      if(response.status == 'success'){
        this.subcategoria = response.subcategoria; 
        //console.log(this.subcategoria);
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
        //console.log(this.almacenes);
      }
    },
    error =>{
      console.log(error);
    }
  );
}
getAllProduts(){
  this._productoService.getProductos().subscribe(
    response =>{
      if(response.status == 'success'){
        this.productos = response.productos;
        //navegacion paginacion
        //this.totalPages = response.productos.total;
        console.log(response.productos);
      }
    },
    error =>{
      console.log(error);
    }
  );
}


}
/********************************************************* */
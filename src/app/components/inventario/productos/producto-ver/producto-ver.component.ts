import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
//Servicio
import { ProductoService } from 'src/app/services/producto.service';
import {ToastService} from 'src/app/services/toast.service';
import { global } from 'src/app/services/global';
import { Productos_medidas } from 'src/app/models/productos_medidas';
import {MenuItem, MessageService} from 'primeng/api';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-producto-ver',
  templateUrl: './producto-ver.component.html',
  styleUrls: ['./producto-ver.component.css'],
  providers:[ProductoService,MessageService]
})
export class ProductoVerComponent implements OnInit {

  //variables de servicios
  public producto: any;
  public identity: any;
  public url: string = global.url;
  //  para el codbar
  public muestraCbarras: any;
  //spinner
  public isLoading: boolean = false;
  //Para recoger la informacion de las tablas de precios
  public listaProdMedida: Array<Productos_medidas> = [];
  public datosTab1: Productos_medidas;
  public datosTab2: Productos_medidas;
  public datosTab3: Productos_medidas;
  public datosTab4: Productos_medidas;
  public datosTab5: Productos_medidas;
  //Para mostrar y ocultar las tablas de precios
  public noMedida: number = 1;
  public selectNoMedida: number = 1;
  public tab2: boolean = true;
  public tab3: boolean = true;
  public tab4: boolean = true;
  public tab5: boolean = true;
  //para asignar nombre de la medida
  public medida1: string = '';
  public medida2: string = '';
  public medida3: string = '';
  public medida4: string = '';
  public medida5: string = '';
  //
  items: MenuItem[] =[];

  constructor( 
    private _productoService: ProductoService,
    private _empleadoService: EmpleadoService,
    private _router: Router,
    private _route: ActivatedRoute,
    public toastService: ToastService,
    private messageService: MessageService
    ){
      this.datosTab1 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
      this.datosTab2 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
      this.datosTab3 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
      this.datosTab4 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
      this.datosTab5 = new Productos_medidas(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);
   }

  ngOnInit(): void {
    this.getIdProduct();
  }
  /**
   * Estructura del menu desplegable
   */
  menu(){
    this.items = [
      {
          label: 'Opciones',
          items: [{
              label: 'PDF',
              icon: 'pi pi-file-pdf'
          },
          {
              label: 'Editar',
              icon: 'pi pi-file-edit'
          }
      ]}
    ];
  }

  /**
   * Busca el producto, con el id recibido en la url
   */
  getIdProduct(){
    this.menu();
    //mostramos el spinner
    this.isLoading = true;
    //Obtener el id del producto a modificar de la URL
    this._route.params.subscribe(params => {
     let id = + params['idProducto'];
     //console.log(id);

     //Peticion ajax para obtener los datos con base en el id del proveedor
   this._productoService.getProdverDos(id).subscribe(//traemos el servicio
     response =>{//asignamos la respuesta
      if(response.status == 'success'){
         //console.log(response);

         this.producto = response.producto;
         //console.log(this.producto[0])

         this.prueba(response.producto[0]['statuss'])
         //para asi asignar el valor del codigo de barras a la variable value
         //esto con la finalidad de poder mostrar el codigo de barras
         this.muestraCbarras = response.producto[0]['cbarras'];

         this.listaProdMedida = response.productos_medidas;
         //console.log(this.listaProdMedida)
         this.noMedida = this.listaProdMedida.length;

         this.seleccionanoMedidas(this.noMedida.toString());

         //recorremos array de acuerdo a la longitud  de listaProdMedida
         for(let i= 0; i < this.listaProdMedida.length; i++){
          //Vamos asignando valores de acuerdo a la vuelta que le damos al array
          if(i=== 0){
            this.datosTab1.idProdMedida = this.listaProdMedida[i]['idProdMedida'];
            this.datosTab1.idProducto = this.listaProdMedida[i]['idProducto'];
            this.datosTab1.idMedida = this.listaProdMedida[i]['idMedida'];
            this.datosTab1.unidad = this.listaProdMedida[i]['unidad'];
            this.datosTab1.preciocompra = this.listaProdMedida[i]['preciocompra'];
            this.datosTab1.porcentaje1 = this.listaProdMedida[i]['porcentaje1'];
            this.datosTab1.precio1 = this.listaProdMedida[i]['precio1'];
            this.datosTab1.porcentaje2 = this.listaProdMedida[i]['porcentaje2'];
            this.datosTab1.precio2 = this.listaProdMedida[i]['precio2'];
            this.datosTab1.porcentaje3 = this.listaProdMedida[i]['porcentaje3'];
            this.datosTab1.precio3 = this.listaProdMedida[i]['precio3'];
            this.datosTab1.porcentaje4 = this.listaProdMedida[i]['porcentaje4'];
            this.datosTab1.precio4 = this.listaProdMedida[i]['precio4'];
            this.datosTab1.porcentaje5 = this.listaProdMedida[i]['porcentaje5'];
            this.datosTab1.precio5 = this.listaProdMedida[i]['precio5'];
            this.datosTab1.idStatus = this.listaProdMedida[i]['idStatus'];
            this.medida1 = response.productos_medidas[i]['nombreMedida'];
          } else if(i=== 1){
            this.datosTab2.idProdMedida = this.listaProdMedida[i]['idProdMedida'];
            this.datosTab2.idProducto = this.listaProdMedida[i]['idProducto'];
            this.datosTab2.idMedida = this.listaProdMedida[i]['idMedida'];
            this.datosTab2.unidad = this.listaProdMedida[i]['unidad'];
            this.datosTab2.preciocompra = this.listaProdMedida[i]['preciocompra'];
            this.datosTab2.porcentaje1 = this.listaProdMedida[i]['porcentaje1'];
            this.datosTab2.precio1 = this.listaProdMedida[i]['precio1'];
            this.datosTab2.porcentaje2 = this.listaProdMedida[i]['porcentaje2'];
            this.datosTab2.precio2 = this.listaProdMedida[i]['precio2'];
            this.datosTab2.porcentaje3 = this.listaProdMedida[i]['porcentaje3'];
            this.datosTab2.precio3 = this.listaProdMedida[i]['precio3'];
            this.datosTab2.porcentaje4 = this.listaProdMedida[i]['porcentaje4'];
            this.datosTab2.precio4 = this.listaProdMedida[i]['precio4'];
            this.datosTab2.porcentaje5 = this.listaProdMedida[i]['porcentaje5'];
            this.datosTab2.precio5 = this.listaProdMedida[i]['precio5'];
            this.datosTab2.idStatus = this.listaProdMedida[i]['idStatus'];
            this.medida2 = response.productos_medidas[i]['nombreMedida'];
          } else if(i=== 2){
            this.datosTab3.idProdMedida = this.listaProdMedida[i]['idProdMedida'];
            this.datosTab3.idProducto = this.listaProdMedida[i]['idProducto'];
            this.datosTab3.idMedida = this.listaProdMedida[i]['idMedida'];
            this.datosTab3.unidad = this.listaProdMedida[i]['unidad'];
            this.datosTab3.preciocompra = this.listaProdMedida[i]['preciocompra'];
            this.datosTab3.porcentaje1 = this.listaProdMedida[i]['porcentaje1'];
            this.datosTab3.precio1 = this.listaProdMedida[i]['precio1'];
            this.datosTab3.porcentaje2 = this.listaProdMedida[i]['porcentaje2'];
            this.datosTab3.precio2 = this.listaProdMedida[i]['precio2'];
            this.datosTab3.porcentaje3 = this.listaProdMedida[i]['porcentaje3'];
            this.datosTab3.precio3 = this.listaProdMedida[i]['precio3'];
            this.datosTab3.porcentaje4 = this.listaProdMedida[i]['porcentaje4'];
            this.datosTab3.precio4 = this.listaProdMedida[i]['precio4'];
            this.datosTab3.porcentaje5 = this.listaProdMedida[i]['porcentaje5'];
            this.datosTab3.precio5 = this.listaProdMedida[i]['precio5'];
            this.datosTab3.idStatus = this.listaProdMedida[i]['idStatus'];
            this.medida3 = response.productos_medidas[i]['nombreMedida'];
          } else if(i=== 3){
            this.datosTab4.idProdMedida = this.listaProdMedida[i]['idProdMedida'];
            this.datosTab4.idProducto = this.listaProdMedida[i]['idProducto'];
            this.datosTab4.idMedida = this.listaProdMedida[i]['idMedida'];
            this.datosTab4.unidad = this.listaProdMedida[i]['unidad'];
            this.datosTab4.preciocompra = this.listaProdMedida[i]['preciocompra'];
            this.datosTab4.porcentaje1 = this.listaProdMedida[i]['porcentaje1'];
            this.datosTab4.precio1 = this.listaProdMedida[i]['precio1'];
            this.datosTab4.porcentaje2 = this.listaProdMedida[i]['porcentaje2'];
            this.datosTab4.precio2 = this.listaProdMedida[i]['precio2'];
            this.datosTab4.porcentaje3 = this.listaProdMedida[i]['porcentaje3'];
            this.datosTab4.precio3 = this.listaProdMedida[i]['precio3'];
            this.datosTab4.porcentaje4 = this.listaProdMedida[i]['porcentaje4'];
            this.datosTab4.precio4 = this.listaProdMedida[i]['precio4'];
            this.datosTab4.porcentaje5 = this.listaProdMedida[i]['porcentaje5'];
            this.datosTab4.precio5 = this.listaProdMedida[i]['precio5'];
            this.datosTab4.idStatus = this.listaProdMedida[i]['idStatus'];
            this.medida4 = response.productos_medidas[i]['nombreMedida'];
          }else if(i=== 4){ 
            this.datosTab5.idProdMedida = this.listaProdMedida[i]['idProdMedida'];
            this.datosTab5.idProducto = this.listaProdMedida[i]['idProducto'];
            this.datosTab5.idMedida = this.listaProdMedida[i]['idMedida'];
            this.datosTab5.unidad = this.listaProdMedida[i]['unidad'];
            this.datosTab5.preciocompra = this.listaProdMedida[i]['preciocompra'];
            this.datosTab5.porcentaje1 = this.listaProdMedida[i]['porcentaje1'];
            this.datosTab5.precio1 = this.listaProdMedida[i]['precio1'];
            this.datosTab5.porcentaje2 = this.listaProdMedida[i]['porcentaje2'];
            this.datosTab5.precio2 = this.listaProdMedida[i]['precio2'];
            this.datosTab5.porcentaje3 = this.listaProdMedida[i]['porcentaje3'];
            this.datosTab5.precio3 = this.listaProdMedida[i]['precio3'];
            this.datosTab5.porcentaje4 = this.listaProdMedida[i]['porcentaje4'];
            this.datosTab5.precio4 = this.listaProdMedida[i]['precio4'];
            this.datosTab5.porcentaje5 = this.listaProdMedida[i]['porcentaje5'];
            this.datosTab5.precio5 = this.listaProdMedida[i]['precio5'];
            this.datosTab5.idStatus = this.listaProdMedida[i]['idStatus'];
            this.medida5 = response.productos_medidas[i]['nombreMedida'];
          }
         }
         //una vez terminado de cargar quitamos el spinner
          this.isLoading = false;
       }//fin if
     },//fin response
     error =>{
       console.log(error);
     }
   );//finsubscribe getProdverdos

  });//finsubscribe params
  }

  /**
     * Funcion para el select de no. de medidas
     * @param model 
     * recibimos el numero de medidas a ingresar
     * y mostramos y ocultamos las tablas
     */
  seleccionanoMedidas(e:any){
      
    switch( e ){
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

   /**
   * 
   */
   prueba(statuss:number){
    switch(statuss){
      case 31:
          this.items[0].items?.push({
            label: 'Deshabilitar',
            icon: 'pi pi-exclamation-triangle',
            command: () => {
              this.actualizaStatus();
            }
          });
        break;
      case 32:
          this.items[0].items?.push({
            label: 'Habilitar',
            icon: 'pi pi-exclamation-triangle',
            command: () => {
              this.actualizaStatus();
            }
          });
        break;        
    }
  }
  
  /**
   * Actualiza el status del producto
   */
  actualizaStatus(){
    this._route.params.subscribe( params =>{
      let id = + params['idProducto'];
      var identity = this._empleadoService.getIdentity();


      this._productoService.updateStatus(id,this.producto,identity).subscribe(
        response =>{
          if(response.status == 'success'){
            this.messageService.add({severity:'success', summary:'Estatus Actualizado', detail:'El producto: '+this.producto[0]['claveEx']+' se a actualizado'});
            //this._router.navigate(['./producto-modulo/producto-buscar']);
            this.getIdProduct();
          }
  
        }, error =>{
          console.log(error);
        });
    });
  }

  ngOnDestroy():void{
    
  }
}

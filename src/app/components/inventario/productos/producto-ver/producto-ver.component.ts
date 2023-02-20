import { Component, OnInit } from '@angular/core';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {ToastService} from 'src/app/services/toast.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { global } from 'src/app/services/global';

@Component({
  selector: 'app-producto-ver',
  templateUrl: './producto-ver.component.html',
  styleUrls: ['./producto-ver.component.css'],
  providers:[ProductoService]
})
export class ProductoVerComponent implements OnInit {


  public producto: Array<any>;

  public closeModal: string;

  public url:any;

  public value: any;

  public prod: Producto;
  public prodd: Producto;
 

  constructor( 
    private _productoService: ProductoService,
    private _router: Router,
    private _route: ActivatedRoute,
    public toastService: ToastService
    ){
    this.producto = [];
    this.closeModal='';
    this.url = global.url;
    this.prod =  new Producto(0,0,0,0,0,0,'',0,'',0,0,'',2,'','',null,0,null,0,0);
    this.prodd = new Producto(0,0,0,0,0,0,'',0,'',0,0,'',1,'','',null,0,null,0,0);
   }

  ngOnInit(): void {
    this.getIdProduct();
    
  }

  getIdProduct(){
     //Obtener el id del proveedor de la URL
     this._route.params.subscribe(params => {
      let id = + params['idProducto'];
      //console.log(id);

      //Peticion ajax para obtener los datos con base en el id del proveedor
    this._productoService.getProdver(id).subscribe(
      response =>{
        if(response.status == 'success' && response.producto.length > 0){
          this.producto = response.producto;
          this.value = this.producto[0]['cbarras'];
          console.log(this.producto);
        }else{
          this._productoService.getProdverDos(id).subscribe(
            response=>{
              this.producto = response.producto;
              //this.value = this.producto[0]['cbarras'];
              console.log(this.producto);
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

  onSubmitt(form:any){
    this._route.params.subscribe(params => {
      let id = + params['idProducto'];

    this._productoService.updateStatus(this.prod, id).subscribe(
      response =>{
        //console.log(response);
        this._router.navigate(['./producto-modulo/producto-deshabilitado']);
       this.toastService.show('Producto deshabilitado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
      },
      error =>{
        //console.log(this.prod);
        console.log(<any>error);
      this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
      }
    )
  });
  }
  onSubmit(form:any){
    this._route.params.subscribe(params => {
      let id = + params['idProducto'];

    this._productoService.updateStatus(this.prodd, id).subscribe(
      response =>{
        //console.log(response);
        this._router.navigate(['./producto-modulo/producto-buscar']);
       this.toastService.show('Producto: '+this.prodd.claveEx+' habilitado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
      },
      error =>{
        //console.log(this.prodd);
        console.log(<any>error);
      this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
      }
    )
  });
  }

}

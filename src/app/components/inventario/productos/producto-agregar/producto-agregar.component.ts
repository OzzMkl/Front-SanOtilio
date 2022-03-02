import { Component, OnInit } from '@angular/core';
import { global } from 'src/app/services/global';
import { Router, ActivatedRoute} from '@angular/router';

/*****SERVICIOS*/
import { MedidaService } from 'src/app/services/medida.service';
import { MarcaService } from 'src/app/services/marca.service';
import { DepartamentoService } from 'src/app/services/departamento.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import { SubCategoriaService } from 'src/app/services/subcategoria.service';
import { AlmacenService } from 'src/app/services/almacen.service';
import { ProductoService } from 'src/app/services/producto.service';
import {ToastService} from 'src/app/services/toast.service';
/** */
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
/** */
import { Lote} from 'src/app/models/lote';
import { Producto} from 'src/app/models/producto';

@Component({
  selector: 'app-producto-agregar',
  templateUrl: './producto-agregar.component.html',
  styleUrls: ['./producto-agregar.component.css'],
  providers: [MedidaService, MarcaService,DepartamentoService,
  CategoriaService, SubCategoriaService, AlmacenService,
  ProductoService]
})
export class ProductoAgregarComponent implements OnInit {
  
  
  public medidas: any;
  public marca: any;
  public departamentos: any;
  public categoria: any;
  public subcategoria: any;
  public almacenes: any;
  public closeModal: string;
  public lote: Lote;
  public loteC: any;
  public isChecked = false;
  public producto: Producto;
  public pd: any;
  public url: any;

  

  public a: number = 1;
  steps:any =1;


  public afuConfig = {
    multiple: false,
    formatsAllowed: ".jpg,.png,.jpeg",
    maxSize: .5,
    uploadAPI: {
      url: global.url+'productos/uploadimage',
    },
    theme: "attachPin", 
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn:false,
    replaceTexts:{
      attachPinBtn: 'Sube tu imagen ..'
    }
  };

  constructor(
    private _productoService: ProductoService,
    private _medidaService: MedidaService,
    private _marcaService: MarcaService,
    private _departamentosService: DepartamentoService,
    private _categoriaService: CategoriaService,
    private _subcategoriaService: SubCategoriaService,
    private _almacenService: AlmacenService,
    private modalService: NgbModal,
    public toastService: ToastService,
    private _router: Router,
    private _route: ActivatedRoute,

  ) {
    this.medidas= [];
    this.marca=[];
    this.departamentos=[];
    this.categoria = [];
    this.subcategoria =[];
    this.almacenes = [];
    this.closeModal ='';
    this.lote = new Lote ('','');
    this.producto = new Producto(0,0,0,0,0,0,'',0,'',0,0,'null',1,'','','',0,0,0,null,0,0);
    this.pd=[];
    this.url = global.url;
   }


  ngOnInit(): void {
    this.getMedida();
    this.getMarca();
    this.getDepartamentos();
    this.getCategoria();
    this.getSubcategoria();
    this.getAlmacen();
    this.getLote();
    this.getLP();
  }
  siguiente(){
    this.steps = this.steps +1;
  }
  regresar(){
    this.steps = this.steps -1;
  }
  submit(form:any){
    this.getLP();
    //console.log(this.pd.cbarras+1);
     this.producto.cbarras =  parseInt(this.pd.cbarras) + 1;
     //this.producto.cbarras =  parseInt(this.pd.cbarras) + 1;
    this._productoService.registerProducto(this.producto).subscribe(
      response =>{
        //console.log(response);
        this._router.navigate(['./producto-modulo/producto-buscar']);
        this.toastService.show('Producto guardado correctamente', { classname: 'bg-success text-light', delay: 5000 });
      },
      error =>{
        //console.log(this.producto);
        console.log(<any>error);
        this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
      }
    )
  }

  // /*CREACUION DE LOTE */
  // onSubmitt(form:any){
    
  //   this._productoService.registerLote(this.lote).subscribe(
  //     response =>{
  //       //console.log(response);
  //       this.toastService.show('Lote guardado correctamente', { classname: 'bg-success text-light', delay: 5000 });
  //       this.getLote();
  //     },
  //     error =>{
  //       //console.log(<any>error);
  //       this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
  //     }
  //   )
  // }


  /****SERVCIOS */
  getMedida(){
    this._medidaService.getMedidas().subscribe(
      response =>{
        if(response.status == 'success'){
          this.medidas = response.medidas;
          //navegacion de paginacion
          
          
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
  getSubcategoria(){
    this._subcategoriaService.getSubCategorias().subscribe(
      response =>{
        if(response.status == 'success'){
          this.subcategoria = response.subcategoria;
          
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
  getLote(){
     this._productoService.getLotes().subscribe(
        response =>{
          if(response.status == 'success'){
            this.loteC = response.loteC;
 
          }
        },
        error =>{
          console.log(error);
        }
      );
  }
  getLP(){
    this._productoService.getLastPro().subscribe(
       response =>{
         if(response.status == 'success'){
           this.pd = response.productos;

         }
       },
       error =>{
         console.log(error);
       }
     );
 }
  
  /***MODALES */
  triggerModal(content:any) {
      if(this.isChecked==true)
      this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((res) => {
        this.closeModal = `Closed with: ${res}`;
      }, (res) => {
        this.closeModal = `Dismissed ${this.getDismissReason(res)}`;
      });
  }
  private getDismissReason(reason: any): string {
      if (reason === ModalDismissReasons.ESC) {
        return 'by pressing ESC';
      } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
        return 'by clicking on a backdrop';
      } else {
        return  `with: ${reason}`;
      }
  }
   
  productImage(datos:any){
    console.log(datos.body.image);
    let data_image = datos.body.image;
    this.producto.imagen = data_image;
  }



}



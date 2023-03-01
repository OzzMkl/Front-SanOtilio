import { Component, OnInit } from '@angular/core';
import { CompraService } from 'src/app/services/compra.service';
import { HttpClient} from '@angular/common/http';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';
import { NgbModal, ModalDismissReasons, NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-compra-buscar',
  templateUrl: './compra-buscar.component.html',
  styleUrls: ['./compra-buscar.component.css'],
  providers: [CompraService]
})
export class CompraBuscarComponent implements OnInit {
  public userPermisos:any

  //public proveedores: Array<Proveedor>;
  public compras: Array<any> = [];

  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  
  public detallesCompra:any;
  public productosDOC:any;

  public tipoBusqueda: number = 1;
  //modal
  closeResult = '';
  //spinner
  public isLoading:boolean = false;
  //Subscripciones
  private getCompraSub : Subscription = new Subscription;

  constructor(
    private _compraService: CompraService,
    private _router: Router,
    private _http: HttpClient,
    private _modalService: NgbModal,
    private _empleadoService:EmpleadoService
  ) {}

  ngOnInit(): void {
    this.getComprasR();
  }

  //
  
  getComprasR(){
    //mostramos el spinner
    this.isLoading = true;


    this.getCompraSub = this._compraService.getComprasRecibidas().subscribe(
      response =>{
        if(response.status == 'success'){

          this.compras = response.compra.data;
          //navegacion de paginacion
          this.totalPages = response.compra.total;
          this.itemsPerPage = response.compra.per_page;
          this.pageActual = response.compra.current_page;
          this.next_page = response.compra.next_page_url;
          this.path = response.compra.path;

          //una vez terminado quitamos el spinner
          this.isLoading=false;
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  /**
   * 
   * @param page
   * Es el numero de pagina a la cual se va acceder
   * @description
   * De acuerdo al numero de pagina recibido lo concatenamos a
   * la direccion para "ir" a esa direccion y traer la informacion
   * no retornamos ya que solo actualizamos las variables a mostrar
   */
  getPage(page:number) {
    //iniciamos spinner
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        
        //asignamos datos a varibale para poder mostrarla en la tabla
        this.compras = response.compra.data;
        //navegacion de paginacion
        this.totalPages = response.compra.total;
        this.itemsPerPage = response.compra.per_page;
        this.pageActual = response.compra.current_page;
        this.next_page = response.compra.next_page_url;
        this.path = response.compra.path;

        //una vez terminado quitamos el spinner
        this.isLoading=false;        
    })
  }

  getSearchIdCompra(idCompra:any){

    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(idCompra.target.value == '' || idCompra.target.value == null ){
      this.getComprasR();
    }
    else{
      //componemos la palabra
      let idCom = idCompra.target.value;

      //generamos consulta
      this._compraService.getSearchIdCompra(idCom).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.compras = response.compra.data;
              //navegacion de paginacion
              this.totalPages = response.compra.total;
              this.itemsPerPage = response.compra.per_page;
              this.pageActual = response.compra.current_page;
              this.next_page = response.compra.next_page_url;
              this.path = response.compra.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }

  }

  getSearchNombreProveedor(nombreProveedor:any){

    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(nombreProveedor.target.value == '' || nombreProveedor.target.value == null ){
      this.getComprasR();
    }
    else{
      //componemos la palabra
      let nomPro = nombreProveedor.target.value;

      //generamos consulta
      this._compraService.getSearchNombreProveedor(nomPro).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.compras = response.compra.data;
              //navegacion de paginacion
              this.totalPages = response.compra.total;
              this.itemsPerPage = response.compra.per_page;
              this.pageActual = response.compra.current_page;
              this.next_page = response.compra.next_page_url;
              this.path = response.compra.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }

  }

  getSearchFolioProveedor(folioProveedor:any){

      //mostramos el spinner 
      this.isLoading = true;

      //si es vacio volvemos a llamar la primera funcion
      if(folioProveedor.target.value == '' || folioProveedor.target.value == null ){
        this.getComprasR();
      }
      else{
        //componemos la palabra
        let folioProv = folioProveedor.target.value;

        //generamos consulta
        this._compraService.getSearchFolioProveedor(folioProv).subscribe(
          response =>{
              if(response.status == 'success'){

                //asignamos datos a varibale para poder mostrarla en la tabla
                this.compras = response.compra.data;
                //navegacion de paginacion
                this.totalPages = response.compra.total;
                this.itemsPerPage = response.compra.per_page;
                this.pageActual = response.compra.current_page;
                this.next_page = response.compra.next_page_url;
                this.path = response.compra.path;
                
                //una ves terminado de cargar quitamos el spinner
                this.isLoading = false;
              }
          }, error =>{
              console.log(error)
          }
        )
      }

  }

  getSearchTotal(total:any){

    //mostramos el spinner 
    this.isLoading = true;

    //si es vacio volvemos a llamar la primera funcion
    if(total.target.value == '' || total.target.value == null ){
      this.getComprasR();
    }
    else{
      //componemos la palabra
      let tot = total.target.value;

      //generamos consulta
      this._compraService.getSearchTotal(tot).subscribe(
        response =>{
            if(response.status == 'success'){

              //asignamos datos a varibale para poder mostrarla en la tabla
              this.compras = response.compra.data;
              //navegacion de paginacion
              this.totalPages = response.compra.total;
              this.itemsPerPage = response.compra.per_page;
              this.pageActual = response.compra.current_page;
              this.next_page = response.compra.next_page_url;
              this.path = response.compra.path;
              
              //una ves terminado de cargar quitamos el spinner
              this.isLoading = false;
            }
        }, error =>{
            console.log(error)
        }
      )
    }

  }

  selected(idCompra:any){
    console.log('selected:' ,idCompra);
    this.getDetailsCompra(idCompra);
  }

  getDetailsCompra(idCompra:any){//recibimos el id y traemos informacion de esa compra
    this._compraService.getDetailsCompra(idCompra).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesCompra = response.compra;
          this.productosDOC = response.productos;

          console.log(this.detallesCompra);
          console.log(this.productosDOC);
        }else{ console.log('Algo salio mal');}
        
      },error => {
        console.log(error);
      });
  }

  // Modal
  open(content:any) {//abre modal
      this._modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  private getDismissReason(reason: any): string {//cierra modal con teclado ESC o al picar fuera del modal
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo();
  }

   /**
   * Destruye las subscripciones a los observables de regitro proveedor
   * y obtecion de bancos
   */
   ngOnDestroy(): void {
    this.getCompraSub.unsubscribe();
  }

}

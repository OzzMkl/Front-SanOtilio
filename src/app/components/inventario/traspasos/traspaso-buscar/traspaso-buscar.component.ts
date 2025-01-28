import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient} from '@angular/common/http';
import { TraspasoService } from 'src/app/services/traspaso.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
//primeng
import { MessageService, MenuItem,ConfirmationService, ConfirmEventType  } from 'primeng/api';
import { NgbDateStruct,NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-traspaso-buscar',
  templateUrl: './traspaso-buscar.component.html',
  styleUrls: ['./traspaso-buscar.component.css'],
  providers: [EmpleadoService, MessageService,ConfirmationService]
})
export class TraspasoBuscarComponent implements OnInit {

  //variables servicios
  public traspasos: Array<any> = [];
  //Buscador
  public tipoBusqueda: string = 'Envia';
  public search: string = '';
  public date_actual: Date = new Date();
  public datInicial: NgbDateStruct= { year:this.date_actual.getFullYear() , month:this.date_actual.getMonth(), day: this.date_actual.getDate()};
  public datFinal: NgbDateStruct= { year:this.date_actual.getFullYear() , month:this.date_actual.getMonth(), day: this.date_actual.getDate()};
  //spinner
  public isLoading:boolean = false;
  //PERMISOS
  public userPermisos:any = [];
  public mTras = this._modulosService.modsTraspaso();
  public identity: any;
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;
  /**PAGINATOR */
  public totalPages: any;
  public path: any;
  public next_page: any;
  public prev_page: any;
  public itemsPerPage:number=0;
  pageActual: number = 0;
  //////////
  items: MenuItem[] =[];
  //Modal
  closeResult = '';
  //Paginacion MODAL
  pageActualM: number = 0;
  //Datos para modal
  public detallesTraspaso:any;
  public productosDT:any;
  //Modal para cancelación
  public motivo:string = '';
  //Ayudantes
  public isHidden = true;
  public isHiddenRec = true;

  public isLoadingGeneral: boolean = true;

  //Observaciones
  public observaciones:any = '';


  constructor(
    private _empleadoService: EmpleadoService,
    private _modulosService: ModulosService,
    private _traspasoService: TraspasoService,
    private messageService: MessageService,
    private _router: Router,
    private _http: HttpClient,
    private _modalService: NgbModal,
    private _confirmationService:ConfirmationService
  ) { }

  ngOnInit(): void {
    this.loadUser();
  }

   /**
  * Funcion que carga los permisos
  */
   loadUser(){
     this.userPermisos = this._empleadoService.getPermisosModulo(this.mTras.idModulo, this.mTras.idSubModulo);
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
       
         this.getTrasp();
         this.menuBusqueda();
         this.identity = this._empleadoService.getIdentity();
         
         }
   }

   getTrasp(){
    //Mostramos spinner de carga
    // this.isLoading = true;
    this.isLoadingGeneral =true;
    // let str_datInicial = this.datInicial.year+'-'+this.datInicial.month+'-'+this.datInicial.day;
    // let str_datFinal = this.datFinal.year+'-'+this.datFinal.month+'-'+this.datFinal.day;
    this.tipoBusqueda == 'Envia' ? this.isHidden = false : this.isHidden = true;
    //ejecutamos el servicio
    this._traspasoService.getTraspasos(this.tipoBusqueda,this.search).subscribe(
      response =>{
        console.log(response);
        if(response.status == 'success'){
          this.traspasos = response.traspasos.data;
          //paginacion
          this.totalPages = response.traspasos.total;
          this.itemsPerPage = response.traspasos.per_page;
          this.pageActual = response.traspasos.current_page;
          this.next_page = response.traspasos.next_page_url;
          this.path = response.traspasos.path;

          //quitamos spinner
          // this.isLoading = false;
          this.isLoadingGeneral =false;
        }
        // console.log(response)
      }, error=>{
        this.messageService.add({severity:'error', summary:'Ocurrio un error', detail: 'Fallo al obtener los traspasos.'});
        console.log(error);
      });
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
    //mostramos el spinner
    this.isLoading = true;

    this._http.get(this.path+'?page='+page).subscribe(
      (response:any) => {
        //console.log(response);
        this.traspasos = response.traspasos.data;
        //navegacion paginacion
        this.totalPages = response.traspasos.total;
        this.itemsPerPage = response.traspasos.per_page;
        this.pageActual = response.traspasos.current_page;
        this.next_page = response.traspasos.next_page_url;
        this.path = response.traspasos.path
        
        //una vez terminado de cargar quitamos el spinner
        this.isLoading = false;
    })
  }

   /**
   * @description
   * Obtiene la informacion del input y busca
   */
  selectBusqueda(){
      
      if(this.search == "" || null){
      
        this.getTrasp();
    } else{
      this.getTrasp();
      }//finelse
  }//finFunction

  menuBusqueda(){
    this.items = [
      {
        icon:'pi pi-pencil',
        command: () => {
          this.messageService.add({ severity: 'info', summary: 'Add', detail: 'Data Added' });
        }
      },
      {
          icon: 'pi pi-refresh',
          command: () => {
              this.messageService.add({ severity: 'success', summary: 'Update', detail: 'Data Updated' });
          }
      }];
  }


  /**MODAL */

  open(content:any) {//abre modal
    this._modalService.open(content, {ariaLabelledBy: 'modal-basic-title', size: 'xl'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // this.tipoBusqueda = 'Envia';
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

  resetVariables(){
    this.pageActualM = 0;
    this.detallesTraspaso = '';
    this.productosDT = '';
    this.motivo = '';
  }

  getDetailsTraspaso(idTraspaso:any,tipoTraspaso:any){
    //console.log(idTraspaso);
    //console.log(tipoTraspaso);
    this._traspasoService.getDetailsTraspaso(idTraspaso,tipoTraspaso).subscribe(
      response =>{
        if(response.status == 'success'){
          this.detallesTraspaso = response.traspaso; 
          this.productosDT = response.productos;
          this.isHiddenRec = (this.detallesTraspaso[0].idStatus == 50 && this.tipoBusqueda == 'Recibe' ) ? false : true;
          this.observaciones = this.detallesTraspaso[0].observaciones;
          //console.log('response',this.detallesTraspaso[0].idStatus);
          console.log('traspaso',this.detallesTraspaso);
          // if(this.detallesTraspaso[0].sucursalE == this.detallesTraspaso[0].sucursalR){
          //   this.tipoBusqueda = 'Uso interno';}
          
          // console.log('productos',this.productosDT);

        }else{ console.log('Algo salio mal'); }
        
      },error => {
        console.log(error);
      });
  }

  public createPDF(idTraspaso:number,tipoTraspaso:any):void{//Crear PDF
    // console.log(idTraspaso);
    // console.log(tipoTraspaso);
    this._traspasoService.getPDF(idTraspaso,this.identity['sub'],tipoTraspaso).subscribe(
      (pdf: Blob) => {
        const blob = new Blob([pdf], {type: 'application/pdf'});
        const url = window.URL.createObjectURL(blob);
        window.open(url);
        this._router.navigate(['./traspaso-modulo/traspaso-buscar']);
      }
    );
  }

  confirmCan() {
    if(this.motivo.length < 10){
      this.messageService.add({severity:'error', summary:'Advertencia', detail: 'El motivo de la cancelación tiene que contener minimo 10 caracteres.'});
    }
    else{
      this._confirmationService.confirm({
        message: '¿Está seguro(a) que desea cancelar el traspaso?',
        header: 'Advertencia',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          //this.messageService.add({severity:'info', summary:'Confirmado', detail:'Compra'});
          this.cancelarTraspaso();
        },
        reject: (type:any) => {
          switch(type) {
              case ConfirmEventType.REJECT:
                  this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Cancelación de traspaso cancelada.'});
              break;
              case ConfirmEventType.CANCEL:
                  this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Cancelación de traspaso cancelada.'});
              break;
          }
        }
      });
    }
  }

  public cancelarTraspaso(){
    // console.log(this.detallesCompra[0]['idCompra']);
    // console.log(this.motivo);
    // console.log(this.identity['sub']);

    this._traspasoService.cancelarTraspaso(this.detallesTraspaso[0]['idTraspaso'],this.tipoBusqueda,this.motivo,this.identity['sub']).subscribe(
      response =>{
        if(response.status == 'success'){
          console.log(response);
          this.messageService.add({severity:'success', summary:'Éxito', detail:'Traspaso cancelado'});
          this._modalService.dismissAll();
          this.getTrasp();
          this.resetVariables();
        }else{
          this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al cancelar el traspaso'});
        }
      },
      error =>{
        this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al cancelar el traspaso'});
        console.log(error);
      }
    )
  }

  public editarTraspaso(traspaso:any){
    //console.log(compra.created_at);
    const resultado = new Date(traspaso.created_at);
    resultado.setDate(resultado.getDate()+15);
    //console.log(resultado);
    const fechaActual = new Date();
    //console.log(fechaActual);
    if(resultado>fechaActual){
      //this.messageService.add({severity:'success', summary:'Éxito', detail:'Si se puede'});
      this._modalService.dismissAll('Cross click');
      this._router.navigate(['../traspaso-modulo/traspaso-editar/',traspaso.idTraspaso,this.tipoBusqueda]);
    }else{
      this.messageService.add({severity:'warn', summary:'Aviso', detail:'No se puede modificar un traspaso con más de 15 días de antiguedad'});
    }

  }

  public recibirTraspaso(){
    console.log('recibirTraspaso');
    this._confirmationService.confirm({
      message: '¿Está seguro(a) que desea ingresar el traspaso?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.detallesTraspaso[0].observaciones = this.observaciones;
        this._traspasoService.recibirTraspaso(this.detallesTraspaso[0]['idTraspasoR'],this.identity['sub'],this.detallesTraspaso[0].observaciones).subscribe(
          response =>{
            if(response.status == 'success'){
              console.log(response);
              this.messageService.add({severity:'success', summary:'Éxito', detail:'Traspaso ingresado'});
              this._modalService.dismissAll();
              this.getTrasp();
              this.resetVariables();
            }else{
              this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al ingresar el traspaso'});
            }
          },
          error =>{
            this.messageService.add({severity:'error', summary:'Error', detail:'Fallo al ingresar el traspaso'});
            console.log(error);
          }
        )

        
        
      },
      reject: (type:any) => {
        switch(type) {
            case ConfirmEventType.REJECT:
                this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Ingreso de traspaso cancelada.'});
            break;
            case ConfirmEventType.CANCEL:
                this.messageService.add({severity:'warn', summary:'Cancelado', detail:'Ingreso de traspaso cancelada.'});
            break;
        }
      }
    });
  }

}

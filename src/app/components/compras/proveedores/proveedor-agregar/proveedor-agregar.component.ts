import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Subscription } from 'rxjs';
//Servicios
import { ProveedorService } from 'src/app/services/proveedor.service';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ModulosService } from 'src/app/services/modulos.service';
import { BancoService } from 'src/app/services/banco.service';
//Modelos
import { Proveedor } from 'src/app/models/proveedor';
import { Banco } from 'src/app/models/banco';
//primeng
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-proveedor-agregar',
  templateUrl: './proveedor-agregar.component.html',
  styleUrls: ['./proveedor-agregar.component.css'],
  providers:[ProveedorService,BancoService]  
})
export class ProveedorAgregarComponent implements OnInit, OnDestroy {

  public proveedor: Proveedor= new Proveedor(0,'','','','','','','','','','',0,0,29,'','','','','','','','','');//Modelo del proveedor
  public banco: Array<Banco> = [];//Array de modelos del objeto banco
  public checkContacto: boolean = false;
  public checkNcp: boolean = false;
  //PERMISOS
  public userPermisos:any = [];
  public mProv = this._modulosService.modsProveedores();
  //contador para redireccion al no tener permisos
  counter: number = 5;
  timerId:any;

  //subscripciones
  private registraProveedor: Subscription = new Subscription;
  private getBancoSub: Subscription = new Subscription;
  
  constructor(  private _proveedorService: ProveedorService,
                private _empleadoService: EmpleadoService,
                private _modulosService: ModulosService,
                private _bancoService: BancoService,
                private messageService: MessageService,
                private _router: Router,
                ) { }

  ngOnInit(): void {
    this.loadUser(); 

  }

  /**
  * Funcion que carga los permisos
  */
  loadUser(){
    this.userPermisos = this._empleadoService.getPermisosModulo(this.mProv.idModulo, this.mProv.idSubModulo);
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
          this.getBanco();
        }
  }

  /**
   * Recibe la informacion del formulario
   * Y registra la informacion del formulario
   * @param form 
   */
  onSubmit(form:any){
    var identity = this._empleadoService.getIdentity();
    //console.log(this.proveedor);
    if(this.checkContacto){
      this.proveedor.nombreCon = 'XXXXX';
      this.proveedor.emailCon = 'XXXXX';
      this.proveedor.telefonoCon = 'XXXXX';
      this.proveedor.puestoCon = 'XXXXX';
    }
    if(this.checkNcp){
      this.proveedor.ncuenta = '00000000';
      this.proveedor.idBanco = '2';
      this.proveedor.titular = 'xxxxx';
      this.proveedor.clabe = '000000000000000000';
    }

    this.registraProveedor =  this._proveedorService.register(this.proveedor,identity).subscribe(
       response =>{ 
         //console.log(response);
        //  this.toastService.show('Proveedor guardado correctamente', { classname: 'bg-success text-light', delay: 5000 }); 
         form.reset();
         this._router.navigate(['./proveedor-modulo/proveedorBuscar']);
        },
       error => {
        //  this.toastService.show('Ups... Algo salio mal', { classname: 'bg-danger text-light', delay: 15000 });
         console.log(<any>error);
       }
     )
  }

  /**
   * Trae la informacion de los bancos que se tienen registradros en la DB
   */
  getBanco(){
    //console.log(this.banco);
    this.getBancoSub = this._bancoService.getBancos().subscribe(
      response =>{
        if(response.status == 'success'){
          this.banco = response.proveedores;
          //console.log(response.proveedores);
        }
      },
      error =>{
        console.log(error);
      }
    );
  }

  checkedContacto(event:any){
    console.log(event)
  }

  /**
   * Destruye las subscripciones a los observables de regitro proveedor
   * y obtecion de bancos
   */
  ngOnDestroy(): void {
    this.registraProveedor.unsubscribe();
    this.getBancoSub.unsubscribe();
  }

}

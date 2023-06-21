import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
//Servicios
import { EmpleadoService } from '../services/empleado.service';
import { ToastService } from '../services/toast.service';
//primeng
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ProveedorGuard implements CanActivate {

  
  public user:any
  public userPermisos:any
  public roles:any
  public check: boolean = false
  idModulo=3;
  idSubModulo=88;

  constructor(private _router: Router,
              private _empleadoService: EmpleadoService,
              private messageService: MessageService,
              public toastService: ToastService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      //variable para obtener el token del localstorage
      const token = this._empleadoService.getToken();
      //validamos el token
      if(token != null ){
        //check = true
        this.validaPermiso();
        //this.validateRol()
      }else{
        this._router.navigate(['/login'])
      }
      
      return false;
  }

  //validamos el rol
  // private async validateRol(){
  //   //obtenemos datos del localstorage
  //   this.user = this._empleadoService.getIdentity()
  //   //ejecutamos consulta
  //   return  this._empleadoService.getRolesBySubmodulo(this.idSubModulo).subscribe( 
  //       response =>{
  //         this.roles= response.roles
  //       //si el rol exoste en la lista de roles
  //       if(this.roles.find((items:any)=> items.idRol === this.user['idRol']) != undefined){
  //         //traemos sus  permisos
  //         return this.validatePermissions()
  //       }else{
  //         //si no lo encuentra no tiene permisos y retornamos un false
  //         this.toastService.show('Acceso denegado', { classname: 'bg-danger  text-light', delay: 5000 });
  //           false
  //       }
  //       }
        
  //     )
  // }
  //revisamos permisos
  //  private  validatePermissions(){
  //    this._empleadoService.getPermisos(this.user['idRol'],this.idModulo,this.idSubModulo).subscribe(
  //      response =>{
  //        this.userPermisos = response.permisos
  //        if(this.userPermisos.length > 0){
  //           //console.log(this.userPermisos)
  //           /****** */
  //           localStorage.removeItem('PermisosModulo');
  //           localStorage.setItem('PermisosModulo', JSON.stringify(this.userPermisos));//guardamos la identidad y convertimos el objeto javascript a un objeto json
  //           /****** */
  //           return this.check=true;
  //        }else{
         
  //         this.toastService.show('Acceso denegado', { classname: 'bg-danger  text-light', delay: 5000 });
  //         return false
  //        }
        
  //      }
  //    )

  // }

  private validaPermiso(){
    //obtenemos datos del localstorage
    this.user = this._empleadoService.getIdentity();
    //console.log(this.user.permisos);

    var userPermi = this.user.permisos.find((x:any) => x.idModulo == this.idModulo && x.idSubModulo == this.idSubModulo);
    
    if( userPermi == undefined){
      this.toastService.show('Acceso denegado', { classname: 'bg-danger  text-light', delay: 5000 });
      this.messageService.add({severity:'success', summary:'Registro exitoso', detail: 'Cliente registrado correctamente'});
      return false;
    } else{
      return true;
    }
  }
}

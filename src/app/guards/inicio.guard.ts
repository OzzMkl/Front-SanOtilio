import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../services/empleado.service';
import { ToastService } from 'src/app/services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class InicioGuard implements CanActivate {

  public user:any
  public userPermisos:any
  public roles:any
  public check: boolean = false
  idModulo=3
  idSubModulo=6

  constructor(private _router: Router, private _empleadoService: EmpleadoService, public toastService: ToastService){}


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const token = this._empleadoService.getToken();

       if(token != null ){
         //check = true
         this.validateRol()
       }else{
         this.check = false;
       }
    
    return this.check
  }

  private async validateRol(){
    this.user = this._empleadoService.getIdentity()
    await  this._empleadoService.getRolesBySubmodulo(this.idModulo).subscribe( 
        response =>{
          this.roles= response.roles
        if(this.roles.find((items:any)=> items.idRol === this.user['idRol']) != 'undefined'){
          
          return this.validatePermissions();
        }else{
           console.log('no tiene permisos');
           return false
        }
        }
      )
  }
  private async validatePermissions(){
   await this._empleadoService.getPermisos(this.user['idRol'],this.idModulo,this.idSubModulo).subscribe(
     response =>{
       this.userPermisos = response.permisos
       if(this.userPermisos.length > 0){
          console.log(this.userPermisos)
          return true;
       }else{
        
        this.toastService.show('Acceso denegado', { classname: 'bg-danger  text-light', delay: 5000 });
        return false
       }
       
     }
   )

 }
  
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../services/empleado.service';
import { ToastService } from 'src/app/services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class OrdencompraGuardGuard implements CanActivate {

  public user:any
  public userPermisos:any
  public roles:any
  public check: boolean = false
  idModulo=3
  idSubModulo=6

  constructor(private _router: Router,
              private _empleadoService: EmpleadoService, 
              public toastService: ToastService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      //variable para obtener el token del localstorage
      const token = this._empleadoService.getToken();
      //validamos el token
      if(token != null ){
        //check = true
        this.validateRol()
      }else{
        this._router.navigate(['/login'])
      }
      
      return this.check
  }

  

  //validamos el rol
  private async validateRol(){
    //obtenemos datos del localstorage
    this.user = this._empleadoService.getIdentity()
    //ejecutamos consulta
    await  this._empleadoService.getRolesBySubmodulo(this.idSubModulo).subscribe( 
        response =>{
          this.roles= response.roles
        //si el rol exoste en la lista de roles
        if(this.roles.find((items:any)=> items.idRol === this.user['idRol']) != undefined){
          //traemos sus  permisos
              
              this._empleadoService.getPermisos(this.user['idRol'],this.idModulo,this.idSubModulo).subscribe(
                response =>{
                  this.userPermisos = response.permisos
                  if(this.userPermisos.length > 0){
                     //console.log(this.userPermisos)
                     /****** */
                     localStorage.removeItem('PermisosModulo');
                     localStorage.setItem('PermisosModulo', JSON.stringify(this.userPermisos));//guardamos la identidad y convertimos el objeto javascript a un objeto json
                     /****** */
                     return this.check=true;
                  }else{
                   
                   this.toastService.show('Acceso denegado', { classname: 'bg-danger  text-light', delay: 5000 });
                   return false
                  }
                  
                }
              )
        }else{
          //si no lo encuentra no tiene permisos y retornamos un false
           console.log('no tiene permisos');
            false
        }
        }
      )
  }
  //revisamos permisos
  private  validatePermissions(){
    

 }
}

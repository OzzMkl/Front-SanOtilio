import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { Observable } from 'rxjs';
//Servicios
import { EmpleadoService } from '../services/empleado.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorGuard implements CanActivate {

  //declaramos variables a usar
  public empleado:any
  public empleadoPermisos:any
  public roles:any
  public check: boolean = false
  //declaramos propiedades del modulo
  idModulo=0
  idSubmodulo=0
  constructor(private _router: Router, private _empleadoService: EmpleadoService, public toastService: ToastService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      //obtenemos el token del localStorage
      const token = this._empleadoService.getToken();
      //validamos el token
      if(token != null){
        this.check=true
      } else{
        this._router.navigate(['/login'])
      }
    return this.check;
  }

  //validacion de rol
  private validateRol(){
    this.empleado = this._empleadoService.getIdentity()
    this._empleadoService.getRolesBySubmodulo(this.idSubmodulo).subscribe(
      response =>{

        this.roles = response.roles
        //Si el rol existe dentro de la lista de roles avanzamos
        if(this.roles.find((items:any) => items.idRol === this.empleado['idRol']) != undefined){
          this._empleadoService.getPermisos(this.empleado['idRol'],this.idModulo,this.idSubmodulo).subscribe(
            response =>{
              this.empleadoPermisos = response.permisos 
              if(this.empleadoPermisos.length > 0){
                localStorage.removeItem('PermisosModulo')
                localStorage.setItem('PermisosModulo', JSON.stringify(this.empleadoPermisos));
                return this.check = true
              } else{
                return this.check
              }
            }
          )
        } else{
          console.log('No tiene permisos');
          
        }
      }
    )
  }
  
}

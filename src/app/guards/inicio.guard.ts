import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../services/empleado.service';

@Injectable({
  providedIn: 'root',
})
export class InicioGuard implements CanActivate {

  constructor(private _router: Router, private _empleadoService: EmpleadoService){}

  // redirect(flag: boolean):any{
  //   if(!flag){
  //     this._router.navigate(['inicio'])
  //   }
  //   this._router.navigate(['login'])
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // let check = false;
//       const token = this._empleadoService.getToken();

      // if(token != null ){
      //   check = true
      // }else{
      //   check = false;
      // }
      // this.redirect(check)
    //return check;
    
      const permisos = this._empleadoService.getPermisos();

    //suponiendo que estamos en el modulo de compras
    const idModulo=3;
    //y en el submodulo de orden de compra
    const idSubModulo=6;

    const idRol = this._empleadoService.getToken();

    const userArray=[idRol['idRol'],idModulo,idSubModulo];
    return true;
  }
  
}

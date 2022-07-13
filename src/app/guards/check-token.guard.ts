import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../services/empleado.service';

@Injectable({
  providedIn: 'root'
})
export class CheckTokenGuard implements CanActivate {

  public check: boolean = false

  constructor(private _router: Router, private _empleadoService: EmpleadoService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      //variable para obtener el token del localstorage
      const token = this._empleadoService.getToken();
      //validamos el token
      if(token != null ){
        //check = true
        this.check= true
        
      }else{
        this._router.navigate(['/login'])
      }
      return this.check;
  }
  
}

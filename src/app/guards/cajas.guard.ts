import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../services/empleado.service';
import { ModulosService } from '../services/modulos.service';
//Primeng
import { MessageService } from 'primeng/api';
// utileria
import { validaPermiso } from '../utils/permisos-util';

@Injectable({
  providedIn: 'root'
})
export class CajasGuard implements CanActivate {

  public user: any;
  public check: boolean = false;
  private mCaja = this._modulosService.modsCaja();

  constructor(
    private _router: Router,
    private _empleadoService: EmpleadoService,
    private _modulosService: ModulosService,
    private messageService: MessageService
  ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      //traemos el token de localstorage
      const token = this._empleadoService.getToken();

      //validamos que exista el token
      if(token != null){
        // obtenemos os datos del localstorage
        this.user = this._empleadoService.getIdentity();
        // usamos la funcion de la utileria enviando la info del usuario, modulos y el servicio de message
        this.check = validaPermiso(this.user,this.mCaja, this.messageService);
      } else{
        this.messageService.add({
                  severity:'error', 
                  summary:'Acceso denegado', 
                  detail: 'Favor de iniciar sesión.'
                });
        this._router.navigate(['/login']);
      }
      return this.check;
  }
  
}

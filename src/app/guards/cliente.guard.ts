import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EmpleadoService } from '../services/empleado.service';
//primeng
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ClienteGuard implements CanActivate {

  public user:any;
  public check: boolean = false;
  idModulo=6;
  idSubModulo=20;

  constructor(private _router: Router,
              private _empleadoService: EmpleadoService, 
              private messageService: MessageService,){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      //variable para obtener el token del localstorage
      const token = this._empleadoService.getToken();
      //validamos el token
      if(token != null ){
        //check = true
        this.validaPermiso();
      }else{
        this._router.navigate(['/login']);
      }
      
      return this.check;
  }

  private validaPermiso(){
    //obtenemos datos del localstorage
    this.user = this._empleadoService.getIdentity();
    //console.log(this.user.permisos);

    /**
     * Bucamos en los permisos guardados en el navegador el modulo y su submodulo si lo encuentra este ingresa al modulo
     */
    var userPermi = this.user.permisos.find((x:any) => x.idModulo == this.idModulo && x.idSubModulo == this.idSubModulo);
    
    if( userPermi == undefined){
      //this.toastService.show('Acceso denegado', { classname: 'bg-danger  text-light', delay: 5000 });
      this.messageService.add({severity:'error', summary:'Acceso denegado', detail: 'El usuario no cuenta con los permisos necesarios'});

      return false;

    } else{

      return this.check= true;

    }
  }
 
}

//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable()
export class EmpleadoService{
    public url: string;//declaramos la url publica a usar para todas las peticiones
    public identity: any;
    public token: any;
    /****** */
    public permisos: any;
    /****** */

    constructor( public _http: HttpClient ){ this.url = global.url; }

    signup(empleado:any, getToken = null): Observable<any>{//creamos metodo de inicio de sesion
        if(getToken != null){//comunicandose con la api de laravel jalamos el token y si es diferente de vacio 
            empleado.getToken = 'true';
        }
        let json = JSON.stringify(empleado);
        let params = 'json='+json;
        
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
        return this._http.post(this.url+'login',params, {headers:headers} );
    }

   getIdentity(){//obtener la informacion del usuario identificado guardado localmente con localStorage IDENTITY
    
    let identity = JSON.parse(localStorage.getItem('identity') || '{}');
        if(identity && identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }
    /************ */
    getPermisosModulo(idModulo:number, idSubModulo:number){
        
        var user = this.getIdentity();

        var permisos = user.permisos.find((x:any) => x.idModulo == idModulo && x.idSubModulo == idSubModulo);

        if(permisos && permisos != undefined){
            this.permisos = permisos;
        } else{
            this.permisos = null;
        }
        return this.permisos;
    }
    /************ */
    getToken(){//obtener la informacion del usuario identificado guardado localmente TOKEN
        let token = localStorage.getItem('token');
        if(token != "undefined"){
            this.token = token;
        }else{
            this.token = null;
        }
        return this.token;
    }

    getPermisos(idRol:number,idModulo:number,idSubModulo:number):Observable<any>{
        // let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        // return this._http.get(this.url+'permisos', {headers:headers} );
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'PermissionsByRol/'+idRol+'/'+idModulo+'/'+idSubModulo, {headers:headers});
    }
    getRolesBySubmodulo(idSubModulo:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'RolesBySubmodulo/'+idSubModulo, {headers:headers} );
    }

}
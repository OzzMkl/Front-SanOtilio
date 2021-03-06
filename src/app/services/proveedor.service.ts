//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable()
export class ProveedorService{
    public url: string;//declaramos la url publica a usar para todas las peticiones


    constructor(
        public _http: HttpClient
    ){
        this.url = global.url;
    }
    test(){//prueba
        return "Hola mundo esto es un servicio";
    }

    register(proveedor:any): Observable<any>{
        let json = JSON.stringify(proveedor);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
        return this._http.post(this.url+'proveedor/register',params, {headers:headers} );
    }
    getProveedores():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'proveedor/index', {headers:headers} );
    }
    getProveedoresDes():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'proveedor/proveedoresDes', {headers:headers} );
    }
    getProveedoresVer(idProveedor:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'proveedor/'+idProveedor, {headers:headers} );
    }
    /*Contacto*/
    getContactos(idProveedor:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'proveedor/provContactos/'+idProveedor, {headers:headers} );
    }
    /*Numero de cuenta*/
    getNcps(idProveedor:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'proveedor/getNCP/'+idProveedor, {headers:headers} );
    }
    updateStatus( prove:any, idProveedor:any):Observable<any>{
        let json = JSON.stringify(prove);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.put(this.url + 'proveedor/updatestatus/'+idProveedor,params,{headers: headers});
    }
    
    



//     signup(empleado:any, getToken = null): Observable<any>{//creamos metodo de inicio de sesion
//         if(getToken != null){//comunicandose con la api de laravel jalamos el token y si es diferente de vacio 
//             empleado.getToken = 'true';
//         }
//         let json = JSON.stringify(empleado);
//         let params = 'json='+json;
        
//         let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
//         return this._http.post(this.url+'login',params, {headers:headers} );
//     }

//    getIdentity(){//obtener la informacion del usuario identificado guardado localmente con localStorage IDENTITY
    
//     let identity = JSON.parse(localStorage.getItem('identity') || '{}');
//         if(identity && identity != "undefined"){
//             this.identity = identity;
//         }else{
//             this.identity = null;
//         }
//         return this.identity;
//     }
//     getToken(){//obtener la informacion del usuario identificado guardado localmente TOKEN
//         let token = localStorage.getItem('token');
//         if(token != "undefined"){
//             this.token = token;
//         }else{
//             this.token = null;
//         }
//         return this.token;
//     }

}
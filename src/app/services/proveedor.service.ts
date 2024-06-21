//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable()
export class ProveedorService{
    //declaramos la url publica a usar para todas las peticiones
    public url: string = global.url;
    //declaramos las cabeceras
    public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');


    constructor( public _http: HttpClient ){ }

    register(proveedor:any, empleado:any): Observable<any>{
        let combinado = {...proveedor, sub: empleado.sub};
        let json = JSON.stringify(combinado);
        let params = 'json='+json;
        return this._http.post(this.url+'proveedor/register',params, {headers:this.headers} );
    }

    getProveedores(type:number, search:string, status:Array<any>, page:number):Observable<any>{
        return this._http.get(this.url+
                                'proveedor/index'+
                                '?search='+search+
                                '&type='+type+
                                '&status='+status+
                                '&page='+page,
                                {headers:this.headers} 
                            );
    }

    getProveedoresSelect():Observable<any>{
        return this._http.get(this.url+'proveedor/ObtenerLista', {headers:this.headers} );
    }

    getProveedoresVer(idProveedor:any):Observable<any>{
        return this._http.get(this.url+'proveedor/'+idProveedor, {headers:this.headers} );
    }
    /*Contacto*/
    getContactos(idProveedor:any):Observable<any>{
        return this._http.get(this.url+'proveedor/provContactos/'+idProveedor, {headers:this.headers} );
    }
    /*Numero de cuenta*/
    getNcps(idProveedor:any):Observable<any>{
        return this._http.get(this.url+'proveedor/getNCP/'+idProveedor, {headers:this.headers} );
    }

    updateStatus(idProveedor:number,idUsuario:number):Observable<any>{
        let json = JSON.stringify(idUsuario);
        let params = 'json='+json; 
        return this._http.put(this.url+'proveedor/updatestatus/'+idProveedor,params,{headers:this.headers})
    }
}
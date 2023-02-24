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

    register(proveedor:any): Observable<any>{
        let json = JSON.stringify(proveedor);
        let params = 'json='+json;
        return this._http.post(this.url+'proveedor/register',params, {headers:this.headers} );
    }
    getProveedores():Observable<any>{
        return this._http.get(this.url+'proveedor/index', {headers:this.headers} );
    }
    getProveedoresDes():Observable<any>{
        return this._http.get(this.url+'proveedor/proveedoresDes', {headers:this.headers} );
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
    updateStatus( prove:any, idProveedor:any):Observable<any>{
        let json = JSON.stringify(prove);
        let params = 'json='+json;
        return this._http.put(this.url + 'proveedor/updatestatus/'+idProveedor,params,{headers:this.headers});
    }

    searchNombreProveedor(nombreProveedor:string):Observable<any>{
        return this._http.get(this.url+'proveedor/searchNombreProveedor/'+nombreProveedor,{headers:this.headers});
    }

}
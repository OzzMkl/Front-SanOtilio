//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 
import { Subcategoria } from "../models/subcategoria";

@Injectable()
export class SubCategoriaService{
    public url: string;//declaramos la url publica a usar para todas las peticiones


    constructor(
        public _http: HttpClient
    ){
        this.url = global.url;
    }
    test(){//prueba
        return "Hola mundo esto es un servicio";
    }

    // register(proveedor:any): Observable<any>{
    //     let json = JSON.stringify(proveedor);
    //     let params = 'json='+json;
    //     let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    //     return this._http.post(this.url+'proveedor/register',params, {headers:headers} );
    // }
    getSubCategorias():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'subcategoria/index', {headers:headers} );
    }

    fillSubCategorias(id:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'subcategoria/getIdSuca/'+id, {headers:headers} );
    }

    // getProveedoresDes():Observable<any>{
    //     let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    //     return this._http.get(this.url+'proveedor/proveedoresDes', {headers:headers} );
    // }
}
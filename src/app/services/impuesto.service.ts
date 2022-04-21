//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 


@Injectable()
export class ImpuestoService{
    public url: string;//declaramos la url publica a usar para todas las peticiones


    constructor(public _http: HttpClient){
        this.url = global.url;
    }

 
    getImpuestos():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'impuesto/index', {headers:headers} );
    }

    getImpuestoVer(idImpuesto:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'impuesto/show/'+idImpuesto, {headers:headers} );
    }
}
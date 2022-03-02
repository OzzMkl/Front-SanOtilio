import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable({
  providedIn: 'root'
})
export class OrdendecompraService {

  public url : string;

  constructor( public _http: HttpClient ) { this.url = global.url; }

  registerOrdencompra(orden:any):Observable<any>{
    let json = JSON.stringify(orden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'ordendecompra/register',params, {headers:headers} );
  }
  registerProductoscompra(Productosorden:any):Observable<any>{
    let json = JSON.stringify(Productosorden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'ordendecompra/registerLista',params, {headers:headers} );
  }
}

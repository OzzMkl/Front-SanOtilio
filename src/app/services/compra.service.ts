import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { global } from "./global"; 

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  public url : string;

  constructor( public _http: HttpClient ) { this.url = global.url; }

  registrerCompra(compra:any):Observable<any>{
    let json = JSON.stringify(compra);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'compra/register',params, {headers:headers} );
  }

}

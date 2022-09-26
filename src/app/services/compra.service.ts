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

  getLastCompra():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'compra/getLastCompra', {headers:headers} );
  }

  getDetailsCompra(idCompra:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'compra/showMejorado/'+idCompra, {headers:headers} );
  }

  registerProductoscompra(ProductosCompra:any):Observable<any>{
    let json = JSON.stringify(ProductosCompra);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'compra/registerLista',params, {headers:headers} );
  }

  updateExistencia(ProductosCompra:any):Observable<any>{
    let json = JSON.stringify(ProductosCompra);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'compra/updateExistencia',params, {headers:headers} );
  }

  registerLote():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'compra/registerLote', {headers:headers} );
  }

}

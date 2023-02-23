import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { global } from "./global"; 

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  public url : string;
  public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

  constructor( public _http: HttpClient ) { this.url = global.url; }

  registrerCompra(compra:any):Observable<any>{
    let json = JSON.stringify(compra);
    let params = 'json='+json;
    return this._http.post(this.url+'compra/register',params, {headers:this.headers} );
  }

  getLastCompra():Observable<any>{
    return this._http.get(this.url+'compra/getLastCompra', {headers:this.headers} );
  }

  getDetailsCompra(idCompra:any):Observable<any>{
    return this._http.get(this.url+'compra/showMejorado/'+idCompra, {headers:this.headers} );
  }

  registerProductoscompra(ProductosCompra:any):Observable<any>{
    let json = JSON.stringify(ProductosCompra);
    let params = 'json='+json;
    return this._http.post(this.url+'compra/registerLista',params, {headers:this.headers} );
  }

  updateExistencia(ProductosCompra:any):Observable<any>{
    let json = JSON.stringify(ProductosCompra);
    let params = 'json='+json;
    return this._http.post(this.url+'compra/updateExistencia',params, {headers:this.headers} );
  }

  registerLote():Observable<any>{
    return this._http.post(this.url+'compra/registerLote', {headers:this.headers} );
  }

  getComprasRecibidas():Observable<any>{
    return this._http.get(this.url+'compra/listaComprasRecibidas', {headers:this.headers} );
  }

  getsearchIdCompra(idCompra:any):Observable<any>{
    return this._http.get(this.url+'compra/searchIdCompra/'+idCompra, {headers:this.headers} );
  }

}

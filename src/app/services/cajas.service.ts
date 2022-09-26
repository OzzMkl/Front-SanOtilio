import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 
import { parseTranslation } from '@angular/localize/src/utils';

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  public url: string = global.url;
  public headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  constructor( private _http: HttpClient) { }

  verificarCaja(idEmpleado:any):Observable<any>{
    return this._http.get(this.url+'cajas/verificarCaja/'+idEmpleado,{headers:this.headers});
  }
  aperturaCaja(caja:any):Observable<any>{
    let json = JSON.stringify(caja);
    let params = 'json='+json;
    return this._http.post(this.url+'cajas/aperturaCaja',params,{headers:this.headers});
  }
  cierreCaja(caja:any):Observable<any>{
    let json = JSON.stringify(caja);
    let params = 'json='+json;
    return this._http.put(this.url+'cajas/cierreCaja',params,{headers:this.headers})
  }
  cobroVenta(idVenta:number,venta:any):Observable<any>{
    let json = JSON.stringify(venta);
    let params = 'json='+json;
    return this._http.post(this.url+'cajas/cobroVenta/'+idVenta,params,{headers:this.headers});
  }
  verificaSesionCaja():Observable<any>{
    return this._http.get(this.url+'cajas/verificaSesionesCaja',{headers:this.headers})
  }
  movimientosSesionCaja(idCaja:any):Observable<any>{
    return this._http.get(this.url+'cajas/movimientosSesionCaja/'+idCaja,{headers:this.headers})
  }
  // getTipoMovimiento():Observable<any>{
  //   return this._http.get(this.url+'cajas/indexTipoMovimiento',{headers:this.headers});
  // }
}



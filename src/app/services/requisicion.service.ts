import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable({
  providedIn: 'root'
})
export class RequisicionService {
  
  public url : string;

  constructor( public _http: HttpClient ) { this.url = global.url; }

  
  registerRequisicion(req:any):Observable<any>{
    let json = JSON.stringify(req);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'requisicion/register',params, {headers:headers} );
  }

  registerProductosRequisicion(ProductosRequisicion:any):Observable<any>{
    let json = JSON.stringify(ProductosRequisicion);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'requisicion/registerLista',params, {headers:headers} );
  }

  getLastReq():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'requisicion/getLastReq', {headers:headers} );
  }

  getDetailsReq(idReq:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'requisicion/showMejorado/'+idReq, {headers:headers} );
  }

  getPDF(idReq:number):Observable<Blob>{
    return this._http.get(this.url+'requisicion/generatePDF/'+ idReq, {responseType:'blob'});
  }

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable({
  providedIn: 'root'
})
export class RequisicionService {
  
  public url : string;
  public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

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

  getPDF(idReq:number,idEmpleado:number):Observable<Blob>{
    return this._http.get(this.url+'requisicion/generatePDF/'+ idReq+'/'+idEmpleado, {responseType:'blob'});
  }

  getReq():Observable<any>{
    return this._http.get(this.url+'requisicion/listaRequisiciones', {headers:this.headers} );
  }

  updateRequisicion(idOrd:any,orden:any):Observable<any>{
    let json = JSON.stringify(orden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.put(this.url+'ordendecompra/updateOrder/'+idOrd,params, {headers:headers} );
  }
  updateProductosRequisicion(idOrd:any, productosOrden:any):Observable<any>{
    let json = JSON.stringify(productosOrden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.put(this.url+'ordendecompra/updateProductsOrder/'+idOrd,params, {headers:headers} );
  }

}

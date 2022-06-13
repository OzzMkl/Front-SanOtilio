import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  public url: string;//declaramos la url publica a usar para todas las peticiones

  constructor(public _http: HttpClient) { this.url = global.url; }
  getAllClientes():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'clientes/index', {headers:headers} );
  }
 getTipocliente():Observable<any> {
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  return this._http.get(this.url+'clientes/indexTipocliente', {headers:headers} );
 }
 postCliente(cliente:any):Observable<any>{
  let json = JSON.stringify(cliente);
  let params = 'json='+json;
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
  return this._http.post(this.url+'clientes/register',params, {headers:headers} );
 }
 postCdireccion(cdireccion:any):Observable<any>{
  let json = JSON.stringify(cdireccion);
  let params = 'json='+json;
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
  return this._http.post(this.url+'clientes/registerCdireccion',params, {headers:headers} );
 }
 postNuevaDireccion(nuevaDir:any):Observable<any>{
  let json = JSON.stringify(nuevaDir);
  let params = 'json='+json;
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
  return this._http.post(this.url+'clientes/registrarNuevaDireccion',params, {headers:headers} );
 }
 getDetallesCliente(idCliente:any):Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  return this._http.get(this.url+'clientes/getDetallesCliente/'+idCliente, {headers:headers} );
 }
 getDireccionCliente(idCliente:any):Observable<any>{
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  return this._http.get(this.url+'clientes/getDireccionCliente/'+idCliente, {headers:headers} );
 }
 updateCliente(cliente:any, idCliente:any):Observable<any>{
  let json = JSON.stringify(cliente);
  let params = 'json='+json;
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  return this._http.put(this.url + 'clientes/updateCliente/'+idCliente,params,{headers: headers});
 }
 updateCdireccion(cdireccion:any,idCliente:any):Observable<any>{
  let json = JSON.stringify(cdireccion);
  let params = 'json='+json;
  let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  return this._http.put(this.url + 'clientes/updateCdireccion/'+idCliente,params,{headers: headers});
 }
}

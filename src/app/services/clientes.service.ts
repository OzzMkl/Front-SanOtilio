import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  //declaramos la url publica a usar para todas las peticiones
  public url: string;
  //declaramos las cabeceras
  public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

  constructor(public _http: HttpClient) { this.url = global.url; }

  /**
   * Obtener todos los clientes Activos
   * @returns 
   */
  getAllClientes():Observable<any>{
    return this._http.get(this.url+'clientes/index', {headers:this.headers} );
  }

 getTipocliente():Observable<any> {
  return this._http.get(this.url+'clientes/indexTipocliente', {headers:this.headers} );
 }

 postCliente(cliente:any):Observable<any>{
  let json = JSON.stringify(cliente);
  let params = 'json='+json;
  return this._http.post(this.url+'clientes/register',params, {headers:this.headers} );
 }

 postCdireccion(cdireccion:any):Observable<any>{
  let json = JSON.stringify(cdireccion);
  let params = 'json='+json;
  return this._http.post(this.url+'clientes/registerCdireccion',params, {headers:this.headers} );
 }

 postNuevaDireccion(nuevaDir:any):Observable<any>{
  let json = JSON.stringify(nuevaDir);
  let params = 'json='+json;
  return this._http.post(this.url+'clientes/registrarNuevaDireccion',params, {headers:this.headers} );
 }

 getDetallesCliente(idCliente:any):Observable<any>{
  return this._http.get(this.url+'clientes/getDetallesCliente/'+idCliente,{headers:this.headers} );
 }

 getDireccionCliente(idCliente:any):Observable<any>{
  return this._http.get(this.url+'clientes/getDireccionCliente/'+idCliente,{headers:this.headers} );
 }

 updateCliente(cliente:any, idCliente:any):Observable<any>{
  let json = JSON.stringify(cliente);
  let params = 'json='+json;
  return this._http.put(this.url + 'clientes/updateCliente/'+idCliente,params,{headers:this.headers});
 }
 updateCdireccion(cdireccion:any,idCliente:any):Observable<any>{
  let json = JSON.stringify(cdireccion);
  let params = 'json='+json;
  return this._http.put(this.url + 'clientes/updateCdireccion/'+idCliente,params,{headers:this.headers});
 }

 searchNombreCliente(nombreCliente:string):Observable<any>{
  return this._http.get(this.url+'clientes/searchNombreCliente/'+nombreCliente,{headers:this.headers});
 }
 /***EJEMPLO PDF */
 getPDF():Observable<Blob>{
  return this._http.get(this.url+'clientes/generatePDF',{responseType:'blob'});
 }
 /***EJEMPLO PDF */
}

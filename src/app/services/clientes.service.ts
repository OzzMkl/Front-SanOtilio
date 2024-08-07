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

getClientesNewIndex(page:number, type:number, search: string):Observable<any>{
  return this._http.get(this.url+
                        'clientes/index'+
                        '?search='+search+
                        '&type='+type+
                        '&page='+page, {headers:this.headers} );
}

 getTipocliente():Observable<any> {
  return this._http.get(this.url+'clientes/indexTipocliente', {headers:this.headers} );
 }

 /**
  * Registra un nuevo cliente
  * @param cliente 
  * @param empleado 
  * @returns 
  */
 postCliente(cliente:any,empleado:any):Observable<any>{
  let combinado = {...cliente, idEmpleado: empleado.sub};
  let json = JSON.stringify(combinado);
  let params = 'json='+json;
  return this._http.post(this.url+'clientes/register',params, {headers:this.headers} );
 }

 /**
  * Registra la direcion al registrar un nuevo cliente
  * @param cdireccion 
  * @param empleado 
  * @returns 
  */
 postCdireccion(cdireccion:any,empleado:any):Observable<any>{
  let combinado = {...cdireccion, idEmpleado:empleado};
  let json = JSON.stringify(combinado);
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

 updateCliente(cliente:any, idCliente:any,empleado:any):Observable<any>{
  let combinado = {...cliente, sub: empleado.sub};
  let json = JSON.stringify(combinado);
  let params = 'json='+json;
  return this._http.put(this.url + 'clientes/updateCliente/'+idCliente,params,{headers:this.headers});
 }

 updateCdireccion(cdireccion:any,idCliente:any, empleado:any):Observable<any>{
  let combinado = {cdireccion: cdireccion, sub: empleado.sub};
  console.log(combinado)
  let json = JSON.stringify(combinado);
  let params = 'json='+json;
  return this._http.put(this.url + 'clientes/updateCdireccion/'+idCliente,params,{headers:this.headers});
 }

 searchNombreCliente(nombreCliente:string):Observable<any>{
  return this._http.get(this.url+'clientes/searchNombreCliente/'+nombreCliente,{headers:this.headers});
 }
}

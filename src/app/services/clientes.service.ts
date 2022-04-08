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
}

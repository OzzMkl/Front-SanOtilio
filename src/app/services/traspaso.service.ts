import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { global } from './global';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TraspasoService {

  public url: string = global.url;//declaramos la url publica a usar para todas las peticiones
    public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

  constructor( public _http: HttpClient) { }

  getTraspasos(tipoTraspaso: string, traspaso: string ,datInicial:any, datFinal:any):Observable<any>{
    const combinado = {
      'str_traspaso': traspaso,
      'date_inicial': datInicial,
      'date_final': datFinal
    };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.post(this.url+'traspasos/index/'+tipoTraspaso, params, {headers:this.headers});
  }
}

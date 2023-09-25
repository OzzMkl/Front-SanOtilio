import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from './global';

@Injectable({
  providedIn: 'root'
})
export class SucursalService {

  public url : string = global.url;
  public headers:any = new Headers().set('Content-Type','application/x-www-form-urlencoded');

  constructor( public _http: HttpClient) {}

  getSucursales():Observable<any>{

    return this._http.get(this.url+'sucursales/index');
  }
}

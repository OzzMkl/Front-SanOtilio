import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class EntregasService {

  public url: string = global.url;
  public headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  constructor(public _http: HttpClient) { }

  getIndexEntregas():Observable<any>{
    return this._http.get(this.url+'entregas/indexEntregas',{headers:this.headers});
  }
}

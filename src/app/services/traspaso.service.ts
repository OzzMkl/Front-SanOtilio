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

  /**
   * GET
   */
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

  getPDF(idTraspaso:number,idEmpleado:number,tipoTraspaso:any):Observable<Blob>{
    return this._http.get(this.url+'traspasos/generatePDF/'+idTraspaso+'/'+idEmpleado+'/'+tipoTraspaso,{responseType:'blob'});
  }

  getDetailsTraspaso(idTraspaso:any,tipoTraspaso:any):Observable<any>{
    return this._http.get(this.url+'traspasos/showMejorado/'+idTraspaso+'/'+tipoTraspaso, {headers:this.headers} );
  }

  /**
   * POST
   */
  registerTraspaso(traspaso:any,tipoTraspaso:string,lista_producto_traspaso:any,identity:any):Observable<any>{
    const combinado = {
      'traspaso': traspaso,
      'tipoTraspaso':tipoTraspaso,
      'lista_producto_traspaso':lista_producto_traspaso,
      'identity':identity
    };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.post(this.url+'traspasos/registerTraspaso',params, {headers:this.headers} );
  }

  cancelarTraspaso(idTraspaso:any,tipoTraspaso:any,motivo:any,idEmpleado:any):Observable<any>{
    let combinado = {'idTraspaso':idTraspaso,
                     'tipoTraspaso':tipoTraspaso,
                     'motivo':motivo,
                     'idEmpleado':idEmpleado
    };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    //console.log('combinado',combinado);
    //console.log('json',json);
    return this._http.post(this.url+'traspasos/cancelarTraspaso',params, {headers:this.headers} );
  }

  updateTraspaso(traspaso:any,tipoTraspaso:string,lista_producto_traspaso:any,identity:any):Observable<any>{
    const combinado = {
      'traspaso': traspaso,
      'tipoTraspaso':tipoTraspaso,
      'lista_producto_traspaso':lista_producto_traspaso,
      'identity':identity
    };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.post(this.url+'traspasos/updateTraspaso',params, {headers:this.headers} );

  }




  

}

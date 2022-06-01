import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  public url: string;

  constructor( public _http: HttpClient) { this.url = global.url; }

  getTipoventa():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'ventas/indexTP', {headers:headers} );
  }
  //COTIZACIONES
  getIndexCotiza():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'cotizaciones/indexCotizaciones', {headers:headers} );
  }
  postCotizaciones(cotizacion:any):Observable<any>{
    let json = JSON.stringify(cotizacion);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'cotizaciones/guardarCotizacion',params, {headers:headers} );
  }
  postProductosCotiza(productosCotiza:any):Observable<any>{
    let json = JSON.stringify(productosCotiza);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'cotizaciones/guardarProductosCotiza',params, {headers:headers} );
  }
  getLastCotiza():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'cotizaciones/consultaUltimaCotiza', {headers:headers} );
  }
  getDetallesCotiza(idCotiza:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'cotizaciones/detallesCotizacion/'+idCotiza, {headers:headers} );
  }
  putCotizacion(idCotiza:any, cotizacion:any):Observable<any>{
    let json = JSON.stringify(cotizacion);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.put(this.url+'cotizaciones/actualizaCotizacion/'+idCotiza,params, {headers:headers} );
  }
  putProductosCotiza(idCotiza:any, productosCotiza:any):Observable<any>{
    let json = JSON.stringify(productosCotiza);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.put(this.url+'cotizaciones/actualizaProductosCotizacion/'+idCotiza,params, {headers:headers} );
  }
  //VENTAS
  getIndexVentas():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'ventas/indexVentas', {headers:headers} );
  }
  postVentas(ventasg:any):Observable<any>{
    let json = JSON.stringify(ventasg);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.post(this.url+'ventas/guardarVenta',params, {headers:headers});
  }
  postProductosVentas(productosVenta:any):Observable<any>{
    let json = JSON.stringify(productosVenta);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'ventas/guardarProductosVenta',params, {headers:headers} );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class VentasService {

  public url: string = global.url;
  public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

  constructor( public _http: HttpClient) {

  }

  getTipoPago():Observable<any>{
    return this._http.get(this.url+'ventas/indexTP', {headers:this.headers} );
  }

  getTipoVenta():Observable<any>{
    return this._http.get(this.url+'ventas/indexTipoVenta',{headers:this.headers});
  }

  //COTIZACIONES
  getIndexCotiza():Observable<any>{
    return this._http.get(this.url+'cotizaciones/indexCotizaciones', {headers:this.headers} );
  }

  postCotizaciones(cotizacion:any):Observable<any>{
    let json = JSON.stringify(cotizacion);
    let params = 'json='+json;    
    return this._http.post(this.url+'cotizaciones/guardarCotizacion',params, {headers:this.headers} );
  }

  postProductosCotiza(productosCotiza:any):Observable<any>{
    let json = JSON.stringify(productosCotiza);
    let params = 'json='+json;
    return this._http.post(this.url+'cotizaciones/guardarProductosCotiza',params, {headers:this.headers} );
  }

  getLastCotiza():Observable<any>{
    return this._http.get(this.url+'cotizaciones/consultaUltimaCotiza', {headers:this.headers} );
  }

  getDetallesCotiza(idCotiza:any):Observable<any>{
    return this._http.get(this.url+'cotizaciones/detallesCotizacion/'+idCotiza, {headers:this.headers} );
  }

  putCotizacion(idCotiza:any, cotizacion:any):Observable<any>{
    let json = JSON.stringify(cotizacion);
    let params = 'json='+json;
    return this._http.put(this.url+'cotizaciones/actualizaCotizacion/'+idCotiza,params, {headers:this.headers} );
  }

  putProductosCotiza(idCotiza:any, productosCotiza:any):Observable<any>{
    let json = JSON.stringify(productosCotiza);
    let params = 'json='+json;
    return this._http.put(this.url+'cotizaciones/actualizaProductosCotizacion/'+idCotiza,params, {headers:this.headers} );
  }

  getPDF(idCotiza:number):Observable<Blob>{
    return this._http.get(this.url+'cotizaciones/generatePDF/'+ idCotiza, {responseType:'blob'});
  }

  //VENTAS
  getIndexVentas():Observable<any>{
    return this._http.get(this.url+'ventas/indexVentas', {headers:this.headers} );
  }

  getDetallesVenta(idVenta:any):Observable<any>{
    return this._http.get(this.url+'ventas/getDetallesVenta/'+idVenta, {headers:this.headers} );
  }

  postVentas(ventasg:any):Observable<any>{
    let json = JSON.stringify(ventasg);
    let params = 'json='+json;
    return this._http.post(this.url+'ventas/guardarVenta',params, {headers:this.headers});
  }

  postProductosVentas(productosVenta:any):Observable<any>{
    let json = JSON.stringify(productosVenta);
    let params = 'json='+json;
    return this._http.post(this.url+'ventas/guardarProductosVenta',params, {headers:this.headers} );
  }
}


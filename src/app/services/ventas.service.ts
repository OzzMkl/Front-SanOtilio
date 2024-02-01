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

  postVenta(ventasg:any, lista_productoVentag:Array<any>, identity: Array<any>):Observable<any>{
    const combinado = {
      'ventasg': ventasg,
      'lista_productoVentag': lista_productoVentag,
      'identity': identity
    }

    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.post(this.url+'ventas/guardarVenta',params, {headers:this.headers});
  }

  putVenta( idVenta:number, ventasg:any, lista_productoVentag: Array<any>, identity: Array<any>, motivoEdicion: string):Observable<any>{
    const combinado = {
      'ventasg': ventasg,
      'lista_productoVentag': lista_productoVentag,
      'identity': identity,
      'motivo_edicion': motivoEdicion
    };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.put(this.url+'ventas/updateVenta/'+idVenta,params, {headers:this.headers} );
  }

  cancelaVenta(idVenta:number, identity: Array<any>, motivoCancelacion: string):Observable<any>{
    const combinado = {
      'identity': identity,
      'motivo_cancelacion': motivoCancelacion
    };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.post(this.url+'ventas/cancelaVenta/'+idVenta,params, {headers:this.headers} );
  }

  getVentasCanceladas(page: number,type: number, search: string):Observable<any>{
    return this._http.get(this.url+'ventas/indexVentasCanceladas/'+type+'/'+search+'?page='+page,{headers:this.headers});
  }

  getDetallesVentaCancelada(idVenta:number):Observable<any>{
    return this._http.get(this.url+'ventas/getDetallesVentaCancelada/'+idVenta,{headers:this.headers});
  }
}


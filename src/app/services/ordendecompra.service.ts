import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable({
  providedIn: 'root'
})
export class OrdendecompraService {

  public url : string;
  public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

  constructor( public _http: HttpClient ) { this.url = global.url; }

  registerOrdencompra(orden:any):Observable<any>{
    let json = JSON.stringify(orden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'ordendecompra/register',params, {headers:headers} );
  }
  registerProductosOrdenCompra(Productosorden:any):Observable<any>{
    let json = JSON.stringify(Productosorden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.post(this.url+'ordendecompra/registerLista',params, {headers:headers} );
  }
  getLastOrd():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'ordendecompra/getLastOrder', {headers:headers} );
}
  // getDetalsOrde(idOrd:any):Observable<any>{
  //   let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  //   return this._http.get(this.url+'ordendecompra/show/'+idOrd, {headers:headers} );
  // }
  getDetailsOrdes(idOrd:any):Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'ordendecompra/showMejorado/'+idOrd, {headers:headers} );
  }
  getAllOrders():Observable<any>{
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
    return this._http.get(this.url+'ordendecompra/index', {headers:headers} );
  }
  updateOrdenCompra(idOrd:any,orden:any):Observable<any>{
    let json = JSON.stringify(orden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.put(this.url+'ordendecompra/updateOrder/'+idOrd,params, {headers:headers} );
  }
  updateProductosOrderC(idOrd:any, productosOrden:any):Observable<any>{
    let json = JSON.stringify(productosOrden);
    let params = 'json='+json;
    let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
    return this._http.put(this.url+'ordendecompra/updateProductsOrder/'+idOrd,params, {headers:headers} );
  }
  getPDF(idOrd:number,idEmpleado:number):Observable<Blob>{
    return this._http.get(this.url+'ordendecompra/generatePDF/'+ idOrd+'/'+idEmpleado, {responseType:'blob'});
  }

  cancelarOrden(idOrd:any,motivo:any,idEmpleado:any):Observable<any>{
    let combinado = {'idOrd':idOrd,
                     'motivo':motivo,
                     'idEmpleado':idEmpleado
    };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    //console.log('combinado',combinado);
    //console.log('json',json);
    return this._http.post(this.url+'ordendecompra/cancelarOrden',params, {headers:this.headers} );
  }

  /**
   * SERVICIOS DE BUSQUEDA
  */
  searchIdOrden(idOrd:any):Observable<any>{
    return this._http.get(this.url+'ordendecompra/searchIdOrden/'+idOrd, {headers:this.headers} );
  }

  searchNombreProveedor(nombreProveedor:any):Observable<any>{
    return this._http.get(this.url+'ordendecompra/searchNombreProveedor/'+nombreProveedor, {headers:this.headers} );
  }



}

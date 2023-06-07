import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { global } from "./global"; 

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  public url : string;
  public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

  constructor( public _http: HttpClient ) { this.url = global.url; }

  /***
   * GET
   */
    getLastCompra():Observable<any>{
      return this._http.get(this.url+'compra/getLastCompra', {headers:this.headers} );
    }

    getDetailsCompra(idCompra:any):Observable<any>{
    return this._http.get(this.url+'compra/showMejorado/'+idCompra, {headers:this.headers} );
    }

    getComprasRecibidas():Observable<any>{
      return this._http.get(this.url+'compra/listaComprasRecibidas', {headers:this.headers} );
    }
  
  /**
   * POST
   */
    registrerCompra(compra:any):Observable<any>{
      let json = JSON.stringify(compra);
      let params = 'json='+json;
      return this._http.post(this.url+'compra/register',params, {headers:this.headers} );
    }

    registerProductoscompra(ProductosCompra:any):Observable<any>{
      let json = JSON.stringify(ProductosCompra);
      let params = 'json='+json;
      return this._http.post(this.url+'compra/registerLista',params, {headers:this.headers} );
    }

    updateExistencia(ProductosCompra:any):Observable<any>{
      let json = JSON.stringify(ProductosCompra);
      let params = 'json='+json;
      return this._http.post(this.url+'compra/updateExistencia',params, {headers:this.headers} );
    }

    updateExistenciaFacturable(ProductosCompra:any):Observable<any>{
      let json = JSON.stringify(ProductosCompra);
      let params = 'json='+json;
      return this._http.post(this.url+'compra/updateExistenciaFacturable',params, {headers:this.headers} );
    }

    registerLote():Observable<any>{
      return this._http.post(this.url+'compra/registerLote', {headers:this.headers} );
    }  

    updateCompra(compra:any,Lista_compras:any,empleado:any):Observable<any>{
      let combinado = {...compra,...Lista_compras,...empleado};
      let json = JSON.stringify(combinado);
      let params = 'json='+json;
      console.log('combinado',combinado);
      console.log('json',json);
      return this._http.post(this.url+'compra/updateCompra',params, {headers:this.headers} );
    }

    updateProductosCompra(ProductosCompra:any):Observable<any>{
      let json = JSON.stringify(ProductosCompra);
      let params = 'json='+json;
      return this._http.post(this.url+'compra/updateProductosCompra',params, {headers:this.headers} );
    }

    alterExistencia(ProductosCompra:any):Observable<any>{
      let json = JSON.stringify(ProductosCompra);
      let params = 'json='+json;
      return this._http.post(this.url+'compra/alterExistencia',params, {headers:this.headers} );
    }


  /**
   * SERVICIOS DE BUSQUEDA DEL COMPONENTE COMPRA-BUSCAR
    */
    getSearchIdCompra(idCompra:any):Observable<any>{
      return this._http.get(this.url+'compra/searchIdCompra/'+idCompra, {headers:this.headers} );
    }
    getSearchNombreProveedor(nombreProveedor:any):Observable<any>{
      return this._http.get(this.url+'compra/searchNombreProveedor/'+nombreProveedor, {headers:this.headers} );
    }
    getSearchFolioProveedor(folioProveedor:any):Observable<any>{
      return this._http.get(this.url+'compra/searchFolioProveedor/'+folioProveedor, {headers:this.headers} );
    }
    getSearchTotal(total:any):Observable<any>{
      return this._http.get(this.url+'compra/searchTotal/'+total, {headers:this.headers} );
    }
}

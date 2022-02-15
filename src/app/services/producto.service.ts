//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable()
export class ProductoService{
    public url: string;//declaramos la url publica a usar para todas las peticiones


    constructor(
        public _http: HttpClient
    ){
        this.url = global.url;
    }
    registerProducto(producto:any):Observable<any>{
            let json = JSON.stringify(producto);
            let params = 'json='+json;
            let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
            return this._http.post(this.url+'productos/register',params, {headers:headers} );
    }
    getProductos():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/index', {headers:headers} );
    }
    getProductosDes():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/productosDes', {headers:headers} );
    }
    registerLote(lote:any):Observable<any>{
        let json = JSON.stringify(lote);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');//mandamos el json con las cabeceras para que obtengamos el token
        return this._http.post(this.url+'lote/register',params, {headers:headers} );
    }
    getLotes():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'lote/index', {headers:headers} );
    }
    getLastPro():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/getlastproduct', {headers:headers} );
    }
    getProdver(idProducto:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/'+idProducto, {headers:headers} );
    }
    getProdverDos(idProducto:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/showTwo/'+idProducto, {headers:headers} );
    }
    getProdclaveex(claveEx:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/searchclaveEx/'+claveEx, {headers:headers} );
    }
    updateStatus( prod:any, idProducto:any):Observable<any>{
        let json = JSON.stringify(prod);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.put(this.url + 'productos/updatestatus/'+idProducto,params,{headers: headers});
    }
    updateProducto( productoModificado:any, idProducto:any):Observable<any>{
        let json = JSON.stringify(productoModificado);
        let params = 'json='+json;
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.put(this.url + 'productos/updateProduct/'+idProducto,params,{headers: headers});
    }
}
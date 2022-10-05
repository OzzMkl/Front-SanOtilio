//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global"; 

@Injectable()
export class ProductoService{
    public url: string;//declaramos la url publica a usar para todas las peticiones
    public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

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
    
    getProductosPV():Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/indexPV', {headers:headers} );
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
    getExistenciaG(idProducto:any):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
        return this._http.get(this.url+'productos/getExistenciaG/'+idProducto, {headers:headers} );
    }
    
    /**
     * Busca los productos apartir de su clave externa
     * solo busca los productos que tengan estatus 1 (activos/habilitados)
     * 
     * @param claveExterna 
     * Recibimos parametro a buscar
     * @returns 
     * Retornamos la respuesta del api
     */
    searchClaveExterna(claveExterna:string):Observable<any>{
        return this._http.get(this.url+'productos/searchClaveExterna/'+claveExterna, {headers:this.headers});
    }

    /**
     * Busca los productos apartir de su codigo de barras
     * solo busca productos habilitados statuss 1
     * @param codbar 
     * parametro a buscar
     * @returns 
     * retorna respuesta
     */
    searchCodbar(codbar:number):Observable<any>{
        return this._http.get(this.url+'productos/searchCodbar/'+codbar, {headers:this.headers})
    }

    /**
     * Busca los productos apartir de su descripcion
     * solo busca los productos activos estatus 1
     * @param descripcion 
     * recibe la descripcion a buscar
     * @returns 
     */
    searchDescripcion(descripcion:string):Observable<any>{
        return this._http.get(this.url+'productos/searchDescripcion/'+descripcion, {headers:this.headers})
    }

    /**
     * Busca los productos apartir de su clave externa
     * solo busca los productos que tengan estatus 2 (deshabilitado/inactivo)
     * 
     * @param claveExterna 
     * Recibimos parametro a buscar
     * @returns 
     * Retornamos la respuesta del api
     */
    searchClaveExternaInactivos(claveExterna:string):Observable<any>{
        return this._http.get(this.url+'productos/searchClaveExInactivos/'+claveExterna, {headers:this.headers});
    }

    /**
     * Busca los productos apartir de su codigo de barras
     * solo busca productos habilitados statuss 2
     * @param codbar 
     * parametro a buscar
     * @returns 
     * retorna respuesta
     */
     searchCodbarI(codbar:number):Observable<any>{
        return this._http.get(this.url+'productos/searchCodbarI/'+codbar, {headers:this.headers})
    }

    /**
     * Busca los productos apartir de su descripcion
     * solo busca los productos activos estatus 2
     * @param descripcion 
     * recibe la descripcion a buscar
     * @returns 
     */
    searchDescripcionI(descripcion:string):Observable<any>{
        return this._http.get(this.url+'productos/searchDescripcionI/'+descripcion, {headers:this.headers})
    }
}
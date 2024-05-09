//parte fundamental, púes este archivo se comunica con nuestro back
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, throwError } from "rxjs";
import { catchError, concatMap} from "rxjs/operators";
import { global } from "./global";
import { Producto_ventasg } from 'src/app/models/productoVentag';

@Injectable()
export class ProductoService{
    public url: string = global.url;//declaramos la url publica a usar para todas las peticiones
    public headers:any = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');

    constructor( public _http: HttpClient ){ }
    
    /**
     * Registra el nuevo producto con sus nuevas medidas
     * 
     * @param producto Producto
     * @param listaProdMedida  Array<Producto>
     * @param empleado Empleado
     * @returns 
     */
    registerProducto(producto:any,listaProdMedida:any,empleado:any):Observable<any>{
            let combinado = {
                'producto': producto,
                'empleado': empleado,
                'lista_productosMedida':listaProdMedida
            };
            let json = JSON.stringify(combinado);
            let params = 'json='+json;

            return this._http.post(this.url+'productos/register',params,{headers:this.headers});
    }

    /**
     * Listado de productos habilitados (general)
     * @returns 
     */
    getProductos():Observable<any>{
        return this._http.get(this.url+'productos/index', {headers:this.headers} );
    }

    /**
     * 
     * @param page - number - pagina a buscar
     * @param type - number - tipo de busqueda ( 1 = claveEx, 2 = descripcion, 3 = codbar)
     * @param search - string -  cadena a buscar
     * @returns 
     * @description
     * Funcion que nos permite buscar en el catalogo de productos y retornamos el resultado paginado por 10 elementos
     */
    getProductosNewIndex(page: number,type: number, search: string):Observable<any>{
        return this._http.get(this.url+'productos/newIndex/'+type+'/'+search+'?page='+page,{headers:this.headers});
    }

    /**
     * Listado de prodcutos deshabilitados (general)
     * @returns 
     */
    getProductosDes():Observable<any>{
        return this._http.get(this.url+'productos/productosDes', {headers:this.headers} );
    }

    /**
     * Trae todos los detalles del producto
     * @param idProducto number
     * @returns 
     */
    getProdverDos(idProducto:any):Observable<any>{
        return this._http.get(this.url+'productos/showTwo/'+idProducto, {headers:this.headers} );
    }

    /**
     * 
     * @param claveEx 
     * @returns 
     * @description
     * Servicio para el componente de input-external-key-search
     */
    getIdProductByClaveEx(claveEx:string):Observable<any>{
        return this._http.get(this.url+'productos/getIdProductByClaveEx/'+claveEx, {headers:this.headers} );
    }

    /**
     * Actualza unicamente el status
     * 
     * @param idProducto number
     * @param producto Producto
     * @param empleado Empleado
     * @returns 
     */
    updateStatus( idProducto:number, producto:any, empleado:any):Observable<any>{
        let combinado = {...producto, ...empleado};
        let json = JSON.stringify(combinado);
        let params = 'json='+json;
        return this._http.put(this.url + 'productos/updatestatus/'+idProducto,params,{headers:this.headers});
    }

    /**
     * Este envia la informacion del producto mas la informacion de sus medidas
     * @param producto Producto
     * @param listaProdMedida Array<Medidas>
     * @param empleado Empleado
     * @returns Observable
     */
    updateProducto( producto:any, listaProdMedida:any,idEmpleado:any, sucUpdate:any, local:boolean = false):Observable<any>{
        let combinado = {
            'producto': producto,
            'idEmpleado': idEmpleado,
            'lista_productosMedida': listaProdMedida,
            'sucursales': sucUpdate,
            'update_local': local,
        }
        let json = JSON.stringify(combinado);
        let params = 'json='+json;

        return this._http.put(this.url+'productos/updateProduct/'+producto.idProducto,params,{headers:this.headers});
        
    }
    
    /**
     * 
     * @param idProducto 
     * @returns 
     */
    getExistenciaG(idProducto:number, idProdMedida:number, cantidad:number):Observable<any>{
        return this._http.get(this.url+'productos/getExistenciaG/'+ idProducto+ '/'+ idProdMedida+ '/'+ cantidad,{headers:this.headers} );
    }
    
    /**
     * Busca los productos apartir de su clave externa
     * solo busca los productos que tengan estatus 31 (activos/habilitados)
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
     * solo busca productos habilitados statuss 31
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
     * solo busca los productos activos estatus 31
     * @param descripcion 
     * recibe la descripcion a buscar
     * @returns 
     */
    searchDescripcion(descripcion:string):Observable<any>{
        return this._http.get(this.url+'productos/searchDescripcion/'+descripcion, {headers:this.headers})
    }

    /**
     * Busca los productos apartir de su clave externa
     * solo busca los productos que tengan estatus 32 (deshabilitado/inactivo)
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
     * solo busca productos deshabilitados statuss 32
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
     * solo busca los productos deshabiliotados estatus 32
     * @param descripcion 
     * recibe la descripcion a buscar
     * @returns 
     */
    searchDescripcionI(descripcion:string):Observable<any>{
        return this._http.get(this.url+'productos/searchDescripcionI/'+descripcion, {headers:this.headers})
    }

    /**
     * Busca la medida de los productos habilitados
     * Busca la imagen del producto
     * @param idProducto number
     * @returns 
     */
    searchProductoMedida(idProducto:number):Observable<any>{
        return this._http.get(this.url+'productos/searchProductoMedida/'+idProducto,{headers:this.headers});
    }

    /**
     * Busca la medida de los productos deshabilitados
     * busca la imagen
     * @param idProducto number
     * @returns 
     */
    searchProductoMedidaI(idProducto:number):Observable<any>{
        return this._http.get(this.url+'productos/searchProductoMedidaI/'+idProducto,{headers:this.headers});
    }

    /**
     * 
     * @param idProducto 
     * @returns Array
     * @description
     * Solicita el idProducto y e consulta en todas las sucursales disponibles
     * No busca en la nube(hostinger)
     */
    getExistenciaMultiSucursal(idProducto:number):Observable<any>{
        return this._http.get(this.url+'productos/getExistenciaMultiSucursal/'+idProducto,{headers:this.headers});
    }

    /**
     * 
     * @param idProducto number
     * @returns producto
     * @description
     * Se consulta el producto en el catalogo de la nube, si lo encuentra
     * este regresa la informacion del producto y sus medidas
     */
    getProductoNUBE(idProducto:number):Observable<any>{
        return this._http.get(this.url+'productos/getProductoNUBE/'+idProducto,{headers:this.headers});
    }

    /**
     * 
     * @param idProducto 
     * @returns 
     * @description
     * Obtiene todas las modificaciones que se han realizado al producto
     */
    getHistorialProducto(idProducto:number):Observable<any>{
        return this._http.get(this.url+'productos/getHistorialProducto/'+idProducto,{headers:this.headers});
    }

    getHistorialProductoPrecio(idProducto:number):Observable<any>{
        return this._http.get(this.url+'productos/getHistorialProductoPrecio/'+idProducto,{headers:this.headers});
    }
}
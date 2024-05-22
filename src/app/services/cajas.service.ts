import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from "rxjs";
import { global } from "./global";

@Injectable({
  providedIn: 'root'
})
export class CajasService {

  public url: string = global.url;
  public headers = new HttpHeaders().set('Content-Type','application/x-www-form-urlencoded');
  constructor( private _http: HttpClient) { }

  verificarCaja(idEmpleado:any):Observable<any>{
    return this._http.get(this.url+'cajas/verificarCaja/'+idEmpleado,{headers:this.headers});
  }
  aperturaCaja(caja:any):Observable<any>{
    let json = JSON.stringify(caja);
    let params = 'json='+json;
    return this._http.post(this.url+'cajas/aperturaCaja',params,{headers:this.headers});
  }

  cierreCaja(idEmpleado:number,caja:any, totales:any, imgChart: string):Observable<any>{
    const combinado = {
      idEmpleado: idEmpleado,
      caja: caja,
      totales: totales,
      imgChart: imgChart
    }
    let json = JSON.stringify(combinado);
    let params = 'json='+ encodeURIComponent(json);
    return this._http.post(this.url+'cajas/cierreCaja',params,{headers:this.headers,responseType:'blob'})
  }

  cobroVenta(idVenta:number,venta:any, isSaldo:boolean, idempleado:number, tieneAbono:boolean, isCredito:boolean):Observable<any>{
    let combinado = {
        ...venta, 
        isSaldo: isSaldo, 
        idEmpleado:idempleado, 
        tieneAbono: tieneAbono,
        isCredito: isCredito,
      };
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.post(this.url+'cajas/cobroVenta/'+idVenta,params,{headers:this.headers});
  }
  verificaSesionCaja():Observable<any>{
    return this._http.get(this.url+'cajas/verificaSesionesCaja',{headers:this.headers})
  }
  
  movimientosSesionCaja(idCaja:any):Observable<any>{
    return this._http.get(this.url+'cajas/movimientosSesionCaja/'+idCaja,{headers:this.headers})
  }

  abonosVentasg(idVenta:number):Observable<any>{
    return this._http.get(this.url+'cajas/abonos_ventas/'+idVenta, { headers:this.headers});
  }

  getPDF(idVenta:number):Observable<Blob>{
    return this._http.get(this.url+'cajas/generatePDF/'+ idVenta, {responseType:'blob'});
  }

  guardaVentaCredito(objVenta:any):Observable<any>{
    let json = JSON.stringify(objVenta);
    let params = 'json='+json;
    return this._http.post(this.url+'cajas/guardaVentaCredito',params,{headers: this.headers});
  }

  getPDF_CorteCaja(idEmpleado:number,caja:any, totales:any, imgChart: string):Observable<Blob>{
    const combinado = {
      idEmpleado: idEmpleado,
      caja: caja,
      totales: totales,
      imgChart: imgChart
    }
    
    let json = JSON.stringify(combinado);
    let params = 'json='+json;
    return this._http.post(this.url+'cajas/generatePDF_CorteCajas',params,{headers: this.headers,responseType:'blob'})
  }

  // getTipoMovimiento():Observable<any>{
  //   return this._http.get(this.url+'cajas/indexTipoMovimiento',{headers:this.headers});
  // }
}



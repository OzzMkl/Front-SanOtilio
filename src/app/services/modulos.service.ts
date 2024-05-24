import { Injectable } from '@angular/core';
import { propModulo } from '../models/interfaces/propModulo';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

  public pCaja: propModulo ={
                  idModulo: 2,
                  idSubModulo: 1
              }
  public pCreditos: propModulo = {
    idModulo: 2,
    idSubModulo: 22
  }

  public pCaja_Cortecaja: propModulo = {
    idModulo: 2,
    idSubModulo: 2,
  }

  public pInv: propModulo ={
                idModulo: 5,
                idSubModulo: 13
              }
  public pCli: propModulo ={
                idModulo: 6,
                idSubModulo: 20
              }
  public pCoti: propModulo ={
                idModulo: 6,
                idSubModulo: 19
              }
  public pProv: propModulo ={
                idModulo:3,
                idSubModulo:4
              }

  public pReq: propModulo ={
                idModulo:3,
                idSubModulo:5
              }

  public pPuv: propModulo ={
                idModulo:6,
                idSubModulo:17
              }

  public pOrdC: propModulo={
                idModulo:3,
                idSubModulo:6
              }

  public pTras: propModulo ={
    idModulo:5,
    idSubModulo:13
  }

  public pCom: propModulo ={
    idModulo:3,
    idSubModulo: 7
  }

  constructor() { }

  modsCaja(){
    return this.pCaja;
  }

  modsCreditos(){
    return this.pCreditos;
  }

  modsCaja_Cortecaja(){
    return this.pCaja_Cortecaja;
  }

  modsInventario(){
    return this.pInv;
  }

  modsClientes(){
    return this.pCli;
  }

  modsCotizaciones(){
    return this.pCoti;
  }

  modsRequisicion(){
    return this.pReq;
  }

  modsProveedores(){
    return this.pProv;
  }

  modsPuntodeVenta(){
    return this.pPuv;
  }

  modsOrdendeCompra(){
    return this.pOrdC;
  }

  modsTraspaso(){
    return this.pTras;
  }

  modsCompra(){
    return this.pCom;
  }
}

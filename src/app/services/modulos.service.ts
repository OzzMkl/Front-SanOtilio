import { Injectable } from '@angular/core';
import { propModulo } from '../models/interfaces/propModulo';

@Injectable({
  providedIn: 'root'
})
export class ModulosService {

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

  constructor() { }

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
}

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

  constructor() { }

  modsInventario(){
    return this.pInv;
  }
}

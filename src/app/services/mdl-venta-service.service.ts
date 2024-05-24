import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dialogOptionsVentas } from '../models/interfaces/dialogOptions-ventas';

@Injectable({
  providedIn: 'root'
})
export class MdlVentaService {

  //Abrir modal de detalles de venta
  private openMdlVentaDialogSource = new Subject<dialogOptionsVentas>();
  private actualizaListaVentas = new Subject<void>();

  openMdlVentaDialog$ = this.openMdlVentaDialogSource.asObservable();
  actualizaListaVentas$ = this.actualizaListaVentas.asObservable();

  constructor() { }

  openMdlVentaDialog(obj:dialogOptionsVentas):void{
    this.openMdlVentaDialogSource.next(obj);
  }

  actualizarVentas(){
    this.actualizaListaVentas.next();
  }
}

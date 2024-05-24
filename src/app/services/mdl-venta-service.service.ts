import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dialogOptionsVentas } from '../models/interfaces/dialogOptions-ventas';

@Injectable({
  providedIn: 'root'
})
export class MdlVentaService {

  private openMdlVentaDialogSource = new Subject<dialogOptionsVentas>();

  openMdlVentaDialog$ = this.openMdlVentaDialogSource.asObservable();

  constructor() { }

  openMdlVentaDialog(obj:dialogOptionsVentas):void{
    this.openMdlVentaDialogSource.next(obj);
  }
}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dialogOptionsProductos } from '../models/interfaces/dialogOptions-productos';

@Injectable({
  providedIn: 'root'
})

export class MdlProductoService {

  private openMdlProductosDialogSource = new Subject<dialogOptionsProductos>();
  private selectedValueSource = new Subject<any>();

  openMdlProductosDialog$ = this.openMdlProductosDialogSource.asObservable();
  selectedValue$ = this.selectedValueSource.asObservable();

  constructor() { }

  /**
   * 
   * @param openMdlMedidas boolean open modal medidas
   * @param isCatalagoNube boolean get catagalogo nube
   * 
   */
  openMdlProductosDialog(obj:dialogOptionsProductos): void {
    this.openMdlProductosDialogSource.next(obj);
  }

  sendSelectedValue(value: any): void {
    this.selectedValueSource.next(value);
  }

}

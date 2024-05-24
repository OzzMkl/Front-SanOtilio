import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MdlProductoService {

  private openMdlProductosDialogSource = new Subject<{ openMdlMedidas: boolean, isCatalagoNube: boolean }>();
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
  openMdlProductosDialog(openMdlMedidas: boolean = false,isCatalagoNube: boolean = false): void {
    const dialogOptions = { openMdlMedidas, isCatalagoNube };
    this.openMdlProductosDialogSource.next(dialogOptions);
  }

  sendSelectedValue(value: any): void {
    this.selectedValueSource.next(value);
  }

}

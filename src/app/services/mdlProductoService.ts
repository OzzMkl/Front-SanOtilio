import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MdlProductoService {

  private openMdlProductosDialogSource = new Subject<boolean>();
  private selectedValueSource = new Subject<any>();

  openMdlProductosDialog$ = this.openMdlProductosDialogSource.asObservable();
  selectedValue$ = this.selectedValueSource.asObservable();

  constructor() { }

  openMdlProductosDialog(openMdlMedidas: boolean = false): void {
    this.openMdlProductosDialogSource.next(openMdlMedidas);
  }

  sendSelectedValue(value: any): void {
    this.selectedValueSource.next(value);
  }

}

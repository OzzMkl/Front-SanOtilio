import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class MdlProductoService {

  private openMdlProductosDialogSource = new Subject<void>();
  private selectedValueSource = new Subject<any>();

  openMdlProductosDialog$ = this.openMdlProductosDialogSource.asObservable();
  selectedValue$ = this.selectedValueSource.asObservable();

  constructor() { }

  openMdlProductosDialog(): void {
    this.openMdlProductosDialogSource.next();
  }

  sendSelectedValue(value: any): void {
    this.selectedValueSource.next(value);
  }

}

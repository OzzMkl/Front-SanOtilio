import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { dialogOptionsClientes } from '../models/interfaces/dialogOptions-clientes';

@Injectable({
  providedIn: 'root'
})

export class MdlClienteService {

  private openMdlClientesDialogSource = new Subject<dialogOptionsClientes>();
  private selectedValueSource = new Subject<any>();
  private searchTermSource = new Subject<string>();

  openMdlClientesDialog$ = this.openMdlClientesDialogSource.asObservable();
  selectedValue$ = this.selectedValueSource.asObservable();
  currentSearchTerm = this.searchTermSource.asObservable();

  constructor() { }

  openMdlProductosDialog(obj:dialogOptionsClientes): void {
    this.openMdlClientesDialogSource.next(obj);
  }

  sendSelectedValue(value: any): void {
    this.selectedValueSource.next(value);
  }

  updateSearchTerm(term: string){
    this.searchTermSource.next(term);
  }

}

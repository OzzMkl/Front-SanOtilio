import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/primeng/primeng/primeng.module';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ModalProductosComponent } from './modal-productos/modal-productos.component';
import { ModalVentasComponent } from './modal-ventas/modal-ventas.component';
import { InputExternalKeySearchComponent } from './input-external-key-search/input-external-key-search.component';
import { ModalClientesComponent } from './modal-clientes/modal-clientes.component';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        ModalProductosComponent,
        ModalVentasComponent,
        InputExternalKeySearchComponent,
        ModalClientesComponent,
    ],
    exports: [
        LoadingSpinnerComponent,
        ModalProductosComponent,
        ModalVentasComponent,
        InputExternalKeySearchComponent,
        ModalClientesComponent,
    ],
    imports : [
        PrimengModule,
        CommonModule,
    ],
})

export class ComponentsUtilsModule {}

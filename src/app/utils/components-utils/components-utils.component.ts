import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/primeng/primeng/primeng.module';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ModalProductosComponent } from './modal-productos/modal-productos.component';
import { ModalVentasComponent } from './modal-ventas/modal-ventas.component';
import { InputExternalKeySearchComponent } from './input-external-key-search/input-external-key-search.component';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        ModalProductosComponent,
        ModalVentasComponent,
        InputExternalKeySearchComponent,
    ],
    exports: [
        LoadingSpinnerComponent,
        ModalProductosComponent,
        ModalVentasComponent,
        InputExternalKeySearchComponent,
    ],
    imports : [
        PrimengModule,
        CommonModule,
    ],
})

export class ComponentsUtilsModule {}

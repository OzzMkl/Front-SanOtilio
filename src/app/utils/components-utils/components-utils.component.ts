import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from 'src/app/primeng/primeng/primeng.module';

import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { ModalProductosComponent } from './modal-productos/modal-productos.component';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        ModalProductosComponent,
    ],
    exports: [
        LoadingSpinnerComponent,
        ModalProductosComponent,
    ],
    imports : [
        PrimengModule,
        CommonModule,
    ],
})

export class ComponentsUtilsModule {}

// app/feature1/feature1.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PrimengModule } from 'src/app/primeng/primeng/primeng.module';

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
    ],
    exports: [
        LoadingSpinnerComponent,
    ],
    imports : [
        PrimengModule,
        CommonModule,
    ],
})

export class ComponentsUtilsModule {}

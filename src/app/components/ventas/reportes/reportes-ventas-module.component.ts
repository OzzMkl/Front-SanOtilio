import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesVentasModuloComponent } from './ventas/reportes-ventas-modulo/reportes-ventas-modulo.component';
import { ReportesVentasFinalizadasComponent } from './ventas/reportes-ventas-finalizadas/reportes-ventas-finalizadas.component';
import { ReportesVentasCanceladasComponent } from './ventas/reportes-ventas-canceladas/reportes-ventas-canceladas.component';
import { ReportesVentasRoutingModule } from './reportes-ventas-routing.module';

import { ComponentsUtilsModule } from 'src/app/utils/components-utils/components-utils.component';

import { PrimengModule } from 'src/app/primeng/primeng/primeng.module';

@NgModule({
    declarations: [
        ReportesVentasModuloComponent,
        ReportesVentasCanceladasComponent,
        ReportesVentasFinalizadasComponent,
    ],
    exports: [
        ReportesVentasModuloComponent,
        ReportesVentasCanceladasComponent,
        ReportesVentasFinalizadasComponent,
    ],
    imports : [
        CommonModule,
        PrimengModule,
        ReportesVentasRoutingModule,
        ComponentsUtilsModule
    ],
})

export class ReportesVentasModule {}
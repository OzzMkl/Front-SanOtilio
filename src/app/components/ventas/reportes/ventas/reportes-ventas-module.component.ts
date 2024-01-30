import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesVentasModuloComponent } from './reportes-ventas-modulo/reportes-ventas-modulo.component';
import { ReportesVentasFinalizadasComponent } from './reportes-ventas-finalizadas/reportes-ventas-finalizadas.component';
import { ReportesVentasCanceladasComponent } from './reportes-ventas-canceladas/reportes-ventas-canceladas.component';
import { ReportesVentasRoutingModule } from './reportes-ventas-routing.module';

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
        ReportesVentasRoutingModule
    ],
})

export class ReportesVentasModule {}
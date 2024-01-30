import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportesVentasModuloComponent } from './reportes-ventas-modulo/reportes-ventas-modulo.component';
import { ReportesVentasFinalizadasComponent } from './reportes-ventas-finalizadas/reportes-ventas-finalizadas.component';
import { ReportesVentasCanceladasComponent } from './reportes-ventas-canceladas/reportes-ventas-canceladas.component';

const routes: Routes = [
  {
    path: '',
    component: ReportesVentasModuloComponent,
    children: [
      { path: 'ventas-canceladas', component: ReportesVentasCanceladasComponent },
      { path: 'ventas-finalizadas', component: ReportesVentasFinalizadasComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesVentasRoutingModule { }

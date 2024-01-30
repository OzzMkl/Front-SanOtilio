import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//IMPORTAR COMPONENTES
import { GeneralComponent } from './components/general/general.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { EmpleadoEditarComponent } from './components/empleado-editar/empleado-editar.component';

import {RequisicionModuloComponent} from './components/compras/requisiciones/requisicion-modulo/requisicion-modulo.component';
import {RequisicionAgregarComponent} from './components/compras/requisiciones/requisicion-agregar/requisicion-agregar.component';
import {RequisicionBuscarComponent} from './components/compras/requisiciones/requisicion-buscar/requisicion-buscar.component';
import {RequisicionEditarComponent} from './components/compras/requisiciones/requisicion-editar/requisicion-editar.component';

import { OrdencompraModuloComponent } from './components/compras/ordenes-compras/ordencompra-modulo/ordencompra-modulo.component';
import { OrdencompraAgregarComponent } from './components/compras/ordenes-compras/ordencompra-agregar/ordencompra-agregar.component';
import { OrdencompraBuscarComponent } from './components/compras/ordenes-compras/ordencompra-buscar/ordencompra-buscar.component';
import { OrdencompraEditarComponent } from './components/compras/ordenes-compras/ordencompra-editar/ordencompra-editar.component';

import { CompraModuloComponent } from './components/compras/compra/compra-modulo/compra-modulo.component';
import { CompraAgregarIdComponent } from './components/compras/compra/compra-agregar-id/compra-agregar-id.component';
import { CompraAgregarComponent } from './components/compras/compra/compra-agregar/compra-agregar.component';
import { CompraBuscarComponent } from './components/compras/compra/compra-buscar/compra-buscar.component';
import { CompraVerComponent } from './components/compras/compra/compra-ver/compra-ver.component';
import { CompraEditarComponent } from './components/compras/compra/compra-editar/compra-editar.component';


import { ProveedorAgregarComponent } from './components/compras/proveedores/proveedor-agregar/proveedor-agregar.component';
import { ProveedorModuloComponent } from './components/compras/proveedores/proveedor-modulo/proveedor-modulo.component';
import { ProveedorDeshabilitadosComponent } from './components/compras/proveedores/proveedor-deshabilitados/proveedor-deshabilitados.component';
import { ProveedorBuscarComponent } from './components/compras/proveedores/proveedor-buscar/proveedor-buscar.component';
import { ProveedorModificarComponent } from './components/compras/proveedores/proveedor-modificar/proveedor-modificar.component';
import { ProveedorVerComponent } from './components/compras/proveedores/proveedor-ver/proveedor-ver.component';

import { ProductoModuloComponent } from './components/inventario/productos/producto-modulo/producto-modulo.component';
import { ProductoAgregarComponent } from './components/inventario/productos/producto-agregar/producto-agregar.component';
import { ProductoBuscarComponent } from './components/inventario/productos/producto-buscar/producto-buscar.component';
import { ProductoVerComponent } from './components/inventario/productos/producto-ver/producto-ver.component';
import { ProductoDeshabilitadosComponent } from './components/inventario/productos/producto-deshabilitados/producto-deshabilitados.component';
import { ProductoEditarComponent } from './components/inventario/productos/producto-editar/producto-editar.component';

import { TraspasoModuloComponent } from './components/inventario/traspasos/traspaso-modulo/traspaso-modulo.component';
import { TraspasoBuscarComponent } from './components/inventario/traspasos/traspaso-buscar/traspaso-buscar.component';
import { TraspasoAgregarComponent } from './components/inventario/traspasos/traspaso-agregar/traspaso-agregar.component';
import { TraspasoEditarComponent } from './components/inventario/traspasos/traspaso-editar/traspaso-editar.component';

import { ClasificacionModuloComponent } from './components/inventario/taxonomia/clasificacion-modulo/clasificacion-modulo.component';

import { PuntoDeVentaComponent } from './components/ventas/punto-de-venta/punto-de-venta.component';
import { PuntoDeVentaEditarComponent } from './components/ventas/punto-de-venta-editar/punto-de-venta-editar.component';

import { VentasRealizadasModuloComponent } from './components/ventas/ventas-realizadas/ventas-realizadas-modulo/ventas-realizadas-modulo.component';
import { VentasRealizadasComponent } from './components/ventas/ventas-realizadas/ventas-realizadas/ventas-realizadas.component';

import { CotizacionModuloComponent } from './components/ventas/cotizaciones/cotizacion-modulo/cotizacion-modulo.component';
import { CotizacionBuscarComponent } from './components/ventas/cotizaciones/cotizacion-buscar/cotizacion-buscar.component';
import { CotizacionEditarComponent } from './components/ventas/cotizaciones/cotizacion-editar/cotizacion-editar.component';

import { ClienteModuloComponent } from './components/ventas/clientes/cliente-modulo/cliente-modulo.component';
import { ClienteBuscarComponent } from './components/ventas/clientes/cliente-buscar/cliente-buscar.component';
import { ClienteAgregarComponent } from './components/ventas/clientes/cliente-agregar/cliente-agregar.component';
import { ClienteEditarComponent } from './components/ventas/clientes/cliente-editar/cliente-editar.component';

import { EntregasModuloComponent } from './components/entregas/entregas-modulo/entregas-modulo.component';
import { EntregasAgregarComponent } from './components/entregas/entregas-agregar/entregas-agregar.component';
import { EntregasPendientesComponent } from './components/entregas/entregas-pendientes/entregas-pendientes.component';

import { CajaModuloComponent } from './components/cajas/caja-modulo/caja-modulo.component';
import { NotasPorCobrarComponent } from './components/cajas/notas-por-cobrar/notas-por-cobrar.component';
import { NotasACreditoComponent } from './components/cajas/notas-a-credito/notas-a-credito.component';
import { CorteDeCajaComponent } from './components/cajas/corte-de-caja/corte-de-caja.component';
/***guards */
import { OrdencompraGuardGuard } from './guards/ordencompra-guard.guard';
import { ProveedorGuard } from './guards/proveedor.guard';
import { PuntoDeVentaGuard } from './guards/punto-de-venta.guard';
import { CheckTokenGuard } from './guards/check-token.guard';
import { CotizacionGuard } from './guards/cotizacion.guard';
import { ClienteGuard } from './guards/cliente.guard';
import { ProductosGuard } from './guards/productos.guard';
import { RequisicionGuard } from './guards/requisicion.guard';
import { CajasGuard } from './guards/cajas.guard';




const routes: Routes = [
  {path: '', component: GeneralComponent, canActivate:[CheckTokenGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'logout/:sure', component: LoginComponent},
  {path: 'ajustes',component: EmpleadoEditarComponent, canActivate:[CheckTokenGuard]},
  {path: 'requisicion-modulo', component: RequisicionModuloComponent, canActivate:[RequisicionGuard],
    children:[
      {path: 'requisicion-agregar',component: RequisicionAgregarComponent},
      {path: 'requisicion-buscar',component: RequisicionBuscarComponent},
      {path: 'requisicion-editar/:idReq',component: RequisicionEditarComponent}
  ]},
  {path: 'ordencompra-modulo', component: OrdencompraModuloComponent, canActivate:[OrdencompraGuardGuard],
    children:[
      {path: 'ordencompra-agregar',component: OrdencompraAgregarComponent},
      {path: 'ordencompra-buscar',component: OrdencompraBuscarComponent},
      {path: 'ordencompra-editar/:idOrd',component: OrdencompraEditarComponent}
    ]},
  {path: 'compra-modulo',component: CompraModuloComponent,
    children:
    [
      {path: 'compra-agregar-id/:idOrd', component: CompraAgregarIdComponent},
      {path: 'compra-agregar', component: CompraAgregarComponent},
      {path: 'compra-buscar', component: CompraBuscarComponent},
      {path: 'compra-ver', component: CompraVerComponent},
      {path: 'compra-editar/:idCompra', component: CompraEditarComponent}
    ]},

  {path: 'proveedor-modulo', component: ProveedorModuloComponent, canActivate:[ProveedorGuard],
    children:
    [
      {path: 'agregarProveedor',component: ProveedorAgregarComponent},
      {path: 'proveedorDeshabilitado',component: ProveedorDeshabilitadosComponent},
      {path: 'proveedorBuscar',component: ProveedorBuscarComponent},
      {path: 'proveedorEditar',component: ProveedorModificarComponent},
      {path: 'proveedorVer/:idProveedor',component: ProveedorVerComponent}
    ]},
  {path: 'punto-de-venta',component: PuntoDeVentaComponent,canActivate:[PuntoDeVentaGuard]},
  {path: 'punto-de-venta-editar/:idVenta',component: PuntoDeVentaEditarComponent,canActivate:[PuntoDeVentaGuard]},
  {path: 'ventas-modulo',component: VentasRealizadasModuloComponent,canActivate:[PuntoDeVentaGuard],
  children:
  [
    {path:'ventas-realizadas-buscar',component: VentasRealizadasComponent},
  ]},
  {path: 'cotizacion-modulo', component: CotizacionModuloComponent, canActivate:[CotizacionGuard],
  children:
  [
    {path: 'cotizacion-buscar', component: CotizacionBuscarComponent},
    {path: 'cotizacion-editar/:idCotiza', component: CotizacionEditarComponent}
  ]},
  {path: 'cliente-modulo',component: ClienteModuloComponent,canActivate:[ClienteGuard],
      children:
    [
      {path: 'cliente-buscar',component: ClienteBuscarComponent},
      {path: 'cliente-agregar',component:ClienteAgregarComponent},
      {path: 'cliente-editar/:idCliente',component: ClienteEditarComponent}
    ]},
  { path: 'reportes-ventas', loadChildren: () => import('./components/ventas/reportes/reportes-ventas-module.component').then(m => m.ReportesVentasModule) },
  {path:'entregas-modulo',component: EntregasModuloComponent,
      children:[
        {path:'entregas-agregar',component: EntregasAgregarComponent},
        {path:'entregas-pendientes',component: EntregasPendientesComponent}
      ]},
  {path:'caja-modulo', component: CajaModuloComponent,canActivate:[CajasGuard],
      children:
      [
        {path:'notas-por-cobrar',component: NotasPorCobrarComponent},
        {path:'notas-a-credito',component: NotasACreditoComponent}
      ]},
  {path:'corte-de-caja',component: CorteDeCajaComponent},
  {path: 'producto-modulo', component: ProductoModuloComponent,canActivate:[ProductosGuard],
   children:
   [
      {path: 'producto-agregar', component: ProductoAgregarComponent},
      {path: 'producto-buscar', component: ProductoBuscarComponent},
      {path: 'producto-deshabilitado', component: ProductoDeshabilitadosComponent},
      {path: 'producto-ver/:idProducto', component: ProductoVerComponent},
      {path: 'producto-editar/:idProducto', component:ProductoEditarComponent}
   ]},
  {path:'traspaso-modulo', component: TraspasoModuloComponent,
    children:
    [
      {path: 'traspaso-buscar', component: TraspasoBuscarComponent},
      {path: 'traspaso-agregar', component: TraspasoAgregarComponent},
      {path: 'traspaso-editar/:idTraspaso/:tipoTraspaso', component: TraspasoEditarComponent}
      
    ]},
  {path: 'clasificacion-modulo',component: ClasificacionModuloComponent},
  {path: '**', component: ErrorComponent}
  
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


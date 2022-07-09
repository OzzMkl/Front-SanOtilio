import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//IMPORTAR COMPONENTES
import { GeneralComponent } from './components/general/general.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { ErrorComponent } from './components/error/error.component';
import { EmpleadoEditarComponent } from './components/empleado-editar/empleado-editar.component';

import { OrdencompraModuloComponent } from './components/compras/ordenes-compras/ordencompra-modulo/ordencompra-modulo.component';
import { OrdencompraAgregarComponent } from './components/compras/ordenes-compras/ordencompra-agregar/ordencompra-agregar.component';
import { OrdencompraBuscarComponent } from './components/compras/ordenes-compras/ordencompra-buscar/ordencompra-buscar.component';
import { OrdencompraEditarComponent } from './components/compras/ordenes-compras/ordencompra-editar/ordencompra-editar.component';

import { CompraModuloComponent } from './components/compras/compra/compra-modulo/compra-modulo.component';
import { CompraAgregarIdComponent } from './components/compras/compra/compra-agregar-id/compra-agregar-id.component';
import { CompraAgregarComponent } from './components/compras/compra/compra-agregar/compra-agregar.component';
import { CompraBuscarComponent } from './components/compras/compra/compra-buscar/compra-buscar.component';
import { CompraVerComponent } from './components/compras/compra/compra-ver/compra-ver.component';

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

import { ClasificacionModuloComponent } from './components/inventario/taxonomia/clasificacion-modulo/clasificacion-modulo.component';

import { PuntoDeVentaComponent } from './components/ventas/punto-de-venta/punto-de-venta.component';

import { VentasRealizadasModuloComponent } from './components/ventas/ventas-realizadas/ventas-realizadas-modulo/ventas-realizadas-modulo.component';
import { VentasRealizadasComponent } from './components/ventas/ventas-realizadas/ventas-realizadas/ventas-realizadas.component';

import { CotizacionModuloComponent } from './components/ventas/cotizaciones/cotizacion-modulo/cotizacion-modulo.component';
import { CotizacionBuscarComponent } from './components/ventas/cotizaciones/cotizacion-buscar/cotizacion-buscar.component';
import { CotizacionEditarComponent } from './components/ventas/cotizaciones/cotizacion-editar/cotizacion-editar.component';

import { ClienteModuloComponent } from './components/ventas/clientes/cliente-modulo/cliente-modulo.component';
import { ClienteBuscarComponent } from './components/ventas/clientes/cliente-buscar/cliente-buscar.component';
import { ClienteAgregarComponent } from './components/ventas/clientes/cliente-agregar/cliente-agregar.component';
import { ClienteEditarComponent } from './components/ventas/clientes/cliente-editar/cliente-editar.component';

import { EntregasComponent } from './components/ventas/entregas/entregas.component';

import { CajaModuloComponent } from './components/cajas/caja-modulo/caja-modulo.component';
import { NotasPorCobrarComponent } from './components/cajas/notas-por-cobrar/notas-por-cobrar.component';
import { NotasACreditoComponent } from './components/cajas/notas-a-credito/notas-a-credito.component';
import { CorteDeCajaComponent } from './components/cajas/corte-de-caja/corte-de-caja.component';
/***guards */
import { OrdencompraGuardGuard } from './guards/ordencompra-guard.guard';
import { ProveedorGuard } from './guards/proveedor.guard';
import { PuntoDeVentaGuard } from './guards/punto-de-venta.guard';

const routes: Routes = [
  {path: '', component: GeneralComponent},
  {path: 'inicio', component: HomeComponent}, //canActivate:[InicioGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'logout/:sure', component: LoginComponent},
  {path: 'ajustes',component: EmpleadoEditarComponent},
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
      {path: 'compra-ver', component: CompraVerComponent}
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
  {path: 'punto-de-venta',component: PuntoDeVentaComponent, canActivate:[PuntoDeVentaGuard]},
  {path: 'ventas-realizadas',component: VentasRealizadasModuloComponent,
  children:
  [
    {path:'ventas-realizadas-buscar',component: VentasRealizadasComponent}
  ]},
  {path: 'cotizacion-modulo', component: CotizacionModuloComponent,
  children:
  [
    {path: 'cotizacion-buscar', component: CotizacionBuscarComponent},
    {path: 'cotizacion-editar/:idCotiza', component: CotizacionEditarComponent}
  ]},
  {path: 'cliente-modulo',component: ClienteModuloComponent,
      children:
    [
      {path: 'cliente-buscar',component: ClienteBuscarComponent},
      {path: 'cliente-agregar',component:ClienteAgregarComponent},
      {path: 'cliente-editar/:idCliente',component: ClienteEditarComponent}
    ]},
  {path:'entregas',component: EntregasComponent},
  {path:'caja-modulo', component: CajaModuloComponent,
      children:
      [
        {path:'notas-por-cobrar',component: NotasPorCobrarComponent},
        {path:'notas-a-credito',component: NotasACreditoComponent}
      ]},
  {path:'corte-de-caja',component: CorteDeCajaComponent},
  {path: 'producto-modulo', component: ProductoModuloComponent,
   children:
   [
      {path: 'producto-agregar', component: ProductoAgregarComponent},
      {path: 'producto-buscar', component: ProductoBuscarComponent},
      {path: 'producto-deshabilitado', component: ProductoDeshabilitadosComponent},
      {path: 'producto-ver/:idProducto', component: ProductoVerComponent},
      {path: 'producto-editar/:idProducto', component:ProductoEditarComponent}
   ]},
  {path: 'clasificacion-modulo',component: ClasificacionModuloComponent},
  {path: '**', component: ErrorComponent}
  
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


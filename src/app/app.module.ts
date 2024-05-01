import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module

import localeEsMX from '@angular/common/locales/es-MX';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsMX);
/*************************** */

// import { AngularFileUploaderModule } from "angular-file-uploader";
//import { ReactiveFormsModule } from '@angular/forms';
import { NgxBarcodeModule } from 'ngx-barcode';
///primeng
import { PrimengModule } from './primeng/primeng/primeng.module';
//Pertenecen a primeng y se declaran afuera para poder ocuparlos anivel raiz!!
// import { ToastModule } from 'primeng/toast';
// import { MessagesModule } from 'primeng/messages';
// import { MessageModule } from 'primeng/message';
// import { MessageService } from 'primeng/api';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { ErrorComponent } from './components/error/error.component';

import { EmpleadoEditarComponent } from './components/empleado-editar/empleado-editar.component';

import { ProveedorAgregarComponent } from './components/compras/proveedores/proveedor-agregar/proveedor-agregar.component';
import { ProveedorModuloComponent } from './components/compras/proveedores/proveedor-modulo/proveedor-modulo.component';
import { ProveedorDeshabilitadosComponent } from './components/compras/proveedores/proveedor-deshabilitados/proveedor-deshabilitados.component';
import { ProveedorBuscarComponent } from './components/compras/proveedores/proveedor-buscar/proveedor-buscar.component';
import { ProveedorModificarComponent } from './components/compras/proveedores/proveedor-modificar/proveedor-modificar.component';
import { ProveedorVerComponent } from './components/compras/proveedores/proveedor-ver/proveedor-ver.component';
import { ProductoAgregarComponent } from './components/inventario/productos/producto-agregar/producto-agregar.component';
import { ProductoModuloComponent } from './components/inventario/productos/producto-modulo/producto-modulo.component';
import { ProductoBuscarComponent } from './components/inventario/productos/producto-buscar/producto-buscar.component';
import { FilterProveedoresPipe } from './pipes/filter-proveedores.pipe';
import { FilterProductPipe } from './pipes/filter-products.pipe';
import { FilterProductModalPipe } from './pipes/filter-productsModal.pipe';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { ClasificacionModuloComponent } from './components/inventario/taxonomia/clasificacion-modulo/clasificacion-modulo.component';
import { DepartamentoVerComponent } from './components/inventario/taxonomia/clasificaciones/departamentos/departamento-ver/departamento-ver.component';
import { CategoriaVerComponent } from './components/inventario/taxonomia/clasificaciones/categorias/categoria-ver/categoria-ver.component';
import { SubcategoriaVerComponent } from './components/inventario/taxonomia/clasificaciones/subcategorias/subcategoria-ver/subcategoria-ver.component';
import { MarcaVerComponent } from './components/inventario/taxonomia/marcas/marca-ver/marca-ver.component';
import { MedidaVerComponent } from './components/inventario/taxonomia/medidas/medida-ver/medida-ver.component';
import { AlmacenVerComponent } from './components/inventario/taxonomia/almacenes/almacen-ver/almacen-ver.component';
import { ProductoVerComponent } from './components/inventario/productos/producto-ver/producto-ver.component';
import { ProductoDeshabilitadosComponent } from './components/inventario/productos/producto-deshabilitados/producto-deshabilitados.component';
import { CompraModuloComponent } from './components/compras/compra/compra-modulo/compra-modulo.component';
import { CompraBuscarComponent } from './components/compras/compra/compra-buscar/compra-buscar.component';
import { CompraVerComponent } from './components/compras/compra/compra-ver/compra-ver.component';
import { CompraAgregarComponent } from './components/compras/compra/compra-agregar/compra-agregar.component';
import { OrdencompraAgregarComponent } from './components/compras/ordenes-compras/ordencompra-agregar/ordencompra-agregar.component';
import { OrdencompraModuloComponent } from './components/compras/ordenes-compras/ordencompra-modulo/ordencompra-modulo.component';
import { FilterProductsModalcePipe } from './pipes/filter-products-modalce.pipe';
import { FilterProductsModalcbarPipe } from './pipes/filter-products-modalcbar.pipe';
import { GeneralComponent } from './components/general/general.component';
import { FilterOrdersPipe } from './pipes/filter-orders.pipe';
import { FilterOrdersIdordPipe } from './pipes/filter-orders-idord.pipe';
import { CompraAgregarIdComponent } from './components/compras/compra/compra-agregar-id/compra-agregar-id.component';
import { OrdencompraEditarComponent } from './components/compras/ordenes-compras/ordencompra-editar/ordencompra-editar.component';
import { PuntoDeVentaComponent } from './components/ventas/punto-de-venta/punto-de-venta.component';
import { ClienteModuloComponent } from './components/ventas/clientes/cliente-modulo/cliente-modulo.component';
import { ClienteAgregarComponent } from './components/ventas/clientes/cliente-agregar/cliente-agregar.component';
import { ClienteEditarComponent } from './components/ventas/clientes/cliente-editar/cliente-editar.component';
import { ClienteBuscarComponent } from './components/ventas/clientes/cliente-buscar/cliente-buscar.component';
import { FilterClientesPipe } from './pipes/filter-clientes.pipe';
import { CotizacionBuscarComponent } from './components/ventas/cotizaciones/cotizacion-buscar/cotizacion-buscar.component';
import { CotizacionModuloComponent } from './components/ventas/cotizaciones/cotizacion-modulo/cotizacion-modulo.component';
import { FilterCotizacionesNomCPipe } from './pipes/filter-cotizaciones-nom-c.pipe';
import { FilterCotizacionesIdCotizaPipe } from './pipes/filter-cotizaciones-id-cotiza.pipe';
import { VentasRealizadasModuloComponent } from './components/ventas/ventas-realizadas/ventas-realizadas-modulo/ventas-realizadas-modulo.component';
import { VentasRealizadasComponent } from './components/ventas/ventas-realizadas/ventas-realizadas/ventas-realizadas.component';
import { FilterIdventaPipe } from './pipes/ventas/filter-idventa.pipe';
import { FilterVendedorPipe } from './pipes/ventas/filter-vendedor.pipe';
import { CajaModuloComponent } from './components/cajas/caja-modulo/caja-modulo.component';
import { NotasPorCobrarComponent } from './components/cajas/notas-por-cobrar/notas-por-cobrar.component';
import { NotasACreditoComponent } from './components/cajas/notas-a-credito/notas-a-credito.component';
import { CorteDeCajaComponent } from './components/cajas/corte-de-caja/corte-de-caja.component';
import { EmpleadoService } from './services/empleado.service';
import { EntregasModuloComponent } from './components/entregas/entregas-modulo/entregas-modulo.component';
import { EntregasAgregarComponent } from './components/entregas/entregas-agregar/entregas-agregar.component';
import { EntregasPendientesComponent } from './components/entregas/entregas-pendientes/entregas-pendientes.component';
import { CompraEditarComponent } from './components/compras/compra/compra-editar/compra-editar.component';
import { RequisicionModuloComponent } from './components/compras/requisiciones/requisicion-modulo/requisicion-modulo.component';
import { RequisicionAgregarComponent } from './components/compras/requisiciones/requisicion-agregar/requisicion-agregar.component';
import { RequisicionBuscarComponent } from './components/compras/requisiciones/requisicion-buscar/requisicion-buscar.component';
import { RequisicionEditarComponent } from './components/compras/requisiciones/requisicion-editar/requisicion-editar.component';
import { OrdencompraBuscarComponent } from './components/compras/ordenes-compras/ordencompra-buscar/ordencompra-buscar.component';
import { TraspasoModuloComponent } from './components/inventario/traspasos/traspaso-modulo/traspaso-modulo.component';
import { TraspasoAgregarComponent } from './components/inventario/traspasos/traspaso-agregar/traspaso-agregar.component';
import { TraspasoBuscarComponent } from './components/inventario/traspasos/traspaso-buscar/traspaso-buscar.component';
import { TraspasoEditarComponent } from './components/inventario/traspasos/traspaso-editar/traspaso-editar.component';
import { ComponentsUtilsModule } from './utils/components-utils/components-utils.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ErrorComponent,
    EmpleadoEditarComponent,
    ProveedorAgregarComponent,
    ProveedorModuloComponent,
    ProveedorDeshabilitadosComponent,
    ProveedorBuscarComponent,
    ProveedorModificarComponent,
    ProveedorVerComponent,
    ProductoAgregarComponent,
    ProductoModuloComponent,
    ProductoBuscarComponent,
    FilterProveedoresPipe,
    FilterProductPipe,
    FilterProductModalPipe,
    ClasificacionModuloComponent,
    DepartamentoVerComponent,
    CategoriaVerComponent,
    SubcategoriaVerComponent,
    MarcaVerComponent,
    MedidaVerComponent,
    AlmacenVerComponent,
    ProductoVerComponent,
    ProductoDeshabilitadosComponent,
    CompraModuloComponent,
    CompraBuscarComponent,
    CompraVerComponent,
    CompraAgregarComponent,
    OrdencompraAgregarComponent,
    OrdencompraModuloComponent,
    FilterProductsModalcePipe,
    FilterProductsModalcbarPipe,
    GeneralComponent,
    FilterOrdersPipe,
    FilterOrdersIdordPipe,
    CompraAgregarIdComponent,
    OrdencompraEditarComponent,
    PuntoDeVentaComponent,
    ClienteModuloComponent,
    ClienteAgregarComponent,
    ClienteEditarComponent,
    ClienteBuscarComponent,
    FilterClientesPipe,
    CotizacionBuscarComponent,
    CotizacionModuloComponent,
    FilterCotizacionesNomCPipe,
    FilterCotizacionesIdCotizaPipe,
    VentasRealizadasModuloComponent,
    VentasRealizadasComponent,
    FilterIdventaPipe,
    FilterVendedorPipe,
    CajaModuloComponent,
    NotasPorCobrarComponent,
    NotasACreditoComponent,
    CorteDeCajaComponent,
    EntregasModuloComponent,
    EntregasAgregarComponent,
    EntregasPendientesComponent,
    CompraEditarComponent,
    RequisicionModuloComponent,
    RequisicionAgregarComponent,
    RequisicionBuscarComponent,
    RequisicionEditarComponent,
    OrdencompraBuscarComponent,
    TraspasoModuloComponent,
    TraspasoAgregarComponent,
    TraspasoBuscarComponent,
    TraspasoEditarComponent,
    
  ],
  imports: [
    PrimengModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    NgxPaginationModule,
    // AngularFileUploaderModule,
    NgxBarcodeModule,
    // ToastModule,
    // MessageModule,
    // MessagesModule,
    ComponentsUtilsModule,
    BrowserAnimationsModule
    
  ],
  providers: [EmpleadoService,{provide: LOCALE_ID, useValue: 'es-MX'}],
  bootstrap: [AppComponent],
  exports: [
    CategoriaVerComponent    
  ]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {NgxPaginationModule} from 'ngx-pagination'; // <-- import the module
import { AngularFileUploaderModule } from "angular-file-uploader";
//import { ReactiveFormsModule } from '@angular/forms';
import { NgxBarcodeModule } from 'ngx-barcode';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
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

import { ToastContainerComponent } from './components/toast/toast-container/toast-container.component';
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
import { ProductoEditarComponent } from './components/inventario/productos/producto-editar/producto-editar.component';
import { CompraModuloComponent } from './components/compras/compra/compra-modulo/compra-modulo.component';
import { CompraBuscarComponent } from './components/compras/compra/compra-buscar/compra-buscar.component';
import { CompraVerComponent } from './components/compras/compra/compra-ver/compra-ver.component';
import { CompraAgregarComponent } from './components/compras/compra/compra-agregar/compra-agregar.component';
import { OrdencompraAgregarComponent } from './components/compras/ordenes-compras/ordencompra-agregar/ordencompra-agregar.component';
import { OrdencompraBuscarComponent } from './components/compras/ordenes-compras/ordencompra-buscar/ordencompra-buscar.component';
import { OrdencompraModuloComponent } from './components/compras/ordenes-compras/ordencompra-modulo/ordencompra-modulo.component';
import { FilterProductsModalcePipe } from './pipes/filter-products-modalce.pipe';
import { FilterProductsModalcbarPipe } from './pipes/filter-products-modalcbar.pipe';
import { GeneralComponent } from './components/general/general.component';
import { FilterOrdersPipe } from './pipes/filter-orders.pipe';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
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
    ToastContainerComponent,
    ClasificacionModuloComponent,
    DepartamentoVerComponent,
    CategoriaVerComponent,
    SubcategoriaVerComponent,
    MarcaVerComponent,
    MedidaVerComponent,
    AlmacenVerComponent,
    ProductoVerComponent,
    ProductoDeshabilitadosComponent,
    ProductoEditarComponent,
    CompraModuloComponent,
    CompraBuscarComponent,
    CompraVerComponent,
    CompraAgregarComponent,
    OrdencompraAgregarComponent,
    OrdencompraBuscarComponent,
    OrdencompraModuloComponent,
    FilterProductsModalcePipe,
    FilterProductsModalcbarPipe,
    GeneralComponent,
    FilterOrdersPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    NgbModule,
    NgxPaginationModule,
    AngularFileUploaderModule,
    NgxBarcodeModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [
    CategoriaVerComponent    
  ]
})
export class AppModule { }

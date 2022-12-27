import { Component, OnInit, DoCheck } from '@angular/core';
import { EmpleadoService } from './services/empleado.service';

import { PrimeNGConfig } from 'primeng/api';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [EmpleadoService]
})
export class AppComponent implements OnInit, DoCheck{
  title = 'Sistema San Otilio';
  public identity: any;
  public token:any;

  items: MenuItem[] =[];

  constructor( public _empleadoService : EmpleadoService, private primengConfig: PrimeNGConfig ){
    this.loadUser();
  }

  ngOnInit(){
    //se agrega para activar la animacion de los botones
    this.primengConfig.ripple = true;
    // console.log('web carada correctaetne');
    this.items = [
      {
        label: 'Compras',
        icon: 'pi pi-fw pi-briefcase',
        items: [{
          label: 'Proveedores',
          icon: 'pi pi-fw pi-users',
          routerLink: 'proveedor-modulo/proveedorBuscar',
          items: [{
              label: 'Agregar proveedor',
              icon: 'pi pi-fw pi-user-plus',
              routerLink:'proveedor-modulo/agregarProveedor',
          },{
            label: 'Buscar proveedor',
            icon: 'pi pi-fw pi-search',
            routerLink:'proveedor-modulo/proveedorBuscar',
          },{
            label: 'Buscar proveedor deshabilitado',
            icon: 'pi pi-fw pi-search',
            routerLink:'proveedor-modulo/proveedorDeshabilitado',
      }]},{
          label: 'Requisicion',
          icon: 'pi pi-fw pi-book'
        },{
          label: 'Orden de compra',
          icon: 'pi pi-fw pi-book',
          routerLink: 'ordencompra-modulo/ordencompra-buscar',
          items: [{
              label: 'Agregar orden de compra',
              icon: 'pi pi-fw pi-plus-circle',
              routerLink: 'ordencompra-modulo/ordencompra-agregar'
            },{
              label: 'Buscar orden de compra',
              icon: 'pi pi-fw pi-search',
              routerLink: 'ordencompra-modulo/ordencompra-buscar'
            },{
              label: 'Buscar orden de compra cancelada',
              icon: 'pi pi-fw pi-search',
              routerLink: ''
      }]},{
          label: 'Compras',
          icon: 'pi pi-fw pi-book',
          routerLink: 'compra-modulo/compra-buscar',
          items: [{
              label:'',
              icon:'pi pi-fw pi-plus-circle',
              routerLink:''
          }]
        },{
          label: 'Devoluciones',
          icon: 'pi pi-fw pi-arrow-circle-left',
          routerLink: ''
        },{
          label: 'Pedido cliente',
          icon: 'pi pi-fw pi-user',
          routerLink: ''
        },{
          label: 'Cuentas por pagar',
          icon: 'pi pi-fw pi-info-circle',
          routerLink: ''
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file',
          routerLink: ''
        }]
      },{
        label: 'Ventas',
        icon: 'pi pi-fw pi-dollar',
        items: [{
          label: 'Punto de venta',
          icon:'pi pi-fw pi-money-bill',
          routerLink: 'punto-de-venta'
        },{
          label: 'Ventas',
          icon: 'pi pi-fw pi-shopping-cart',
          routerLink: 'ventas-modulo/ventas-realizadas-buscar',
          items:[{
              label:'Agregar venta',
              icon:'pi pi-fw pi-plus-circle',
              routerLink:'punto-de-venta'
            },{
              label:'Buscar ventas sin cobrar',
              icon:'pi pi-fw pi-search',
              routerLink:'punto-de-venta'
        }]},{
          label: 'Cotizaciones',
          icon: 'pi pi-fw pi-file-pdf'
        },{
          label: 'Clientes',
          icon: 'pi pi-fw pi-users'
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file'
        }]
      },{
        label: 'Entregas',
        icon: 'pi pi-fw pi-map',
        items: [{
          label: 'Entrega de material'
        },{
          label: 'Operadores y auxiliares',
          icon: ''
        },{
          label: 'Unidades',
          icon: ''
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      },{
        label: 'Cajas',
        icon: 'pi pi-fw pi-wallet',
        items: [{
          label: 'Caja'
        },{
          label: 'Corte de caja',
          icon: ''
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      },{
        label: 'Administracion',
        icon: 'pi pi-fw pi-sitemap',
        items: [{
          label: 'A'
        },{
          label: 'B',
          icon: ''
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      },{
        label: 'Inventario',
        icon: 'pi pi-fw pi-table',
        items: [{
          label: 'Productos'
        },{
          label: 'Traspasos',
          icon: ''
        },{
          label: 'Clasificaciones',
          icon: ''
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      }
    ]
  }

  ngDoCheck(){
    this.loadUser();
  }

  loadUser(){
    this.identity = this._empleadoService.getIdentity();
    this.token =  this._empleadoService.getToken();
  }


}

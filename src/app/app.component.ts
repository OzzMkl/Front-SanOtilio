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

  items! : MenuItem[];
  itemsAvatar! : MenuItem[];
  itemLogin! : MenuItem[];

  constructor( public _empleadoService : EmpleadoService, private primengConfig: PrimeNGConfig ){
    this.loadUser();
  }

  ngOnInit(){
    //se agrega para activar la animacion de los botones
    this.primengConfig.ripple = true;
    this.loadMenuItems();
    this.loadMenuAvatar();
    this.itemLogin = [{
      label:'Login',
      icon:'pi pi-fw pi-sign-in',
      routerLink:'login'
    }]
  }

  ngDoCheck(){
    this.loadUser();
  }

  loadUser(){
    this.identity = this._empleadoService.getIdentity();
    this.token =  this._empleadoService.getToken();
  }

  loadMenuItems() : void{
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
          icon: 'pi pi-fw pi-book',
          routerLink: 'requisicion-modulo/requisicion-buscar',
          items: [{
            label: 'Agregar requisicion',
            icon: 'pi pi-fw pi-plus-circle',
            routerLink: 'requisicion-modulo/requisicion-agregar'
      }]},{
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
              routerLink:'ventas-modulo/ventas-realizadas-buscar'
            },]
        },{
          label: 'Cotizaciones',
          icon: 'pi pi-fw pi-file-pdf',
          routerLink:'cotizacion-modulo/cotizacion-buscar',
          items:[{
            label:'Agregar cotizacion',
            icon:'pi pi-fw pi-plus-circle',
            routerLink:'punto-de-venta'
          },{
            label:'Buscar cotizaciones',
            icon:'pi pi-fw pi-search',
            routerLink:'cotizacion-modulo/cotizacion-buscar'
          }]
        },{
          label: 'Clientes',
          icon: 'pi pi-fw pi-users',
          routerLink:'cliente-modulo/cliente-buscar',
          items:[{
            label:'Agregar cliente',
            icon:'pi pi-fw pi-user-plus',
            routerLink:'cliente-modulo/cliente-agregar'
          },{
            label:'Buscar cliente',
            icon:'pi pi-fw pi-search-plus',
            routerLink:'cliente-modulo/cliente-buscar'
          }]
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file',
          items: [{
            label: 'Ventas',
            icon:'pi pi-fw pi-shopping-cart',
            items: [{
              label:'Ventas canceladas',
              routerLink:'reportes-ventas/ventas-canceladas'
            },{
              label: 'Ventas finalizadas',
              routerLink:'reportes-ventas/ventas-finalizadas'
            }]
          }]
        }]
      },{
        label: 'Entregas',
        icon: 'pi pi-fw pi-map',
        items: [{
          label: 'Entrega de material',
          icon:'pi pi-fw pi-send',
          routerLink:'entregas-modulo/entregas-pendientes',
          items:[{
            label:'Generar entrega',
            icon:'pi pi-fw pi-sign-out',
            routerLink:''
          },{
            label:'Pedidos pendiente por enviar',
            icon:'pi pi-fw pi-search',
            routerLink:''
          }]
        },{
          label: 'Operadores y auxiliares',
          icon: 'pi pi-fw pi-users'
        },{
          label: 'Unidades',
          icon: 'pi pi-fw pi-truck'
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      },{
        label: 'Cajas',
        icon: 'pi pi-fw pi-wallet',
        // routerLink:'caja-modulo/notas-por-cobrar',
        items: [{
          label: 'Caja',
          icon:'pi pi-fw pi-inbox',
          routerLink:'caja-modulo/notas-por-cobrar'
        },{
          label: 'Corte de caja',
          icon: 'pi pi-fw pi-calculator',
          routerLink:'corte-de-caja'
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      },{
        label: 'Administracion',
        icon: 'pi pi-fw pi-sitemap',
        items: [{
          label: 'A',
          icon:'',
          routerLink:''
        },{
          label: 'B',
          icon: '',
          routerLink:''
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      },{
        label: 'Inventario',
        icon: 'pi pi-fw pi-table',
        items: [{
          label: 'Productos',
          icon:'pi pi-fw pi-th-large',
          routerLink:'producto-modulo/producto-buscar',
          items:[{
            label:'Agregar producto',
            icon:'pi pi-fw pi-plus-circle',
            routerLink:'producto-modulo/producto-agregar'
          },{
            label:'Buscar producto',
            icon:'pi pi-fw pi-search-plus',
            routerLink:'producto-modulo/producto-buscar'
          },{
            label:'Buscar producto deshabilitado',
            icon:'pi pi-fw pi-search-minus',
            routerLink:'producto-modulo/producto-deshabilitado'
          }]
        },{
          label: 'Traspasos',
          icon: 'pi pi-fw pi-sync',
          routerLink:'traspaso-modulo/traspaso-buscar',
          items:[{
            label:'Agregar traspaso',
            icon:'',
            routerLink:'traspaso-modulo/traspaso-agregar'
          },{
            label:'Editar traspaso',
            icon:'',
            routerLink:'traspaso-modulo/traspaso-editar'
          }]
        },{
          label: 'Clasificaciones',
          icon: 'pi pi-fw pi-sitemap',
          routerLink:'clasificacion-modulo',
          items:[{
            label:'Clasificaciones',
            icon:'',
            routerLink:''
          },{
            label:'Marcas',
            icon:'',
            routerLink:''
          },{
            label:'Medidas',
            icon:'',
            routerLink:''
          },{
            label:'Almacenes',
            icon:'',
            routerLink:''
          }]
        },{
          label: 'Reportes',
          icon: 'pi pi-fw pi-file-pdf'
        }]
      }
    ]
  }

  loadMenuAvatar() : void{
    this.itemsAvatar = [{
      label:'Perfil',
      icon:'pi pi-fw pi-user',
      routerLink:''
    },{
      label:'Ajustes',
      icon:'pi pi-fw pi-user-edit',
      routerLink:''
    },{
      label:'Cerrar sesion',
      icon:'pi pi-fw pi-sign-out',
      routerLink:'logout/1'
    }];
  }


}

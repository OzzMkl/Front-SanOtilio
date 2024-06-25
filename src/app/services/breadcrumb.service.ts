import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService implements OnDestroy {

  private sub_navigation?: Subscription;

  constructor(private _router: Router) { }

  ngOnDestroy(): void {
    this.sub_navigation?.unsubscribe();
  }

  /**
   * Inicializa el breadcrumb para un componente específico
   * @param route Ruta activa del componente
   * @param initialBreadcrumb Array de elementos iniciales del breadcrumb
   * @param updateCallback Callback para actualizar los items del breadcrumb
   */
  initializeBreadcrumb(
    route: ActivatedRoute,
    initialBreadcrumb: MenuItem[],
    updateCallback: (items: MenuItem[]) => void
  ): void {
    this.setBreadcrumb(route, initialBreadcrumb, updateCallback);
    this.sub_navigation = this._router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.setBreadcrumb(route, initialBreadcrumb, updateCallback);
    });
  }

  /**
   * Configura los items del breadcrumb basado en la ruta activa
   * @param route Ruta activa del componente
   * @param initialBreadcrumb Array de elementos iniciales del breadcrumb
   * @param updateCallback Callback para actualizar los items del breadcrumb
   */
  private setBreadcrumb(
    route: ActivatedRoute,
    initialBreadcrumb: MenuItem[],
    updateCallback: (items: MenuItem[]) => void
  ): void {
    const items: MenuItem[] = [...initialBreadcrumb];
    this.addBreadcrumb(route.root, items);

    // Si no hay más rutas hijas, agrega styleClass: 'fw-bold' al último item inicial
    if (items.length === initialBreadcrumb.length) {
      items[items.length - 1].styleClass = 'fw-bold';
    }

    updateCallback(items);
  }

  /**
   * Añade items al breadcrumb recursivamente basado en la estructura de la ruta activa
   * @param route Ruta activa actual
   * @param items Array de items del breadcrumb
   */
  private addBreadcrumb(route: ActivatedRoute, items: MenuItem[]): void {
    if (route) {
      const children = route.children;
      children.forEach((child, index) => {
        if (child.snapshot.url.length > 0) {
          const url = child.snapshot.url.map(segment => segment.path).join('/');
          let item: MenuItem | undefined;

          // Add breadcrumb items based on the current URL
          //PROVEEDORES
          if (url === 'proveedorBuscar') {
            item = { label: 'Buscar proveedor', icon: 'pi pi-search me-1', routerLink: 'proveedorBuscar' };
          } else if (url === 'agregarProveedor') {
            item = { label: 'Agregar proveedor', icon: 'pi pi-user-plus me-1', routerLink: 'agregarProveedor' };
          }
          //INVENTARIO-PRODUCTOS
          else if(url == 'producto-buscar'){
            item = { label: 'Buscar producto', icon: 'pi pi-search me-1', routerLink: 'producto-buscar' };
          } else if(url == 'producto-agregar'){
            item = { label: 'Agregar producto', icon: 'pi pi-plus-circle me-1', routerLink: 'producto-buscar' };
          }
          //VENTAS
          else if(url == 'ventas-realizadas-buscar'){
            item = { label: 'Buscar venta', icon: 'pi pi-search me-1', routerLink: 'producto-buscar' };
          }

          // Add styleClass 'fw-bold' to the last item
          if (item && index === children.length - 1) {
            item = { ...item, styleClass: 'fw-bold' };
          }

          if (item) {
            items.push(item);
          }
        }
        this.addBreadcrumb(child, items);
      });
    }
  }
}
